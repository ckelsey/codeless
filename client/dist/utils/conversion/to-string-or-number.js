export default function ToStringOrNumber(arg) {
    const argNumber = parseFloat(arg);
    return !isNaN(arg) ? arg.trim() : argNumber;
}
