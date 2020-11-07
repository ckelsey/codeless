import { r as registerInstance, h } from './index-cb63118f.js';

function Try(fn, elseFn = () => { }) {
  try {
    return fn();
  }
  catch (error) {
    try {
      return fn.apply(null);
    }
    catch (error) {
      if (typeof elseFn !== 'function') {
        return elseFn;
      }
      return elseFn();
    }
  }
}

const validSymbol = Symbol('__valid');
const SetValid = (element, valid) => {
  if (element === undefined || element === null) {
    return;
  }
  try {
    element.constructor.prototype[validSymbol] = valid === true;
  }
  catch (error) { }
  return element;
};
const IsValid = (element) => {
  if (element === undefined || element === null) {
    return;
  }
  try {
    return typeof element.constructor.prototype == 'undefined' || (element.constructor.prototype[validSymbol] === undefined || element.constructor.prototype[validSymbol] === true);
  }
  catch (error) { }
  return false;
};

function FromEntities(value) {
  if (typeof value == 'string') {
    return SetValid(value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;|&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
      .replace(/&apos;|&lsquo;|&rsquo;|&#8216;/g, '\''), true);
  }
  return SetValid(value, false);
}

function ArrayFrom(elements) {
  if (Array.isArray(elements)) {
    return elements.slice();
  }
  const result = [];
  if (elements && elements.length) {
    const length = elements.length;
    let index = 0;
    while (index < length) {
      result.push(elements[index]);
      index = index + 1;
    }
  }
  return result;
}

function ToStringOrNumber(arg) {
  const argNumber = parseFloat(arg);
  return !isNaN(arg) ? arg.trim() : argNumber;
}

function IsItNull(v) {
  return v === undefined || v === null;
}

function emptyModifyFn(v) {
  return v;
}
function getFunctionParams(str = '') {
  const result = /\((.*?)\)/g.exec(str || '');
  return result ? result[1] : '';
}
function Get(obj, path, emptyVal, modifyFn = emptyModifyFn) {
  /** If nothing to search, return */
  if (!obj) {
    return modifyFn(emptyVal);
  }
  /** The search array, initial search item being the source */
  const pathParts = path.split('.');
  let result = obj;
  const count = pathParts.length;
  let loopIndex = pathParts.length;
  while (loopIndex) {
    if (IsItNull(result)) {
      result = emptyVal;
      break;
    }
    const partIndex = count - loopIndex;
    const startParens = /\(/.exec(pathParts[partIndex]);
    if (startParens) {
      const fn = result[pathParts[partIndex].slice(0, startParens.index)];
      if (typeof fn === 'function') {
        result = fn.apply(result, getFunctionParams(pathParts[partIndex])
          .split(',')
          .map(ToStringOrNumber));
        loopIndex = loopIndex - 1;
        continue;
      }
    }
    result = result[pathParts[partIndex]];
    loopIndex = loopIndex - 1;
  }
  /** If nothing was found return emptyVal */
  if (IsItNull(result)) {
    result = emptyVal;
  }
  return modifyFn(result);
}

function SelectAll(selector, root = document.body) {
  return ArrayFrom(Get(root, `querySelectorAll(${selector})`));
}

function ValidateHtml(str, disallowedHtmlTags = [], allowedHtmlTags = []) {
  const original = str;
  const converted = Try(() => FromEntities(str.toString()), '');
  if (!converted || !converted.length) {
    return {
      original: original,
      valid: false,
      sanitized: converted,
      reason: ['no value']
    };
  }
  const doc = Try(() => new DOMParser().parseFromString(converted, 'text/html'));
  if (!doc) {
    return { original: original, valid: true, sanitized: converted, reason: ['no html present'], };
  }
  const totalElements = SelectAll('*', doc);
  const elementsToDestroy = [];
  let tagsToDestroy = [];
  function allowedHtmlTagsEach(tag) {
    const index = tagsToDestroy.indexOf(tag);
    if (index > -1) {
      tagsToDestroy.splice(index, 1);
    }
  }
  function tagsToDestroyEach(tag) {
    const els = SelectAll(tag, doc);
    let elsIndex = els.length;
    while (elsIndex--) {
      elementsToDestroy.push(els[elsIndex]);
    }
  }
  function elementsToDestroyEach(el) {
    const parent = el.parentNode;
    if (el && parent) {
      const childrenLength = el.children.length;
      let index = 0;
      while (index < childrenLength) {
        if (typeof parent.insertBefore == 'function') {
          parent.insertBefore(el.children[index], el);
        }
        index = index + 1;
      }
      parent.removeChild(el);
    }
  }
  if (disallowedHtmlTags.length) {
    tagsToDestroy = disallowedHtmlTags.slice(0);
  }
  else {
    tagsToDestroy = htmlTags.concat(svgTags);
  }
  if (allowedHtmlTags.length) {
    allowedHtmlTags.forEach(allowedHtmlTagsEach);
  }
  if (!allowedHtmlTags.length && !disallowedHtmlTags.length) {
    tagsToDestroy = htmlTags.concat(svgTags);
  }
  tagsToDestroy.forEach(tagsToDestroyEach);
  elementsToDestroy.forEach(elementsToDestroyEach);
  const leftOverElements = SelectAll('*', doc);
  const diff = totalElements.length - leftOverElements.length;
  const valid = diff === 0;
  return {
    original: original,
    valid: valid,
    sanitized: valid ? converted : !doc.body.innerHTML || !doc.body.innerHTML.length ? '' : doc.body.innerHTML,
    reason: valid ? [] : [`${diff} element${diff > 1 ? 's were' : 'was'} removed`]
  };
}
const htmlTags = [
  'a',
  'abbr',
  'acronym',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'bdi',
  'bdo',
  'big',
  'blink',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'content',
  'data',
  'datalist',
  'dd',
  'decorator',
  'del',
  'details',
  'dfn',
  'dir',
  'div',
  'dl',
  'dt',
  'element',
  'em',
  'fieldset',
  'figcaption',
  'figure',
  'font',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meter',
  'nav',
  'nobr',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'section',
  'select',
  'shadow',
  'small',
  'source',
  'spacer',
  'span',
  'strike',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'track',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
];
const svgTags = [
  'svg',
  'a',
  'altglyph',
  'altglyphdef',
  'altglyphitem',
  'animatecolor',
  'animatemotion',
  'animatetransform',
  'audio',
  'canvas',
  'circle',
  'clippath',
  'defs',
  'desc',
  'ellipse',
  'filter',
  'font',
  'g',
  'glyph',
  'glyphref',
  'hkern',
  'image',
  'line',
  'lineargradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialgradient',
  'rect',
  'stop',
  'style',
  'switch',
  'symbol',
  'text',
  'textpath',
  'title',
  'tref',
  'tspan',
  'video',
  'view',
  'vkern'
];

let index = 0;
function doId(indx) {
  return doHash() + indx;
}
function doHash() {
  return (performance.now() + 'xxxxxxxxxxxxxxxx')
    .replace(/[x]|\./g, function () {
    return (Math.random() * 16 | 0).toString(16);
  });
}
function ID() {
  index = index + 1;
  return doId(index);
}

/**
 * Determines if a value is not a collection
 * @function IsNonCollection
 * @param {any} value - The value to test
 * @return {boolean} Whether or not the value is a collection
 * @example
 * IsNonCollection({}) // false
 * IsNonCollection([]) // false
 * IsNonCollection('') // true
 * IsNonCollection(1) // true
 * IsNonCollection(null) // true
 * IsNonCollection(undefined) // true
 * IsNonCollection(()=>{}) // true
 * IsNonCollection(true) // true
 */
const nonCollections = ['string', 'number', 'null', 'undefined', 'function', 'boolean', 'date'];
function IsNonCollection(value) { return nonCollections.indexOf(typeof value) > -1 || value === null || value instanceof Date; }

/**
 * Determines if a value is a valid DOM element
 * @function IsDom
 * @param {any} value - The value to test
 * @return {boolean} If the value is a DOM element
 * @example
 * const element = document.createElement('div')
 * IsDom(element) // true
 * IsDom('nope') // false
 */
function IsDom(value) {
  return (value instanceof Element) || (value instanceof Node);
}

/**
 * Determines if a value is or can be a valid date
 * @function IsDate
 * @param {any} value - The value to test
 * @return (boolean) If the value is a valid date
 * @example
 * IsDate('Mon Nov 18 2019 07:41:48 GMT-0800') // true
 * IsDate('Not a date') // false
 */
function IsDate(value) {
  let tempValue = new Date(Date.parse(value));
  return (tempValue !== 'Invalid Date'
    && !isNaN(tempValue)
    && tempValue instanceof Date);
}

/**
 * Determines if the value is an object
 * @function IsObject
 * @param {any} value
 * @return {boolean} Whether or not the value is an object
 * @example
 * IsObject() // false
 * IsObject(()=>{}) // false
 * IsObject('') // false
 * IsObject(true) // false
 * IsObject(null) // false
 * IsObject(new Date()) // false
 * IsObject([]) // false
 * IsObject({}) // true
 */
function IsObject(value) {
  return (typeof value).indexOf('object') > -1 && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

function Type(value) {
  return value === null ?
    'null' :
    IsNonCollection(value) ?
      IsDate(value) ?
        'date' :
        typeof value :
      IsDom(value) ?
        'dom' :
        Array.isArray(value) ?
          'array' :
          IsObject(value) ?
            'object' :
            typeof value;
}

function Equals(value1, value2) {
  const type = Type(value1);
  if (Type(value2) !== type) {
    return false;
  }
  if (IsNonCollection(value1)) {
    if (type === 'date') {
      let d = value1 === value2;
      d = new Date(value1).getTime() === new Date(value2).getTime();
      return d;
    }
    return value2 === value1;
  }
  if (type === 'boolean' && value1 !== value2) {
    return false;
  }
  if (type === 'array' && value1.length !== value2.length) {
    return false;
  }
  if (type === 'object' && Object.keys(value1).length !== Object.keys(value2).length) {
    return false;
  }
  if (type === 'object' && value1.constructor !== value2.constructor) {
    return false;
  }
  if (type === 'dom') {
    return value1.isEqualNode(value2);
  }
  // Start walking
  if (type === 'array') {
    let len = value1.length;
    while (len--) {
      if (!Equals(value1[len], value2[len])) {
        return false;
      }
    }
  }
  if (type === 'object') {
    const keys = Object.keys(value1);
    let len = keys.length;
    while (len--) {
      if (!Equals(value1[keys[len]], value2[keys[len]])) {
        return false;
      }
    }
  }
  return true;
}

const Debounce = (func, wait = 300, immediate = false) => {
  let timer = 0;
  const _this = undefined;
  return function () {
    const context = _this;
    const args = arguments;
    const callNow = immediate && !timer;
    const later = function () {
      timer = requestAnimationFrame(function () {
        timer = 0;
        if (!immediate)
          func.apply(context, args);
      });
    };
    clearTimeout(timer);
    cancelAnimationFrame(timer);
    timer = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

function Diff(sourceObject, compareObject) {
  const differences = {};
  const sourceType = Type(sourceObject);
  const compareType = Type(compareObject);
  const validTypes = ['object', 'array'];
  if (validTypes.indexOf(sourceType) == -1 || validTypes.indexOf(compareType) == -1) {
    return sourceObject !== compareObject ? compareObject || sourceObject : undefined;
  }
  if (sourceType !== compareType) {
    return compareType == 'undefined' && sourceType !== 'undefined' ? sourceObject : compareObject;
  }
  function doCompare(index) {
    if (differences[index]) {
      return;
    }
    const compared = Diff(sourceObject[index], compareObject[index]);
    if (compared !== undefined) {
      differences[index] = sourceObject[index] === compared ? undefined : compared;
    }
  }
  if (sourceType == 'object') {
    Object.keys(sourceObject).forEach(doCompare);
    Object.keys(compareObject).forEach(doCompare);
  }
  if (sourceType == 'array') {
    sourceObject.forEach((_v, index) => doCompare(index));
    compareObject.forEach((_v, index) => doCompare(index));
  }
  return differences;
}

const observers = new WeakMap();
const observerKeys = {};
window.observers = () => ({
  map: observers,
  keys: Object.keys(observerKeys)
});
const emptyNext = (_value, _force) => { };
const emptyError = (_value) => { };
const emptyFn = () => { };
const SubscribeFn = (_next, _error, _complete) => emptyFn;
const emptyUnsubscribe = (_subscription) => { };
const nullObserver = () => ({
  isComplete: true,
  value: undefined,
  previous: undefined,
  subscriptions: {},
  lastUpdate: 0,
  settings: {},
  removed: [],
  added: [],
  changed: {},
  next: emptyNext,
  error: emptyError,
  complete: emptyFn,
  subscribe: SubscribeFn,
  unsubscribe: emptyUnsubscribe,
  insert: (_element, _index) => { },
  insertAll: (_elements, _index) => { },
  remove: (_element, _index, _all) => { },
  removeElements: (_elements) => { },
  reverse: emptyFn,
  has: (_value) => false,
  indexOf: (_value) => -1,
  on: (_name, _callback) => () => { },
  trigger: (_name, _data) => { },
  data: {}
});
function Observer(initialValue, options = {}) {
  let _this = [ID()];
  observerKeys[_this[0]] = _this;
  const noInit = options.noInit ? true : false;
  const nextOnNew = options.nextOnNew ? true : false;
  const matchType = options.matchType ? true : false;
  const onSubscribe = options.onSubscribe && typeof options.onSubscribe === 'function' ? options.onSubscribe : (val) => val;
  const formatter = options.formatter && typeof options.formatter === 'function' ? options.formatter : (val) => val;
  const initialType = Type(formatter(initialValue));
  const takeFirst = !!options.takeFirst;
  const takeLast = !!options.takeLast;
  const debounced = !!takeFirst || !!takeLast;
  const takeBy = options.takeBy || 0;
  const getInstance = () => observers.get(_this);
  const formatValue = (toFormat, obs = {}) => {
    const f = formatter(toFormat, obs);
    const inst = getInstance();
    return inst && matchType && Type(f) != initialType ? inst.data.value : f;
  };
  const states = [formatValue(initialValue)];
  const addedRemovedReducer = (source) => (target, current) => {
    if (source.indexOf(current) === -1) {
      target.push(current);
    }
    return target;
  };
  const bothArray = (source, target) => Array.isArray(source) && Array.isArray(target);
  function getAddedRemoved(source, target) {
    return !bothArray(source, target) ? [] : source.reduce(addedRemovedReducer(target), []);
  }
  function getRemoved() {
    const inst = getInstance();
    return inst && inst.data ?
      getAddedRemoved(inst.data.previousValue, inst.data.value) :
      [];
  }
  function getAdded() {
    const inst = getInstance();
    return inst && inst.data ? getAddedRemoved(inst.data.value, inst.data.previousValue) : [];
  }
  function destroy() {
    const inst = getInstance();
    if (!inst) {
      return;
    }
    inst.trigger('destroy', inst.data);
    Object.keys(inst.data.subscriptions).forEach(k => Get(inst.data, `subscriptions.${k}.unsubscribe`, emptyFn));
    inst.data.isComplete = true;
    delete observerKeys[_this[0]];
    observers.delete(_this);
    _this = undefined;
  }
  const callFn = (val, valuesObj, functionKey, subscriptions) => (id) => {
    const fn = Get(subscriptions, `${id}.${functionKey}`);
    typeof fn === 'function' ? fn(val, valuesObj || {}, id) : undefined;
  };
  function doLoop(functionKey, val, valuesObj) {
    const inst = getInstance();
    if (!inst) {
      return;
    }
    inst.trigger(functionKey, valuesObj || {});
    const subs = inst.data.subscriptions;
    Object.keys(subs).forEach(callFn(val, valuesObj, functionKey, subs));
    if (functionKey === 'complete') {
      destroy();
    }
  }
  const debouncedLoop = Debounce(doLoop, takeBy, !!takeFirst);
  const loop = !debounced ? doLoop : debouncedLoop;
  function unsubscribe(subscription) {
    return function unsubscribeInner() {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const subscriptions = inst.data.subscriptions;
      delete subscriptions[subscription.id];
      inst.trigger('unsubscribe', { subscription, subscriptions });
      if (inst.data.noSubsComplete && Object.keys(subscriptions).length === 0) {
        destroy();
      }
    };
  }
  function getArrayIndexOf(element, isArray) {
    const inst = getInstance();
    if (!inst || !isArray) {
      return;
    }
    const index = inst.data.value.indexOf(element);
    return index > -1 ? index : undefined;
  }
  function getObjectKey(value) {
    let _result;
    const inst = getInstance();
    if (!inst) {
      return;
    }
    const dataVal = inst.data.value;
    const keys = Object.keys(dataVal);
    let i = keys.length;
    while (i--) {
      if (value === dataVal[keys[i]]) {
        _result = keys[i];
        break;
      }
    }
    return _result;
  }
  function getValTypes(inst) {
    inst = inst || getInstance();
    const value = Get(inst, 'data.value');
    return inst ? {
      value,
      isArray: Array.isArray(value),
      isString: typeof value === 'string'
    } : {};
  }
  let result = {
    get isComplete() {
      const inst = getInstance();
      if (!inst) {
        return true;
      }
      return inst.data.isComplete;
    },
    get value() {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      return inst.data.value;
    },
    get previous() {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      return inst.data.previousValue;
    },
    get subscriptions() {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      return inst.data.subscriptions;
    },
    get lastUpdate() {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      return inst.data.updated;
    },
    get settings() {
      return {
        initialType,
        formatter,
        matchType,
        nextOnNew,
        noInit,
        takeFirst,
        takeLast,
        takeBy
      };
    },
    get removed() { return getRemoved(); },
    get added() { return getAdded(); },
    get changed() {
      const inst = getInstance();
      if (!inst) {
        return [];
      }
      return Diff(inst.data.previousValue, inst.data.value);
    },
    next: function (v, force) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const formatted = formatValue(v, inst);
      if (!force && nextOnNew && Equals(formatted, inst.data.value)) {
        return;
      }
      inst.data.value = formatted;
      inst.data.updated = new Date().getTime();
      loop('next', inst.data.value, inst.data);
      return inst.data;
    },
    error: function (err) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      inst.data.errors = inst.data.errors.concat([err]);
      inst.data.updated = new Date().getTime();
      loop('error', err, inst.data);
      inst.complete();
    },
    complete: function () {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      loop('complete', inst.data);
    },
    subscribe: function (next, error = (_err) => { }, complete = emptyFn) {
      const inst = getInstance();
      if (!inst) {
        return () => { };
      }
      const subscription = Object.assign({}, {
        next: next,
        error: error,
        complete: complete,
        id: ID()
      });
      subscription.unsubscribe = unsubscribe(subscription);
      inst.data.subscriptions[subscription.id] = subscription;
      if (!noInit && inst.data.value !== undefined && typeof subscription.next === 'function') {
        subscription.next(inst.data.value);
      }
      onSubscribe(subscription);
      return unsubscribe(subscription);
    },
    unsubscribe: function (subscription) {
      const inst = getInstance();
      if (!inst || !subscription || !subscription.id || !inst.data.subscriptions[subscription.id]) {
        return;
      }
      return unsubscribe(subscription);
    },
    insert: function (element, index) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const valData = getValTypes(inst);
      index = index == undefined ? Get(valData, 'value.length', 0) : index;
      if (valData.isArray) {
        valData.value.splice(index, index !== valData.value.length ? 1 : 0, element);
        return inst.next(valData.value, true);
      }
      if (typeof valData.value === 'string') {
        valData.value = valData.value.slice(0, index) + element + valData.value.slice(index);
        return inst.next(valData.value, true);
      }
      valData.value[index] = element;
      return inst.next(valData.value, true);
    },
    insertAll: function (elements, index) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const valData = getValTypes(inst);
      index = index == undefined ? Get(valData, 'value.length', 0) : index;
      if (valData.isArray) {
        if (!Array.isArray(elements)) {
          return;
        }
        valData.value.splice.apply(valData.value, [index, index !== valData.value.length ? 1 : 0, ...elements]);
        return inst.next(valData.value, true);
      }
      const elementsObject = elements;
      Object.keys(elementsObject).forEach(elementKey => inst.data.value[elementKey] = elementsObject[elementKey]);
      return inst.next(valData.value, true);
    },
    remove: function (element, index, all = false) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const valData = getValTypes(inst);
      if (index === undefined) {
        index = getArrayIndexOf(element, valData.isArray);
      }
      if (index === undefined && valData.isArray) {
        return valData.value;
      }
      if (index === undefined && valData.isString) {
        return inst.next(valData.value.replace(new RegExp(element, all ? 'gm' : ''), ''), true);
      }
      if (index !== undefined) {
        if (valData.isArray) {
          valData.value.splice(index, 1);
        }
        else if (valData.isString) {
          inst.data.value = valData.value.slice(0, index);
        }
        else {
          inst.data.value[index] = undefined;
          delete inst.data.value[index];
        }
        return inst.next(valData.value, true);
      }
      const objectKey = getObjectKey(element);
      if (objectKey !== undefined) {
        inst.data.value[objectKey] = null;
        delete inst.data.value[objectKey];
        return inst.next(inst.data.value, true);
      }
      return inst.next(inst.data.value, true);
    },
    removeElements: function (elements) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const valData = getValTypes(inst);
      if (valData.isArray) {
        for (let i = 0; i < elements.length; i = i + 1) {
          const index = valData.value.indexOf(elements[i]);
          if (index > -1) {
            valData.value.splice(index, 1);
          }
        }
        return inst.next(valData.value, true);
      }
      Object.keys(elements).forEach(prop => delete valData.value[prop]);
      return inst.next(valData.value, true);
    },
    reverse: function () {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const valData = getValTypes(inst);
      if (valData.isArray) {
        return inst.next(valData.value.reverse(), true);
      }
      if (valData.isString) {
        return inst.next(valData.value.split('').reverse(), true);
      }
      inst.next(valData.value, true);
    },
    has: function has(value) {
      const valData = getValTypes();
      if (valData.isArray) {
        return getArrayIndexOf(value, valData.isArray) || false;
      }
      if (valData.isString) {
        return valData.value.indexOf(value) > -1;
      }
      const objectKey = getObjectKey(value);
      if (objectKey !== undefined) {
        return true;
      }
      return false;
    },
    indexOf: function indexOf(value) {
      const valData = getValTypes();
      if (valData.isArray) {
        return getArrayIndexOf(value, valData.isArray) || -1;
      }
      if (valData.isString) {
        return valData.value.indexOf(value);
      }
      return getObjectKey(value) || -1;
    },
    on: function on(name, callback) {
      const inst = getInstance();
      if (!inst) {
        return () => { };
      }
      if (!inst.data.eventCallbacks[name]) {
        observers.get(_this).data.eventCallbacks[name] = {};
      }
      const id = ID();
      observers.get(_this).data.eventCallbacks[name][id] = callback;
      return () => delete observers.get(_this).data.eventCallbacks[name][id];
    },
    trigger: function trigger(name, data) {
      const inst = getInstance();
      if (!inst) {
        return;
      }
      const callbacks = inst.data.eventCallbacks[name];
      if (!callbacks) {
        return;
      }
      Object.keys(callbacks).forEach(prop => callbacks[prop](data));
    },
    data: {
      errors: [],
      updated: new Date().getTime(),
      subscriptions: {},
      isComplete: false,
      initialType,
      initialValue,
      eventCallbacks: {},
      formatter,
      matchType,
      nextOnNew,
      noInit,
      noSubsComplete: options.noSubsComplete === true ? true : false,
      takeFirst,
      takeLast,
      value: null,
      previousValue: null
    }
  };
  observers.set(_this, result);
  Object.defineProperties(getInstance().data, {
    value: {
      get() {
        return states[0];
      },
      set(v) {
        states.unshift(v);
        while (states.length > 2) {
          states.pop();
        }
      }
    },
    previousValue: {
      get() {
        return states[1];
      }
    }
  });
  return getInstance();
}

