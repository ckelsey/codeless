import { RouteObject } from "../utils/routing/route-object"

const Routes: { [key: string]: RouteObject } = {
    home: {
        path: '',
        title: 'Projects',
        redirect: 'projects',
    },
    projects: {
        path: 'projects',
        title: 'Projects',
        content: {
            'left-section': [{ tag: 'projects-list' }],
            'right-section': [{ tag: 'project-settings' }]
        },
    },
    pages: {
        path: 'pages',
        title: 'Pages',
        content: {
            'left-section': [],
            'right-section': []
        },
    },
    components: {
        path: 'components',
        title: 'Components',
        content: {
            'left-section': [],
            'right-section': [{
                tag: 'component-settings'
            }]
        }
    },
    services: {
        path: 'services',
        title: 'Services',
        content: {
            'left-section': [{
                tag: 'services-list'
            }],
            'right-section': [{
                tag: 'service-settings'
            }]
        },
    }
}

export default Routes