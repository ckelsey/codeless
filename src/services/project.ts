import Vue from 'vue'
import app from './app'
import auth from './auth'

class Project {
    defaultImage = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDI5IiBoZWlnaHQ9IjIzOCIgdmlld0JveD0iMCAwIDQyOSAyMzgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPm1pc3NpbmctaW1hZ2UtNHgzPC90aXRsZT48ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNDI5djIzOEgweiIgZmlsbD0iI0YwRjFGMiIvPjxwYXRoIGQ9Ik0xNjAuODc1IDc5djc3LjdoMTA3LjI1Vjc5aC0xMDcuMjV6bTEwMS44ODggNC45djM5LjhsLTI4Ljg1LTI2LjEtMjguNzQ0IDI2LjgtMTQuNjkzLTEzLjctMjQuMjM5IDIyLjdWODMuOWg5Ni41MjV6bS05Ni41MjUgNTYuNWwyNC4zNDUtMjIuNyAzNi4zNTggMzMuOWgtNjAuNzA0di0xMS4yem02OC4yMSAxMS4zbC0yNS41MjUtMjMuOCAyNC45OS0yMy4zIDI4Ljg1IDI2LjF2MjFoLTI4LjMxNHoiIGZpbGw9IiNEQ0REREYiLz48L2c+PC9zdmc+`
    data: projectData | null = null
    previewing: boolean = false
    isEditing: boolean = false
    author: boolean = false
    totalColumns: number = 12
    _pageFilter: string = ``
    _filteredPages: string[] = []
    saveTimer: any = null
    selectionNode: any = null
    selectionOffset: number = 0

    fonts: string[] = [
        `h1`,
        `h2`,
        `h3`,
        `h4`,
        `p`
    ]

    colors: string[] = [
        `#1c1c1c`,
        `#333`,
        `#fafafa`,
        `#ccc`
    ]

    defaultProject: projectData = {
        pages: {},
        elements: {},
        settings: {
            colors: this.colors,
            fonts: this.fonts,
            name: ``,
            logo: ``,
            favicon: ``
        },
        home: ``,
        navigation: [],
        navigationMap: {},
        currentPage: ``,
        templates: {}
    }

    get currentPage(): string {
        return this.data ? this.data.currentPage : ``
    }

    set currentPage(page: string) {
        if (this.data && this.data.hasOwnProperty(`currentPage`)) {
            (this.data as any).currentPage = page
        }
    }

    get filteredPages() {
        return this._filteredPages
    }

    set filteredPages(arr) {
        const keys: string[] = []

        arr.forEach((k) => {
            if (!this.pageFilter || this.pageFilter.trim() === ``) {
                keys.push(k)
                return
            }

            if (
                this.data &&
                this.data.pages[k] &&
                (this.data.pages[k].name.toLowerCase() === this.pageFilter.toLowerCase() ||
                    this.data.pages[k].name.toLowerCase().indexOf(this.pageFilter.toLowerCase()) > -1)
            ) {
                keys.push(k)
            }
        })

        this._filteredPages = JSON.parse(JSON.stringify(keys))
    }

    get pageFilter() {
        return this._pageFilter
    }

    set pageFilter(str) {
        if (this.data) {
            this._pageFilter = str
            this.filteredPages = Object.keys(this.data.pages)
        }
    }

    get projectColors() {
        return this.data ? this.data.settings.colors.join(`, `) : ``
    }

    set projectColors(string: string) {
        if (this.data) {
            this.data.settings.colors = string.split(`,`).map(str => str.trim())
        }
    }

    createPrimitive(type: string): node {
        const id = this.generateId()
        return {
            name: `element-${id}`,
            type,
            content: [],
            colSpan: this.totalColumns,
            height: `auto`,
            id,
            index: {},
            background: `transparent`,
            backgroundImage: ``,
            active: false,
            published: true,
            global: false,
            css: ``,
            generic: null
        }
    }

    generateId(): string {
        return `${new Date().getTime()}-${Math.round(Math.random() * 1000)}`
    }

    reorderElements(page: string, start: number, end: number) {
        if (!this.data || !this.data.elements[this.data.pages[page].data[start]]) {
            return
        }
        this.data.elements[this.data.pages[page].data[start]].index[page] = end

        if (!this.data.pages[page].data) {
            return
        }

        const length = this.data.pages[page].data.length
        let index = 0

        this.data.pages[page].data.sort((a: string, b: string) => {
            if (!this.data) {
                return 1
            }
            const aIndex = this.data.elements[a].index[page]
            const bIndex = this.data.elements[b].index[page]
            return aIndex >= bIndex ? 1 : -1
        })

        while (length > index) {
            this.data.elements[this.data.pages[page].data[index]].index[page] = index
            index++
        }

        this.savePage(page)
    }

    setColumns(pageId: string) {
        let lastSpan = 0

        if (!this.data) {
            return
        }

        this.data.pages[pageId].data.forEach((i) => {
            if (!this.data) {
                return
            }
            const element = this.data.elements[i]

            if (!element) {
                return element
            }

            if (!lastSpan) {
                element.isRowStart = true
            } else if (lastSpan + element.colSpan > this.totalColumns) {
                lastSpan = 0
                element.isRowStart = true
            } else {
                element.isRowStart = false
            }

            if (lastSpan + element.colSpan === this.totalColumns) {
                element.isRowEnd = true
            } else {
                element.isRowEnd = false
            }

            lastSpan = lastSpan + element.colSpan
        })
    }

    addElement(element: node) {
        if (!this.data || !this.currentPage) {
            return
        }

        let currentObject = this.data.pages[this.currentPage].data

        if (!currentObject) {
            return
        }

        element.active = true
        element.index[this.currentPage] = currentObject.length

        currentObject.forEach((i: string) => {
            if (!this.data) {
                return
            }
            this.data.elements[i].active = false
        })

        Vue.set(this.data.elements, element.id, element)

        currentObject.push(element.id)
        this.savePage(this.currentPage)

        requestAnimationFrame(() => {
            app.scrollToElement(document.getElementById(`element-${element.id}`))
            element.active = true
        })
    }

    addText() {
        let newText: node = this.createPrimitive(`text`)
        newText.content = [`text`]
        this.addElement(newText)
    }

    addDivider() {
        let newDivider: node = this.createPrimitive(`divider`)
        newDivider.content = []
        this.addElement(newDivider)
    }

    addImage() {
        let newImage: node = this.createPrimitive(`image`)
        newImage.content = [this.defaultImage]
        newImage.link = ``
        this.addElement(newImage)
    }

    addForm(){
        let el: node = this.createPrimitive(`form`)
        el.content = [``]
        el.link = ``
        el.name = ``
        this.addElement(el)
    }

    deleteItem(key: string) {
        if (!this.data || !this.currentPage) {
            return
        }
        let el = this.data.elements[key]
        let pageKeys = Object.keys(this.data.pages)
        let pageLength = pageKeys.length

        while (pageLength--) {
            let contentLength = this.data.pages[pageKeys[pageLength]].data.length

            while (contentLength--) {
                if (this.data.pages[pageKeys[pageLength]].data[contentLength] === key) {
                    this.data.pages[pageKeys[pageLength]].data.splice(contentLength, 1)
                    break
                }
            }
        }

        if (!el.global) {
            delete this.data.elements[key]
        }

        this.savePage(this.currentPage)
    }

    addPage() {
        if (!this.data) {
            return
        }

        const id = this.generateId()

        const newPage = {
            name: `New page`,
            id,
            data: []
        }

        Vue.set(this.data.pages, id, newPage)

        this.openPage(id)
        this.savePage(id)
    }

    deletePage(id: string) {
        if (!this.data || !this.currentPage) {
            return
        }

        const pages = Object.keys(this.data.pages)

        if (this.currentPage = id) {
            let newId
            let index = 0

            while (!newId && index < pages.length) {
                if (pages[index] !== id) {
                    newId = pages[index]
                }

                index++
            }

            if (newId) {
                this.openPage(newId)
            } else {
                this.addPage()
            }
        }

        let contentLength = this.data.pages[id].data.length

        while (contentLength--) {
            if (!this.data.elements[this.data.pages[id].data[contentLength]].global) {
                delete this.data.elements[this.data.pages[id].data[contentLength]]
            }
        }

        delete this.data.pages[id]

        if (this.data.home === id) {
            this.setHomePage(Object.keys(this.data.pages)[0])
        }

        this.savePage(this.currentPage)
    }

    duplicatePage(id: string) {
        if (!this.data || !this.currentPage) {
            return
        }

        let page = JSON.parse(JSON.stringify(this.data.pages[id]))

        page.data = page.data.map((elementIndex: string) => {
            if (!this.data || !this.currentPage) {
                return
            }

            if (!this.data.elements[elementIndex].global) {
                let element = JSON.parse(JSON.stringify(this.data.elements[elementIndex]))
                element.id = this.generateId()

                Vue.set(this.data.elements, element.id, element)

                return element.id
            }

            return elementIndex
        })

        page.id = this.generateId()
        page.name = `${page.name} (copy)`

        Vue.set(this.data.pages, page.id, page)

        this.openPage(page.id)
        this.savePage(page.id)
    }

    setHomePage(id: string) {
        if (!this.data || !this.currentPage) {
            return
        }

        this.data.home = id
        this.savePage(this.currentPage)
    }

    openPage(pageId: string, anchor?: string) {
        if (!this.data || !this.currentPage) {
            return
        }

        this.currentPage = pageId;

        if (!this.data.pages[pageId]) {
            return
        }

        window.document.title = `${this.data.settings.name} - ${this.data.pages[pageId].name}`

        let query = `?p=${pageId}${anchor ? `&a=${anchor}` : ``}`
        let url = window.location.origin + window.location.pathname + query

        if (this.data.home === pageId) {
            query = `${anchor ? `?a=${anchor}` : ``}`
            url = window.location.origin + window.location.pathname + query
        }

        history.pushState({ p: pageId, a: anchor }, window.document.title, url)

        if (anchor) {
            requestAnimationFrame(() => {
                app.scrollToElement(document.getElementById(`element-${anchor}`))
                this.openPage(pageId)
            })
        }
    }

    savePage(pageId: string) {
        app.saveSelection()

        clearTimeout(this.saveTimer)

        this.saveTimer = setTimeout(() => {
            if (!this.data || !this.currentPage) {
                return
            }

            this.setColumns(pageId)

            const save = () => {
                if (!this.data || !this.currentPage) {
                    return
                }

                const json = JSON.stringify(this.data)
                auth.updateDoc(json)
                localStorage.setItem(`codeless`, json)
                this.filteredPages = Object.keys(this.data.pages)

                if (this.data.pages[this.currentPage]) {
                    window.document.title = `${this.data.settings.name} - ${this.data.pages[this.currentPage].name}`
                }

                this.setColumns(pageId)

                this.setFavicon()

                Vue.nextTick(() => {
                    app.restoreSelection()
                })
            }

            auth.getDoc()
                .then(data => {
                    this.data = this.mergeData(data)

                    save()
                }, () => {
                    save()
                })
        }, 333)
    }


    getPageQuery(url?: string) {

        if (url) {
            url = url.split('?')[1]

            if (url) {
                url = `?${url}`
            }
        }

        let searchString: string = url || window.location.search
        let results: { [key: string]: string } = {}

        if (!searchString) {
            return results
        }

        // Convert query string to object
        let search: Array<string> = searchString.substr(1).split('&')

        search.forEach((s) => {
            let key = s.split('=').shift()

            if (key) {
                let val: string = s.split(`${key}=`)[1]

                if (val && val !== 'undefined' && val !== '') {
                    results[key] = val
                }
            }
        })

        return results
    }

    getPageFromUrl() {
        if (!this.data || !this.currentPage) {
            return ``
        }

        const query = this.getPageQuery()
        return query.p || this.data.home || Object.keys(this.data.pages)[0]
    }

    mergeData(data?: any) {
        const storage = localStorage.getItem(`codeless`)
        const objs = []

        if (storage) {
            objs.push(JSON.parse(storage))
        }

        if (data) {
            objs.push(data)
        }

        if (this.data) {
            objs.push(this.data)
        }

        if (!objs.length) {
            this.data = JSON.parse(JSON.stringify(this.defaultProject))

            if (this.data) {
                this.addPage()
                this.currentPage = Object.keys(this.data.pages)[0]
            }
        }

        if (objs.length === 3) {
            this.data = app.deepMerge(app.deepMerge(objs[0], objs[1]), objs[2])
        }

        if (objs.length === 2) {
            this.data = app.deepMerge(objs[0], objs[1])
        }

        if (objs.length === 1) {
            this.data = objs[0]
        }

        return this.data
    }

    getData(data?: projectData) {
        app.saveSelection()

        this.data = this.mergeData(data)

        if (!this.data) {
            return
        }

        if (!Object.keys(this.data.pages).length) {
            this.addPage()
        }

        if (!this.data.home) {
            this.setHomePage(Object.keys(this.data.pages)[0])
        }

        const query = this.getPageQuery()
        this.currentPage = this.getPageFromUrl()
        this.openPage(this.currentPage, query.a)
        this.setColumns(this.currentPage)

        this.filteredPages = Object.keys(this.data.pages)

        localStorage.setItem(`codeless`, JSON.stringify(this.data))

        this.setFavicon()
        Vue.nextTick(() => {
            app.restoreSelection()
        })
    }

    setFavicon() {
        if (!this.data) {
            return
        }
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link') as HTMLLinkElement
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = this.data.settings.favicon
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    insertNavItem(item: any) {
        if (!this.data || !this.currentPage) {
            return
        }

        this.data.navigationMap[item.id] = this.data.navigation.length.toString()
        this.data.navigation.push(item)
        this.savePage(this.currentPage)
    }

    saveNavItem(item: any, _path: any) {
        if (!this.data || !this.currentPage) {
            return
        }

        const base = app.getBase(this.data.navigation, _path)
        let path: any[] = []

        app.setPath(path, _path)

        const key = path[path.length - 1]

        base[key].text = item.text
        base[key].link = item.link

        this.savePage(this.currentPage)
    }

    togglePageNav(page: string) {
        if (!this.data || !this.currentPage) {
            return
        }

        this.data.navigationMap[`?p=${page}`] = this.data.navigation.length.toString()
        this.data.navigation.push({
            id: page,
            content: [],
            link: `?p=${page}`
        })
        this.savePage(this.currentPage)
    }

    makeProxy(data:any){
        const proxy = JSON.parse(JSON.stringify(data))

        proxy.data = proxy.data.map((element: string) => {
            if (!this.data) {
                return
            }
            const elementProxy = JSON.parse(JSON.stringify(this.data.elements[element]))

            if(elementProxy.global){
                return elementProxy.id
            }

            elementProxy.id = this.generateId()
            elementProxy.published = true

            this.data.elements[elementProxy.id] = elementProxy

            return elementProxy.id
        })

        proxy.id = this.generateId()

        return proxy
    }

    saveAsTemplate() {
        if (!this.data) {
            return
        }

        const proxy = this.makeProxy(this.data.pages[this.currentPage])

        if(!this.data.templates){
            this.data.templates = {}
        }

        Vue.set(this.data.templates, proxy.id, proxy)

        this.savePage(this.currentPage)
    }

    deleteTemplate(id: string) {
        if (!this.data) {
            return
        }

        Vue.delete(this.data.templates, id)

        this.savePage(this.currentPage)
    }

    newPageFromTemplate(id: string) {
        if (!this.data) {
            return
        }

        const proxy = this.makeProxy(this.data.templates[id])

        proxy.id = this.generateId()
        proxy.name =  `New page`

        Vue.set(this.data.pages, proxy.id, proxy)

        this.openPage(proxy.id)
        this.savePage(proxy.id)
    }

    constructor() {
        auth.onAuth((isAuthor: boolean) => {
            if (isAuthor) {
                this.author = true
                this.isEditing = true
            }
        })
        auth.onUpdate((res: projectData) => {
            this.getData(res)
        })
        auth.init()
            .catch(() => {
                this.getData()
            })
    }
}

export default new Project()