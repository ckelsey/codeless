export default function AttributeSetRemove(
    obj: any = {
        setAttribute: (arg: any, arg2: any) => ({ arg, arg2 }),
        removeAttribute: (arg: any) => arg
    },
    key: string = 'dummy',
    val: any = ''
) {
    obj[!!val ? 'setAttribute' : 'removeAttribute'](key, val || undefined)
}