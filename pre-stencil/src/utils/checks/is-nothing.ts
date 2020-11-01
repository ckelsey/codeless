export default function IsNothing(val: any): boolean {
    return val === null || typeof val === 'undefined' || val === false
}