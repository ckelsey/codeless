import { RouteObject } from '../utils/routing/route-object'
import Routes from './routes'

import RemoveElement from '../utils/dom/remove-element'
import ArrayFrom from '../utils/conversion/array-from'
import Create, { CreateOptions } from '../utils/dom/create'
import Routing from '../utils/routing/routing'

import '../styles/index.scss'
import '../behaviors/tabs/tabs'
import '../components/project-list/index'

function routeContent(route: RouteObject) {
    if (route && route.content) {
        Object.keys(route.content).forEach(id => {
            const container = document.getElementById(id)

            if (container) {
                ArrayFrom(container.children).forEach(RemoveElement)

                route.content[id].forEach((options: CreateOptions) => {
                    const newElement = Create(options)
                    if (newElement) {
                        container.appendChild(newElement)
                    }
                })
            }
        })
    }
}

function App() {
    const services = {
        router: Routing(Routes)
    }

    services.router.subscribeToRoute(routeContent)

    return { services }
}

export default App