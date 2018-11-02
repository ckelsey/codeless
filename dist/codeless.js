/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.5.17
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "production" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "production" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
})

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (false) { var repeat, classify, classifyRE, hasConsole; }

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (false) {}
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (false
  ) {}
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (false
  ) {}
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (false) {}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "production" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "production" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (false) {}
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "production" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (false) {}
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (false) {}
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (false) {}
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (false) {}

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (false) {}
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    false
  ) {}
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (false) {}
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (false) {}
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

if (false) { var perf; }

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (false) { var getHandler, hasHandler, isBuiltInModifier, hasProxy, warnNonPresent, allowedGlobals; }

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      "production" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (false) { var keyInLowerCase; }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "production" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 false
                  ? (undefined)
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (false) { var lowerCaseEvent; }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (false) {}
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (false) {} else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (false) {}

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (false) {}
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (false) {}
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (false) {}
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  false
    ? undefined
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "production" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (false) { var hyphenatedKey; } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "production" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (false) {}
    if (props && hasOwn(props, key)) {
      "production" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (false) {}

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (false) {}
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (false) {}
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (false) {}
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (false) {}
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (false) {} else {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (false) {}
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (false) {}
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if (false) {}
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "production" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "production" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (false) {}
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "production" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (false
  ) {}
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (false) {} else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    // reset _rendered flag on slots for duplicate slot check
    if (false) { var key; }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (false) {} else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (false) {}
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (false) {}

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (false) {} else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (false) {}

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  if (false
  ) {}
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (false) {}

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (false) {}
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
}

var builtInComponents = {
  KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (false) {}
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.17';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "production" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
}

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (false) {}

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (false) {}
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (false) {}
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (false) {}

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (false) {}
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (false
              ) {}
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (false
              ) {}
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (false) {}
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
}

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
]

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
}

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
}

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    false
  ) {}

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = {
    value: value.trim()
  };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (false) {}

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (false) {}

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (false) { var binding, typeBinding, value$1; }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
}

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (false) {}

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (false) {}

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {}

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "production" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
}

var platformDirectives = {
  model: directive,
  show: show
}

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (false) {}

    var mode = this.mode;

    // warn invalid mode
    if (false
    ) {}

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
}

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (false) { var name, opts; }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
}

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
}

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        false
      ) {}
    }
    if (false
    ) {}
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (false) { var res; }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
}

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (false) { var res; }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
}

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
}

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (false) {}
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (false
        ) {}
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "production" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        if (false) {}
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (false) {}
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (false) {}
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (false) {}
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (false) {}
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '');
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (false) {}
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (false) {}
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (false) {}
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (false) {}
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (false) {}
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (false) {}
      }
    } else {
      // literal attribute
      if (false) { var res; }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      false
    ) {}
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$2 = {
  preTransformNode: preTransformNode
}

var modules$1 = [
  klass$1,
  style$1,
  model$2
]

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
}

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  'delete': ['Backspace', 'Delete']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : handler.value;
    /* istanbul ignore if */
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if (false) {}
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
}

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "production" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (false
  ) {}

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if (false) {}
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (false) {}

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (false) {}

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (false) {}

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (false) {}
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "production" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (false) {}
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (false) {}
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (false) {}

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (false) {}
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v6.2.0
  * (c) 2015-present Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(0));

