import FromJSON from '../utils/conversion/from-json'
import ToJSON from '../utils/conversion/to-json'
import Observer from '../utils/observe/observer'
import { ProjectObject } from './projects'

const getLocal = (key: string) => FromJSON(localStorage.getItem(key))
const setLocal = (key: string, value: any) => localStorage.setItem(key, typeof value == 'string' ? value : ToJSON(value))

const projects = Observer(getLocal('projects') || [], { matchType: true, nextOnNew: true })
projects.subscribe((arrayOfProjects: ProjectObject[]) => {
    setLocal('projects', arrayOfProjects)
})

const currentProject = Observer(getLocal('project') || '', { matchType: true, nextOnNew: true })
currentProject.subscribe((projectId: string) => setLocal('project', projectId))

const Storage = {
    get projects() {
        if (!getLocal('projects')) { projects.next([]) }

        return projects.value
    },

    set projects(arrayOfProjects) {
        projects.next(arrayOfProjects)
    },

    get currentProject() {
        return currentProject.value
    },

    set currentProject(id: string) {
        currentProject.next(id)
    }
}

export default Storage