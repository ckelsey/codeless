import Pipe from '../function-helpers/pipe';
import ToString from './to-string';
import FromUriComponent from './from-uri-component';
import FromEntities from './from-entities';
import SetValid from './set-valid';
export default function ToPlainText(value) {
  function ToPlainTextFn(str) {
    return SetValid(str, typeof str == 'string');
  }
  return ToPlainTextFn(Pipe(ToString, FromUriComponent, FromEntities)(value));
}
