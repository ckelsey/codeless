"use strict";
exports.__esModule = true;
function Pipe() {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    var functions = arguments;
    var count = functions.length;
    return function PipeInnerFunction(value) {
        var loopIndex = count + 1;
        while (loopIndex--) {
            value = typeof functions[count - loopIndex] !== 'function' ?
                value :
                functions[count - loopIndex](value);
        }
        return value;
    };
}
exports["default"] = Pipe;
