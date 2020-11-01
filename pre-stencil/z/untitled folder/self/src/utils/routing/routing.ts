import getQuery from './get-query'
import GetRouteByPath from './get-route-by-path'
import Observer, { ObserverInstance } from '../observe/observer'
import { RouteObject, RouteQuery, RouteState, RoutingResult } from './route-object'
import Get from '../objects/get'
import LinkClickObserver from './link-click-observer'
import Diff from '../objects/diff'
import UpdateHistory from './update-history'
import EventObserver from '../observe/event-observer'

function getBaseUrl() {
    return `${location.protocol}//${location.host}`
}

export default function Routing(routes: { [key: string]: RouteObject }): RoutingResult {
    const _routes = Object.assign({}, routes)
    const getRouteByPath = GetRouteByPath(_routes)
    const getDefault = () => ({
        path: location.pathname,
        query: getQuery(location.search),
        base: getBaseUrl()
    })

    const filteredQueries = (queries: RouteQuery = {}, allowedQueries: string[] = []) => {
        const result: RouteQuery = {}
        const queryKeys = Object.keys(queries)

        if (!allowedQueries.length || !queryKeys.length) { return result }

        queryKeys.forEach((key: string) => allowedQueries.indexOf(key) > -1 ? result[key] = queries[key] : undefined)

        return result
    }

    const initialRoute = getRouteByPath(`${location.pathname}${location.search}`)

    const initialDefault = getDefault()
    initialDefault.query = filteredQueries(initialDefault.query, Get(initialRoute, 'allowedQueries'))

    const initialState = Object.assign(
        {},
        initialDefault,
        initialRoute
    )

    const queryObserver = Observer(initialState.query, { matchType: true, nextOnNew: true })

    const state = Observer(
        initialState,
        {
            matchType: true,
            nextOnNew: true,
            formatter: (route: string | RouteState, obs: ObserverInstance | undefined): RouteState => {
                const current = Get(obs, 'value', initialState)
                const routeAsString = typeof route !== 'string' ? '' : route.split('?')[0].split('/').filter(v => !!v).join('/')
                const path = Get(route, 'path', routeAsString, (r: any) => typeof r == 'string' ? r : undefined)

                if (!path) { return current }

                const _route = getRouteByPath(path)

                if (!_route) { return current }

                const query = Get(route, 'query', typeof route == 'string' ? getQuery(route as string) : {})
                current.query = filteredQueries(query, Get(_route, 'allowedQueries'))

                const queryDifference = Diff(queryObserver.value, current.query)

                if (Object.keys(queryDifference).length) {
                    queryObserver.next(current.query)
                }

                const result = Object.assign({}, current, _route)

                UpdateHistory(result.path, result.query, current.path === result.path)

                return result
            }
        }
    )

    LinkClickObserver.subscribe(link => state.next(`${link.path}${link.search || ''}`))

    const popstateObserver = EventObserver(window, 'popstate')

    if (popstateObserver) {
        popstateObserver.subscribe(() => {
            console.log('popstateObserver', location.pathname, location.search)
            state.next(`${location.pathname}${location.search}`)
        })
    }

    return {
        routes: _routes,

        subscribeToRoute: function (next, error, complete) { return state.subscribe(next, error, complete) },
        subscribeToQuery: function (next, error, complete) { return queryObserver.subscribe(next, error, complete) },

        get current() {
            return state.value
        },

        set current(current) {
            state.next(current)
        },

        get query() {
            return Get(state, 'current.query', {})
        },

        set query(query) {
            state.next(Object.assign({}, state.value, { query: Object.assign({}, Get(state, 'value.query'), query) }))
        },

        get lastState() {
            return state.previous
        }
    }
}