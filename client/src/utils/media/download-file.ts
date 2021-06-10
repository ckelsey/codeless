export default function Download(file: string | Blob, name = 'download') {
    const a = document.createElement('a')
    a.href = typeof file === 'string' ? file : window.URL.createObjectURL(file)
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    if (typeof file !== 'string') {
        try { window.URL.revokeObjectURL(a.href) } catch (error) { }
    }
}