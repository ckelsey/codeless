export default function TextareaHeight(input) {
  if (!input) {
    return;
  }
  input.style.removeProperty('height');
  input.style.overflow = 'hidden';
  input.style.height = `${input.scrollHeight}px`;
}