function EventObserver(element, eventName, options = {}) {
  if (!element || !eventName) {
    return nullObserver();
  }
  let isRunning = false;
  options = Object.assign({}, {
    preventDefault: false,
    stopPropagation: false,
    useCapture: true
  }, options || {});
  function canListen() {
    return element && typeof element.addEventListener == 'function';
  }
  function onSubscribe() {
    if (isRunning) {
      return;
    }
    if (!canListen()) {
      return shutDown();
    }
    isRunning = true;
    element.addEventListener(eventName, eventHandler, options.useCapture);
  }
  const observer = Observer(undefined, Object.assign({}, options, { onSubscribe, noSubsComplete: true }));
  function eventHandler(event) {
    if (!observer || !observer.subscriptions || Object.keys(observer.subscriptions).length === 0) {
      return shutDown();
    }
    if ((typeof options.preventDefault == 'function' && !!options.preventDefault(event)) || (typeof options.preventDefault == 'boolean' && options.preventDefault)) {
      event.preventDefault();
    }
    if ((typeof options.stopPropagation == 'function' && !!options.stopPropagation(event)) || (typeof options.stopPropagation == 'boolean' && options.stopPropagation)) {
      event.stopPropagation();
    }
    observer.next(event);
  }
  function shutDown() {
    if (canListen()) {
      element.removeEventListener(eventName, eventHandler, options.useCapture);
    }
    isRunning = false;
    if (element instanceof Window) {
      return;
    }
  }
  return observer;
}

