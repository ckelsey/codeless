export default function InputName(name, label, id) {
  if (!!name) {
    return name;
  }
  if (!!label && label.trim() !== '') {
    return label.split(' ').join('_').toLowerCase();
  }
  return id || '';
}
