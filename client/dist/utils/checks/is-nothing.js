export default function IsNothing(val) {
    return val === null || typeof val === 'undefined' || val === false;
}
