import ID from '../utils/id'
// import Get from '../utils/objects/get'
// import Observer from '../utils/observe/observer'
// import Storage from './storage'

export interface ProjectObject {
    name: string
    id: string
}

const Project: ProjectObject = {
    name: 'test',
    id: '1234'
}

// const list = Observer(
//     Storage.projects,
//     {
//         matchType: true,
//         nextOnNew: true,
//         formatter: (projects: ProjectObject[], observer) => {
//             console.log('projects', projects)
//             const result: ProjectObject[] = []
//             projects.forEach(project => project.name && project.id ? result.push(project) : undefined)
//             return result
//         }
//     }
// )

// list.subscribe(projects => Storage.projects = projects)


// const current = Observer(
//     undefined,
//     {
//         nextOnNew: true,
//         formatter: (project: ProjectObject, observer) => {
//             const id = Get(project, 'id')
//             if (!id) { return Get(observer, 'value') }

//             return Projects.findById(id) || Get(observer, 'value')
//         }
//     }
// )

// const Projects = {
//     get list() { return list.value },

//     get current() { return current.value },
//     set current(project) { current.next(project) },

//     findById(id: string) {
//         const currentList = list.value
//         let index = currentList.length
//         let project

//         while (!project && index--) {
//             if (currentList[index].id == id) {
//                 project = currentList[index]
//             }
//         }

//         return project
//     },

//     newProject(name: string) {
//         if (!name) { return }
//         let id = ID()

//         while (Projects.findById(id)) {
//             id = ID()
//         }

//         list.insert({ name, id })
//         Projects.current = Projects.findById(id)
//     }
// }

export default Project