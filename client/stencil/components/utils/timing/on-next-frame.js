import ID from '../id';
const OnNextFrameQueueObject = {};
const OnNextFrameQueue = [];
let isRunning = false;
let frameTimer;
let timeout;
function deleteEntry(id) {
  if (!OnNextFrameQueueObject[id]) {
    return;
  }
  OnNextFrameQueueObject[id].hasRun = true;
  OnNextFrameQueueObject[id].canceled = true;
  delete OnNextFrameQueueObject[id];
}
function hasTime(startTime) {
  return performance.now() - startTime < runTasks.max;
}
function runTasks(startTime) {
  cancelAnimationFrame(frameTimer);
  clearTimeout(timeout);
  do {
    const id = OnNextFrameQueue.shift();
    if (id) {
      if (OnNextFrameQueueObject[id] && !OnNextFrameQueueObject[id].canceled && !OnNextFrameQueueObject[id].hasRun) {
        OnNextFrameQueueObject[id].hasRun = true;
        OnNextFrameQueueObject[id].resolve(OnNextFrameQueueObject[id].task());
        requestAnimationFrame(function () {
          deleteEntry(id);
        });
      }
    }
  } while (hasTime(startTime) && OnNextFrameQueue.length);
  if (OnNextFrameQueue.length) {
    return frameTimer = requestAnimationFrame(function () {
      timeout = setTimeout(function () { runTasks(performance.now()); });
    });
  }
  else {
    isRunning = false;
  }
}
runTasks.max = 4.5;
function RunOnNextFrame() {
  if (isRunning || !OnNextFrameQueue.length) {
    return;
  }
  isRunning = true;
  runTasks(performance.now());
}
export default function OnNextFrame(task) {
  let resolve;
  let reject;
  const promise = new Promise(function OnNextFramePromise(res, rej) {
    resolve = res;
    reject = rej;
  });
  const id = ID();
  OnNextFrameQueueObject[id] = {
    hasRun: false,
    canceled: false,
    task: task,
    promise: promise,
    resolve: resolve,
    reject: reject,
    id: id,
    cancel: function OnNextFrameCancel() {
      deleteEntry(id);
    }
  };
  OnNextFrameQueue.push(id);
  RunOnNextFrame();
  return OnNextFrameQueueObject[id];
}
OnNextFrame.max = function OnNextFrameMax(max) { runTasks.max = max; };
