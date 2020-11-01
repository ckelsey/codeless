import Get from "../utils/objects/get"
import { RouteObject } from "../utils/routing/route-object"
import Projects from "./projects"

const Routes: { [key: string]: RouteObject } = {
    projects: {
        path: 'projects',
        title: 'Projects',
        content: {
            'left-section': [{
                tag: 'projects-list',
                evaluatedProperties: {
                    list: () => Projects.list
                },
                events: {
                    projectselected: (e: Event) => {
                        const target = e.target
                        const id = Get(target, 'id')
                        console.log(target)

                        if (!id) { return }

                        Projects.current = Projects.findById(id)
                    }
                }
            }]
        },
    },
    pages: {
        path: 'pages',
        title: 'Pages',
        content: {},
    }
}

export default Routes