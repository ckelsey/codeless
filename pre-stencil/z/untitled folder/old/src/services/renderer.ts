import project from './project'
import URL from 'url'
import auth from './auth';
import app from './app';

class Renderer {
    file: any = null
    linkDialogueActive: any = null
    showLinkTextInput: boolean = true
    linkText: string = ``
    linkUrl: string = ``
    selectingLinkElement: boolean = false
    imageUploadDialogueActive: string | null = null
    imageUrl: string = ``
    navItemDialogue: string | null = null
    showProjectSettings = null
    showingNav = false
    searchResults: any = {}
    _searchTerm = ``
    showSearch = null
    showSpinner = false
    uploadedFiles: any = {}
    logoFile: any = null
    faviconFile: any = null
    showCSS: any = false
    showFormInputs: any = null
    formSent: any = null

    get searchTerm() {
        return this._searchTerm
    }

    set searchTerm(term) {
        this._searchTerm = term

        for (let i in this.searchResults) {
            delete this.searchResults[i]
        }

        if (!term || term.trim() === ``) {
            this.searchResults = {}
            return
        }

        let _term = term.toLowerCase()

        if (!project.data) {
            return
        }

        for (let page in project.data.pages) {
            let isAmatch = false
            let name = project.data.pages[page].name
            let thisMatch = {
                page: {
                    id: page,
                    name
                },
                terms: []
            }
            let terms: any[] = []

            if (name.toLowerCase().indexOf(_term) > -1) {
                isAmatch = true
            }

            project.data.pages[page].data.forEach((key: string) => {
                if (!project.data) {
                    return
                }

                const element = project.data.elements[key]

                if (element.type !== `text`) {
                    return
                }

                if (element.content[0].toLowerCase().indexOf(_term) > -1) {
                    isAmatch = true
                    const index = element.content[0].toLowerCase().indexOf(_term)
                    const start = index - 10 || 0
                    const text = `...${element.content[0].substring(start, index + _term.length + 30)}...`

                    terms.push({
                        id: element.id,
                        text
                    })
                }
            })

            if (isAmatch) {
                (thisMatch as any).terms = terms
                this.searchResults[page] = thisMatch
            }
        }
    }

    newNavItem: any = {
        text: ``,
        link: ``,
        content: []
    }

    views: any[] = [
        { icon: `edit`, name: `editor` },
        { icon: `visibility`, name: `preview` },
        { icon: `publish`, name: `published` }
    ]

    view: any = project.isEditing ? this.views[0] : this.views[2]

    activate(element: node) {
        if (!project.data) {
            return
        }

        if (!element || element.active) {
            return
        }

        for (let i in project.data.elements) {
            if (project.data.elements[i]) {
                project.data.elements[i].active = false
            }
        }

        element.active = true

        app.clearSelection()
    }

    handleLinkClick(e: Event, link?: HTMLElement | undefined) {
        if (project.isEditing) {
            e.preventDefault()
            return false
        }

        if (link) {
            const href = link.getAttribute(`href`) || ``
            const url = URL.parse(href)

            if (!url.hostname) {
                url.hostname = location.hostname
            }

            if (!url.protocol) {
                url.protocol = `https:`
            }

            if (url.hostname === location.hostname) {
                e.preventDefault()
                const query = project.getPageQuery(href)
                project.openPage(query.p, query.a)
            }
        }
    }

    getActiveElement() {
        if (!project.data) {
            return
        }
        const elements = project.data.pages[project.currentPage].data
        let len = elements.length
        let active

        while (!active && len--) {
            if (project.data.elements[elements[len]] && project.data.elements[elements[len]].active) {
                active = project.data.elements[elements[len]]
            }
        }

        return active
    }

    getActiveDomElement(subElement?: string) {
        let currentElement = this.getActiveElement()

        if (!currentElement) {
            return
        }

        return window.document.body.querySelector(`#element-${currentElement.id}${subElement ? ` ${subElement}` : ``}`)
    }

    selectLinkElement(targetIsPage: boolean) {
        app.saveSelection()
        this.selectingLinkElement = true

        document.body.classList.add(`selecting-link-element`)

        if (targetIsPage) {
            document.body.classList.add(`selecting-link-page`)
        }

        const pageNavButton = document.getElementById(`pages-nav-button`)

        if (pageNavButton) {
            pageNavButton.click()
        }

        const prevent = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
        }

        const release = () => {
            document.body.classList.remove(`selecting-link-page`)
            document.body.classList.remove(`selecting-link-element`)
            this.selectingLinkElement = false
            window.removeEventListener(`mousedown`, setTarget)
            window.removeEventListener(`keydown`, esc)
            window.removeEventListener(`click`, prevent)
        }

        const esc = (e: KeyboardEvent) => {
            let key = e.key

            if (key.toLowerCase() === `escape`) {
                release()
            }
        }

