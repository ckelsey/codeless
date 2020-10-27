import Try from '../try'
import FromEntities from '../conversion/from-entities'
import ValidationResult from './validation-result'
import SelectAll from '../dom/select-all'

export default function ValidateHtml(
    str: string,
    disallowedHtmlTags: string[] = [],
    allowedHtmlTags: string[] = [],
): ValidationResult {

    const original = str
    const converted = Try(() => FromEntities(str.toString()), '')

    if (!converted || !converted.length) {
        return {
            original: original,
            valid: false,
            sanitized: converted,
            reason: ['no value']
        }
    }

    const doc = Try(() => new DOMParser().parseFromString(converted, 'text/html'))

    if (!doc) { return { original: original, valid: true, sanitized: converted, reason: ['no html present'], } }

    const totalElements = SelectAll('*', doc)
    const elementsToDestroy: Element[] = []
    let tagsToDestroy: string[] = []

    function allowedHtmlTagsEach(tag: string) {
        const index = tagsToDestroy.indexOf(tag)

        if (index > -1) {
            tagsToDestroy.splice(index, 1)
        }
    }

    function tagsToDestroyEach(tag: string) {
        const els = SelectAll(tag, doc)
        let elsIndex = els.length
        while (elsIndex--) {
            elementsToDestroy.push(els[elsIndex])
        }
    }

    function elementsToDestroyEach(el: Element) {
        const parent = el.parentNode
        if (el && parent) {

            const childrenLength = el.children.length
            let index = 0

            while (index < childrenLength) {
                if (typeof parent.insertBefore == 'function') {
                    parent.insertBefore(el.children[index], el)
                }
                index = index + 1
            }

            parent.removeChild(el)
        }
    }

    if (disallowedHtmlTags.length) {
        tagsToDestroy = disallowedHtmlTags.slice(0)
    } else {
        tagsToDestroy = htmlTags.concat(svgTags)
    }

    if (allowedHtmlTags.length) {
        allowedHtmlTags.forEach(allowedHtmlTagsEach)
    }

    if (!allowedHtmlTags.length && !disallowedHtmlTags.length) {
        tagsToDestroy = htmlTags.concat(svgTags)
    }

    tagsToDestroy.forEach(tagsToDestroyEach)

    elementsToDestroy.forEach(elementsToDestroyEach)

    const leftOverElements = SelectAll('*', doc)
    const diff = totalElements.length - leftOverElements.length
    const valid = diff === 0

    return {
        original: original,
        valid: valid,
        sanitized: valid ? converted : !doc.body.innerHTML || !doc.body.innerHTML.length ? '' : doc.body.innerHTML,
        reason: valid ? [] : [`${diff} element${diff > 1 ? 's were' : 'was'} removed`]
    }
}

const htmlTags = [
    'a',
    'abbr',
    'acronym',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'bdi',
    'bdo',
    'big',
    'blink',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'center',
    'cite',
    'code',
    'col',
    'colgroup',
    'content',
    'data',
    'datalist',
    'dd',
    'decorator',
    'del',
    'details',
    'dfn',
    'dir',
    'div',
    'dl',
    'dt',
    'element',
    'em',
    'fieldset',
    'figcaption',
    'figure',
    'font',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'main',
    'map',
    'mark',
    'marquee',
    'menu',
    'menuitem',
    'meter',
    'nav',
    'nobr',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'section',
    'select',
    'shadow',
    'small',
    'source',
    'spacer',
    'span',
    'strike',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'tr',
    'track',
    'tt',
    'u',
    'ul',
    'var',
    'video',
    'wbr'
]

const svgTags = [
    'svg',
    'a',
    'altglyph',
    'altglyphdef',
    'altglyphitem',
    'animatecolor',
    'animatemotion',
    'animatetransform',
    'audio',
    'canvas',
    'circle',
    'clippath',
    'defs',
    'desc',
    'ellipse',
    'filter',
    'font',
    'g',
    'glyph',
    'glyphref',
    'hkern',
    'image',
    'line',
    'lineargradient',
    'marker',
    'mask',
    'metadata',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialgradient',
    'rect',
    'stop',
    'style',
    'switch',
    'symbol',
    'text',
    'textpath',
    'title',
    'tref',
    'tspan',
    'video',
    'view',
    'vkern'
]