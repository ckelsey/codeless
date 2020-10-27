import { RouteObject } from '../utils/routing/route-object'
import Routes from './routes'

import RemoveElement from '../utils/dom/remove-element'
import ArrayFrom from '../utils/conversion/array-from'
import Create, { CreateOptions } from '../utils/dom/create'
import Routing from '../utils/routing/routing'

import '../styles/index.scss'
import '../behaviors/tabs/tabs'
import '../components/project-list'
import '../components/project-settings'
import '../components/component-settings'
import '../components/service-settings'
import '../components/services-list'

function routeContent(route: RouteObject) {
    if (!route) { return }

    if (route.content) {
        Object.keys(route.content).forEach(id => {
            const container = document.getElementById(id)

            if (!container) { return }

            ArrayFrom(container.children).forEach(RemoveElement)

            if (!route.content) { return }

            route.content[id].forEach((options: CreateOptions) => {
                const newElement = Create(options)
                if (newElement) {
                    container.appendChild(newElement)
                }
            })
        })
    }

    ArrayFrom(document.body.querySelectorAll('#top-section a'))
        .forEach(link =>
            link.classList[route.path == link.pathname.slice(1) ? 'add' : 'remove']('active')
        )
}

function App() {
    const services = {
        router: Routing(Routes)
    }

    services.router.subscribeToRoute(routeContent)

    return { services }
}

export default App