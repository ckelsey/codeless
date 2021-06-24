const onSubmit = (input) => () => {
  if (!input) {
    return;
  }
  if (input.validationMessage) {
    (this || {}).error = input.validationMessage;
  }
};
const FormControl = (inputid, input, form) => {
  if (!form) {
    return;
  }
  const onSub = onSubmit(input).bind(this);
  if (!form.events) {
    form.events = {};
  }
  if (form.events[inputid] && typeof form.events[inputid] === 'function') {
    form.events[inputid]();
  }
  form.addEventListener('submit', onSub);
  form.events[inputid] = () => {
    form.removeEventListener('submit', onSub);
    delete form.events[inputid];
  };
};
export default FormControl;
