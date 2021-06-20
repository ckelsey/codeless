export default function IsDom(value) {
    return (value instanceof Element) || (value instanceof Node);
}