var hasProto = { __proto__: [] } instanceof Array;
function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function mixins() {
    var Ctors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ctors[_i] = arguments[_i];
    }
    return Vue.extend({ mixins: Ctors });
}
function isPrimitive(value) {
    var type = typeof value;
    return value == null || (type !== "object" && type !== "function");
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { return vm[key] = value; },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (false) {}
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured' // 2.5
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            // methods
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            // computed properties
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
        delete Component.__decorators__;
    }
    // find super
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    var Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);
    return Extended;
}
var reservedPropertyNames = [
    // Unique id
    'cid',
    // Super Vue constructor
    'super',
    // Component options that will be used by the component
    'options',
    'superOptions',
    'extendOptions',
    'sealedOptions',
    // Private assets
    'component',
    'directive',
    'filter'
];
function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(function (key) {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
        // If the user agent does not support `__proto__` or its family (IE <= 10),
        // the sub class properties may be inherited properties from the super class in TypeScript.
        // We need to exclude such properties to prevent to overwrite
        // the component options object which stored on the extended constructor (See #192).
        // If the value is a referenced value (object or function),
        // we can check equality of them and exclude it if they have the same reference.
        // If it is a primitive value, it will be forwarded for safety.
        if (!hasProto) {
            // Only `cid` is explicitly exluded from property forwarding
            // because we cannot detect whether it is a inherited property or not
            // on the no `__proto__` environment even though the property is reserved.
            if (key === 'cid') {
                return;
            }
            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value)
                && superDescriptor
                && superDescriptor.value === descriptor.value) {
                return;
            }
        }
        // Warn if the users manually declare reserved properties
        if (false) {}
        Object.defineProperty(Extended, key, descriptor);
    });
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports.default = Component$1;
exports.createDecorator = createDecorator;
exports.mixins = mixins;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(14);
var util = __webpack_require__(16);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(17);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("a34f428a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\nhtml {\n  backface-visibility: hidden; }\n\nbody {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  color: #1c1c1c;\n  font-size: 14px;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: normal;\n  line-height: 24px;\n  margin: 0px;\n  backface-visibility: hidden; }\n\nol,\nul,\np,\nspan,\nh1,\nh2,\nh3,\nh4,\ndiv {\n  color: inherit; }\n\nh1 {\n  line-height: 1.4em; }\n\nh3 {\n  font-weight: 100; }\n\ninput,\ntextarea,\nbutton,\nselect {\n  padding: 10px;\n  border: none;\n  font-size: inherit;\n  font-family: inherit;\n  font-weight: inherit;\n  color: inherit;\n  outline: none !important;\n  width: 100%;\n  box-sizing: border-box;\n  box-sizing: border-box;\n  position: relative;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  border-radius: 1px;\n  box-shadow: none;\n  border-bottom: 1px solid #e7e7e7; }\n\nselect {\n  cursor: pointer; }\n\n.select {\n  position: relative; }\n  .select:after {\n    content: \"\";\n    position: absolute;\n    top: calc(50% - 3.5px);\n    right: 7px;\n    border: 5px solid transparent;\n    border-top-color: #cacaca; }\n\nlabel {\n  display: block; }\n\nbutton {\n  cursor: pointer;\n  background: transparent;\n  box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.25);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: auto;\n  text-transform: uppercase; }\n  button.clear {\n    box-shadow: none;\n    padding: 0px; }\n  button .icon {\n    margin-right: 4px;\n    width: 15px !important;\n    height: 15px !important; }\n  button > *:nth-last-child(1) {\n    margin-right: 0px; }\n  button.btn {\n    background: #009ef1;\n    color: #fff;\n    padding: 10px 20px;\n    box-shadow: none; }\n\na,\na:visited,\na:focus {\n  color: inherit; }\n\nimg {\n  width: auto;\n  display: block;\n  max-width: 100%; }\n\n#codeless {\n  display: flex;\n  height: 100%; }\n\n.tooltip {\n  position: absolute;\n  white-space: nowrap;\n  left: 50%;\n  transform: translate(-50%, -100%);\n  background: #009ef1;\n  color: #fff;\n  padding: 7px 14px;\n  opacity: 0;\n  height: 0px;\n  width: 0px;\n  overflow: hidden;\n  pointer-events: all;\n  top: 0px;\n  font-size: 0px;\n  opacity: 0;\n  transition: opacity 0.5s; }\n\n.tooltip * {\n  pointer-events: all;\n  position: relative; }\n\n.tooltip .tooltip-pointer {\n  border: 7px solid transparent;\n  border-top-color: #009ef1;\n  display: block;\n  position: absolute;\n  content: \"\";\n  bottom: -14px;\n  left: 50%;\n  transform: translateX(-50%); }\n\n.tooltip.tooltip-active {\n  opacity: 1;\n  z-index: 9999;\n  height: auto;\n  width: auto;\n  overflow: visible;\n  font-size: inherit;\n  box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n\n.tooltip[position=\"right\"] {\n  right: 3px;\n  left: auto;\n  transform: translate(0%, -100%); }\n\n.tooltip[position=\"bottom\"] {\n  transform: translate(-50%, -7px);\n  top: calc(100% + 18px); }\n\n.tooltip[position=\"bottomright\"] {\n  right: 3px;\n  left: auto;\n  top: calc(100% + 14px);\n  transform: translate(0%, -7px); }\n\n.tooltip[position=\"right\"] .tooltip-pointer {\n  right: -7px;\n  left: auto; }\n\n.tooltip[position=\"bottom\"] .tooltip-pointer {\n  bottom: auto;\n  top: -14px;\n  border-top-color: transparent;\n  border-bottom-color: #009ef1; }\n\n.input {\n  margin: 7px 0px 21px; }\n  .input .fake-button:nth-child(1) {\n    padding: 7px 7px 7px 0px; }\n  .input .fake-button:nth-last-of-type() {\n    padding: 7px 0px 7px 7px; }\n\n.fake-button {\n  cursor: pointer;\n  padding: 7px;\n  text-transform: uppercase;\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n  .fake-button .icon {\n    margin-right: 3px; }\n\n.btn {\n  background: #009ef1;\n  cursor: pointer;\n  padding: 10px 20px;\n  text-transform: uppercase;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff; }\n\n.gray {\n  background: #e7e7e7; }\n\n.close-button {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  padding: 7px;\n  cursor: pointer; }\n\n.file-input {\n  position: relative;\n  display: inline-block; }\n  .file-input input[type=\"file\"] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0px;\n    top: 0px;\n    opacity: 0; }\n\n.primary-color {\n  color: #009ef1; }\n\n.drag-handle {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  color: #000;\n  width: 10px;\n  flex-wrap: wrap;\n  line-height: 4px;\n  text-align: justify;\n  left: -7px;\n  top: calc(50% - 10px);\n  font-weight: bold;\n  opacity: .24;\n  cursor: move;\n  transition: all 0.24s; }\n  .drag-handle .dot {\n    box-shadow: 1px 1px 0px #fff;\n    border-radius: 50%;\n    width: 3px;\n    height: 3px;\n    margin: 0px 1px 1px 0px; }\n  .drag-handle:hover {\n    opacity: .5; }\n\n.flex {\n  display: flex;\n  align-items: center; }\n\n.drop-down {\n  position: relative; }\n  .drop-down .drop-down-text {\n    cursor: pointer;\n    display: flex;\n    align-items: center; }\n  .drop-down > .drop-down-text:after {\n    content: '';\n    position: relative;\n    border: 5px solid transparent;\n    border-top-color: #fff;\n    top: 2px;\n    right: 0px; }\n  .drop-down .drop-down-options {\n    position: absolute;\n    top: calc(100%);\n    left: -10px;\n    display: none;\n    background: #0cabff; }\n    .drop-down .drop-down-options .drop-down-text {\n      padding: 10px; }\n      .drop-down .drop-down-options .drop-down-text:hover {\n        background: rgba(255, 255, 255, 0.1); }\n      .drop-down .drop-down-options .drop-down-text * {\n        margin: 0px !important; }\n    .drop-down .drop-down-options.right {\n      left: unset;\n      right: -10px; }\n  .drop-down:hover .drop-down-options {\n    display: block; }\n\n.colspan1 {\n  grid-column-end: span 1; }\n\n.colspan2 {\n  grid-column-end: span 2; }\n\n.colspan3 {\n  grid-column-end: span 3; }\n\n.colspan4 {\n  grid-column-end: span 4; }\n\n.colspan5 {\n  grid-column-end: span 5; }\n\n.colspan6 {\n  grid-column-end: span 6; }\n\n.colspan7 {\n  grid-column-end: span 7; }\n\n.colspan8 {\n  grid-column-end: span 8; }\n\n.colspan9 {\n  grid-column-end: span 9; }\n\n.colspan10 {\n  grid-column-end: span 10; }\n\n.colspan11 {\n  grid-column-end: span 11; }\n\n.colspan12 {\n  grid-column-end: span 12; }\n\n@media (max-width: 800px) {\n  .primitive-element.colspan12,\n  .primitive-element.colspan11,\n  .primitive-element.colspan10,\n  .primitive-element.colspan9,\n  .primitive-element.colspan8,\n  .primitive-element.colspan7,\n  .primitive-element.colspan6,\n  .primitive-element.colspan5,\n  .primitive-element.colspan4,\n  .primitive-element.colspan3,\n  .primitive-element.colspan2,\n  .primitive-element.colspan1 {\n    grid-column-end: span 12; }\n    .primitive-element.colspan12 .primitive-inner,\n    .primitive-element.colspan11 .primitive-inner,\n    .primitive-element.colspan10 .primitive-inner,\n    .primitive-element.colspan9 .primitive-inner,\n    .primitive-element.colspan8 .primitive-inner,\n    .primitive-element.colspan7 .primitive-inner,\n    .primitive-element.colspan6 .primitive-inner,\n    .primitive-element.colspan5 .primitive-inner,\n    .primitive-element.colspan4 .primitive-inner,\n    .primitive-element.colspan3 .primitive-inner,\n    .primitive-element.colspan2 .primitive-inner,\n    .primitive-element.colspan1 .primitive-inner {\n      padding-left: 60px;\n      padding-right: 60px; } }\n\n.disabled {\n  opacity: 0.5;\n  pointer-events: none; }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("6563fdb5", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n#side-bar {\n  max-width: 300px;\n  min-width: 200px;\n  width: 33%;\n  height: 100%;\n  overflow: auto;\n  padding-left: 3px; }\n\n#side-bar-nav {\n  display: flex;\n  width: 100%;\n  align-content: center;\n  cursor: pointer; }\n  #side-bar-nav .tab {\n    width: 100%;\n    text-align: center;\n    padding: 16px 0px 12px;\n    box-sizing: border-box;\n    cursor: pointer;\n    transition: all 0.5s;\n    margin: 0px 15px; }\n    #side-bar-nav .tab.active {\n      color: #009ef1; }\n\n.tab-indicator {\n  height: 2px;\n  width: 100%;\n  background: #009ef1;\n  position: relative;\n  transition: left 0.2s, width 0.5s; }\n\n#side-bar-content {\n  padding: 24px; }\n  #side-bar-content .tab-content {\n    pointer-events: none;\n    transform: scale3d(0, 1, 1);\n    width: 100%;\n    opacity: 0;\n    overflow: hidden;\n    height: 0px;\n    transition: opacity 0.1s, transform 0.2s ease 0s, overflow 0s ease 0s, height 0s ease 0s; }\n    #side-bar-content .tab-content.active {\n      transform: scale3d(1, 1, 1);\n      pointer-events: all;\n      width: 100%;\n      opacity: 1;\n      overflow: auto;\n      height: auto;\n      transition: opacity 0.1s, transform 0.2s ease 0s, overflow 0s ease 0.2s, height 0s ease 0.2s; }\n    #side-bar-content .tab-content .buttons {\n      display: flex;\n      flex-wrap: wrap;\n      justify-content: flex-start;\n      align-items: center; }\n    #side-bar-content .tab-content .pages {\n      margin: 0px; }\n\n.insert-button {\n  padding: 10px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 45px;\n  flex-direction: column;\n  width: calc(50% - 25px);\n  background: #e7e7e7;\n  margin: 0px;\n  transition: all 0.5s; }\n  .insert-button:nth-child(odd) {\n    margin: 5px 5px 5px 0px; }\n  .insert-button:nth-child(even) {\n    margin: 5px 0px 5px 5px; }\n  .insert-button:nth-child(1) {\n    margin: 0px 5px 5px 0px; }\n  .insert-button:nth-child(2) {\n    margin: 0px 0px 5px 5px; }\n  .insert-button:hover {\n    background: #fafafa;\n    box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n  .insert-button .icon {\n    height: 21px !important;\n    align-items: center;\n    display: flex; }\n\n.page-item {\n  display: flex;\n  align-items: center;\n  opacity: 0.84;\n  margin: 3px 0px 21px;\n  transition: all 0.2s;\n  box-sizing: border-box;\n  padding: 3px; }\n  .page-item.currentPage {\n    background: #009ef1;\n    color: #fff;\n    opacity: 1; }\n    .page-item.currentPage .page-thumb-wrapper .page-thumb-container {\n      color: #fff;\n      box-shadow: none; }\n    .page-item.currentPage .page-name input {\n      box-shadow: none;\n      border: none; }\n      .page-item.currentPage .page-name input:focus {\n        background: rgba(255, 255, 255, 0.1); }\n  .page-item .page-thumb-wrapper {\n    display: inline-block;\n    height: 37px;\n    cursor: pointer;\n    transition: all 0.2s; }\n    .page-item .page-thumb-wrapper .page-thumb-container {\n      height: 100%;\n      width: 100%;\n      box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05);\n      transition: all 0.2s;\n      display: flex;\n      align-items: center;\n      justify-content: center; }\n      .page-item .page-thumb-wrapper .page-thumb-container.no-shadow {\n        box-shadow: none; }\n      .page-item .page-thumb-wrapper .page-thumb-container .material-icons {\n        font-size: 30px; }\n  .page-item .page-name {\n    margin-left: 7px;\n    width: 100%;\n    transition: all 0.2s; }\n    .page-item .page-name input {\n      height: 100%;\n      display: block;\n      background: transparent;\n      transition: all 0.2s; }\n      .page-item .page-name input:focus {\n        background: #fff; }\n  .page-item:hover {\n    opacity: 1; }\n\n.page-settings .page-settings-icon {\n  cursor: pointer;\n  transition: all 0.2s;\n  opacity: 0;\n  transform: rotate(90deg);\n  transition: all 0.2s;\n  position: relative;\n  left: -2px; }\n  .page-settings .page-settings-icon:hover {\n    opacity: 0.5; }\n\n.page-settings .page-settings-item {\n  display: flex;\n  align-items: center;\n  width: auto;\n  padding: 10px;\n  box-sizing: border-box;\n  margin: -6px -14px; }\n  .page-settings .page-settings-item:hover {\n    background: rgba(255, 255, 255, 0.1); }\n  .page-settings .page-settings-item .icon {\n    margin-right: 3px; }\n\n.page-settings:hover .page-settings-icon {\n  opacity: 0.24; }\n\n.selecting-link-element .page-item:hover {\n  background: rgba(0, 158, 241, 0.5);\n  cursor: pointer; }\n\n.filter-icon {\n  width: 16px;\n  height: 16px;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  justify-content: center; }\n  .filter-icon * {\n    width: 100%;\n    height: 2px;\n    background: #000;\n    opacity: 0.24;\n    margin: 1px 0px; }\n    .filter-icon *:nth-child(2) {\n      width: 60%; }\n    .filter-icon *:nth-child(3) {\n      width: 20%; }\n\n.page-filter-wrapper {\n  display: flex;\n  align-items: center;\n  margin: 0px 0px 21px 0px; }\n  .page-filter-wrapper .btn {\n    padding: 6px 14px; }\n\n.page-filter {\n  position: relative;\n  margin-right: 14px; }\n  .page-filter .filter-icon {\n    position: absolute;\n    z-index: 1;\n    pointer-events: none;\n    left: 10px;\n    top: calc(50% - 11px); }\n  .page-filter input {\n    padding-left: 35px; }\n\n.global-element-item {\n  display: flex;\n  align-items: center;\n  padding: 7px; }\n  .global-element-item .global-element-item-thumb {\n    display: flex;\n    align-items: center;\n    margin-right: 7px; }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("152dd43a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.page-thumb-renderer {\n  width: 37px;\n  min-width: 37px;\n  height: 37px;\n  overflow: hidden;\n  display: inline-block;\n  user-select: none;\n  pointer-events: none; }\n\n.page-thumb {\n  max-width: 1280px;\n  background: #fafafa;\n  color: #1c1c1c;\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n  display: grid;\n  grid-auto-rows: min-content;\n  grid-template-columns: repeat(auto-fill, 8.33333%);\n  overflow-y: auto;\n  overflow-x: visible;\n  width: 1280px;\n  transform: scale3d(0.028, 0.028, 0.028);\n  transform-origin: 0px 0px;\n  height: 1280px; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("5a75697c", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.primitive-element {\n  width: 100%;\n  position: relative;\n  transition: all 0.5s;\n  outline: none !important;\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n  box-sizing: border-box; }\n  .primitive-element .primitive-inner {\n    padding: 5px 15px;\n    box-sizing: border-box;\n    width: 100%;\n    position: relative;\n    margin: auto; }\n    .primitive-element .primitive-inner.editing {\n      position: relative;\n      transition: all 0.5s;\n      z-index: 1; }\n    .primitive-element .primitive-inner.start {\n      padding-left: 60px; }\n    .primitive-element .primitive-inner.end {\n      padding-right: 60px; }\n    .primitive-element .primitive-inner.unpublished {\n      border: 1px dashed rgba(0, 158, 241, 0.25); }\n      .primitive-element .primitive-inner.unpublished .element-content {\n        opacity: 0.62; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(15)(module), __webpack_require__(5)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(18);
exports.encode = exports.stringify = __webpack_require__(19);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("45d213c6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n[draggable=\"true\"] {\n  background-color: #e7e7e7;\n  opacity: 0.4; }\n\n.dragover {\n  background-color: #f1f1f1;\n  box-shadow: inset 5px 5px #009ef1; }\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23), __webpack_require__(5)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("1e366af6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, ".editable-text-element, .editable-text-element * {\n  outline: none !important;\n  user-drag: none;\n  -webkit-user-drag: none;\n  -moz-user-drag: none;\n  -ms-user-drag: none; }\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("208138e0", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.element-resizer {\n  display: none; }\n\n.dont-drag,\n.dont-drag * {\n  -webkit-user-drag: none;\n  -khtml-user-drag: none;\n  -moz-user-drag: none;\n  -o-user-drag: none;\n  user-drag: none; }\n\n.editor-mode .primitive-element .tooltip {\n  display: none; }\n\n.editor-mode .primitive-element .primitive-inner:hover .element-resizer, .editor-mode .primitive-element .primitive-inner.editing .element-resizer {\n  display: block;\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  box-shadow: inset 0px 0px 0px 2px #009ef1;\n  transition: opacity 1s; }\n  .editor-mode .primitive-element .primitive-inner:hover .element-resizer .element-resizer-handle, .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle {\n    display: none; }\n\n.editor-mode .primitive-element .primitive-inner.editing .tooltip {\n  display: none;\n  align-items: center;\n  justify-content: center; }\n  .editor-mode .primitive-element .primitive-inner.editing .tooltip.tooltip-active {\n    display: flex; }\n  .editor-mode .primitive-element .primitive-inner.editing .tooltip .tooltip-button {\n    padding: 3px 7px;\n    font-size: 16px;\n    cursor: pointer;\n    transition: all 0.5s;\n    display: flex;\n    align-items: center;\n    justify-content: center; }\n    .editor-mode .primitive-element .primitive-inner.editing .tooltip .tooltip-button:hover {\n      background: rgba(255, 255, 255, 0.1); }\n    .editor-mode .primitive-element .primitive-inner.editing .tooltip .tooltip-button.font-picker-wrapper {\n      margin-right: 10px; }\n      .editor-mode .primitive-element .primitive-inner.editing .tooltip .tooltip-button.font-picker-wrapper:hover {\n        background: transparent; }\n\n.editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-settings {\n  position: absolute;\n  top: calc(100% - 18px);\n  left: 50%; }\n\n.editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle {\n  display: block;\n  position: absolute;\n  pointer-events: all;\n  top: calc(50% - 13px);\n  cursor: ew-resize;\n  padding: 3px 6px;\n  box-sizing: border-box; }\n  .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e, .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 14px;\n    color: #000;\n    width: 22px;\n    flex-wrap: wrap;\n    line-height: 4px;\n    text-align: justify;\n    left: -3px;\n    font-weight: bold;\n    opacity: .24;\n    cursor: move;\n    transition: all 0.24s; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e .dot, .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle .dot {\n      box-shadow: 1px 1px 0px #fff;\n      border-radius: 50%;\n      width: 3px;\n      height: 3px;\n      margin: 0px 1px 1px 0px; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e:hover, .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle:hover {\n      opacity: .5; }\n  .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e {\n    width: 19px;\n    right: 2px;\n    left: auto;\n    flex-wrap: nowrap;\n    cursor: ew-resize;\n    outline: none !important; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e:after {\n      content: '';\n      position: absolute;\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      pointer-events: none;\n      background: #fff;\n      opacity: 0;\n      left: -3px;\n      top: calc(50% - 20px);\n      transform: scale3d(0, 0, 0);\n      transform-origin: 25% 68%;\n      transition: all 0.68s; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e:focus:after {\n      animation: ripple 0.68s ease-in-out; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.element-resizer-e.clicker:after {\n      opacity: 0.1;\n      transform: scale3d(1, 1, 1);\n      transform-origin: 50% 50%; }\n  .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle {\n    outline: none !important; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle:after {\n      content: '';\n      position: absolute;\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      pointer-events: none;\n      background: #fff;\n      opacity: 0;\n      left: -10px;\n      top: calc(50% - 20px);\n      transform: scale3d(0, 0, 0);\n      transform-origin: 25% 68%;\n      transition: all 0.68s; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle:focus:after {\n      animation: ripple 0.68s ease-in-out; }\n    .editor-mode .primitive-element .primitive-inner.editing .element-resizer .element-resizer-handle.sort-handle.clicker:after {\n      opacity: 0.1;\n      transform: scale3d(1, 1, 1);\n      transform-origin: 50% 50%; }\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("3d78029a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("0548f2b4", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n.divider-element {\n  width: 100%;\n  height: 0px;\n  border-top: 1px solid;\n  color: inherit;\n  margin: 21px 0px;\n  opacity: 0.2; }\n", ""]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("75fa3cdf", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.form-element {\n  min-height: 100px; }\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("01a8a7a4", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.primitive-thumb-wrapper {\n  width: 37px;\n  min-width: 37px;\n  height: 37px;\n  overflow: hidden;\n  display: inline-block;\n  user-select: none;\n  pointer-events: none;\n  background: #fff; }\n  .primitive-thumb-wrapper .primitive-thumb {\n    transform: scale3d(0.2, 0.2, 0.2);\n    transform-origin: 0px 0px;\n    max-width: 180px;\n    width: 180px;\n    height: 180px;\n    position: relative;\n    transition: all 0.5s;\n    outline: none !important;\n    background-repeat: no-repeat;\n    background-size: cover;\n    background-position: center; }\n    .primitive-thumb-wrapper .primitive-thumb .primitive-inner {\n      padding: 5px 15px;\n      box-sizing: border-box;\n      width: 100%;\n      position: relative;\n      margin: auto; }\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("2231d41b", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n@keyframes ripple {\n  0% {\n    opacity: 0;\n    transform: scale3d(0, 0, 0);\n    transform-origin: 25% 68%; }\n  33% {\n    opacity: 0.16; }\n  100% {\n    opacity: 0;\n    transform: scale3d(1, 1, 1);\n    transform-origin: 50% 50%; } }\n\n.dragging-elements {\n  user-select: none; }\n\n#page-renderer {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  background: #fafafa; }\n\n#login {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%; }\n\n#codeless {\n  background: #f1f1f1; }\n\n#page {\n  height: 100%;\n  width: 100%;\n  background: #fafafa;\n  color: #1c1c1c;\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n  display: grid;\n  grid-auto-rows: min-content;\n  grid-template-columns: repeat(auto-fill, 8.33333%);\n  overflow: auto;\n  box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n\n.page-container {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  max-width: 1280px;\n  margin: auto;\n  background: #fafafa;\n  position: relative; }\n  .page-container #page {\n    box-shadow: none;\n    width: calc(100% - 230px); }\n  .page-container #nav {\n    width: 230px;\n    background: #fafafa;\n    box-sizing: border-box;\n    padding: 48px 0px 21px 21px; }\n\n.color-picker {\n  position: relative;\n  display: flex;\n  align-items: flex-start; }\n  .color-picker .color-swatch {\n    width: 12px;\n    height: 12px;\n    cursor: pointer;\n    border: 1px solid #fff; }\n  .color-picker .color-swatches {\n    position: absolute;\n    padding: 10px;\n    width: 56px;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: space-evenly;\n    top: calc(100% - 10px);\n    left: -10px;\n    display: none; }\n  .color-picker:hover .color-swatches {\n    display: flex; }\n\n#page-renderer.editor-mode {\n  background: transparent; }\n  #page-renderer.editor-mode .page-container {\n    width: calc(100% - 50px);\n    margin: 0px 0px 0px auto;\n    box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n  #page-renderer.editor-mode .dialogue-wrapper {\n    opacity: 0;\n    pointer-events: none;\n    display: flex;\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    left: 0px;\n    top: 0px;\n    align-items: center;\n    justify-content: center;\n    z-index: 99;\n    transition: opacity 0.2s; }\n    #page-renderer.editor-mode .dialogue-wrapper .dialogue {\n      overflow: auto;\n      max-height: 80vh;\n      position: relative;\n      width: 300px;\n      background: #fff;\n      padding: 21px;\n      top: -100%;\n      transition: top 0.5s; }\n    #page-renderer.editor-mode .dialogue-wrapper.showDialogue {\n      opacity: 1;\n      pointer-events: all; }\n      #page-renderer.editor-mode .dialogue-wrapper.showDialogue .dialogue {\n        top: 0%; }\n\n.selecting-link-element * {\n  cursor: pointer; }\n\n.selecting-link-element .dialogue-wrapper {\n  opacity: 0;\n  pointer-events: none;\n  cursor: none; }\n\n.selecting-link-element .primitive-element:hover {\n  box-shadow: inset 0px 0px 1000px rgba(0, 158, 241, 0.9); }\n\n.selecting-link-element .element-resizer-handle,\n.selecting-link-element .element-settings {\n  display: none !important; }\n\n.selecting-link-element #nav,\n.selecting-link-element #top-bar,\n.selecting-link-element #side-bar-nav,\n.selecting-link-element .page-filter-wrapper,\n.selecting-link-element .pages {\n  cursor: none;\n  opacity: 0.25;\n  pointer-events: none; }\n\n.selecting-link-element.selecting-link-page .pages {\n  cursor: pointer;\n  opacity: 1;\n  pointer-events: all; }\n\n.selecting-link-element.selecting-link-page #page {\n  cursor: none;\n  opacity: 0.25;\n  pointer-events: none; }\n\n.site-logo {\n  padding: 5px 0px 5px 21px;\n  box-sizing: border-box; }\n  .site-logo img {\n    width: auto;\n    max-width: 100px;\n    max-height: 40px; }\n\n.site-name {\n  padding: 5px 0px 5px 21px;\n  box-sizing: border-box;\n  font-size: 26px;\n  line-height: 1.3em;\n  font-weight: 300; }\n  .site-name a {\n    text-decoration: none; }\n\n.nav-item-toggler {\n  display: none;\n  opacity: 0;\n  pointer-events: none; }\n\n.overlay-scrim {\n  opacity: 0;\n  pointer-events: none;\n  background: rgba(0, 0, 0, 0.8);\n  position: fixed;\n  height: 100%;\n  width: 100%;\n  left: 0px;\n  top: 0px;\n  z-index: 11;\n  transition: opacity .2s; }\n  .overlay-scrim.showScrim {\n    opacity: 1;\n    pointer-events: all; }\n\n#search {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  z-index: 99;\n  pointer-events: none;\n  opacity: 0;\n  transition: all 0.2s; }\n  #search.showSearch {\n    opacity: 1; }\n    #search.showSearch #search-inner {\n      width: 100%;\n      pointer-events: all; }\n    #search.showSearch #search-results {\n      pointer-events: all; }\n  #search #search-inner {\n    display: flex;\n    width: 0%;\n    background: #f1f1f1;\n    height: 50px;\n    z-index: 3;\n    pointer-events: none;\n    transition: all 0.2s;\n    box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n    #search #search-inner .search-input {\n      display: flex;\n      width: 100%;\n      align-items: center;\n      justify-content: center; }\n      #search #search-inner .search-input .search-input-inner {\n        display: flex;\n        width: 100%;\n        align-items: center;\n        justify-content: center;\n        max-width: 400px; }\n        #search #search-inner .search-input .search-input-inner .search-button {\n          background: #fff;\n          font-size: 22px;\n          border-bottom: 1px solid #e7e7e7; }\n\n#search-results {\n  position: fixed;\n  top: 50px;\n  background: #e7e7e7;\n  padding: 0px;\n  height: 0px;\n  overflow: hidden;\n  width: 100%;\n  box-sizing: border-box;\n  pointer-events: none; }\n  #search-results.showSearchResults {\n    height: calc(100% - 50px);\n    padding: 34px;\n    overflow: auto; }\n  #search-results .search-result {\n    background: #f1f1f1;\n    margin: 0px 0px 21px;\n    padding: 14px;\n    box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n  #search-results h2 {\n    margin: 0px 0px 7px;\n    padding: 7px; }\n\n.search-toggle {\n  display: flex;\n  cursor: pointer;\n  width: 24px;\n  position: absolute;\n  right: 18px;\n  top: 18px;\n  z-index: 3;\n  color: #fff; }\n\n.drive-item {\n  width: 60px;\n  height: 60px;\n  background: #f1f1f1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 5px;\n  margin: 2px;\n  cursor: pointer; }\n  .drive-item.active {\n    background: #009ef1; }\n\n.drive-list {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  justify-content: flex-start;\n  max-height: 170px;\n  overflow: auto; }\n\n.spinner-wrapper {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 21px;\n  position: fixed;\n  height: 100%;\n  background: #000000b3;\n  z-index: 10; }\n\n.spinner,\n.spinner:after {\n  border-radius: 50%;\n  width: 5em;\n  height: 5em; }\n\n.spinner {\n  margin: 20px 0px;\n  font-size: 10px;\n  position: relative;\n  text-indent: -9999em;\n  border: 0.6em solid #76b900;\n  border-left-color: transparent;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation: load8 1.1s infinite linear;\n  animation: load8 1.1s infinite linear; }\n\n@-webkit-keyframes load8 {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@keyframes load8 {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@media (max-width: 1280px) {\n  .page-container {\n    flex-direction: column; }\n    .page-container #nav {\n      width: 100%;\n      padding: 7px 14px;\n      height: 60px;\n      display: flex;\n      align-items: center;\n      box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05);\n      position: relative;\n      padding-left: 48px;\n      background: #fff; }\n      .page-container #nav .search-toggle {\n        color: #1f2325; }\n      .page-container #nav .nav-item-container {\n        position: absolute;\n        left: 0px;\n        height: 24px;\n        width: 250px;\n        overflow: hidden;\n        padding: 0px;\n        top: 18px;\n        height: 100vh;\n        box-sizing: border-box;\n        z-index: 99;\n        pointer-events: none;\n        transition: padding 0.2s, top 0.2s, background 0.2s, left 0.2s, overflow 0.0s ease 0.2s; }\n        .page-container #nav .nav-item-container.expanded {\n          width: 250px;\n          background: #fff;\n          top: 0px;\n          padding: 48px 20px;\n          left: 0px;\n          height: 100vh;\n          overflow: auto;\n          pointer-events: all;\n          box-shadow: 0 0, 0 1px 0 rgba(0, 0, 0, 0.07), 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.06), 0 3px 10px 0 rgba(0, 0, 0, 0.05); }\n          .page-container #nav .nav-item-container.expanded .nav-item-toggler.list {\n            top: 18px;\n            left: 24px; }\n          .page-container #nav .nav-item-container.expanded .nav-items {\n            font-size: inherit;\n            left: 0px;\n            pointer-events: all; }\n      .page-container #nav .site-logo {\n        padding: 5px 0px 5px 14px; }\n      .page-container #nav .site-name {\n        font-size: 20px;\n        margin: 0px;\n        line-height: 20px;\n        width: 100%; }\n      .page-container #nav .nav-item-toggler {\n        display: flex;\n        align-items: center;\n        cursor: pointer;\n        position: absolute;\n        top: 0px;\n        left: 3px;\n        width: 24px;\n        transition: opacity 0.2s, transform 0.2s, top 0.2s, left 0.2s; }\n        .page-container #nav .nav-item-toggler.menu {\n          top: 0px; }\n        .page-container #nav .nav-item-toggler i {\n          transform: rotate(90deg);\n          transition: transform 0.5s;\n          transform-origin: 50% 50%;\n          width: 24px;\n          height: 24px; }\n        .page-container #nav .nav-item-toggler.active {\n          top: 0px;\n          opacity: 1;\n          left: 24px;\n          pointer-events: all; }\n          .page-container #nav .nav-item-toggler.active i {\n            transform: rotate(0deg); }\n          .page-container #nav .nav-item-toggler.active.menu {\n            top: 18px;\n            left: 22px; }\n          .page-container #nav .nav-item-toggler.active.list {\n            left: 20px; }\n      .page-container #nav .nav-items {\n        margin-left: -14px;\n        padding-top: 14px;\n        font-size: 0px;\n        left: -250px;\n        position: relative;\n        transition: all 0.2s;\n        pointer-events: none; }\n    .page-container #page {\n      width: 100%; } }\n", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("3f3ff6d5", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Thin.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-ThinItalic.ttf) format(\"truetype\");\n  font-weight: 100;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Light.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-LightItalic.ttf) format(\"truetype\");\n  font-weight: 300;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");\n  font-weight: 400;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Medium.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-MediumItalic.ttf) format(\"truetype\");\n  font-weight: 500;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");\n  font-weight: 700;\n  font-style: italic; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-Black.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: normal; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: url(/assets/fonts/Roboto-BlackItalic.ttf) format(\"truetype\");\n  font-weight: 900;\n  font-style: italic; }\n\n.nav-item-buttons {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-grow: 1;\n  opacity: 0;\n  pointer-events: none;\n  transition: all 0.2s; }\n  .nav-item-buttons > * {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    font-size: 18px; }\n\n.nav-item {\n  padding: 5px 0px 5px 21px;\n  position: relative;\n  transition: all 0.2s;\n  line-height: 28px; }\n  .nav-item .drag-handle {\n    display: none;\n    top: 9px; }\n  .nav-item.dragover {\n    z-index: 1;\n    box-shadow: none;\n    background: rgba(0, 158, 241, 0.5); }\n  .nav-item .dropzones {\n    display: none;\n    position: absolute;\n    width: 100%;\n    height: 35px;\n    top: 0px;\n    left: 0px; }\n    .nav-item .dropzones .dropzone {\n      position: relative;\n      height: 10px;\n      width: 100%;\n      opacity: 0;\n      display: flex;\n      align-items: center;\n      transition: all 0.2s; }\n      .nav-item .dropzones .dropzone.dropzone-above {\n        border-top: 2px solid #009ef1; }\n      .nav-item .dropzones .dropzone.dropzone-below {\n        border-bottom: 2px solid #009ef1; }\n      .nav-item .dropzones .dropzone.dropzone-in {\n        height: 15px; }\n      .nav-item .dropzones .dropzone .material-icons {\n        position: relative;\n        left: 0px;\n        font-weight: bold;\n        color: #009ef1;\n        pointer-events: none; }\n    .nav-item .dropzones[zone=\"above\"] .dropzone.dropzone-above {\n      opacity: 1; }\n    .nav-item .dropzones[zone=\"in\"] .dropzone.dropzone-in {\n      opacity: 1; }\n    .nav-item .dropzones[zone=\"below\"] .dropzone.dropzone-below {\n      opacity: 1; }\n  .nav-item:hover .drag-handle {\n    display: flex; }\n\n.dragging-elements .nav-item .dropzones {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  z-index: 10; }\n\n.nav-item-name {\n  display: flex;\n  align-items: center;\n  position: relative;\n  width: 100%;\n  cursor: pointer; }\n  .nav-item-name a {\n    text-decoration: none; }\n  .nav-item-name:hover .nav-item-buttons {\n    opacity: 1;\n    pointer-events: all; }\n  .nav-item-name > i.material-icons {\n    margin-left: -20px;\n    width: 20px; }\n\n.nav-item-content {\n  display: none; }\n  .nav-item-content.expanded {\n    display: block; }\n", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("651d630d", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "#top-bar {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  padding: 7px 0px 7px 21px;\n  box-sizing: border-box; }\n  #top-bar .view-selector-option {\n    text-transform: uppercase;\n    padding: 7px 14px;\n    margin: 0px -14px;\n    display: flex;\n    align-items: center; }\n    #top-bar .view-selector-option:hover {\n      background: rgba(255, 255, 255, 0.1); }\n  #top-bar .left-side {\n    display: flex;\n    align-items: center;\n    flex-grow: 1; }\n    #top-bar .left-side #project-name {\n      width: 100%;\n      margin-right: 7px; }\n      #top-bar .left-side #project-name input {\n        width: 100%;\n        background: transparent;\n        border: none;\n        font-size: 1.3em; }\n    #top-bar .left-side span.material-icons {\n      font-size: 32px;\n      margin-right: 5px;\n      cursor: pointer;\n      display: block; }\n  #top-bar .right-side {\n    display: flex;\n    justify-content: flex-end; }\n", ""]);

// exports


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm.js
var vue_esm = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/vue-class-component/dist/vue-class-component.common.js
var vue_class_component_common = __webpack_require__(1);
var vue_class_component_common_default = /*#__PURE__*/__webpack_require__.n(vue_class_component_common);

// CONCATENATED MODULE: ./src/components/app/app.html
/* harmony default export */ var app = ("<div id=\"codeless\" v-if=\"project.data\">\n    <page-renderer :pageId=\"project.currentPage\"></page-renderer>\n    <side-bar></side-bar>\n    <nv-checkbox :label=\"checkboxLabel\" :disabled=\"checkboxDisabled\" :value=\"checkboxValue\" @change=\"whenUpdate\"></nv-checkbox>\n</div>");
// EXTERNAL MODULE: ./src/components/app/app.scss
var app_app = __webpack_require__(6);

// CONCATENATED MODULE: ./src/components/side-bar/side-bar.html
/* harmony default export */ var side_bar = ("<div id=\"side-bar\" v-if=\"project.isEditing && !auth.showLogin\">\n    <div id=\"side-bar-nav\">\n        <div class=\"tab\" @click=\"activateTab(`insert`)\" :class=\"isActive(`insert`)\">Insert</div>\n        <div class=\"tab\" @click=\"activateTab(`pages`)\" :class=\"isActive(`pages`)\" id=\"pages-nav-button\">Pages</div>\n    </div>\n    <div class=\"tab-indicator\" :style=\"tabIndicatorStyle\"></div>\n    <div id=\"side-bar-content\">\n        <div class=\"tab-content\" :class=\"isActive(`insert`)\">\n            <div class=\"buttons\">\n                <div id=\"add-text\" class=\"insert-button\" @click=\"project.addText()\">\n                    <i class=\"material-icons\">text_fields</i>\n                    <div>Text</div>\n                </div>\n                <div id=\"add-image\" class=\"insert-button\" @click=\"project.addImage()\">\n                    <i class=\"material-icons\">image</i>\n                    <div>Image</div>\n                </div>\n                <div id=\"add-rule\" class=\"insert-button\" @click=\"project.addDivider()\">\n                    <i class=\"material-icons\">remove</i>\n                    <div>Divider</div>\n                </div>\n                <div id=\"add-rule\" class=\"insert-button\" @click=\"project.addForm()\">\n                    <i class=\"material-icons\">list_alt</i>\n                    <div>Form</div>\n                </div>\n            </div>\n            <div class=\"global-elements\" v-if=\"hasGlobalElements\">\n                <p style=\"padding: 14px 7px 0px;\">Global elements</p>\n                <div v-for=\"(element, index) in project.data.elements\" :key=\"index\" v-if=\"element.global\" class=\"global-element-item\">\n                    <div class=\"global-element-item-thumb\" @click=\"project.addElement(element)\">\n                        <primitive-thumb :elementId=\"index\"></primitive-thumb>\n                    </div>\n                    <div class=\"global-element-item-name\" style=\"width: 100%;\">\n                        <input type=\"text\" v-model=\"element.name\" @input=\"project.savePage(project.currentPage)\">\n                    </div>\n                    <div class=\"page-settings\">\n                        <div class=\"page-settings-icon\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </div>\n                        <div v-tooltip=\"\">\n                            <div class=\"page-settings-item\" @click=\"toggleGlobalElement(index)\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">{{element.global ? 'check_box' : 'check_box_outline_blank'}}</i> Global component</span>\n                            </div>\n                            <div class=\"page-settings-item\" @click=\"deleteGlobalElement(index)\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">delete</i> Delete globally</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"tab-content\" :class=\"isActive(`pages`)\">\n            <div class=\"page-filter-wrapper\">\n                <div class=\"page-filter\">\n                    <div class=\"filter-icon\">\n                        <div></div>\n                        <div></div>\n                        <div></div>\n                    </div>\n                    <input type=\"text\" v-model=\"project.pageFilter\" placeholder=\"filter\">\n                </div>\n                <span class=\"btn\" @click=\"project.addPage()\">\n                    <span class=\"material-icons\">add</span>\n                    <span>New</span>\n                </span>\n            </div>\n            <div class=\"pages\">\n                <div v-for=\"(page, index) in project.filteredPages\" :key=\"index\" class=\"page-item\" :page=\"page\" :class=\"{currentPage:page===project.currentPage}\"\n                    v-if=\"project.data.pages[page]\">\n                    <div class=\"page-thumb-wrapper\" @click=\"project.openPage(page)\">\n                        <div class=\"page-thumb-container no-shadow\" v-if=\"project.data.home === page\">\n                            <span class=\"material-icons\">home</span>\n                        </div>\n                        <div class=\"page-thumb-container\" v-if=\"project.data.home !== page\">\n                            <page-thumb :pageId=\"page\"></page-thumb>\n                        </div>\n                    </div>\n                    <div class=\"page-name\">\n                        <input type=\"text\" v-model=\"project.data.pages[page].name\" @input=\"project.savePage(page)\">\n                    </div>\n                    <div class=\"page-settings\">\n                        <div class=\"page-settings-icon\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </div>\n                        <div v-tooltip=\"\">\n                            <div class=\"page-settings-item\" @click=\"project.setHomePage(page)\">\n                                <span class=\"material-icons\">home</span>\n                                <span>&nbsp;Make home</span>\n                            </div>\n                            <div class=\"page-settings-item\" @click=\"project.duplicatePage(page)\">\n                                <span class=\"material-icons\">library_books</span>\n                                <span>&nbsp;Duplicate</span>\n                            </div>\n                            <div class=\"page-settings-item\" @click=\"project.deletePage(page)\">\n                                <span class=\"material-icons\">delete</span>\n                                <span>&nbsp;Delete</span>\n                            </div>\n                            <div class=\"page-settings-item\" @click=\"project.togglePageNav(page)\">\n                                <span class=\"material-icons\">near_me</span>\n                                <span>&nbsp;Add to nav</span>\n                            </div>\n                            <div class=\"page-settings-item\" @click=\"project.saveAsTemplate(page)\">\n                                <span class=\"material-icons\">art_track</span>\n                                <span>&nbsp;Save as template</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"pages\">\n                <p style=\"padding: 14px 7px 0px;\">Templates</p>\n                <p v-if=\"!project.data.templates || !Object.keys(project.data.templates).length\" style=\"padding: 14px 7px 0px;opacity:0.5;\">\n                    <i>No templates created yet</i>\n                </p>\n                <div v-for=\"(template, index) in project.data.templates\" :key=\"index\" class=\"page-item\" :template=\"index\" v-if=\"project.data.templates[index]\">\n                    <div class=\"page-thumb-wrapper\" @click=\"project.newPageFromTemplate(index)\">\n                        <div class=\"page-thumb-container\">\n                            <page-thumb :pageId=\"index\" :type=\"'template'\"></page-thumb>\n                        </div>\n                    </div>\n                    <div class=\"page-name\">\n                        <input type=\"text\" v-model=\"template.name\" @input=\"project.savePage(project.currentPage)\">\n                    </div>\n                    <div class=\"page-settings\">\n                        <div class=\"page-settings-icon\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </div>\n                        <div v-tooltip=\"\">\n                            <div class=\"page-settings-item\" @click=\"project.deleteTemplate(index)\">\n                                <span class=\"material-icons\">delete</span>\n                                <span>&nbsp;Delete</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/side-bar/side-bar.scss
var side_bar_side_bar = __webpack_require__(8);

// CONCATENATED MODULE: ./src/services/app.ts
var app_App = /** @class */function () {
    function App() {
        this.selection = null;
    }
    App.prototype.scrollToElement = function (anchor) {
        var page = document.getElementById("page");
        if (anchor && page) {
            page.scrollTop += anchor.getBoundingClientRect().top - page.getBoundingClientRect().top;
        }
    };
    App.prototype.setPath = function (target, _p) {
        if (!_p.split) {
            target.push(_p);
        } else {
            _p.split(".").forEach(function (p) {
                if (p.trim() !== "") {
                    target.push(p);
                }
            });
        }
    };
    App.prototype.getBase = function (base, _path) {
        var path = [];
        this.setPath(path, _path);
        path.forEach(function (p, i) {
            if (i !== path.length - 1) {
                base = base[p];
            }
        });
        return base;
    };
    App.prototype.deleteThis = function (base, _path) {
        var path = [];
        this.setPath(path, _path);
        path.forEach(function (p, i) {
            if (i === path.length - 1) {
                if (Array.isArray(base)) {
                    base.splice(p, 1);
                } else {
                    delete base[p];
                }
                return;
            }
            base = base[p];
        });
    };
    App.prototype.addThis = function (base, _path, item) {
        var path = [];
        this.setPath(path, _path);
        path.forEach(function (p, i) {
            if (i === path.length - 1) {
                if (Array.isArray(base)) {
                    base.splice(p, 0, item);
                } else {
                    base[p] = item;
                }
                return;
            }
            base = base[p];
        });
    };
    App.prototype.moveThis = function (base, from, to) {
        var startBase = this.getBase(base, from);
        var endBase = this.getBase(base, to);
        var startPath = [];
        var endPath = [];
        this.setPath(startPath, from);
        this.setPath(endPath, to);
        var startKey = startPath[startPath.length - 1];
        var endKey = endPath[endPath.length - 1];
        if (Array.isArray(endBase)) {
            endKey = parseInt(endKey);
            if (Array.isArray(startBase)) {
                startKey = parseInt(startKey);
                if (endBase === startBase) {
                    var item = endBase[startKey];
                    if (startKey > endKey) {
                        endBase.splice(startKey, 1);
                        endBase.splice(endKey, 0, item);
                    } else {
                        endBase.splice(endKey, 0, item);
                        endBase.splice(startKey, 1);
                    }
                    return;
                }
                endBase.splice(endKey, 0, startBase.splice(startKey, 1)[0]);
            } else {
                delete startBase[startKey];
            }
        } else {
            endBase[endKey] = startBase[startKey];
            if (Array.isArray(startBase)) {
                startKey = parseInt(startKey);
                startBase.splice(startKey, 1);
            } else {
                delete startBase[startKey];
            }
        }
    };
    App.prototype.getThis = function (el, path, emptyVal) {
        // if can parse path string
        if (path && path.toString().split) {
            path = [el].concat(path.toString().split("."));
        } else {
            // else set the element as the first item to get
            path = [el];
        }
        // follow path
        var result = path.reduce(function (accumulator, currentValue) {
            if (accumulator === undefined) {
                return emptyVal;
            }
            if (currentValue.indexOf(".") === -1 && currentValue.indexOf("(") > -1) {
                var argsString = '';
                var argsObj = /\((.*?)\)/g.exec(currentValue);
                if (argsObj) {
                    argsString = argsObj[1] || "";
                }
                var args = argsString.split(",").map(function (arg) {
                    return arg.trim();
                });
                var functionName = currentValue.split("(")[0];
                if (typeof accumulator[functionName] === "function") {
                    var result_1 = accumulator[functionName].apply(accumulator, args);
                    return result_1;
                }
            }
            if (currentValue) {
                return accumulator[currentValue];
            } else {
                return accumulator;
            }
        });
        if (result === undefined) {
            return emptyVal;
        }
        return result;
    };
    App.prototype.isTruthy = function (value) {
        if (typeof value === "string" && value.trim() === "") {
            return false;
        }
        return value !== undefined && value !== null && value !== "undefined" && value !== "null";
    };
    App.prototype.getTypeOfElement = function (val) {
        try {
            val = JSON.parse(val);
        } catch (e) {}
        if (val === undefined) {
            return "undefined";
        }
        if (val === null) {
            return "null";
        }
        if (val === true || val === false) {
            return "boolean";
        }
        if (typeof val === "number") {
            return "number";
        }
        var possibleDate = new Date(val);
        if (Object.prototype.toString.call(possibleDate) === "[object Date]" && !isNaN(possibleDate.getTime())) {
            return "date";
        }
        if (typeof val === "string") {
            return "string";
        }
        if (Array.isArray(val)) {
            return "array";
        }
        var string = {}.toString.apply(val);
        if (string === "[object Object]") {
            return "object";
        }
        if (string === "[object Function]") {
            return "function";
        }
    };
    App.prototype.isObject = function (item) {
        return item && typeof item === 'object' && !Array.isArray(item) && item !== null;
    };
    App.prototype.deepMerge = function (original_Object, new_Object) {
        var _this = this;
        if (this.isObject(new_Object) && this.isObject(original_Object)) {
            Object.keys(new_Object).forEach(function (key) {
                var _a, _b;
                if (_this.isObject(new_Object[key])) {
                    if (!new_Object[key]) Object.assign(new_Object, (_a = {}, _a[key] = {}, _a));
                    _this.deepMerge(new_Object[key], new_Object[key]);
                } else {
                    Object.assign(new_Object, (_b = {}, _b[key] = new_Object[key], _b));
                }
            });
        }
        return new_Object;
    };
    App.prototype.saveSelection = function () {
        var sel = window.getSelection();
        if (!sel.focusNode) {
            return;
        }
        var parentNode = this.findParentPath(sel.baseNode, [], "primitive-element");
        var node = this.findParentPath(sel.extentNode, [], "editable-text-element");
        var start = this.findParentPath(sel.anchorNode, [], "editable-text-element");
        if (!node || !node.path.length) {
            return;
        }
        if (!parentNode || !parentNode.node.id) {
            return;
        }
        this.selection = {
            id: parentNode.node.id,
            offsetEnd: sel.extentOffset,
            offsetStart: sel.anchorOffset,
            path: node.path,
            pathStart: start.path
        };
    };
    App.prototype.restoreSelection = function () {
        if (!this.selection) {
            return;
        }
        var mainEl = document.body.querySelector("#" + this.selection.id + " .editable-text-element");
        var el = mainEl;
        var startEl = mainEl;
        if (!el) {
            return;
        }
        this.selection.path.forEach(function (i) {
            if (el.childNodes[i]) {
                el = el.childNodes[i];
            }
        });
        this.selection.pathStart.forEach(function (i) {
            if (startEl.childNodes[i]) {
                startEl = startEl.childNodes[i];
            }
        });
        if (!el) {
            return;
        }
        if (!startEl) {
            return;
        }
        var sel = window.getSelection();
        var range = document.createRange();
        range.setStart(startEl, this.selection.offsetStart);
        range.setEnd(el, this.selection.offsetEnd);
        // range.collapse(true)
        sel.removeAllRanges();
        sel.addRange(range);
    };
    App.prototype.clearSelection = function () {
        window.getSelection().removeAllRanges();
        this.selection = null;
    };
    App.prototype.findParentPath = function (target, arr, _class) {
        var index = function () {
            if (target.parentNode) {
                for (var i = 0; i < target.parentNode.childNodes.length; i++) {
                    if (target.parentNode.childNodes[i] === target) {
                        return i;
                    }
                }
            }
        };
        if (target.className && target.className.indexOf(_class) > -1) {
            return { node: target, path: arr };
        } else if (target.parentNode) {
            arr.unshift(index());
            return this.findParentPath(target.parentNode, arr, _class);
        }
        return { node: target, path: arr };
    };
    return App;
}();
/* harmony default export */ var services_app = (new app_App());
// CONCATENATED MODULE: ./src/services/auth.ts
// https://developers.google.com/api-client-library/javascript/features/authentication
// https://github.com/google/google-api-javascript-client
var gapi = window.gapi;
var Auth = /** @class */function () {
    function Auth() {
        this.showLogin = false;
        this.doc = window.codeless.document;
        this.upload = window.codeless.upload;
        this.domain = window.codeless.domain;
        this.docData = {};
        this.isSignedIn = false;
        this.user = null;
        this.isWriter = false;
        this.docUpdatedSubscribers = [];
        this.authSubscribers = [];
    }
    Auth.prototype.onUpdate = function (cb) {
        this.docUpdatedSubscribers.push(cb);
    };
    Auth.prototype.onAuth = function (cb) {
        this.authSubscribers.push(cb);
    };
    Auth.prototype.login = function () {
        gapi.auth2.getAuthInstance().signIn();
    };
    Auth.prototype.logout = function () {
        gapi.auth2.getAuthInstance().signOut();
    };
    Auth.prototype.sendEmail = function (data) {
        return new Promise(function (resolve, reject) {
            if (!data.emails) {
                return reject();
            }
            var callback = function (res) {
                console.log(res);
                resolve(res);
            };
            var message = "To: " + data.emails + "\r\nFrom: " + gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail() + "\r\nSubject: " + data.title + "\n\r" + data.message;
            var base64EncodedEmail = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');
            var request = gapi.client.gmail.users.messages.send({
                'userId': 'me',
                'resource': {
                    'raw': base64EncodedEmail
                }
            });
            request.execute(callback);
        });
    };
    Auth.prototype.getDirectoryFiles = function () {
        return gapi.client.drive.files.list({ q: "'" + this.upload + "' in parents" }).then(function (res) {
            return res.result.files;
        });
    };
    Auth.prototype.getFileUrl = function (id) {
        return "https://drive.google.com/a/" + this.domain + "/uc?id=" + id + "&export=download";
    };
    Auth.prototype.updateSigninStatus = function (isSignedIn) {
        var _this = this;
        this.isSignedIn = isSignedIn;
        if (isSignedIn) {
            if (this.showLogin) {
                window.location.pathname = "/";
            }
            this.user = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
            return gapi.client.drive.permissions.list({
                fileId: this.doc
            }).then(function () {
                _this.isWriter = true;
                _this.triggerAuthUpdate();
            }).catch(function () {
                _this.isWriter = false;
                _this.triggerAuthUpdate();
            });
        }
        this.user = null;
    };
    Auth.prototype.triggerAuthUpdate = function () {
        var _this = this;
        this.authSubscribers.forEach(function (cb) {
            if (cb && typeof cb === "function") {
                cb(_this.isWriter);
            }
        });
    };
    Auth.prototype.triggerUpdate = function () {
        var _this = this;
        this.docUpdatedSubscribers.forEach(function (cb) {
            if (cb && typeof cb === "function") {
                cb(_this.docData);
            }
        });
    };
    Auth.prototype.updateDoc = function (content) {
        var _this = this;
        if (!content) {
            content = JSON.stringify({ testKey: 'test value' });
        }
        return new Promise(function (resolve, reject) {
            if (!_this.isWriter) {
                return reject("not permitted");
            }
            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var contentType = "application/vnd.google-apps.document";
            var base64Data = btoa(content || "");
            var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + delimiter + 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' + '\r\n' + base64Data + close_delim;
            var request = gapi.client.request({
                'path': '/upload/drive/v2/files/' + _this.doc,
                'method': 'PUT',
                'params': { 'uploadType': 'multipart', 'alt': 'json' },
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
            var callback = function (res) {
                resolve(res);
            };
            request.execute(callback);
        });
    };
    Auth.prototype.uploadFile = function (fileData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var reader = new FileReader();
            reader.readAsBinaryString(fileData);
            reader.onload = function (e) {
                var contentType = fileData.type || 'application/octet-stream';
                var metadata = {
                    title: fileData.name || "Uploaded file for Codeless",
                    mimeType: contentType,
                    userPermission: { type: "anyone" },
                    parents: [{ id: _this.upload }]
                };
                if (reader.result) {
                    var base64Data = btoa(reader.result);
                    var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' + '\r\n' + base64Data + close_delim;
                    var request = gapi.client.request({
                        'path': '/upload/drive/v2/files',
                        'method': 'POST',
                        'params': { 'uploadType': 'multipart' },
                        'headers': {
                            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                        },
                        'body': multipartRequestBody
                    });
                    var callback = function (file) {
                        resolve(file);
                    };
                    request.execute(callback);
                }
            };
        });
    };
    Auth.prototype.getDoc = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return gapi.client.drive.files.export({
                fileId: _this.doc,
                mimeType: "text/plain"
            }).then(function (res) {
                var doc;
                try {
                    doc = JSON.parse(res.body.trim());
                    if (doc) {
                        _this.docData = doc;
                        return resolve(_this.docData);
                    }
                } catch (error) {
                    return reject();
                }
            }).catch(reject);
        });
    };
    Auth.prototype.init = function () {
        var _this = this;
        this.updateSigninStatus = this.updateSigninStatus.bind(this);
        if (location.pathname === "/login") {
            this.showLogin = true;
        }
        return new Promise(function (resolve, reject) {
            var start = function () {
                gapi.client.init({
                    apiKey: 'AIzaSyBWyofYdqqWW1fdFBbe3GjYwunoMi_tP5Q',
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                    clientId: '679670526531-po28kjn9kdk5h93k8uf6n2i26harqedr.apps.googleusercontent.com',
                    scope: 'profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send'
                }).then(function () {
                    gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
                    _this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    return _this.getDoc().then(function (res) {
                        _this.triggerUpdate();
                        resolve();
                    }).catch(reject);
                });
            };
            gapi.load('client', start);
        });
    };
    return Auth;
}();
/* harmony default export */ var auth = (new Auth());
// CONCATENATED MODULE: ./src/services/project.ts



var project_Project = /** @class */function () {
    function Project() {
        var _this = this;
        this.defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDI5IiBoZWlnaHQ9IjIzOCIgdmlld0JveD0iMCAwIDQyOSAyMzgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPm1pc3NpbmctaW1hZ2UtNHgzPC90aXRsZT48ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNDI5djIzOEgweiIgZmlsbD0iI0YwRjFGMiIvPjxwYXRoIGQ9Ik0xNjAuODc1IDc5djc3LjdoMTA3LjI1Vjc5aC0xMDcuMjV6bTEwMS44ODggNC45djM5LjhsLTI4Ljg1LTI2LjEtMjguNzQ0IDI2LjgtMTQuNjkzLTEzLjctMjQuMjM5IDIyLjdWODMuOWg5Ni41MjV6bS05Ni41MjUgNTYuNWwyNC4zNDUtMjIuNyAzNi4zNTggMzMuOWgtNjAuNzA0di0xMS4yem02OC4yMSAxMS4zbC0yNS41MjUtMjMuOCAyNC45OS0yMy4zIDI4Ljg1IDI2LjF2MjFoLTI4LjMxNHoiIGZpbGw9IiNEQ0REREYiLz48L2c+PC9zdmc+";
        this.data = null;
        this.previewing = false;
        this.isEditing = false;
        this.author = false;
        this.totalColumns = 12;
        this._pageFilter = "";
        this._filteredPages = [];
        this.saveTimer = null;
        this.selectionNode = null;
        this.selectionOffset = 0;
        this.fonts = ["h1", "h2", "h3", "h4", "p"];
        this.colors = ["#1c1c1c", "#333", "#fafafa", "#ccc"];
        this.defaultProject = {
            pages: {},
            elements: {},
            settings: {
                colors: this.colors,
                fonts: this.fonts,
                name: "",
                logo: "",
                favicon: ""
            },
            home: "",
            navigation: [],
            navigationMap: {},
            currentPage: "",
            templates: {}
        };
        auth.onAuth(function (isAuthor) {
            if (isAuthor) {
                _this.author = true;
                _this.isEditing = true;
            }
        });
        auth.onUpdate(function (res) {
            _this.getData(res);
        });
        auth.init().catch(function () {
            _this.getData();
        });
    }
    Object.defineProperty(Project.prototype, "currentPage", {
        get: function () {
            return this.data ? this.data.currentPage : "";
        },
        set: function (page) {
            if (this.data && this.data.hasOwnProperty("currentPage")) {
                this.data.currentPage = page;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Project.prototype, "filteredPages", {
        get: function () {
            return this._filteredPages;
        },
        set: function (arr) {
            var _this = this;
            var keys = [];
            arr.forEach(function (k) {
                if (!_this.pageFilter || _this.pageFilter.trim() === "") {
                    keys.push(k);
                    return;
                }
                if (_this.data && _this.data.pages[k] && (_this.data.pages[k].name.toLowerCase() === _this.pageFilter.toLowerCase() || _this.data.pages[k].name.toLowerCase().indexOf(_this.pageFilter.toLowerCase()) > -1)) {
                    keys.push(k);
                }
            });
            this._filteredPages = JSON.parse(JSON.stringify(keys));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Project.prototype, "pageFilter", {
        get: function () {
            return this._pageFilter;
        },
        set: function (str) {
            if (this.data) {
                this._pageFilter = str;
                this.filteredPages = Object.keys(this.data.pages);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Project.prototype, "projectColors", {
        get: function () {
            return this.data ? this.data.settings.colors.join(", ") : "";
        },
        set: function (string) {
            if (this.data) {
                this.data.settings.colors = string.split(",").map(function (str) {
                    return str.trim();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Project.prototype.createPrimitive = function (type) {
        var id = this.generateId();
        return {
            name: "element-" + id,
            type: type,
            content: [],
            colSpan: this.totalColumns,
            height: "auto",
            id: id,
            index: {},
            background: "transparent",
            backgroundImage: "",
            active: false,
            published: true,
            global: false,
            css: "",
            generic: null
        };
    };
    Project.prototype.generateId = function () {
        return new Date().getTime() + "-" + Math.round(Math.random() * 1000);
    };
    Project.prototype.reorderElements = function (page, start, end) {
        var _this = this;
        if (!this.data || !this.data.elements[this.data.pages[page].data[start]]) {
            return;
        }
        this.data.elements[this.data.pages[page].data[start]].index[page] = end;
        if (!this.data.pages[page].data) {
            return;
        }
        var length = this.data.pages[page].data.length;
        var index = 0;
        this.data.pages[page].data.sort(function (a, b) {
            if (!_this.data) {
                return 1;
            }
            var aIndex = _this.data.elements[a].index[page];
            var bIndex = _this.data.elements[b].index[page];
            return aIndex >= bIndex ? 1 : -1;
        });
        while (length > index) {
            this.data.elements[this.data.pages[page].data[index]].index[page] = index;
            index++;
        }
        this.savePage(page);
    };
    Project.prototype.setColumns = function (pageId) {
        var _this = this;
        var lastSpan = 0;
        if (!this.data) {
            return;
        }
        this.data.pages[pageId].data.forEach(function (i) {
            if (!_this.data) {
                return;
            }
            var element = _this.data.elements[i];
            if (!element) {
                return element;
            }
            if (!lastSpan) {
                element.isRowStart = true;
            } else if (lastSpan + element.colSpan > _this.totalColumns) {
                lastSpan = 0;
                element.isRowStart = true;
            } else {
                element.isRowStart = false;
            }
            if (lastSpan + element.colSpan === _this.totalColumns) {
                element.isRowEnd = true;
            } else {
                element.isRowEnd = false;
            }
            lastSpan = lastSpan + element.colSpan;
        });
    };
    Project.prototype.addElement = function (element) {
        var _this = this;
        if (!this.data || !this.currentPage) {
            return;
        }
        var currentObject = this.data.pages[this.currentPage].data;
        if (!currentObject) {
            return;
        }
        element.active = true;
        element.index[this.currentPage] = currentObject.length;
        currentObject.forEach(function (i) {
            if (!_this.data) {
                return;
            }
            _this.data.elements[i].active = false;
        });
        vue_esm["default"].set(this.data.elements, element.id, element);
        currentObject.push(element.id);
        this.savePage(this.currentPage);
        requestAnimationFrame(function () {
            services_app.scrollToElement(document.getElementById("element-" + element.id));
            element.active = true;
        });
    };
    Project.prototype.addText = function () {
        var newText = this.createPrimitive("text");
        newText.content = ["text"];
        this.addElement(newText);
    };
    Project.prototype.addDivider = function () {
        var newDivider = this.createPrimitive("divider");
        newDivider.content = [];
        this.addElement(newDivider);
    };
    Project.prototype.addImage = function () {
        var newImage = this.createPrimitive("image");
        newImage.content = [this.defaultImage];
        newImage.link = "";
        this.addElement(newImage);
    };
    Project.prototype.addForm = function () {
        var el = this.createPrimitive("form");
        el.content = [""];
        el.link = "";
        el.name = "";
        this.addElement(el);
    };
    Project.prototype.deleteItem = function (key) {
        if (!this.data || !this.currentPage) {
            return;
        }
        var el = this.data.elements[key];
        var pageKeys = Object.keys(this.data.pages);
        var pageLength = pageKeys.length;
        while (pageLength--) {
            var contentLength = this.data.pages[pageKeys[pageLength]].data.length;
            while (contentLength--) {
                if (this.data.pages[pageKeys[pageLength]].data[contentLength] === key) {
                    this.data.pages[pageKeys[pageLength]].data.splice(contentLength, 1);
                    break;
                }
            }
        }
        if (!el.global) {
            delete this.data.elements[key];
        }
        this.savePage(this.currentPage);
    };
    Project.prototype.addPage = function () {
        if (!this.data) {
            return;
        }
        var id = this.generateId();
        var newPage = {
            name: "New page",
            id: id,
            data: []
        };
        vue_esm["default"].set(this.data.pages, id, newPage);
        this.openPage(id);
        this.savePage(id);
    };
    Project.prototype.deletePage = function (id) {
        if (!this.data || !this.currentPage) {
            return;
        }
        var pages = Object.keys(this.data.pages);
        if (this.currentPage = id) {
            var newId = void 0;
            var index = 0;
            while (!newId && index < pages.length) {
                if (pages[index] !== id) {
                    newId = pages[index];
                }
                index++;
            }
            if (newId) {
                this.openPage(newId);
            } else {
                this.addPage();
            }
        }
        var contentLength = this.data.pages[id].data.length;
        while (contentLength--) {
            if (!this.data.elements[this.data.pages[id].data[contentLength]].global) {
                delete this.data.elements[this.data.pages[id].data[contentLength]];
            }
        }
        delete this.data.pages[id];
        if (this.data.home === id) {
            this.setHomePage(Object.keys(this.data.pages)[0]);
        }
        this.savePage(this.currentPage);
    };
    Project.prototype.duplicatePage = function (id) {
        var _this = this;
        if (!this.data || !this.currentPage) {
            return;
        }
        var page = JSON.parse(JSON.stringify(this.data.pages[id]));
        page.data = page.data.map(function (elementIndex) {
            if (!_this.data || !_this.currentPage) {
                return;
            }
            if (!_this.data.elements[elementIndex].global) {
                var element = JSON.parse(JSON.stringify(_this.data.elements[elementIndex]));
                element.id = _this.generateId();
                vue_esm["default"].set(_this.data.elements, element.id, element);
                return element.id;
            }
            return elementIndex;
        });
        page.id = this.generateId();
        page.name = page.name + " (copy)";
        vue_esm["default"].set(this.data.pages, page.id, page);
        this.openPage(page.id);
        this.savePage(page.id);
    };
    Project.prototype.setHomePage = function (id) {
        if (!this.data || !this.currentPage) {
            return;
        }
        this.data.home = id;
        this.savePage(this.currentPage);
    };
    Project.prototype.openPage = function (pageId, anchor) {
        var _this = this;
        if (!this.data || !this.currentPage) {
            return;
        }
        this.currentPage = pageId;
        if (!this.data.pages[pageId]) {
            return;
        }
        window.document.title = this.data.settings.name + " - " + this.data.pages[pageId].name;
        var query = "?p=" + pageId + (anchor ? "&a=" + anchor : "");
        var url = window.location.origin + window.location.pathname + query;
        if (this.data.home === pageId) {
            query = "" + (anchor ? "?a=" + anchor : "");
            url = window.location.origin + window.location.pathname + query;
        }
        history.pushState({ p: pageId, a: anchor }, window.document.title, url);
        if (anchor) {
            requestAnimationFrame(function () {
                services_app.scrollToElement(document.getElementById("element-" + anchor));
                _this.openPage(pageId);
            });
        }
    };
    Project.prototype.savePage = function (pageId) {
        var _this = this;
        services_app.saveSelection();
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(function () {
            if (!_this.data || !_this.currentPage) {
                return;
            }
            _this.setColumns(pageId);
            var save = function () {
                if (!_this.data || !_this.currentPage) {
                    return;
                }
                var json = JSON.stringify(_this.data);
                auth.updateDoc(json);
                localStorage.setItem("codeless", json);
                _this.filteredPages = Object.keys(_this.data.pages);
                if (_this.data.pages[_this.currentPage]) {
                    window.document.title = _this.data.settings.name + " - " + _this.data.pages[_this.currentPage].name;
                }
                _this.setColumns(pageId);
                _this.setFavicon();
                vue_esm["default"].nextTick(function () {
                    services_app.restoreSelection();
                });
            };
            auth.getDoc().then(function (data) {
                _this.data = _this.mergeData(data);
                save();
            }, function () {
                save();
            });
        }, 333);
    };
    Project.prototype.getPageQuery = function (url) {
        if (url) {
            url = url.split('?')[1];
            if (url) {
                url = "?" + url;
            }
        }
        var searchString = url || window.location.search;
        var results = {};
        if (!searchString) {
            return results;
        }
        // Convert query string to object
        var search = searchString.substr(1).split('&');
        search.forEach(function (s) {
            var key = s.split('=').shift();
            if (key) {
                var val = s.split(key + "=")[1];
                if (val && val !== 'undefined' && val !== '') {
                    results[key] = val;
                }
            }
        });
        return results;
    };
    Project.prototype.getPageFromUrl = function () {
        if (!this.data || !this.currentPage) {
            return "";
        }
        var query = this.getPageQuery();
        return query.p || this.data.home || Object.keys(this.data.pages)[0];
    };
    Project.prototype.mergeData = function (data) {
        var storage = localStorage.getItem("codeless");
        var objs = [];
        if (storage) {
            objs.push(JSON.parse(storage));
        }
        if (data) {
            objs.push(data);
        }
        if (this.data) {
            objs.push(this.data);
        }
        if (!objs.length) {
            this.data = JSON.parse(JSON.stringify(this.defaultProject));
            if (this.data) {
                this.addPage();
                this.currentPage = Object.keys(this.data.pages)[0];
            }
        }
        if (objs.length === 3) {
            this.data = services_app.deepMerge(services_app.deepMerge(objs[0], objs[1]), objs[2]);
        }
        if (objs.length === 2) {
            this.data = services_app.deepMerge(objs[0], objs[1]);
        }
        if (objs.length === 1) {
            this.data = objs[0];
        }
        return this.data;
    };
    Project.prototype.getData = function (data) {
        services_app.saveSelection();
        this.data = this.mergeData(data);
        if (!this.data) {
            return;
        }
        if (!Object.keys(this.data.pages).length) {
            this.addPage();
        }
        if (!this.data.home) {
            this.setHomePage(Object.keys(this.data.pages)[0]);
        }
        var query = this.getPageQuery();
        this.currentPage = this.getPageFromUrl();
        this.openPage(this.currentPage, query.a);
        this.setColumns(this.currentPage);
        this.filteredPages = Object.keys(this.data.pages);
        localStorage.setItem("codeless", JSON.stringify(this.data));
        this.setFavicon();
        vue_esm["default"].nextTick(function () {
            services_app.restoreSelection();
        });
    };
    Project.prototype.setFavicon = function () {
        if (!this.data) {
            return;
        }
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = this.data.settings.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
    };
    Project.prototype.insertNavItem = function (item) {
        if (!this.data || !this.currentPage) {
            return;
        }
        this.data.navigationMap[item.id] = this.data.navigation.length.toString();
        this.data.navigation.push(item);
        this.savePage(this.currentPage);
    };
    Project.prototype.saveNavItem = function (item, _path) {
        if (!this.data || !this.currentPage) {
            return;
        }
        var base = services_app.getBase(this.data.navigation, _path);
        var path = [];
        services_app.setPath(path, _path);
        var key = path[path.length - 1];
        base[key].text = item.text;
        base[key].link = item.link;
        this.savePage(this.currentPage);
    };
    Project.prototype.togglePageNav = function (page) {
        if (!this.data || !this.currentPage) {
            return;
        }
        this.data.navigationMap["?p=" + page] = this.data.navigation.length.toString();
        this.data.navigation.push({
            id: page,
            content: [],
            link: "?p=" + page
        });
        this.savePage(this.currentPage);
    };
    Project.prototype.makeProxy = function (data) {
        var _this = this;
        var proxy = JSON.parse(JSON.stringify(data));
        proxy.data = proxy.data.map(function (element) {
            if (!_this.data) {
                return;
            }
            var elementProxy = JSON.parse(JSON.stringify(_this.data.elements[element]));
            if (elementProxy.global) {
                return elementProxy.id;
            }
            elementProxy.id = _this.generateId();
            elementProxy.published = true;
            _this.data.elements[elementProxy.id] = elementProxy;
            return elementProxy.id;
        });
        proxy.id = this.generateId();
        return proxy;
    };
    Project.prototype.saveAsTemplate = function () {
        if (!this.data) {
            return;
        }
        var proxy = this.makeProxy(this.data.pages[this.currentPage]);
        if (!this.data.templates) {
            this.data.templates = {};
        }
        vue_esm["default"].set(this.data.templates, proxy.id, proxy);
        this.savePage(this.currentPage);
    };
    Project.prototype.deleteTemplate = function (id) {
        if (!this.data) {
            return;
        }
        vue_esm["default"].delete(this.data.templates, id);
        this.savePage(this.currentPage);
    };
    Project.prototype.newPageFromTemplate = function (id) {
        if (!this.data) {
            return;
        }
        var proxy = this.makeProxy(this.data.templates[id]);
        proxy.id = this.generateId();
        proxy.name = "New page";
        vue_esm["default"].set(this.data.pages, proxy.id, proxy);
        this.openPage(proxy.id);
        this.savePage(proxy.id);
    };
    return Project;
}();
/* harmony default export */ var project = (new project_Project());
// CONCATENATED MODULE: ./src/components/page-thumb/page-thumb.html
/* harmony default export */ var page_thumb = ("<div class=\"page-thumb-renderer\">\n    <div class=\"page-thumb\">\n        <primitive-element v-for=\"(id, index) in content\" :key=\"id\" :index=\"index\" :pageId=\"pageId\"></primitive-element>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/page-thumb/page-thumb.scss
var page_thumb_page_thumb = __webpack_require__(10);

// CONCATENATED MODULE: ./src/components/primitive-element/primitive-element.html
/* harmony default export */ var primitive_element = ("<div class=\"primitive-element\" v-if=\"element\" :id=\"`element-${element.id}`\" v-dragdrop=\"{handle:`.sort-handle`, canAddTo:`nav`, ondrop}\"\n    :style=\"elementStyle\" tool-tip-anchor=\"true\" @click=\"activate()\" draggable=\"false\" tabindex=\"-1\" v-if=\"project.isEditing || project.previewing || element.published\"\n    :class=\"colspan\">\n    <div :class=\"classes\" class=\"primitive-inner\">\n        <div class=\"element-content\">\n            <text-element :element=\"element\" :pageId=\"pageId\"></text-element>\n            <image-element :element=\"element\"></image-element>\n            <divider-element :element=\"element\"></divider-element>\n            <form-element :element=\"element\"></form-element>\n        </div>\n        <element-tools :element=\"element\" :pageId=\"pageId\"></element-tools>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/primitive-element/primitive-element.scss
var primitive_element_primitive_element = __webpack_require__(12);

// CONCATENATED MODULE: ./src/components/tool-tip/tool-tip.ts

var reposition = function (el, pointer, marginLeft) {
    el.style.marginLeft = "0px";
    el.style.marginTop = "0px";
    pointer.style.marginLeft = "0px";
    if (el.className.indexOf("tooltip-active") === -1) {
        return;
    }
    var tooltipMax = el.parentElement;
    var findMax = function () {
        if (!tooltipMax || tooltipMax === document.body) {
            return document.body;
        }
        if (tooltipMax.hasAttribute("tool-tip-max")) {
            return tooltipMax;
        }
        tooltipMax = tooltipMax.parentElement;
        return findMax();
    };
    tooltipMax = findMax();
    if (!tooltipMax) {
        tooltipMax = window.document.body;
    }
    var parentBox = tooltipMax.getBoundingClientRect();
    var box = el.getBoundingClientRect();
    if (parentBox.right - box.right < 0) {
        marginLeft = parentBox.right - box.right;
        el.style.marginLeft = marginLeft + "px";
        pointer.style.marginLeft = -marginLeft + "px";
    }
    if (box.left - parentBox.left < 0) {
        marginLeft = box.left - parentBox.left;
        el.style.marginLeft = -marginLeft + "px";
        pointer.style.marginLeft = marginLeft + "px";
    }
    if (box.bottom > window.innerHeight) {
        el.style.marginTop = "-" + (box.bottom - window.innerHeight) + "px";
    }
    if (box.top < 50) {
        el.style.marginTop = 50 - box.top + "px";
    }
};
/** Desc Renders an element as a tooltip */
var Tooltip = {
    /** @desc Attribute name */
    name: "tooltip",
    update: function (el, binding) {
        var pointer = el.querySelector(".tooltip-pointer");
        if (!pointer) {
            return;
        }
        if (!binding.value) {
            el.classList.remove("tooltip-active");
        }
        if (binding.value) {
            el.classList.add("tooltip-active");
        }
        reposition(el, pointer, 0);
    },
    /**
     * Vuejs lifecycle inserted hook
     * @param el - This element
     * @param binding - Directive bindings
     */
    inserted: function (el, binding) {
        var marginLeft = 0;
        // Open close the tooltip
        var toggle = function () {
            el.classList.toggle("tooltip-active");
            reposition(el, pointer, marginLeft);
        };
        var open = function (ev) {
            var target = ev.target;
            if (!target) {
                return;
            }
            if (el.parentElement) {
                var targetIsParent = el.parentElement === target;
                var parentContainsTarget = el.parentElement.contains(target);
                var targetIsEl = el === target || el.contains(target);
                var classes = el.className;
                var noCloseOnClick = classes && classes.length && classes.indexOf("do-not-close-tooltip-on-click") > -1 ? true : false;
                var noCloseOnOuterClick = classes && classes.length && classes.indexOf("do-not-close-tooltip-on-outer-click") > -1 ? true : false;
                if (noCloseOnOuterClick) {
                    if (targetIsParent || parentContainsTarget && !targetIsEl) {
                        return toggle();
                    }
                    return;
                }
                if (targetIsParent || parentContainsTarget) {
                    var classes = target.className;
                    if (el.classList.contains("tooltip-active") && noCloseOnClick) {
                        return;
                    }
                    return toggle();
                }
            }
            el.classList.remove("tooltip-active");
            if (binding.value) {
                window.document.body.classList.remove(binding.value);
            }
        };
        // Set up the element
        el.classList.add("tooltip");
        if (!el.getAttribute("position")) {
            el.setAttribute("position", "bottom");
        }
        if (el.parentElement) {
            el.parentElement.style.cursor = "pointer";
            el.parentElement.style.position = "relative";
        }
        window.document.body.addEventListener("click", open);
        var pointer = window.document.createElement("div");
        pointer.classList.add("tooltip-pointer");
        el.appendChild(pointer);
        var observerConfig = { attributes: true, childList: true, subtree: true };
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === "tooltip-update") {
                    reposition(el, pointer, marginLeft);
                }
            });
        });
        observer.observe(el, observerConfig);
        reposition(el, pointer, marginLeft);
        window.addEventListener("resize", function () {
            reposition(el, pointer, marginLeft);
        }, true);
        window.addEventListener("scroll", function () {
            reposition(el, pointer, marginLeft);
        }, true);
    }
};
/* harmony default export */ var tool_tip = (Tooltip);
vue_esm["default"].directive("tooltip", Tooltip);
// EXTERNAL MODULE: (webpack)/node_modules/url/url.js
var url_url = __webpack_require__(4);
var url_default = /*#__PURE__*/__webpack_require__.n(url_url);

// CONCATENATED MODULE: ./src/services/renderer.ts




var renderer_Renderer = /** @class */function () {
    function Renderer() {
        var _this = this;
        this.file = null;
        this.linkDialogueActive = null;
        this.showLinkTextInput = true;
        this.linkText = "";
        this.linkUrl = "";
        this.selectingLinkElement = false;
        this.imageUploadDialogueActive = null;
        this.imageUrl = "";
        this.navItemDialogue = null;
        this.showProjectSettings = null;
        this.showingNav = false;
        this.searchResults = {};
        this._searchTerm = "";
        this.showSearch = null;
        this.showSpinner = false;
        this.uploadedFiles = {};
        this.logoFile = null;
        this.faviconFile = null;
        this.showCSS = false;
        this.showFormInputs = null;
        this.formSent = null;
        this.newNavItem = {
            text: "",
            link: "",
            content: []
        };
        this.views = [{ icon: "edit", name: "editor" }, { icon: "visibility", name: "preview" }, { icon: "publish", name: "published" }];
        this.view = project.isEditing ? this.views[0] : this.views[2];
        var view = localStorage.getItem("code_less");
        if (view) {
            this.setView(JSON.parse(view));
        }
        auth.onAuth(function (isAuthor) {
            if (isAuthor) {
                _this.setView(_this.views[0]);
                auth.getDirectoryFiles().then(function (res) {
                    _this.uploadedFiles = res;
                });
            }
        });
    }
    Object.defineProperty(Renderer.prototype, "searchTerm", {
        get: function () {
            return this._searchTerm;
        },
        set: function (term) {
            this._searchTerm = term;
            for (var i in this.searchResults) {
                delete this.searchResults[i];
            }
            if (!term || term.trim() === "") {
                this.searchResults = {};
                return;
            }
            var _term = term.toLowerCase();
            if (!project.data) {
                return;
            }
            var _loop_1 = function (page) {
                var isAmatch = false;
                var name_1 = project.data.pages[page].name;
                var thisMatch = {
                    page: {
                        id: page,
                        name: name_1
                    },
                    terms: []
                };
                var terms = [];
                if (name_1.toLowerCase().indexOf(_term) > -1) {
                    isAmatch = true;
                }
                project.data.pages[page].data.forEach(function (key) {
                    if (!project.data) {
                        return;
                    }
                    var element = project.data.elements[key];
                    if (element.type !== "text") {
                        return;
                    }
                    if (element.content[0].toLowerCase().indexOf(_term) > -1) {
                        isAmatch = true;
                        var index = element.content[0].toLowerCase().indexOf(_term);
                        var start = index - 10 || 0;
                        var text = "..." + element.content[0].substring(start, index + _term.length + 30) + "...";
                        terms.push({
                            id: element.id,
                            text: text
                        });
                    }
                });
                if (isAmatch) {
                    thisMatch.terms = terms;
                    this_1.searchResults[page] = thisMatch;
                }
            };
            var this_1 = this;
            for (var page in project.data.pages) {
                _loop_1(page);
            }
        },
        enumerable: true,
        configurable: true
    });
    Renderer.prototype.activate = function (element) {
        if (!project.data) {
            return;
        }
        if (!element || element.active) {
            return;
        }
        for (var i in project.data.elements) {
            if (project.data.elements[i]) {
                project.data.elements[i].active = false;
            }
        }
        element.active = true;
        services_app.clearSelection();
    };
    Renderer.prototype.handleLinkClick = function (e, link) {
        if (project.isEditing) {
            e.preventDefault();
            return false;
        }
        if (link) {
            var href = link.getAttribute("href") || "";
            var url = url_default.a.parse(href);
            if (!url.hostname) {
                url.hostname = location.hostname;
            }
            if (!url.protocol) {
                url.protocol = "https:";
            }
            if (url.hostname === location.hostname) {
                e.preventDefault();
                var query = project.getPageQuery(href);
                project.openPage(query.p, query.a);
            }
        }
    };
    Renderer.prototype.getActiveElement = function () {
        if (!project.data) {
            return;
        }
        var elements = project.data.pages[project.currentPage].data;
        var len = elements.length;
        var active;
        while (!active && len--) {
            if (project.data.elements[elements[len]] && project.data.elements[elements[len]].active) {
                active = project.data.elements[elements[len]];
            }
        }
        return active;
    };
    Renderer.prototype.getActiveDomElement = function (subElement) {
        var currentElement = this.getActiveElement();
        if (!currentElement) {
            return;
        }
        return window.document.body.querySelector("#element-" + currentElement.id + (subElement ? " " + subElement : ""));
    };
    Renderer.prototype.selectLinkElement = function (targetIsPage) {
        var _this = this;
        services_app.saveSelection();
        this.selectingLinkElement = true;
        document.body.classList.add("selecting-link-element");
        if (targetIsPage) {
            document.body.classList.add("selecting-link-page");
        }
        var pageNavButton = document.getElementById("pages-nav-button");
        if (pageNavButton) {
            pageNavButton.click();
        }
        var prevent = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var release = function () {
            document.body.classList.remove("selecting-link-page");
            document.body.classList.remove("selecting-link-element");
            _this.selectingLinkElement = false;
            window.removeEventListener("mousedown", setTarget);
            window.removeEventListener("keydown", esc);
            window.removeEventListener("click", prevent);
        };
        var esc = function (e) {
            var key = e.key;
            if (key.toLowerCase() === "escape") {
                release();
            }
        };
        var setTarget = function (e) {
            prevent(e);
            var target;
            if (targetIsPage) {
                target = _this.findParentPrimitive(e.target, "page-item");
                if (target) {
                    _this.linkUrl = "?p=" + target.getAttribute("page");
                    release();
                }
            } else {
                target = _this.findParentPrimitive(e.target);
                if (target) {
                    _this.linkUrl = "?p=" + project.currentPage + "&a=" + target.id.split("element-")[1];
                    release();
                }
            }
        };
        setTarget.bind(this);
        window.addEventListener("mousedown", setTarget);
        window.addEventListener("click", prevent);
        window.addEventListener("keydown", esc);
    };
    Renderer.prototype.clearEmptyElements = function () {
        var activeDomElement = this.getActiveDomElement(".editable-text-element");
        if (activeDomElement) {
            var children = activeDomElement.querySelectorAll("*");
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var parent_1 = child.parentNode;
                if (parent_1 && child.innerHTML === "") {
                    parent_1.removeChild(child);
                }
            }
        }
    };
    Renderer.prototype.wrapSelection = function (tag, attributes, text) {
        var sel = window.getSelection();
        if (sel.type === "none") {
            services_app.restoreSelection();
            sel = window.getSelection();
            if (sel.type === "none") {
                return;
            }
        }
        var selection = window.getSelection().getRangeAt(0);
        var selectedText = selection.extractContents();
        var el = document.createElement(tag);
        if (attributes) {
            for (var i in attributes) {
                if (attributes[i]) {
                    el.setAttribute(i, attributes[i]);
                }
            }
        }
        el.appendChild(selectedText);
        if (text) {
            el.textContent = text;
        }
        selection.insertNode(el);
        return el;
    };
    Renderer.prototype.addLink = function () {
        if (!project.data) {
            return;
        }
        var activeElement = this.getActiveElement();
        var activeDomElement = this.getActiveDomElement(".editable-text-element");
        this.linkDialogueActive = false;
        var url = url_default.a.parse(this.linkUrl);
        if (!url.hostname) {
            url.hostname = location.hostname;
        }
        if (!url.protocol) {
            url.protocol = "https:";
        }
        this.linkUrl = url_default.a.format(url);
        if (activeElement && project.isEditing) {
            if (activeElement.type === "text" && activeDomElement) {
                if (!this.linkText) {
                    this.linkText = this.linkUrl;
                }
                services_app.restoreSelection();
                this.wrapSelection("a", { href: this.linkUrl }, this.linkText);
                services_app.restoreSelection();
                this.clearEmptyElements();
                project.data.elements[activeElement.id].content[0] = activeDomElement.innerHTML;
                project.savePage(project.currentPage);
            } else if (activeElement.type === "image") {
                project.data.elements[activeElement.id].link = this.linkUrl;
                project.savePage(project.currentPage);
            }
        }
        this.linkUrl = "";
        this.linkText = "";
    };
    Renderer.prototype.setLinkText = function () {
        services_app.restoreSelection();
        this.showLinkTextInput = true;
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        var rangeNode = range.commonAncestorContainer;
        var rangeElement = rangeNode.parentElement && rangeNode.parentNode ? rangeNode.parentElement.children[Array.prototype.indexOf.call(rangeNode.parentNode.childNodes, rangeNode)] : null;
        var link;
        if (rangeNode) {
            if (rangeNode.nodeName.toLocaleLowerCase() === "#text") {
                if (rangeNode.parentNode && rangeNode.parentNode.nodeName.toLocaleLowerCase() === "a") {
                    if (rangeNode.parentElement) {
                        link = rangeNode.parentElement;
                    }
                }
            }
            if (rangeNode.nodeName.toLocaleLowerCase() === "a") {
                if (rangeNode.parentElement && rangeNode.parentNode) {
                    link = rangeElement;
                }
            }
            if (rangeElement) {
                var _link = rangeElement.querySelector("a[href]");
                if (rangeElement.getAttribute('href')) {
                    _link = rangeElement;
                }
                if (_link) {
                    this.linkUrl = _link.href;
                }
            }
            if (link) {
                this.linkText = link.textContent || "";
                this.linkUrl = link.getAttribute("href") || "";
                var _range = document.createRange();
                _range.selectNodeContents(link);
                sel.removeAllRanges();
                sel.addRange(_range);
                services_app.saveSelection();
                services_app.restoreSelection();
                return;
            }
        }
        this.linkText = sel.toString().trim();
        if (!this.linkUrl) {
            var currentEl = this.getActiveDomElement();
            if (!currentEl || !currentEl.querySelector("img")) {
                return;
            }
            this.showLinkTextInput = false;
            var link_1 = currentEl.querySelector("a");
            this.linkUrl = link_1 ? link_1.getAttribute("href") || "" : "";
        }
    };
    Renderer.prototype.openLinkDialogue = function () {
        this.linkUrl = "";
        this.linkText = "";
        this.setLinkText();
        this.linkDialogueActive = true;
    };
    Renderer.prototype.openImageUpload = function (type) {
        this.imageUploadDialogueActive = type;
    };
    Renderer.prototype.addImageUrl = function () {
        var _this = this;
        if (!project.data) {
            return;
        }
        var finish = function () {
            if (!project.data) {
                return;
            }
            var currentElement = _this.getActiveElement();
            var currentElementId = currentElement ? currentElement.id : null;
            if (!currentElementId || !_this.imageUploadDialogueActive) {
                return;
            }
            if (_this.imageUploadDialogueActive === "content") {
                ;
                project.data.elements[currentElementId].content.pop();
                ;
                project.data.elements[currentElementId].content.push(_this.imageUrl);
            } else {
                ;
                project.data.elements[currentElementId][_this.imageUploadDialogueActive] = _this.imageUrl;
            }
            project.savePage(project.currentPage);
            _this.imageUploadDialogueActive = null;
            _this.file = null;
            auth.getDirectoryFiles().then(function (res) {
                _this.uploadedFiles = res;
            });
        };
        if (this.file) {
            this.showSpinner = true;
            return auth.uploadFile(this.file).then(function (res) {
                _this.showSpinner = false;
                _this.imageUrl = res.webContentLink;
                finish();
            }).catch(function (err) {});
        } else {
            finish();
        }
    };
    Renderer.prototype.findParentPrimitive = function (target, _class) {
        if (!target) {
            return null;
        }
        if (target.classList && !target.classList.contains(_class || "primitive-element")) {
            if (target.parentElement === window.document.body) {
                return null;
            }
            return this.findParentPrimitive(target.parentElement, _class);
        }
        return target;
    };
    Renderer.prototype.findParentTag = function (target, tag) {
        if (!target) {
            return null;
        }
        if (target.tagName.toLowerCase() !== tag.toLowerCase()) {
            if (target.parentElement === window.document.body) {
                return null;
            }
            return this.findParentTag(target.parentElement, tag);
        }
        return target;
    };
    Renderer.prototype.addNewNavItem = function () {
        this.newNavItem = {
            id: project.generateId(),
            text: "",
            link: "",
            content: []
        };
        this.navItemDialogue = "new";
    };
    Renderer.prototype.saveNavItem = function (item) {
        if (item && this.navItemDialogue === "new") {
            project.insertNavItem(item);
        } else {
            project.saveNavItem(this.newNavItem, this.navItemDialogue);
        }
        this.navItemDialogue = null;
    };
    Renderer.prototype.setView = function (view) {
        this.view = view;
        switch (this.view.name) {
            case "preview":
                project.previewing = true;
                project.isEditing = false;
                break;
            case "published":
                project.previewing = false;
                project.isEditing = false;
                break;
            case "editor":
                project.previewing = false;
                project.isEditing = true;
                break;
        }
        localStorage.setItem("code_less", JSON.stringify(this.view));
    };
    Renderer.prototype.applySettings = function () {
        var _this = this;
        this.showProjectSettings = null;
        if (this.logoFile) {
            this.showSpinner = true;
            return auth.uploadFile(this.logoFile).then(function (res) {
                _this.logoFile = null;
                if (!project.data) {
                    return;
                }
                project.data.settings.logo = res.webContentLink;
                if (_this.faviconFile) {
                    return auth.uploadFile(_this.faviconFile).then(function (res) {
                        _this.faviconFile = null;
                        _this.showSpinner = false;
                        if (!project.data) {
                            return;
                        }
                        project.data.settings.favicon = res.webContentLink;
                        project.savePage(project.currentPage);
                    }).catch(function (err) {});
                } else {
                    _this.showSpinner = false;
                    project.savePage(project.currentPage);
                }
            }).catch(function (err) {});
        }
        if (this.faviconFile) {
            this.showSpinner = true;
            return auth.uploadFile(this.faviconFile).then(function (res) {
                _this.faviconFile = null;
                _this.showSpinner = false;
                if (!project.data) {
                    return;
                }
                project.data.settings.favicon = res.webContentLink;
                project.savePage(project.currentPage);
            }).catch(function (err) {});
        }
        project.savePage(project.currentPage);
    };
    Object.defineProperty(Renderer.prototype, "showScrim", {
        get: function () {
            return this.formSent || this.showFormInputs || this.showProjectSettings || this.showCSS || this.imageUploadDialogueActive || this.navItemDialogue !== null || this.linkDialogueActive || this.showSearch;
        },
        enumerable: true,
        configurable: true
    });
    Renderer.prototype.scrimClick = function () {
        this.formSent = this.showFormInputs = this.showProjectSettings = this.showCSS = this.imageUploadDialogueActive = this.navItemDialogue = this.linkDialogueActive = this.showSearch = null;
    };
    return Renderer;
}();
/* harmony default export */ var renderer = (new renderer_Renderer());
// EXTERNAL MODULE: ./src/components/drag-drop/drag-drop.scss
var drag_drop = __webpack_require__(20);

// CONCATENATED MODULE: ./src/components/drag-drop/drag-drop.ts


var Service = /** @class */function () {
    function Service() {
        var _this = this;
        this.dragIndex = null;
        this.dropIndex = null;
        this.dragGroup = null;
        this.onReleaseSubscriptions = [];
        this.onRelease = function () {
            _this.onReleaseSubscriptions.forEach(function (cb) {
                cb();
            });
        };
    }
    return Service;
}();
var service = new Service();
var DragDrop = {
    /** @desc Attribute name */
    name: "dragdrop",
    /**
     * Vuejs lifecycle inserted hook
     * @param el - This element
     * @param binding - Directive bindings
     */
    inserted: function (el, binding, vnode) {
        service.onReleaseSubscriptions.push(function () {
            document.body.classList.remove("dragging-elements");
            el.classList.remove("dragover");
            el.setAttribute("draggable", "false");
        });
        var setDrag = function (e) {
            var target = e.target;
            if (target && target.getAttribute("draggable") === "false") {
                return;
            }
            el.setAttribute("draggable", "true");
            service.dragIndex = vnode.context.dragDropIndex;
            service.dragGroup = binding.value.group;
        };
        var startDrag = function (e) {
            document.body.classList.add("dragging-elements");
        };
        var drop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (service.dragGroup && service.dragGroup !== binding.value.group) {
                return;
            }
            if (service.dragGroup === binding.value.group && service.dragIndex === vnode.context.dragDropIndex) {
                return;
            }
            binding.value.ondrop({
                dragIndex: service.dragIndex,
                dropIndex: vnode.context.dragDropIndex,
                group: service.dragGroup,
                event: e
            });
        };
        var dragover = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (service.dragGroup && service.dragGroup !== binding.value.group && service.dragGroup !== binding.value.canAddTo) {
                return;
            }
            if (service.dragGroup === binding.value.group && service.dragIndex === vnode.context.dragDropIndex) {
                return;
            }
            if (binding.value.ondragover && typeof binding.value.ondragover === "function") {
                binding.value.ondragover({
                    dragIndex: service.dragIndex,
                    dropIndex: vnode.context.dragDropIndex,
                    group: service.dragGroup,
                    event: e
                });
            }
            if (service.dragGroup !== binding.value.group || service.dragIndex !== vnode.context.dragDropIndex) {
                el.classList.add("dragover");
            }
        };
        var dragleave = function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (binding.value.ondragout && typeof binding.value.ondragout === "function") {
                binding.value.ondragout({
                    dragIndex: service.dragIndex,
                    dropIndex: vnode.context.dragDropIndex,
                    group: service.dragGroup,
                    event: e
                });
            }
            el.classList.remove("dragover");
        };
        var releaseDrag = function () {
            service.onRelease();
        };
        el.addEventListener("dragstart", startDrag);
        el.addEventListener("dragover", dragover);
        el.addEventListener("drop", drop);
        el.addEventListener("dragleave", dragleave);
        el.addEventListener("dragend", releaseDrag);
        if (binding.value.handle) {
            var handle = el.querySelector(binding.value.handle);
            if (handle) {
                handle.addEventListener("mousedown", setDrag);
                handle.addEventListener("mouseup", releaseDrag);
                return;
            }
        } else {
            el.addEventListener("mousedown", setDrag);
            el.addEventListener("mouseup", releaseDrag);
        }
    }
};
/* harmony default export */ var drag_drop_drag_drop = (DragDrop);
vue_esm["default"].directive("dragdrop", DragDrop);
// EXTERNAL MODULE: ./node_modules/reflect-metadata/Reflect.js
var reflect_metadata_Reflect = __webpack_require__(22);

// CONCATENATED MODULE: ./node_modules/vue-property-decorator/lib/vue-property-decorator.js
/** vue-property-decorator verson 6.1.0 MIT LICENSE copyright 2018 kaorun343 */





/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
            componentOptions.model = { prop: k, event: event || k };
        })(target, key);
    };
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        Object(vue_class_component_common["createDecorator"])(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return Object(vue_class_component_common["createDecorator"])(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (target, key, descriptor) {
        key = hyphenate(key);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (original.apply(this, args) !== false)
                this.$emit.apply(this, [event || key].concat(args));
        };
    };
}

// CONCATENATED MODULE: ./src/components/text-element/text-element.html
/* harmony default export */ var text_element = ("<div class=\"editable-text-element\" draggable=\"false\" v-if=\"element.type === `text`\" v-html=\"element.content[0]\" :contenteditable=\"project.isEditing\"\n    @paste=\"handlePaste($event)\" @input=\"setElementText()\" @focus=\"activate()\" @blur=\"blur\"></div>");
// EXTERNAL MODULE: ./src/components/text-element/text-element.scss
var text_element_text_element = __webpack_require__(24);

// CONCATENATED MODULE: ./src/components/text-element/text-element.ts
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var text_element_TextElement = /** @class */function (_super) {
    __extends(TextElement, _super);
    function TextElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "text-element";
        _this.project = project;
        _this.renderer = renderer;
        _this.app = services_app;
        _this.element = _this.element;
        _this.pageId = _this.pageId;
        return _this;
    }
    TextElement.prototype.setElementText = function () {
        if (!this.project.isEditing) {
            return;
        }
        this.element.content[0] = this.$el.innerHTML;
        this.project.savePage(this.pageId || this.project.currentPage);
    };
    TextElement.prototype.activate = function () {
        this.renderer.activate(this.element);
    };
    TextElement.prototype.handlePaste = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.project.isEditing) {
            return;
        }
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    };
    TextElement.prototype.blur = function () {
        // this.app.clearSelection()
        this.element.content.unshift(this.$el.innerHTML);
        this.element.content.pop();
        this.project.savePage(this.pageId || this.project.currentPage);
    };
    __decorate([Prop(), __metadata("design:type", Object)], TextElement.prototype, "element", void 0);
    __decorate([Prop(), __metadata("design:type", String)], TextElement.prototype, "pageId", void 0);
    TextElement = __decorate([vue_class_component_common_default()({
        template: text_element,
        components: {},
        propsData: {
            element: null,
            pageId: null
        }
    })], TextElement);
    return TextElement;
}(vue_esm["default"]);
/* harmony default export */ var components_text_element_text_element = (text_element_TextElement);
// CONCATENATED MODULE: ./src/components/image-element/image-element.html
/* harmony default export */ var image_element = ("<div v-if=\"element.type === `image`\">\n    <img class=\"editable-image-element\" v-if=\"!element.link\" :src=\"src\">\n    <a v-if=\"element.link\" :href=\"element.link\" @click=\"renderer.handleLinkClick($event)\">\n        <img class=\"editable-image-element\" :src=\"src\">\n    </a>\n</div>");
// CONCATENATED MODULE: ./src/components/image-element/image-element.ts
var image_element_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var image_element_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var image_element_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var image_element_ImageElement = /** @class */function (_super) {
    image_element_extends(ImageElement, _super);
    function ImageElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "image-element";
        _this.project = project;
        _this.renderer = renderer;
        _this.element = _this.element;
        return _this;
    }
    Object.defineProperty(ImageElement.prototype, "src", {
        get: function () {
            return this.element.content[0];
        },
        enumerable: true,
        configurable: true
    });
    image_element_decorate([Prop(), image_element_metadata("design:type", Object)], ImageElement.prototype, "element", void 0);
    ImageElement = image_element_decorate([vue_class_component_common_default()({
        template: image_element,
        components: {},
        propsData: {
            element: null
        }
    })], ImageElement);
    return ImageElement;
}(vue_esm["default"]);
/* harmony default export */ var image_element_image_element = (image_element_ImageElement);
// CONCATENATED MODULE: ./src/components/element-tools/element-tools.html
/* harmony default export */ var element_tools = ("<div class=\"element-resizer\" draggable=\"false\" v-if=\"project.isEditing\">\n    <div class=\"sort-handle element-resizer-handle\" draggable=\"false\" @mousedown=\"moverDown = true\" @mouseup=\"moverDown = false\"\n        @mouseleave=\"moverDown = false\" :class=\"{clicker: moverDown}\">\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n    </div>\n\n    <div class=\"element-resizer-e element-resizer-handle dont-drag\" draggable=\"false\" @mousedown=\"resize($event);resizerDown = true\"\n        @mouseup=\"resizerDown = false\" @mouseleave=\"resizerDown = false\" :class=\"{clicker: resizerDown}\">\n        <div class=\"dot\">&middot;</div>\n        <div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n        </div>\n        <div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n            <div class=\"dot\">&middot;</div>\n        </div>\n    </div>\n\n    <div class=\"element-settings dont-drag\" draggable=\"false\" @click=\"activate()\" @mousedown=\"app.saveSelection()\" @mouseup=\"app.restoreSelection()\">\n        <div>\n            <div v-tooltip=\"element.active\" :tooltip-update=\"repositionTooltip\" class=\"do-not-close-tooltip-on-outer-click tooltip-active\">\n\n                <div class=\"tooltip-button font-picker-wrapper\" v-if=\"element.type === `text`\">\n                    <font-picker :element=\"element\" :changeFont=\"changeFont\"></font-picker>\n                </div>\n\n                <div class=\"tooltip-button color-picker-wrapper\" v-if=\"element.type === `text`\">\n                    <div class=\"color-picker\">\n                        <i class=\"material-icons\">format_color_text</i>\n                        <div class=\"color-swatches\">\n                            <div class=\"color-swatch\" v-for=\"(color, colorKey) in project.data.settings.colors\" :key=\"colorKey\" :style=\"getColor(color)\"\n                                @click=\"execCommand('foreColor', color)\"></div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"tooltip-button\" @click=\"execCommand('bold')\" v-if=\"element.type === `text`\">\n                    <i class=\"material-icons\">format_bold</i>\n                </div>\n\n                <div class=\"tooltip-button\" @click=\"execCommand('italic')\" v-if=\"element.type === `text`\">\n                    <i class=\"material-icons\">format_italic</i>\n                </div>\n\n                <div class=\"tooltip-button\" @click=\"execCommand('underline')\" v-if=\"element.type === `text`\">\n                    <i class=\"material-icons\">format_underline</i>\n                </div>\n\n                <div class=\"tooltip-button\" @click=\"execCommand('insertOrderedList')\" v-if=\"element.type === `text`\">\n                    <i class=\"material-icons\">format_list_numbered</i>\n                </div>\n\n                <div class=\"tooltip-button\" @click=\"execCommand('insertUnorderedList')\" v-if=\"element.type === `text`\">\n                    <i class=\"material-icons\">format_list_bulleted</i>\n                </div>\n\n                <div class=\"tooltip-button\" v-if=\"element.type === `text` || element.type === `image`\" @click=\"renderer.openLinkDialogue()\">\n                    <i class=\"material-icons\">link</i>\n                </div>\n\n                <div class=\"color-picker-wrapper tooltip-button\" v-if=\"element.type === `text`\">\n                    <div class=\"color-picker\">\n                        <i class=\"material-icons\">format_color_fill</i>\n                        <div class=\"color-swatches\">\n                            <div class=\"color-swatch\" v-for=\"(color, colorKey) in project.data.settings.colors\" :key=\"colorKey\" :style=\"getColor(color)\"\n                                @click=\"setBackgroundColor(color)\"></div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"tooltip-button\" v-if=\"element.type === `text` || element.type === `image`\" @click=\"renderer.openImageUpload(`${element.type === `text` ? `backgroundImage`: `content`}`)\">\n                    <i class=\"material-icons\">image</i>\n                </div>\n\n                <div class=\"tooltip-button\" v-if=\"element.type === `form`\" @click=\"renderer.showFormInputs = element.id\">\n                    <i class=\"material-icons\">list_alt</i>\n                </div>\n\n                <div class=\"tooltip-button\">\n                    <div class=\"drop-down\">\n                        <div class=\"drop-down-text\">\n                            <i class=\"material-icons\">more_vert</i>\n                        </div>\n                        <div class=\"drop-down-options right\">\n                            <div class=\"drop-down-text\" @click=\"togglePublish()\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">{{element.published ? 'check_box' : 'check_box_outline_blank'}}</i> Publish</span>\n                            </div>\n                            <div class=\"drop-down-text\" @click=\"toggleGlobal()\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">{{element.global ? 'check_box' : 'check_box_outline_blank'}}</i> Global component</span>\n                            </div>\n                            <div class=\"drop-down-text\" @click=\"project.deleteItem(element.id)\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">delete</i> Delete</span>\n                            </div>\n                            <div class=\"drop-down-text\" @click=\"renderer.showCSS = element.id\">\n                                <span class=\"flex\">\n                                    <i class=\"material-icons\">code</i> CSS</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/element-tools/element-tools.scss
var element_tools_element_tools = __webpack_require__(26);

// CONCATENATED MODULE: ./src/components/font-picker/font-picker.html
/* harmony default export */ var font_picker = ("<div class=\"font-picker drop-down\">\n    <div class=\"font-text drop-down-text\">Format&nbsp;</div>\n    <div class=\"font-options drop-down-options\">\n        <div class=\"font-text drop-down-text\" v-for=\"(font, fontKey) in project.data.settings.fonts\" :key=\"fontKey\" v-html=\"getFont(font)\" @click=\"changeFont(font)\"></div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/font-picker/font-picker.scss
var font_picker_font_picker = __webpack_require__(28);

// CONCATENATED MODULE: ./src/components/font-picker/font-picker.ts
var font_picker_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var font_picker_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var font_picker_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var font_picker_FontPicker = /** @class */function (_super) {
    font_picker_extends(FontPicker, _super);
    function FontPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "font-picker";
        _this.project = project;
        _this.element = _this.element;
        _this.changeFont = _this.changeFont;
        return _this;
    }
    FontPicker.prototype.getFont = function (font) {
        switch (font) {
            case "p":
                return "<p>normal</p>";
            case "h4":
                return "<h4>heading 4</h4>";
            case "h3":
                return "<h3>heading 3</h3>";
            case "h2":
                return "<h2>heading 2</h2>";
            case "h1":
                return "<h1>heading 1</h1>";
        }
    };
    font_picker_decorate([Prop(), font_picker_metadata("design:type", Object)], FontPicker.prototype, "element", void 0);
    font_picker_decorate([Prop(), font_picker_metadata("design:type", Function)], FontPicker.prototype, "changeFont", void 0);
    FontPicker = font_picker_decorate([vue_class_component_common_default()({
        template: font_picker,
        components: {},
        propsData: {
            element: null,
            changeFont: function () {}
        }
    })], FontPicker);
    return FontPicker;
}(vue_esm["default"]);
/* harmony default export */ var components_font_picker_font_picker = (font_picker_FontPicker);
// CONCATENATED MODULE: ./src/components/element-tools/element-tools.ts
var element_tools_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var element_tools_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var element_tools_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var element_tools_ElementTools = /** @class */function (_super) {
    element_tools_extends(ElementTools, _super);
    function ElementTools() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "element-tools";
        _this.project = project;
        _this.renderer = renderer;
        _this.app = services_app;
        _this.moverDown = false;
        _this.resizerDown = false;
        _this.element = _this.element;
        _this.pageId = _this.pageId;
        _this.repositionTooltip = 1;
        return _this;
    }
    ElementTools.prototype.hasSelectedText = function () {
        try {
            return window.getSelection().type !== "none";
        } catch (error) {
            return false;
        }
    };
    ElementTools.prototype.selectAllText = function () {
        var el = this.getTextElement(".editable-text-element");
        if (!el) {
            return;
        }
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    ElementTools.prototype.activate = function () {
        this.renderer.activate(this.element);
    };
    ElementTools.prototype.resize = function () {
        var _this = this;
        this.repositionTooltip = this.repositionTooltip + 1;
        document.body.classList.add("dragging-elements");
        var el = this.$el.parentElement;
        var page = document.getElementById("page");
        if (!el) {
            return;
        }
        var handleMove = function (ev) {
            var pageX = (ev.pageX || ev.targetTouches[0].pageX) + 13;
            if (!page) {
                return;
            }
            var box = page.getBoundingClientRect();
            var elBox = el.getBoundingClientRect();
            var width = (pageX - elBox.left) / box.width * 100;
            if (width < 5) {
                width = 5;
            }
            if (width > 100) {
                width = 100;
            }
            var cols = Math.round(project.totalColumns * (width / 100));
            if (_this.project.data) {
                _this.project.data.elements[_this.element.id].colSpan = cols;
            }
        };
        var handleRelease = function () {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleRelease);
            window.removeEventListener("mouseleave", handleRelease);
            _this.project.savePage(_this.pageId);
            document.body.classList.remove("dragging-elements");
        };
        handleMove.bind(this);
        handleRelease.bind(this);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleRelease);
        window.addEventListener("mouseleave", handleRelease);
    };
    ElementTools.prototype.execCommand = function (command, value) {
        if (!this.hasSelectedText()) {
            this.selectAllText();
        }
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand(command, false, value || '');
        if (this.element.type === "text" && command === "foreColor") {
            var el = this.getTextElement(".editable-text-element");
            var element = window.getSelection().getRangeAt(0).commonAncestorContainer;
            if (element) {
                if (element.querySelector) {
                    var isUL = element.nodeName.toLocaleLowerCase() === "ul" || !!element.querySelector("ul");
                    var isOL = element.nodeName.toLocaleLowerCase() === "ol" || !!element.querySelector("ol");
                    var isLI = element.nodeName.toLocaleLowerCase() === "li";
                    if (isUL || isOL || isLI) {
                        if (element === el) {
                            var div = document.createElement("div");
                            div.innerHTML = element.innerHTML;
                            element.innerHTML = "";
                            element.appendChild(div);
                            element = div;
                        }
                        element.style.color = value;
                    }
                }
                if (!element.querySelector) {
                    var li = void 0;
                    var current = element.parentNode;
                    var currentEl = element.parentElement;
                    while (!li && currentEl && current && current !== el) {
                        if (current.nodeName.toLocaleLowerCase() === "li") {
                            li = currentEl;
                            if (li) {
                                li.style.color = value;
                            }
                        } else {
                            current = current.parentNode;
                            currentEl = current ? current.parentElement : null;
                        }
                    }
                }
            }
        }
    };
    ElementTools.prototype.getTextElement = function (subElement) {
        return document.body.querySelector("#element-" + this.element.id + (subElement ? " " + subElement : ""));
    };
    ElementTools.prototype.setElementText = function () {
        var el = this.getTextElement(".editable-text-element");
        if (!el || !this.project.isEditing || this.element.type !== "text") {
            return;
        }
        renderer.clearEmptyElements();
        this.element.content[0] = el.innerHTML;
        this.project.savePage(this.pageId);
    };
    ElementTools.prototype.changeFont = function (font) {
        this.selectAllText();
        this.execCommand("formatBlock", font);
    };
    ElementTools.prototype.setBackgroundColor = function (color) {
        this.element.background = color;
        this.project.savePage(this.pageId);
    };
    ElementTools.prototype.getColor = function (color) {
        return { background: color };
    };
    ElementTools.prototype.getCurrentColor = function () {
        var color = "#000";
        if (document.activeElement && window.getSelection) {
            var sel = window.getSelection();
            if (sel && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                if (range && range.commonAncestorContainer && range.commonAncestorContainer.nodeName !== "#text") {
                    color = window.getComputedStyle(range.commonAncestorContainer).color;
                }
            }
        }
        return { background: color || "#000" };
    };
    ElementTools.prototype.togglePublish = function () {
        this.element.published = !this.element.published;
        this.project.savePage(this.pageId);
    };
    ElementTools.prototype.toggleGlobal = function () {
        this.element.global = !this.element.global;
        this.project.savePage(this.pageId);
    };
    element_tools_decorate([Prop(), element_tools_metadata("design:type", Object)], ElementTools.prototype, "element", void 0);
    element_tools_decorate([Prop(), element_tools_metadata("design:type", String)], ElementTools.prototype, "pageId", void 0);
    ElementTools = element_tools_decorate([vue_class_component_common_default()({
        template: element_tools,
        components: {
            'font-picker': components_font_picker_font_picker
        },
        propsData: {
            element: null,
            pageId: null
        }
    })], ElementTools);
    return ElementTools;
}(vue_esm["default"]);
/* harmony default export */ var components_element_tools_element_tools = (element_tools_ElementTools);
// EXTERNAL MODULE: ./src/components/divider-element/divider-element.scss
var divider_element = __webpack_require__(30);

