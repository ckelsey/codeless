import ID from '../id';
import DispatchEvent from '../dom/dispatch-event';
const draggables = {};
const defaultHandler = (_api) => { };
export default function Drag({ target, onMove = defaultHandler, onStart = defaultHandler, onStop = defaultHandler, startOnContainer = false, contained = true }) {
  return new Promise((resolve, reject) => {
    if (!target) {
      return reject();
    }
    if (target['_drag'] && typeof target['_drag'].dispose == 'function') {
      target['_drag'].dispose();
    }
    const container = target.offsetParent;
    const id = ID();
    const overStart = (eventPosition, targetPosition, targetDimension, containerPosition) => {
      const total = targetDimension + containerPosition;
      return eventPosition - targetPosition <= total ? eventPosition - targetPosition : total;
    };
    const underStart = (eventPosition, containerPosition) => eventPosition <= containerPosition ? containerPosition : eventPosition;
    const constrain = (valueToTest, startToTest, eventPosition, containerDimension, containerPosition, targetDimension, targetPosition) => {
      let start = startToTest;
      let value = valueToTest;
      if (valueToTest + targetDimension > containerDimension) {
        start = overStart(eventPosition, targetPosition, targetDimension, containerPosition);
        value = containerDimension - targetDimension;
      }
      else if (valueToTest <= 0) {
        start = underStart(eventPosition, containerPosition);
        value = 0;
      }
      return { start, value };
    };
    const handleDrag = (e) => {
      let x = e.x - api.startXDistance;
      let y = e.y - api.startYDistance;
      if (api.contained) {
        const constrainedX = constrain(x, api.startXDistance, e.x, api.containerWidth, api.containerX, api.width, api.x);
        const constrainedY = constrain(y, api.startYDistance, e.y, api.containerHeight, api.containerY, api.height, api.y);
        x = constrainedX.value;
        api.startXDistance = constrainedX.start;
        y = constrainedY.value;
        api.startYDistance = constrainedY.start;
      }
      Object.assign(api, {
        x, y,
        percentX: (x / api.containerWidth) * 100,
        percentY: !y ? 0 : (y / api.containerHeight) * 100
      });
      api.onMove(api);
      DispatchEvent(target, 'moving', api);
    };
    const stop = () => {
      api.dragging = false;
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', stop);
      document.body.style.removeProperty('user-select');
      target.setAttribute('dragging', 'false');
      api.onStop(api);
      DispatchEvent(target, 'stopmove', api);
    };
    const getDimensions = (x, y) => {
      const containerX = container.offsetLeft;
      const containerY = container.offsetTop;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      return {
        x,
        y,
        width: target.offsetWidth,
        height: target.offsetHeight,
        containerX,
        containerY,
        containerWidth,
        containerHeight,
        percentX: ((x - containerX) / containerWidth) * 100,
        percentY: ((y - containerY) / containerHeight) * 100
      };
    };
    const start = (e) => {
      if (draggables._current && draggables[draggables._current].dragging) {
        draggables[draggables._current].stop();
      }
      draggables._current = id;
      const x = target.offsetLeft;
      const y = target.offsetTop;
      Object.assign(api, Object.assign({ startXDistance: e.x - x, startYDistance: e.y - y, dragging: true }, getDimensions(x, y)));
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', stop);
      document.body.style.userSelect = 'none';
      target.setAttribute('dragging', 'true');
      api.onStart(api);
      DispatchEvent(target, 'startmove', api);
    };
    const dispose = () => {
      target.removeEventListener('mousedown', api.start);
      delete draggables[id];
      delete draggables._current;
      delete target['_drag'];
      target.style.removeProperty('left');
    };
    const x = target.offsetLeft;
    const y = target.offsetTop;
    const api = Object.assign({ target,
      container, dragging: false, contained: contained, stop,
      start,
      dispose,
      onMove,
      onStart,
      onStop, startXDistance: 0, startYDistance: 0 }, getDimensions(x, y));
    const triggerEl = startOnContainer ? container : target;
    triggerEl.addEventListener('mousedown', api.start);
    draggables[id] = target['_drag'] = api;
    return resolve(api);
  });
}
window.draggables = draggables;
