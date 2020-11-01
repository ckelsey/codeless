import FromJSON from '../utils/conversion/from-json'
import ToJSON from '../utils/conversion/to-json'
import Observer from '../utils/observe/observer'

const getLocal = (key: string) => FromJSON(localStorage.getItem(key))
const setLocal = (key: string, value: any) => localStorage.setItem(key, ToJSON(value))

const projects = Observer(getLocal('projects') || [], { matchType: true, nextOnNew: true })
projects.subscribe((arrayOfProjects: any[]) => setLocal('projects', arrayOfProjects))

const defaultSection = 'projects'
const section = Observer(getLocal('section') || defaultSection, { matchType: true, nextOnNew: true })
section.subscribe((newSection: string) => setLocal('section', newSection))

const Storage = {
    get projects() {
        if (!getLocal('projects')) { projects.next([]) }

        return projects.value
    },

    set projects(arrayOfProjects) {
        projects.next(arrayOfProjects)
    },

    get section() {
        if (!getLocal('section')) { section.next(defaultSection) }

        return section.value
    },

    set section(newSectionKey) {
        section.next(newSectionKey)
    },
}

export default Storage