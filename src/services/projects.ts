import ID from '../utils/id'
import Get from '../utils/objects/get'
import Observer from '../utils/observe/observer'
import Storage from './storage'
import Merge from '../utils/objects/merge'

export interface ProjectObject {
    name: string
    id: string
    created: number
    updated: number
}

const list = Observer(
    Storage.projects,
    {
        matchType: true,
        nextOnNew: true,
        formatter: (projects: ProjectObject[]) => {
            const result: ProjectObject[] = []
            projects.forEach(project => project.name && project.id ? result.push(project) : undefined)
            return result
        }
    }
)

list.subscribe(projects => Storage.projects = projects)

function findById(id: string) {
    const currentList = list.value
    let index = currentList.length
    let project

    while (!project && index--) {
        if (currentList[index].id == id) {
            project = currentList[index]
        }
    }

    return project
}

function findIndexById(id: string) {
    const currentList = list.value
    let index = currentList.length
    let projectIndex

    while (projectIndex == undefined && index--) {
        if (currentList[index].id == id) {
            projectIndex = index
        }
    }

    return projectIndex
}

const current = Observer(
    findById(Storage.currentProject),
    {
        nextOnNew: true,
        formatter: (project: ProjectObject, observer) => {
            const id = Get(project, 'id')
            if (!id) { return Get(observer, 'value') }

            return findById(id) || Get(observer, 'value')
        }
    }
)

current.subscribe(project => Storage.currentProject = project.id)

const Projects = {
    subscribeToList: list.subscribe,
    get list() { return list.value },

    subscribeToCurrent: current.subscribe,
    get current() { return current.value },
    set current(project) { current.next(Projects.findById(Get(project, 'id', project))) },

    findById,
    findIndexById,

    newProject(name: string) {
        if (!name) { return }
        let id = ID()

        while (Projects.findById(id)) {
            id = ID()
        }

        list.insert({ name, id, updated: new Date().getTime(), created: new Date().getTime() })
        Projects.current = Projects.findById(id)
    },

    saveProject({ name = '', id = '' }) {
        if (!id || !findById(id)) { return Promise.reject('Invalid project') }
        if (!name) { return Promise.reject('Project must have a name') }

        return new Promise(resolve => {
            const project = Merge(findById(id), { name, id, updated: new Date().getTime() })
            list.insert(project, findIndexById(id))

            return resolve(project)
        })
    },

    deleteProject(id: string) {
        if (!id || !findById(id)) { return Promise.reject('Invalid project') }

        return new Promise(resolve => {
            // const index = findIndexById(id)
            // list.remove(undefined, index)

            return resolve()
        })
    }
}

export default Projects