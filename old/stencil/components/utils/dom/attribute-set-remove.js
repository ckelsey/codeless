export default function AttributeSetRemove(obj = {
  setAttribute: (arg, arg2) => ({ arg, arg2 }),
  removeAttribute: (arg) => arg
}, key = 'dummy', val = '') {
  obj[!!val ? 'setAttribute' : 'removeAttribute'](key, val || undefined);
}