const styleCss = "@keyframes rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes onAutoFillStart{from{}to{}}@keyframes onAutoFillCancel{from{}to{}}@keyframes delayOverflowIn{0%{overflow:hidden}99%{overflow:hidden}100%{overflow:visible}}@keyframes delayOverflowOut{0%{overflow:visible}99%{overflow:visible}100%{overflow:hidden}}@keyframes fadeIn{0%{opacity:0}10%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}:host{display:inline-block;max-width:100%}:host.no-label .field-element-container input,:host.no-label .field-element-container textarea,:host.no-label .field-element-container select,:host[hasicon=true].no-label .field-element-container input,:host[hasicon=true].no-label .field-element-container textarea,:host[hasicon=true].no-label .field-element-container select{padding:0.8em 0.7em}:host.no-label .field-element-container label,:host[hasicon=true].no-label .field-element-container label{padding:0;transform:none}:host.no-label .field-element-container label:before,:host[hasicon=true].no-label .field-element-container label:before{position:absolute;top:1.62em;margin-right:0.25em;right:0}:host[labelalign=top] .field-element-container input,:host[labelalign=top] .field-element-container textarea,:host[labelalign=top] .field-element-container select{padding:0.8em 0.7em 0.8em 2.3em}:host[labelalign=top] .field-element-container label,:host[labelalign=top] .field-element-container input[label-up=true]~label,:host[labelalign=top] .field-element-container textarea[label-up=true]~label,:host[labelalign=top] .field-element-container select[label-up=true]~label{order:-1;position:relative;color:#bbb;transform:none;padding:0;margin-top:-1.5em;pointer-events:all}:host.mtop-0 .field-element-container{margin-top:0}:host.mbottom-0 .field-element-container{margin-bottom:0}:host.w-auto .field-element-container{width:auto}:host .field-text-container{position:relative;width:30em;max-width:100%;margin-top:1.5em;margin-bottom:1.5em;display:flex;flex-direction:column}:host .field-text-container input{padding:1.3em 0.7em 0.3em;position:relative;margin:0;height:auto;width:100%;border-radius:2px;background-color:#eee;color:#222;box-shadow:inset 0 0px 2px 0px rgba(255, 255, 255, 0.5), 0 0 0 100px #eee inset;border:none !important;font-size:inherit;font-family:inherit;line-height:initial;outline:none !important;transition:color 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.2s}:host .field-text-container input:focus{background-color:#fff;box-shadow:inset 0 0px 2px 0px rgba(255, 255, 255, 0.5), 0 0 0 100px #fff inset}:host .field-text-container input:-internal-autofill-selected{background-color:#eee !important}:host .field-text-container input:-webkit-autofill{animation-name:onAutoFillStart;transition:background-color 50000s ease-in-out 0s}:host .field-text-container input:not(:-webkit-autofill){animation-name:onAutoFillCancel}:host .field-text-container input::-webkit-input-placeholder{color:transparent;opacity:0}:host .field-text-container input:-webkit-input-placeholder{color:transparent;opacity:0}:host .field-text-container input:-ms-input-placeholder{color:transparent;opacity:0}:host .field-text-container input::placeholder{color:transparent;opacity:0}:host .field-text-container input[readonly]:not([readonly=false]),:host .field-text-container input[readonly=true]{cursor:not-allowed}:host .field-text-container input[disabled]{cursor:not-allowed;opacity:0.38}:host .field-text-container input[disabled][required]+label:before{opacity:0.5}:host .field-text-container input[required]+label:before{content:\"*\";color:#df0700;line-height:0;position:relative;top:0.2em;margin-right:0.1em;font-style:italic;text-transform:none}:host .field-text-container input[required].no-required-symbol+label:before{display:none}:host .field-text-container input[label-up=true]~label,:host .field-text-container input:not(:placeholder-shown):not([value=\"\"]):not([type=checkbox]):not([type=radio])~label{transform:translateX(0em) translateY(0.125em) translateZ(0) scale(0.7)}:host .field-text-container label{position:absolute;top:0;left:0;width:100%;text-align:left;padding:0.125em 0.5em 0 1em;display:flex;align-items:center;transform:translateX(-0.25em) translateY(0.5em) translateZ(0px) scale(1);transform-origin:0 0;text-transform:capitalize;font-size:inherit;pointer-events:none;color:rgba(34, 34, 34, 0.62);transition:transform 0.2s, opacity 0.2s ease-in 0.062s}:host .field-text-container label[error]:not([error=\"\"]):after{content:attr(error);color:#df0700;font-size:80%;display:inline-block;margin-left:0.5em;font-style:italic;text-transform:none}:host .field-text-container label.label-required:before{content:\"*\";color:#df0700;line-height:0;position:relative;top:0.2em;margin-right:0.1em;font-style:italic;text-transform:none}:host .field-help-text,:host .field-count-text{font-size:75%;margin-bottom:-2em;display:block;font-style:italic;font-weight:100;opacity:0.62}:host .icon-container{position:absolute;left:0.5em;color:#222;top:0.65em;line-height:0;pointer-events:none;width:1.5em;height:1.5em;display:flex;align-items:center;justify-content:center}:host .icon-container svg{width:1.5em;height:auto}:host[hasicon=true] input,:host[hasicon=true] textarea,:host[hasicon=true] select{padding:1.3em 0.7em 0.3em 2.3em}:host[hasicon=true] input[label-up=true]~label,:host[hasicon=true] input:not(:placeholder-shown):not([value=\"\"])~label,:host[hasicon=true] textarea[label-up=true]~label,:host[hasicon=true] textarea:not(:placeholder-shown):not([value=\"\"])~label,:host[hasicon=true] select[label-up=true]~label,:host[hasicon=true] select:not(:placeholder-shown):not([value=\"\"])~label{padding:0.125em 0.5em 0 3em}:host[hasicon=true] label{padding:0.125em 0.5em 0 2.5em}:host[hasicon=true].no-label .field-element-container input,:host[hasicon=true].no-label .field-element-container textarea,:host[hasicon=true].no-label .field-element-container select{padding:0.8em 0.7em 0.8em 2.3em}";