// CONCATENATED MODULE: ./src/components/divider-element/divider-element.ts
var divider_element_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var divider_element_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var divider_element_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var divider_element_DividerElement = /** @class */function (_super) {
    divider_element_extends(DividerElement, _super);
    function DividerElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "divider-element";
        _this.element = _this.element;
        return _this;
    }
    divider_element_decorate([Prop(), divider_element_metadata("design:type", Object)], DividerElement.prototype, "element", void 0);
    DividerElement = divider_element_decorate([vue_class_component_common_default()({
        template: "<div v-if=\"element.type === 'divider'\" class=\"divider-element\"></div>",
        components: {},
        propsData: {
            element: null
        }
    })], DividerElement);
    return DividerElement;
}(vue_esm["default"]);
/* harmony default export */ var divider_element_divider_element = (divider_element_DividerElement);
// CONCATENATED MODULE: ./src/components/form-element/form-element.html
/* harmony default export */ var form_element = ("<div v-if=\"element.type === 'form'\" class=\"form-element\">\n    <h2 class=\"form message\" v-if=\"element.name\">{{element.name}}</h2>\n    <div class=\"inputs\">\n        <div class=\"form-input input\" v-for=\"(input, index) in element.content\" :key=\"index\">\n            <label>{{input}}</label>\n            <input type=\"text\" v-model=\"values[index]\" @input=\"onInput(index)\">\n        </div>\n    </div>\n    <div class=\"input\">\n        <button class=\"btn\" @click=\"sendForm()\">Send</button>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/form-element/form-element.scss
var form_element_form_element = __webpack_require__(32);

// CONCATENATED MODULE: ./src/components/form-element/form-element.ts
var form_element_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var form_element_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var form_element_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var form_element_FormElement = /** @class */function (_super) {
    form_element_extends(FormElement, _super);
    function FormElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "form-element";
        _this.form = [];
        _this.values = [];
        _this.auth = auth;
        _this.element = _this.element;
        return _this;
    }
    FormElement.prototype.formatForm = function () {
        var _this = this;
        this.element.content.forEach(function (el, index) {
            _this.values.push('');
            vue_esm["default"].set(_this.form, index, {
                key: el,
                value: _this.values[index]
            });
        });
    };
    FormElement.prototype.onInput = function (index) {
        vue_esm["default"].set(this.form, index, {
            key: this.element.content[index],
            value: this.values[index]
        });
    };
    Object.defineProperty(FormElement.prototype, "isLoggedIn", {
        get: function () {
            return this.auth.isSignedIn;
        },
        enumerable: true,
        configurable: true
    });
    FormElement.prototype.sendForm = function () {
        var _this = this;
        console.log(this.form);
        if (!this.auth.isSignedIn || !project.data) {
            return;
        }
        var message = this.element.name + "\n\rPage: " + project.data.pages[project.currentPage].name + "\n\r";
        this.form.forEach(function (element, index) {
            message += element.key + ": " + element.value;
            if (index !== _this.form.length - 1) {
                message += "\n\r";
            }
        });
        vue_esm["default"].set(this, "form", []);
        vue_esm["default"].set(this, "values", []);
        this.formatForm();
        return this.auth.sendEmail({
            message: message,
            title: this.element.name,
            emails: this.element.generic
        }).then(function (res) {
            if (res.id) {
                renderer.formSent = true;
            }
        });
    };
    FormElement.prototype.mounted = function () {
        this.form = [];
        this.formatForm();
    };
    form_element_decorate([Prop(), form_element_metadata("design:type", Object)], FormElement.prototype, "element", void 0);
    FormElement = form_element_decorate([vue_class_component_common_default()({
        template: form_element,
        components: {},
        propsData: {
            element: null
        }
    })], FormElement);
    return FormElement;
}(vue_esm["default"]);
/* harmony default export */ var components_form_element_form_element = (form_element_FormElement);
// CONCATENATED MODULE: ./src/components/primitive-element/primitive-element.ts
var primitive_element_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var primitive_element_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var primitive_element_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var primitive_element_PrimitiveElement = /** @class */function (_super) {
    primitive_element_extends(PrimitiveElement, _super);
    function PrimitiveElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "primitive-element";
        _this.project = project;
        _this.renderer = renderer;
        _this.directives = {
            "tooltip": tool_tip,
            "dragdrop": drag_drop_drag_drop
        };
        _this.index = _this.index;
        _this.pageId = _this.pageId;
        return _this;
    }
    Object.defineProperty(PrimitiveElement.prototype, "dragDropIndex", {
        get: function () {
            return this.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveElement.prototype, "colspan", {
        get: function () {
            if (!this.project.data || !this.element) {
                return;
            }
            return "colspan" + this.element.colSpan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveElement.prototype, "element", {
        get: function () {
            if (!this.project.data) {
                return;
            }
            var page = this.project.data.pages[this.pageId];
            if (!page) {
                page = this.project.data.templates[this.pageId];
            }
            if (!page) {
                return;
            }
            return this.project.data.elements[page.data[this.index]];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveElement.prototype, "elementStyle", {
        get: function () {
            if (!this.project.data || !this.element) {
                return;
            }
            var styles = {
                'background-color': this.element.background,
                width: "",
                'background-image': "url(" + (this.element.backgroundImage || "") + ")"
            };
            if (navigator.userAgent.indexOf('Trident/') > -1) {
                styles.width = this.element.colSpan / this.project.totalColumns * 100 + "%";
                return styles;
            }
            if (this.element.css) {
                try {
                    var css = JSON.parse(this.element.css);
                    for (var c in css) {
                        if (css[c]) {
                            styles[c] = css[c];
                        }
                    }
                } catch (error) {}
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveElement.prototype, "classes", {
        get: function () {
            if (!this.project.data || !this.element) {
                return;
            }
            return {
                start: this.element.isRowStart,
                end: this.element.isRowEnd,
                editing: this.element.active,
                unpublished: this.project.isEditing && !this.element.published
            };
        },
        enumerable: true,
        configurable: true
    });
    PrimitiveElement.prototype.ondrop = function (data) {
        this.project.reorderElements(this.pageId, data.dragIndex, data.dropIndex);
    };
    PrimitiveElement.prototype.activate = function () {
        if (!this.project.data || !this.element) {
            return;
        }
        this.renderer.activate(this.element);
    };
    primitive_element_decorate([Prop(), primitive_element_metadata("design:type", Number)], PrimitiveElement.prototype, "index", void 0);
    primitive_element_decorate([Prop(), primitive_element_metadata("design:type", String)], PrimitiveElement.prototype, "pageId", void 0);
    PrimitiveElement = primitive_element_decorate([vue_class_component_common_default()({
        template: primitive_element,
        components: {
            'text-element': components_text_element_text_element,
            'image-element': image_element_image_element,
            'element-tools': components_element_tools_element_tools,
            'divider-element': divider_element_divider_element,
            'form-element': components_form_element_form_element
        },
        propsData: {
            index: 0,
            pageId: null
        }
    })], PrimitiveElement);
    return PrimitiveElement;
}(vue_esm["default"]);
/* harmony default export */ var components_primitive_element_primitive_element = (primitive_element_PrimitiveElement);
// CONCATENATED MODULE: ./src/components/page-thumb/page-thumb.ts
var page_thumb_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var page_thumb_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var page_thumb_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var page_thumb_PageThumb = /** @class */function (_super) {
    page_thumb_extends(PageThumb, _super);
    function PageThumb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "page-thumb";
        _this.project = project;
        _this.renderer = renderer;
        _this.pageId = _this.pageId;
        _this.type = _this.type;
        return _this;
    }
    Object.defineProperty(PageThumb.prototype, "content", {
        get: function () {
            if (!this.project.data) {
                return;
            }
            if (!this.pageId) {
                return [];
            }
            var type = "pages";
            if (this.type === "template") {
                type = "templates";
            }
            return this.project.data[type][this.pageId].data;
        },
        enumerable: true,
        configurable: true
    });
    page_thumb_decorate([Prop(), page_thumb_metadata("design:type", String)], PageThumb.prototype, "pageId", void 0);
    page_thumb_decorate([Prop(), page_thumb_metadata("design:type", String)], PageThumb.prototype, "type", void 0);
    PageThumb = page_thumb_decorate([vue_class_component_common_default()({
        template: page_thumb,
        components: {
            'primitive-element': components_primitive_element_primitive_element
        },
        propsData: {
            pageId: null,
            type: null
        }
    })], PageThumb);
    return PageThumb;
}(vue_esm["default"]);
/* harmony default export */ var components_page_thumb_page_thumb = (page_thumb_PageThumb);
// CONCATENATED MODULE: ./src/components/primitive-thumb/primitive-thumb.html
/* harmony default export */ var primitive_thumb = ("<div class=\"primitive-thumb-wrapper\">\n    <div class=\"primitive-thumb\" :style=\"elementStyle\">\n        <div class=\"primitive-inner\">\n            <div class=\"element-content\">\n                <text-element :element=\"element\"></text-element>\n                <image-element :element=\"element\"></image-element>\n            </div>\n        </div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/primitive-thumb/primitive-thumb.scss
var primitive_thumb_primitive_thumb = __webpack_require__(34);

// CONCATENATED MODULE: ./src/components/primitive-thumb/primitive-thumb.ts
var primitive_thumb_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var primitive_thumb_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var primitive_thumb_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var primitive_thumb_PrimitiveThumb = /** @class */function (_super) {
    primitive_thumb_extends(PrimitiveThumb, _super);
    function PrimitiveThumb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "primitive-thumb";
        _this.project = project;
        _this.elementId = _this.elementId;
        return _this;
    }
    Object.defineProperty(PrimitiveThumb.prototype, "element", {
        get: function () {
            if (!this.project.data) {
                return;
            }
            return this.project.data.elements[this.elementId];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrimitiveThumb.prototype, "elementStyle", {
        get: function () {
            if (!this.project.data || !this.element) {
                return;
            }
            var styles = {
                'background-color': this.element.background,
                width: "",
                'background-image': "url(" + (this.element.backgroundImage || "") + ")"
            };
            if (navigator.userAgent.indexOf('Trident/') > -1) {
                styles.width = this.element.colSpan / this.project.totalColumns * 100 + "%";
                return styles;
            }
            return styles;
        },
        enumerable: true,
        configurable: true
    });
    primitive_thumb_decorate([Prop(), primitive_thumb_metadata("design:type", String)], PrimitiveThumb.prototype, "elementId", void 0);
    PrimitiveThumb = primitive_thumb_decorate([vue_class_component_common_default()({
        template: primitive_thumb,
        components: {
            'text-element': components_text_element_text_element,
            'image-element': image_element_image_element
        },
        propsData: {
            elementId: ""
        }
    })], PrimitiveThumb);
    return PrimitiveThumb;
}(vue_esm["default"]);
/* harmony default export */ var components_primitive_thumb_primitive_thumb = (primitive_thumb_PrimitiveThumb);
// CONCATENATED MODULE: ./src/components/side-bar/side-bar.ts
var side_bar_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var side_bar_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var side_bar_SideBar = /** @class */function (_super) {
    side_bar_extends(SideBar, _super);
    function SideBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "side-bar";
        _this.tabState = "insert";
        _this.project = project;
        _this.auth = auth;
        _this.tabIndicatorStyle = {};
        return _this;
    }
    Object.defineProperty(SideBar.prototype, "hasGlobalElements", {
        get: function () {
            if (!this.project.data) {
                return;
            }
            for (var k in this.project.data.elements) {
                if (this.project.data.elements[k] && this.project.data.elements[k].global) {
                    return true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    SideBar.prototype.setIndicator = function () {
        var _this = this;
        vue_esm["default"].nextTick(function () {
            var tab = document.body.querySelector("#side-bar-nav .tab.active");
            var nav = document.getElementById("side-bar-nav");
            if (!tab || !nav) {
                return;
            }
            var box = tab.getBoundingClientRect();
            var navBox = nav.getBoundingClientRect();
            _this.tabIndicatorStyle = {
                width: box.width + "px",
                left: box.left - navBox.left + "px"
            };
        });
    };
    SideBar.prototype.activateTab = function (state) {
        this.tabState = state;
        this.setIndicator();
    };
    SideBar.prototype.isActive = function (state) {
        return this.tabState === state ? "active" : "";
    };
    SideBar.prototype.toggleGlobalElement = function (id) {
        if (!this.project.data) {
            return;
        }
        this.project.data.elements[id].global = !this.project.data.elements[id].global;
        this.project.savePage(this.project.currentPage);
    };
    SideBar.prototype.deleteGlobalElement = function (id) {
        if (!this.project.data) {
            return;
        }
        this.project.data.elements[id].global = false;
        this.project.deleteItem(id);
    };
    SideBar.prototype.mounted = function () {
        this.setIndicator();
    };
    SideBar = side_bar_decorate([vue_class_component_common_default()({
        template: side_bar,
        components: {
            'page-thumb': components_page_thumb_page_thumb,
            'primitive-thumb': components_primitive_thumb_primitive_thumb
        },
        propsData: {}
    })], SideBar);
    return SideBar;
}(vue_esm["default"]);
/* harmony default export */ var components_side_bar_side_bar = (side_bar_SideBar);
// CONCATENATED MODULE: ./src/components/page-renderer/page-renderer.html
/* harmony default export */ var page_renderer = ("<div id=\"page-renderer\" :class=\"editorClass\">\n    <div id=\"login\" v-if=\"auth.showLogin\">\n        <button class=\"btn\" @click=\"auth.login\">Login</button>\n    </div>\n\n    <top-bar v-if=\"!auth.showLogin\"></top-bar>\n\n    <div class=\"page-container\" v-if=\"!auth.showLogin\">\n        <div id=\"nav\">\n            <div class=\"site-logo\" v-if=\"project.data && project.data.settings.logo\">\n                <a href=\"/\">\n                    <img :src=\"project.data && project.data.settings.logo\">\n                </a>\n            </div>\n            <h3 class=\"site-name\" v-if=\"project.data && project.data.settings.name\">\n                <a href=\"/\">{{project.data.settings.name}}</a>\n            </h3>\n            <div class=\"nav-item-container\" :class=\"{expanded:renderer.showingNav}\">\n                <div class=\"nav-item-toggler list\" :class=\"{active:!renderer.showingNav}\" @click=\"renderer.showingNav = !renderer.showingNav\">\n                    <i class=\"material-icons\">menu</i>\n                </div>\n                <div class=\"nav-item-toggler menu\" :class=\"{active:renderer.showingNav}\" @click=\"renderer.showingNav = !renderer.showingNav\">\n                    <i class=\"material-icons\">close</i>\n                    <span>&nbsp;&nbsp;Menu</span>\n                </div>\n                <div class=\"nav-items\">\n                    <nav-item v-for=\"(item, itemKey) in project.data.navigation\" v-if=\"project.data.navigation.length\" :key=\"itemKey\" :path=\"itemKey\"></nav-item>\n                    <div style=\"padding: 5px 0px 5px 21px;\" v-if=\"project.isEditing\">\n                        <button class=\"btn new-nav-item-btn\" @click=\"renderer.addNewNavItem()\">\n                            <span class=\"material-icons\">add</span>\n                        </button>\n                    </div>\n                </div>\n            </div>\n            <div class=\"search-toggle\" @click=\"renderer.showSearch = true\">\n                <i class=\"material-icons\">search</i>\n            </div>\n        </div>\n        <div id=\"page\" tool-tip-max=\"true\">\n            <primitive-element v-for=\"(id, index) in content\" :key=\"id\" :index=\"index\" :pageId=\"pageId\"></primitive-element>\n            <div style=\"padding:40px;grid-column-end: span 12;\"></div>\n        </div>\n    </div>\n\n    <div id=\"search\" :class=\"{showSearch:renderer.showSearch}\">\n        <div id=\"search-inner\">\n            <i class=\"material-icons fake-button\" style=\"display: flex;\" @click=\"renderer.showSearch = false\">arrow_back</i>\n            <span class=\"search-input\">\n                <span class=\"search-input-inner\">\n                    <i class=\"material-icons search-button fake-button\">search</i>\n                    <input type=\"text\" v-model=\"renderer.searchTerm\" placeholder=\"search\">\n                </span>\n            </span>\n        </div>\n        <div id=\"search-results\" :class=\"{showSearchResults:Object.keys(renderer.searchResults).length}\">\n            <div v-for=\"result in renderer.searchResults\" :key=\"result.page.id\" class=\"search-result\">\n                <div class=\"search-result-name\" @click=\"project.openPage(result.page.id); renderer.showSearch = false\">\n                    <h2>{{result.page.name}}</h2>\n                </div>\n                <div v-for=\"term in result.terms\">\n                    <div class=\"search-term-text\" @click=\"project.openPage(result.page.id, term.id); renderer.showSearch = false\">{{term.text}}</div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.linkDialogueActive}\" class=\"dialogue-wrapper linkDialogueActive\"\n        @click=\"dialogueScrimClick($event, 'linkDialogueActive')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.linkDialogueActive = false\" @mouseup=\"app.restoreSelection()\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\" v-if=\"renderer.showLinkTextInput\">\n                <label>Text</label>\n                <input type=\"text\" v-model=\"renderer.linkText\">\n            </div>\n            <div class=\"input\">\n                <label>Link</label>\n                <input type=\"text\" v-model=\"renderer.linkUrl\">\n            </div>\n            <div class=\"input\" style=\"display: flex;align-items:center;\">\n                <span class=\"fake-button\" @mousedown=\"renderer.selectLinkElement()\">Select element</span>\n                <span>&nbsp;or&nbsp;</span>\n                <span class=\"fake-button\" @mousedown=\"renderer.selectLinkElement(true)\">Select page</span>\n            </div>\n            <div class=\"input\">\n                <button class=\"btn\" @mousedown=\"app.restoreSelection()\" @click=\"renderer.addLink()\">Apply</button>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.navItemDialogue !== null}\" class=\"dialogue-wrapper navItemDialogue\"\n        @click=\"dialogueScrimClick($event, 'navItemDialogue')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.navItemDialogue = null\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\" v-if=\"renderer.showLinkTextInput\">\n                <label>Text</label>\n                <input type=\"text\" v-model=\"renderer.newNavItem.text\">\n            </div>\n            <div class=\"input\">\n                <label>Link</label>\n                <input type=\"text\" v-model=\"renderer.newNavItem.link\">\n            </div>\n            <div class=\"input\">\n                <button class=\"btn\" @click=\"renderer.saveNavItem(renderer.newNavItem)\">{{renderer.navItemDialogue === `new` ? `Insert` : `Save`}}</button>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.imageUploadDialogueActive}\" class=\"dialogue-wrapper imageUploadDialogueActive\"\n        @click=\"dialogueScrimClick($event, 'imageUploadDialogueActive')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.imageUploadDialogueActive = false\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\">\n                <label>Image Url</label>\n                <input type=\"text\" v-model=\"renderer.imageUrl\">\n            </div>\n            <div class=\"input\">\n                <label>Upload file</label>\n                <input type=\"file\" @change=\"renderer.file = $event.target.files[0]\">\n            </div>\n\n            <div class=\"input\">\n                <div class=\"drive-list\">\n                    <div v-for=\"file in renderer.uploadedFiles\" :key=\"file.id\" class=\"drive-item\" @click=\"renderer.imageUrl = auth.getFileUrl(file.id);renderer.addImageUrl()\">\n                        <img :src=\"auth.getFileUrl(file.id)\">\n                    </div>\n                </div>\n            </div>\n            <div class=\"input\">\n                <button class=\"btn\" @click=\"renderer.addImageUrl()\">Apply</button>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.showCSS}\" class=\"dialogue-wrapper showCSS\" @click=\"dialogueScrimClick($event, 'showCSS')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.showCSS = false\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\">\n                <label>CSS</label>\n                <textarea v-model=\"project.data && project.data.elements[renderer.showCSS] && project.data.elements[renderer.showCSS].css\"\n                    @mousedown=\"app.clearSelection()\"></textarea>\n            </div>\n            <div class=\"input\">\n                <button class=\"btn\" @click=\"project.savePage(project.currentPage); renderer.showCSS = false\">Apply</button>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.showFormInputs}\" class=\"dialogue-wrapper showFormInputs\" @click=\"dialogueScrimClick($event, 'showFormInputs')\">\n        <div class=\"dialogue\" v-if=\"project.data && project.data.elements[renderer.showFormInputs]\">\n            <div class=\"close-button\" @click=\"renderer.showFormInputs = false\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\">\n                <label>Title</label>\n                <input type=\"text\" v-model=\"project.data.elements[renderer.showFormInputs].name\">\n            </div>\n\n            <div class=\"input\">\n                <label>Recipient emails</label>\n                <input type=\"text\" v-model=\"project.data.elements[renderer.showFormInputs].generic\">\n            </div>\n\n            <div class=\"input\" v-for=\"(input, index) in project.data.elements[renderer.showFormInputs].content\" :key=\"index\">\n                <div class=\"flex\">\n                    <input type=\"text\" v-model=\"project.data.elements[renderer.showFormInputs].content[index]\">\n                    <i class=\"material-icons\" @click=\"project.data.elements[renderer.showFormInputs].content.splice(index, 1)\">delete</i>\n                </div>\n            </div>\n\n            <div class=\"input flex\">\n                <button class=\"btn\" @click=\"project.savePage(project.currentPage); renderer.showFormInputs = false\">Apply</button>\n                <div class=\"fake-button\" @click=\"project.data.elements[renderer.showFormInputs].content.push('')\">Add input</div>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.formSent}\" class=\"dialogue-wrapper formSent\" @click=\"dialogueScrimClick($event, 'formSent')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.formSent = false\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\">\n                <span>Submission successful</span>\n            </div>\n            <div class=\"input flex\">\n                <button class=\"btn\" @click=\"renderer.formSent = false\">Ok</button>\n            </div>\n        </div>\n    </div>\n\n    <div v-if=\"project.isEditing\" :class=\"{showDialogue:renderer.showProjectSettings}\" class=\"dialogue-wrapper showProjectSettings\"\n        @click=\"dialogueScrimClick($event, 'showProjectSettings')\">\n        <div class=\"dialogue\">\n            <div class=\"close-button\" @click=\"renderer.showProjectSettings = false\">\n                <i class=\"material-icons\">close</i>\n            </div>\n            <div class=\"input\">\n                <label>Name</label>\n                <input type=\"text\" v-model=\"project.data.settings.name\">\n            </div>\n\n            <div class=\"input\">\n                <label>Logo URL</label>\n                <input type=\"text\" v-model=\"project.data.settings.logo\">\n            </div>\n\n            <div class=\"input\">\n                <label>Upload a logo</label>\n                <input type=\"file\" @change=\"renderer.logoFile = $event.target.files[0]\">\n            </div>\n\n            <div class=\"input\">\n                <label>Select a logo</label>\n                <div class=\"drive-list\">\n                    <div v-for=\"file in renderer.uploadedFiles\" :key=\"file.id\" class=\"drive-item\" :class=\"{active: project.data.settings.logo === auth.getFileUrl(file.id)}\"\n                        @click=\"project.data.settings.logo = auth.getFileUrl(file.id)\">\n                        <img :src=\"auth.getFileUrl(file.id)\">\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"input\">\n                <label>Favicon URL</label>\n                <input type=\"text\" v-model=\"project.data.settings.favicon\">\n            </div>\n\n            <div class=\"input\">\n                <label>Upload a favicon</label>\n                <input type=\"file\" @change=\"renderer.faviconFile = $event.target.files[0]\">\n            </div>\n\n            <div class=\"input\">\n                <label>Select a favicon</label>\n                <div class=\"drive-list\">\n                    <div v-for=\"file in renderer.uploadedFiles\" :key=\"file.id\" class=\"drive-item\" :class=\"{active: project.data.settings.favicon === auth.getFileUrl(file.id)}\"\n                        @click=\"project.data.settings.favicon = auth.getFileUrl(file.id)\">\n                        <img :src=\"auth.getFileUrl(file.id)\">\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"input\">\n                <label>Colors</label>\n                <textarea v-model=\"project.projectColors\"></textarea>\n            </div>\n            <div class=\"input\">\n                <button class=\"btn\" @click=\"renderer.applySettings()\">Apply</button>\n            </div>\n        </div>\n    </div>\n    <div v-if=\"project.isEditing\" :class=\"{showScrim:renderer.showScrim}\" class=\"overlay-scrim\" @click=\"renderer.scrimClick()\"></div>\n    <div class=\"spinner-wrapper\" v-if=\"renderer.showSpinner\">\n        <div class=\"spinner\"></div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/page-renderer/page-renderer.scss
var page_renderer_page_renderer = __webpack_require__(36);

// CONCATENATED MODULE: ./src/components/nav-item/nav-item.html
/* harmony default export */ var nav_item = ("<div class=\"nav-item\" v-dragdrop=\"{ondrop, ondragover, ondragout, group:`nav`, handle:`.drag-handle`}\" draggable=\"false\" :class=\"{linkIsShowing, linkIsAbove, isFirstContent}\">\n    <div class=\"drag-handle\" draggable=\"false\" v-if=\"project.isEditing\">\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n        <div class=\"dot\">&middot;</div>\n    </div>\n    <div class=\"nav-item-name\" @click=\"expanded=!expanded\">\n        <i v-if=\"hasContent && !expanded\" class=\"material-icons\">chevron_right</i>\n        <i v-if=\"hasContent && expanded\" class=\"material-icons\">expand_more</i>\n        <a :href=\"navItem.link\">\n            <span>{{text}}</span>\n        </a>\n        <div class=\"nav-item-buttons\" v-if=\"project.isEditing\">\n            <i @click=\"edit()\" class=\"material-icons\">edit</i>\n            <i @click=\"deleteItem()\" class=\"material-icons\">delete</i>\n        </div>\n    </div>\n    <div class=\"nav-item-content\" :class=\"{expanded}\">\n        <nav-item v-for=\"(item, itemKey) in navItem.content\" :key=\"itemKey\" :path=\"path + '.content.' + itemKey\"></nav-item>\n    </div>\n    <div class=\"dropzones\">\n        <div class=\"dropzone dropzone-above\" zone=\"above\">\n            <span class=\"material-icons\">expand_less</span>\n        </div>\n        <div class=\"dropzone dropzone-in\" zone=\"in\">\n            <span class=\"material-icons\">chevron_right</span>\n        </div>\n        <div class=\"dropzone dropzone-below\" zone=\"below\">\n            <span class=\"material-icons\">expand_more</span>\n        </div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/nav-item/nav-item.scss
var nav_item_nav_item = __webpack_require__(38);

// CONCATENATED MODULE: ./src/components/nav-item/nav-item.ts
var nav_item_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var nav_item_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var nav_item_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var nav_item_NavItem = /** @class */function (_super) {
    nav_item_extends(NavItem, _super);
    function NavItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "nav-item";
        _this.project = project;
        _this.expanded = false;
        _this.linkIsShowing = false;
        _this.linkIsAbove = false;
        _this.path = _this.path;
        return _this;
    }
    Object.defineProperty(NavItem.prototype, "navItem", {
        get: function () {
            return services_app.getThis(this.project.data, "navigation." + this.path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavItem.prototype, "text", {
        get: function () {
            return this.navItem.text || services_app.getThis(this.project.data, "pages." + this.navItem.id + ".name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavItem.prototype, "hasContent", {
        get: function () {
            if (!this.navItem || !this.navItem.content) {
                return false;
            }
            return this.navItem.content.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavItem.prototype, "isFirstContent", {
        get: function () {
            return this.path.split ? parseInt(this.path.split(".")[this.path.split(".").length - 1]) === 0 : parseInt(this.path) === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavItem.prototype, "dragDropIndex", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    NavItem.prototype.edit = function () {
        renderer.navItemDialogue = this.path;
        renderer.newNavItem = Object.assign({ text: this.text }, this.navItem);
    };
    NavItem.prototype.deleteItem = function () {
        if (!this.project.data) {
            return;
        }
        delete this.project.data.navigationMap[this.navItem.id];
        services_app.deleteThis(this.project.data.navigation, this.path);
        this.project.savePage(this.project.currentPage);
    };
    NavItem.prototype.ondragout = function () {
        var dropzones = this.$el.querySelector(".dropzones");
        if (dropzones) {
            dropzones.removeAttribute("zone");
        }
    };
    NavItem.prototype.ondragover = function (data) {
        var dropzones = this.$el.querySelector(".dropzones");
        var target = data.event.target;
        var zone = target.getAttribute("zone");
        if (!zone) {
            zone = target.parentElement ? target.parentElement.getAttribute("zone") : null;
        }
        if (dropzones && zone) {
            dropzones.setAttribute("zone", zone);
        }
    };
    NavItem.prototype.ondrop = function (data) {
        if (!this.project.data) {
            return;
        }
        var dropzones = this.$el.querySelector(".dropzones");
        if (dropzones) {
            dropzones.removeAttribute("zone");
        }
        var target = data.event.target;
        var zone = target.getAttribute("zone");
        var path = [];
        services_app.setPath(path, data.dropIndex);
        if (!path.length) {
            return;
        }
        switch (zone) {
            case "above":
                break;
            case "in":
                path.push("content");
                path.push(0);
                break;
            case "below":
                if (path[path.length - 1]) {
                    path[path.length - 1] = path[path.length - 1] + 1;
                }
                break;
        }
        if (path.length === 1) {
            path = path[0].toString();
        } else {
            path = path.join(".");
        }
        if (data.group) {
            services_app.moveThis(this.project.data.navigation, data.dragIndex, path);
        } else {
            var id = this.project.data.pages[this.project.currentPage].data[data.dragIndex];
            var item = {
                id: id,
                text: this.project.data.elements[id].content[0],
                link: "?p=" + this.project.currentPage + "&a=" + id,
                content: []
            };
            services_app.addThis(this.project.data.navigation, path, item);
        }
        this.project.savePage(this.project.currentPage);
    };
    NavItem.prototype.mounted = function () {
        var _this = this;
        var query = this.project.getPageQuery();
        var link = this.project.getPageQuery(this.navItem.link);
        var linkElement;
        if (this.project.currentPage !== link.p) {
            return;
        }
        if (link.p && !link.a) {
            this.linkIsShowing = true;
            return;
        }
        if (link.a) {
            linkElement = document.getElementById("element-" + link.a);
        }
        var handleIntersect = function (entries, observer) {
            _this.linkIsAbove = entries[0].boundingClientRect.top < 0;
            _this.linkIsShowing = entries[0].isIntersecting;
        };
        if (linkElement) {
            var options = {
                root: null,
                threshold: [0, 1]
            };
            var observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(linkElement);
        }
    };
    nav_item_decorate([Prop(), nav_item_metadata("design:type", String)], NavItem.prototype, "path", void 0);
    NavItem = nav_item_decorate([vue_class_component_common_default()({
        template: nav_item,
        components: {},
        propsData: {}
    })], NavItem);
    return NavItem;
}(vue_esm["default"]);
/* harmony default export */ var components_nav_item_nav_item = (nav_item_NavItem);
// CONCATENATED MODULE: ./src/components/top-bar/top-bar.html
/* harmony default export */ var top_bar = ("<div id=\"top-bar\" v-if=\"project.author\">\n    <div class=\"left-side\">\n        <span class=\"material-icons\" @click=\"renderer.showProjectSettings = true\">settings</span>\n        <div id=\"project-name\">\n            <input type=\"text\" v-model=\"project.data.settings.name\" placeholder=\"Untitled project\" @input=\"project.savePage(project.currentPage)\">\n        </div>\n        <div id=\"view-selector\" v-if=\"renderer.view\">\n            <div class=\"fake-button gray\">\n                <span class=\"material-icons\">{{renderer.view.icon}}</span>\n                <span>&nbsp;{{renderer.view.name}}</span>\n                <span class=\"material-icons\">expand_more</span>\n            </div>\n            <div v-tooltip>\n                <div class=\"view-selector-option\" v-for=\"view in renderer.views\" @click=\"renderer.setView(view)\">\n                    <span class=\"material-icons\">{{view.icon}}</span>\n                    <span>&nbsp;{{view.name}}</span>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
// EXTERNAL MODULE: ./src/components/top-bar/top-bar.scss
var top_bar_top_bar = __webpack_require__(40);

// CONCATENATED MODULE: ./src/components/top-bar/top-bar.ts
var top_bar_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var top_bar_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var top_bar_TopBar = /** @class */function (_super) {
    top_bar_extends(TopBar, _super);
    function TopBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "top-bar";
        _this.project = project;
        _this.renderer = renderer;
        _this.directives = {
            "tooltip": tool_tip
        };
        return _this;
    }
    TopBar = top_bar_decorate([vue_class_component_common_default()({
        template: top_bar,
        components: {},
        propsData: {}
    })], TopBar);
    return TopBar;
}(vue_esm["default"]);
/* harmony default export */ var components_top_bar_top_bar = (top_bar_TopBar);
// CONCATENATED MODULE: ./src/components/page-renderer/page-renderer.ts
var page_renderer_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var page_renderer_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var page_renderer_metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var page_renderer_PageRenderer = /** @class */function (_super) {
    page_renderer_extends(PageRenderer, _super);
    function PageRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "page-renderer";
        _this.project = project;
        _this.renderer = renderer;
        _this.auth = auth;
        _this.app = services_app;
        _this.pageId = _this.pageId;
        return _this;
    }
    Object.defineProperty(PageRenderer.prototype, "editorClass", {
        get: function () {
            var classes = [];
            if (this.project.isEditing) {
                classes.push("editor-mode");
            }
            return classes.join(" ");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageRenderer.prototype, "content", {
        get: function () {
            return this.project.data ? this.project.data.pages[this.pageId].data : null;
        },
        enumerable: true,
        configurable: true
    });
    PageRenderer.prototype.dialogueScrimClick = function (e, _class) {
        var target = e.target;
        var dialogue = this.$el.querySelector("." + _class);
        if (!dialogue) {
            return;
        }
        if (target !== dialogue && !dialogue.contains(target)) {
            this[_class] = false;
        }
    };
    PageRenderer.prototype.mounted = function () {
        var _this = this;
        window.document.body.addEventListener("click", function (e) {
            var target = e.target;
            var targetPrimitive = renderer.findParentPrimitive(target);
            var dialogues = window.document.body.querySelectorAll(".dialogue-wrapper");
            var fromDialogue = false;
            if (dialogues) {
                for (var i = 0; i < dialogues.length; i++) {
                    if (target === dialogues[i] || dialogues[i].contains(target)) {
                        fromDialogue = true;
                        break;
                    }
                }
            }
            if (!targetPrimitive && !fromDialogue && !renderer.linkDialogueActive && !renderer.selectingLinkElement && !renderer.imageUploadDialogueActive && !renderer.navItemDialogue) {
                var activeElement = renderer.getActiveElement();
                if (activeElement && _this.project.data) {
                    _this.project.data.elements[activeElement.id].active = false;
                }
            }
        });
        window.addEventListener("keydown", function (e) {
            var key = e.key;
            if (key.toLowerCase() === "escape") {
                e.preventDefault();
                e.stopPropagation();
                var activeElement = renderer.getActiveElement();
                if (activeElement && _this.project.data) {
                    _this.project.data.elements[activeElement.id].active = false;
                }
            }
        });
        window.document.body.addEventListener("click", function (e) {
            var page = document.body.querySelector(".page-container");
            var target = e.target;
            if (!page || !page.contains(target)) {
                return;
            }
            var link = renderer.findParentTag(target, "a");
            if (link) {
                renderer.handleLinkClick(e, link);
            }
        });
    };
    page_renderer_decorate([Prop(), page_renderer_metadata("design:type", String)], PageRenderer.prototype, "pageId", void 0);
    PageRenderer = page_renderer_decorate([vue_class_component_common_default()({
        template: page_renderer,
        components: {
            'primitive-element': components_primitive_element_primitive_element,
            'nav-item': components_nav_item_nav_item,
            'top-bar': components_top_bar_top_bar
        },
        propsData: {
            pageId: null
        }
    })], PageRenderer);
    return PageRenderer;
}(vue_esm["default"]);
/* harmony default export */ var components_page_renderer_page_renderer = (page_renderer_PageRenderer);
// CONCATENATED MODULE: ./src/components/app/app.ts
var app_extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var app_decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var app_app_App = /** @class */function (_super) {
    app_extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "app-entry";
        _this.project = project;
        _this.checkboxLabel = "test";
        _this.checkboxDisabled = false;
        _this.checkboxValue = true;
        return _this;
    }
    App.prototype.whenUpdate = function (data) {
        console.log(data, this);
        this.checkboxValue = data.detail.newValue.toString();
    };
    App.prototype.mounted = function () {
        // setTimeout(()=>{
        //     this.checkboxDisabled = true
        // }, 1000)
    };
    App = app_decorate([vue_class_component_common_default()({
        template: app,
        components: {
            'side-bar': components_side_bar_side_bar,
            'page-renderer': components_page_renderer_page_renderer
        },
        propsData: {}
    })], App);
    return App;
}(vue_esm["default"]);
/* harmony default export */ var components_app_app = (app_app_App);
// CONCATENATED MODULE: ./src/index.ts


vue_esm["default"].config.ignoredElements = ['nv-checkbox'];
new vue_esm["default"]({
    el: '#app',
    components: {
        'app-entry': components_app_app
    },
    template: '<app-entry></app-entry>'
});

/***/ })
/******/ ]);