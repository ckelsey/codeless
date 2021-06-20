export default function IsDate(value) {
    let tempValue = new Date(Date.parse(value));
    return (tempValue !== 'Invalid Date'
        && !isNaN(tempValue)
        && tempValue instanceof Date);
}
