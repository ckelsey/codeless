const queryCheck = (selector) => document.createDocumentFragment().querySelector(selector);
export default function IsSelector(selector) {
    try {
        queryCheck(selector);
    }
    catch {
        return false;
    }
    return true;
}
