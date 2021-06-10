/** SOURCE:https://gist.github.com/rijkvanzanten/560dd06c4e2143aebd552abaeeee3e9b */
export default function IsValidHex(color) {
    if (!color || typeof color !== 'string') return false;

    // Validate hex values
    if (color.substring(0, 1) === '#') color = color.substring(1);

    switch (color.length) {
        case 3: return /^[0-9A-F]{3}$/i.test(color);
        case 6: return /^[0-9A-F]{6}$/i.test(color);
        case 8: return /^[0-9A-F]{8}$/i.test(color);
        default: return false;
    }
}