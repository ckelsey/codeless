import ValidationResult from './validation-result';
export default function ValidateHtml(str: string, disallowedHtmlTags?: string[], allowedHtmlTags?: string[]): ValidationResult;
export declare const SantizedHTML: (val: string) => string;