const FieldText = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.type = 'text';
    this.value = '';
    this.autocomplete = 'on';
    this.autofocus = false;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.inputid = ID();
    this.label = '';
  }
  validType(newVal) {
    const types = ['text', 'email', 'tel'];
    if (!newVal || types.indexOf(newVal) == -1) {
      return this.type = types[0];
    }
  }
  validValue(newVal) {
    if (typeof newVal == 'undefined') {
      return this.value = '';
    }
  }
  validError(newVal) {
    const sanitized = ValidateHtml(newVal).sanitized;
    this.labelElement[!!sanitized ? 'setAttribute' : 'removeAttribute']('error', sanitized || undefined);
  }
  validHelpText(newVal) { this.helpTextElement.innerHTML = this.sanitized(newVal); }
  validId(newVal) {
    console.log('inputid', newVal);
    this.inputElement.id = `field-input-${newVal}`;
    this.labelElement.setAttribute('for', this.inputElement.id);
  }
  validLabel(newVal) {
    this.labelElement.innerHTML = this.sanitized(newVal);
  }
  focused() {
    return Promise.resolve(this.inputid === document.activeElement.inputid);
  }
  sanitized(val) {
    if (!val) {
      return '';
    }
    return ValidateHtml(val).sanitized;
  }
  updateLabelPosition() {
    return this.focused()
      .then(focused => {
      const up = focused || (this.value !== '' && this.value != 'undefined');
      this.inputElement[up ? 'setAttribute' : 'removeAttribute']('label-up', up ? 'true' : undefined);
    });
  }
  setInputEvents() {
    const input = this.inputElement;
    if (input.events) {
      Object.keys(input.events).forEach((key) => input.events[key]());
    }
    const updateLabelPosition = this.updateLabelPosition.bind(this);
    input.events = {
      animationstart: EventObserver(this.inputElement, 'animationstart').subscribe(updateLabelPosition),
      focus: EventObserver(this.inputElement, 'focus').subscribe(updateLabelPosition),
      blur: EventObserver(this.inputElement, 'blur').subscribe(updateLabelPosition),
    };
  }
  componentDidLoad() {
    this.labelElement.innerHTML = this.sanitized(this.label);
    this.setInputEvents();
  }
  disconnectedCallback() {
    this.containerElement.setAttribute('ready', 'false');
  }
  render() {
    return h("div", { ref: (el) => this.containerElement = el, class: "field-text-container field-element-container" }, h("input", { ref: (el) => this.inputElement = el, placeholder: " ", type: this.type, value: this.value, autocomplete: this.autocomplete, autofocus: this.autofocus, disabled: this.disabled, name: this.name, readonly: this.readonly, required: this.required, id: this.inputid }), h("label", { ref: (el) => this.labelElement = el }), h("span", { class: "icon-container" }, h("slot", { name: "icon" })), h("span", { class: "flex-between-center" }, h("span", { ref: (el) => this.helpTextElement = el, class: "field-help-text" }), h("span", { class: "field-count-text" })));
  }
  static get watchers() { return {
    "type": ["validType"],
    "value": ["validValue"],
    "error": ["validError"],
    "helptext": ["validHelpText"],
    "inputid": ["validId"],
    "label": ["validLabel"]
  }; }
};
FieldText.style = styleCss;

export { FieldText as field_text };
