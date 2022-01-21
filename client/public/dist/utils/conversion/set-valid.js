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
export const IsValid = (element) => {
    if (element === undefined || element === null) {
        return;
    }
    try {
        return typeof element.constructor.prototype == 'undefined' || (element.constructor.prototype[validSymbol] === undefined || element.constructor.prototype[validSymbol] === true);
    }
    catch (error) { }
    return false;
};
export default SetValid;
