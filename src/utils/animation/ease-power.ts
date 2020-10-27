export default function EasePower(stepDecimal: number, pow: number) {
    pow = pow === undefined ? 4 : pow
    return 1 - Math.pow(1 - stepDecimal, pow)
}