        const setTarget = (e: Event) => {
            prevent(e)

            let target

            if (targetIsPage) {
                target = this.findParentPrimitive(e.target as HTMLElement, `page-item`)

                if (target) {
                    this.linkUrl = `?p=${target.getAttribute(`page`)}`
                    release()
                }
            } else {
                target = this.findParentPrimitive(e.target as HTMLElement)

                if (target) {
                    this.linkUrl = `?p=${project.currentPage}&a=${target.id.split(`element-`)[1]}`
                    release()
                }
            }
        }

        setTarget.bind(this)

        window.addEventListener(`mousedown`, setTarget)
        window.addEventListener(`click`, prevent)
        window.addEventListener(`keydown`, esc)
    }

    clearEmptyElements() {
        const activeDomElement = this.getActiveDomElement(`.editable-text-element`)

        if (activeDomElement) {
            const children = activeDomElement.querySelectorAll(`*`)

            for (var i = 0; i < children.length; i++) {
                const child = children[i]
                const parent = child.parentNode

                if (parent && child.innerHTML === ``) {
                    parent.removeChild(child)
                }
            }
        }
    }

    wrapSelection(tag: string, attributes?: any, text?: string) {
        let sel = window.getSelection()

        if (sel.type === `none`) {
            app.restoreSelection()
            sel = window.getSelection()

            if (sel.type === `none`) {
                return
            }
        }

        const selection = window.getSelection().getRangeAt(0)
        const selectedText = selection.extractContents()
        const el = document.createElement(tag)

        if (attributes) {
            for (let i in attributes) {
                if (attributes[i]) {
                    el.setAttribute(i, attributes[i])
                }
            }
        }

        el.appendChild(selectedText);

        if (text) {
            el.textContent = text
        }

        selection.insertNode(el)
        return el
    }

    addLink() {
        if (!project.data) {
            return
        }

        const activeElement = this.getActiveElement()
        const activeDomElement = this.getActiveDomElement(`.editable-text-element`)

        this.linkDialogueActive = false

        let url = URL.parse(this.linkUrl)

        if (!url.hostname) {
            url.hostname = location.hostname
        }

        if (!url.protocol) {
            url.protocol = `https:`
        }

        this.linkUrl = URL.format(url)

        if (activeElement && project.isEditing) {
            if (activeElement.type === `text` && activeDomElement) {

                if (!this.linkText) {
                    this.linkText = this.linkUrl
                }

                app.restoreSelection()
                this.wrapSelection(`a`, { href: this.linkUrl }, this.linkText)
                app.restoreSelection()
                this.clearEmptyElements()

                project.data.elements[activeElement.id].content[0] = activeDomElement.innerHTML

                project.savePage(project.currentPage)
            } else if (activeElement.type === `image`) {
                project.data.elements[activeElement.id].link = this.linkUrl
                project.savePage(project.currentPage)
            }
        }

        this.linkUrl = ``
        this.linkText = ``
    }

    setLinkText() {
        app.restoreSelection()
        this.showLinkTextInput = true
        let sel = window.getSelection()
        let range = sel.getRangeAt(0)
        let rangeNode = range.commonAncestorContainer
        let rangeElement = rangeNode.parentElement && rangeNode.parentNode ? rangeNode.parentElement.children[Array.prototype.indexOf.call(rangeNode.parentNode.childNodes, rangeNode)] : null
        let link

        if (rangeNode) {
            if (rangeNode.nodeName.toLocaleLowerCase() === `#text`) {
                if (rangeNode.parentNode && rangeNode.parentNode.nodeName.toLocaleLowerCase() === `a`) {
                    if (rangeNode.parentElement) {
                        link = rangeNode.parentElement
                    }
                }
            }

            if (rangeNode.nodeName.toLocaleLowerCase() === `a`) {
                if (rangeNode.parentElement && rangeNode.parentNode) {
                    link = rangeElement
                }
            }

            if (rangeElement) {
                let _link: any = rangeElement.querySelector(`a[href]`)

                if (rangeElement.getAttribute('href')) {
                    _link = rangeElement
                }

                if (_link) {
                    this.linkUrl = _link.href
                }
            }

            if (link) {
                this.linkText = link.textContent || ``
                this.linkUrl = link.getAttribute(`href`) || ``
                const _range = document.createRange()
                _range.selectNodeContents(link)
                sel.removeAllRanges()
                sel.addRange(_range)
                app.saveSelection()
                app.restoreSelection()
                return
            }
        }

        this.linkText = sel.toString().trim()

        if (!this.linkUrl) {
            const currentEl = this.getActiveDomElement()

            if (!currentEl || !currentEl.querySelector(`img`)) {
                return
            }

            this.showLinkTextInput = false
            const link = currentEl.querySelector(`a`)
            this.linkUrl = link ? link.getAttribute(`href`) || `` : ``
        }
    }

    openLinkDialogue() {
        this.linkUrl = ``
        this.linkText = ``
        this.setLinkText()
        this.linkDialogueActive = true
    }

    openImageUpload(type: string) {
        this.imageUploadDialogueActive = type
    }

    addImageUrl() {
        if (!project.data) {
            return
        }

        const finish = () => {
            if (!project.data) {
                return
            }

            let currentElement = this.getActiveElement()
            let currentElementId = currentElement ? currentElement.id : null

            if (!currentElementId || !this.imageUploadDialogueActive) {
                return
            }

            if (this.imageUploadDialogueActive === `content`) {
                ; (project.data.elements as any)[currentElementId].content.pop();
                ; (project.data.elements as any)[currentElementId].content.push(this.imageUrl);
            } else {
                ; (project.data.elements as any)[currentElementId][this.imageUploadDialogueActive] = this.imageUrl;
            }

            project.savePage(project.currentPage)

            this.imageUploadDialogueActive = null
            this.file = null

            auth.getDirectoryFiles()
                .then((res: any) => {
                    this.uploadedFiles = res
                })
        }

        if (this.file) {
            this.showSpinner = true
            return auth.uploadFile(this.file)
                .then((res: any) => {
                    this.showSpinner = false
                    this.imageUrl = res.webContentLink
                    finish()
                })
                .catch(err => {})
        } else {
            finish()
        }
    }

    findParentPrimitive(target: HTMLElement | null, _class?: string): HTMLElement | null {
        if (!target) {
            return null
        }

        if (target.classList && !target.classList.contains(_class || `primitive-element`)) {
            if (target.parentElement === window.document.body) {
                return null
            }

            return this.findParentPrimitive(target.parentElement, _class)
        }

        return target
    }

    findParentTag(target: HTMLElement | null, tag: string): HTMLElement | null {
        if (!target) {
            return null
        }

        if (target.tagName.toLowerCase() !== tag.toLowerCase()) {
            if (target.parentElement === window.document.body) {
                return null
            }

            return this.findParentTag(target.parentElement, tag)
        }

        return target
    }

    addNewNavItem() {
        this.newNavItem = {
            id: project.generateId(),
            text: ``,
            link: ``,
            content: []
        }
        this.navItemDialogue = `new`
    }

    saveNavItem(item: any) {
        if (item && this.navItemDialogue === `new`) {
            project.insertNavItem(item)
        } else {
            project.saveNavItem(this.newNavItem, this.navItemDialogue)
        }
        this.navItemDialogue = null
    }

    setView(view: any) {
        this.view = view

        switch (this.view.name) {
            case `preview`:
                project.previewing = true
                project.isEditing = false
                break
            case `published`:
                project.previewing = false
                project.isEditing = false
                break
            case `editor`:
                project.previewing = false
                project.isEditing = true
                break
        }

        localStorage.setItem(`code_less`, JSON.stringify(this.view))
    }

    applySettings() {
        this.showProjectSettings = null

        if (this.logoFile) {
            this.showSpinner = true
            return auth.uploadFile(this.logoFile)
                .then((res: any) => {
                    this.logoFile = null
                    if (!project.data) {
                        return
                    }

                    project.data.settings.logo = res.webContentLink

                    if (this.faviconFile) {
                        return auth.uploadFile(this.faviconFile)
                            .then((res: any) => {
                                this.faviconFile = null
                                this.showSpinner = false

                                if (!project.data) {
                                    return
                                }

                                project.data.settings.favicon = res.webContentLink

                                project.savePage(project.currentPage)
                            })
                            .catch(err => { })
                    } else {
                        this.showSpinner = false
                        project.savePage(project.currentPage)
                    }
                })
                .catch(err => { })
        }

        if (this.faviconFile) {
            this.showSpinner = true
            return auth.uploadFile(this.faviconFile)
                .then((res: any) => {
                    this.faviconFile = null
                    this.showSpinner = false

                    if (!project.data) {
                        return
                    }

                    project.data.settings.favicon = res.webContentLink

                    project.savePage(project.currentPage)
                })
                .catch(err => { })
        }

        project.savePage(project.currentPage)
    }

    get showScrim(){
        return this.formSent || this.showFormInputs || this.showProjectSettings || this.showCSS || this.imageUploadDialogueActive || this.navItemDialogue !== null || this.linkDialogueActive || this.showSearch 
    }

    scrimClick(){
        this.formSent = this.showFormInputs = this.showProjectSettings = this.showCSS = this.imageUploadDialogueActive = this.navItemDialogue = this.linkDialogueActive = this.showSearch = null
    }

    constructor() {
        let view = localStorage.getItem(`code_less`)

        if (view) {
            this.setView(JSON.parse(view))
        }

        auth.onAuth((isAuthor: boolean) => {
            if (isAuthor) {
                this.setView(this.views[0])
                auth.getDirectoryFiles()
                    .then((res: any) => {
                        this.uploadedFiles = res
                    })
            }
        })
    }
}

export default new Renderer()