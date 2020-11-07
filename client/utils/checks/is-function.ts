export default function IsFunction(val: any): boolean {
    return !!val && {}.toString.call(val) == '[object Function]'
}