import OnNextFrame from './on-next-frame';
import ID from '../id';
const subscriptions = {};
let isRunning = false;
function removeSubscription(subscription) {
  if (!subscription || !subscription.id) {
    return;
  }
  const id = subscription.id;
  if (!subscriptions[id] || subscriptions[id].resolved) {
    return;
  }
  subscriptions[id].resolved = true;
  subscriptions[id].resolve();
  OnNextFrame(function removeSubscriptionNext() {
    delete subscriptions[id];
  });
}
function loop() {
  isRunning = true;
  const subscriptionKeys = Object.keys(subscriptions);
  if (!subscriptionKeys.length) {
    isRunning = false;
    return;
  }
  function subscriptionKeysEach(key) {
    if (!subscriptions[key] || subscriptions[key].resolved) {
      return;
    }
    const subscription = subscriptions[key];
    const index = new Date().getTime() - subscription.started;
    function subStep() {
      return subscription.stepFn(subscription.frameValues[subscription.frameValues.length - 1]);
    }
    function subStepEnd() {
      return subscription.stepFn(subscription.frameValues[index]);
    }
    function subRemove() {
      return removeSubscription(subscription);
    }
    if (index >= subscription.frameValues.length) {
      subscription.end = index;
      OnNextFrame(subStep);
      OnNextFrame(subRemove);
    }
    else {
      OnNextFrame(subStepEnd);
    }
  }
  subscriptionKeys.forEach(subscriptionKeysEach);
  OnNextFrame(loop);
}
const emptySubscription = () => ({
  id: '',
  stepFn: () => { },
  frameValues: [],
  resolved: true,
  started: new Date().getTime(),
  cancel: () => { },
  then: (fn) => Promise.reject(fn),
  catch: (fn) => Promise.reject(fn),
  promise: new Promise((_resolve, reject) => reject()),
  resolve: Promise.reject,
  reject: Promise.reject
});
const Timer = (function TimerIFEE() {
  return function TimerInner(stepFn, frameValues) {
    if (!Array.isArray(frameValues) || frameValues.length === 0) {
      return emptySubscription();
    }
    if (typeof stepFn !== 'function') {
      return emptySubscription();
    }
    const id = ID();
    let resolve, reject;
    const promise = new Promise(function onNextPromise(res, rej) {
      resolve = res;
      reject = rej;
    });
    subscriptions[id] = {
      id: id,
      stepFn: stepFn,
      frameValues: frameValues,
      resolved: false,
      started: new Date().getTime(),
      cancel: function () { return removeSubscription(subscriptions[id]); },
      then: function (fn) { return promise.then(fn); },
      catch: function (fn) { return promise.catch(fn); },
      promise: promise,
      resolve: resolve,
      reject: reject
    };
    if (!isRunning) {
      loop();
    }
    return subscriptions[id];
  };
})();
export default Timer;
