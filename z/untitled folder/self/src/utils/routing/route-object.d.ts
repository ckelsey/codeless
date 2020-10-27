
import { CreateOptions } from '../dom/create'
import { SubscribeFn } from '../observe/observer'

export interface RouteObject {
    path: string
    content: { [key: string]: [CreateOptions] }
    title: string
    allowedQueries?: string[]
}

export interface RouteState extends RouteObject {
    base: string
    query: RouteQuery
}

export interface RouteQuery {
    [key: string]: string
}

export interface RoutingResult {
    routes: { [key: string]: RouteObject }
    query: RouteQuery
    current: RouteState
    lastState: RouteState
    subscribeToRoute: typeof SubscribeFn
    subscribeToQuery: typeof SubscribeFn
}