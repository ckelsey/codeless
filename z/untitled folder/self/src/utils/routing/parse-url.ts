import ValidateHtml from '../validate/html'

export default function parseUrl(url: string) {
    const validated = ValidateHtml(url.split('?')[0]).sanitized as string // prevent XSS
    return validated.length > 1 && validated[validated.length - 1] === '/' ? validated.slice(0, validated.length - 1) : validated
}