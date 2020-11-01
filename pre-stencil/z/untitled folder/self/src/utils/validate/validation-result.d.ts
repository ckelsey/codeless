export default interface ValidationResult {
    original: string | number
    valid: boolean
    sanitized: string | number,
    reason: string[]
}