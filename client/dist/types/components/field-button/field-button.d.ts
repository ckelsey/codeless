export declare class FieldButton {
  type: string;
  validateType(newValue: string): string;
  theme: string;
  validateTheme(newValue: string): void;
  size: string;
  validateSize(newValue: string): void;
  kind: string;
  validateKind(newValue: string): void;
  disabled: boolean;
  spinner: boolean;
  btn: HTMLButtonElement;
  containerElement: HTMLElement;
  render(): any;
}
