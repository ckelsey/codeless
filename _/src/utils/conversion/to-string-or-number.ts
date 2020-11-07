export default function ToStringOrNumber(arg: string | number): string | number {
    const argNumber = parseFloat(arg as string)
    return !isNaN(arg as number) ? (arg as string).trim() : argNumber
}