import ID from '../id'
import Type from '../types/type'
import Equals from '../checks/equals'
import Debounce from '../timing/debounce'
import Get from '../objects/get'
import Diff from '../objects/diff'

const emptyNext = (_value: any, _force?: boolean) => { }
const emptyError = (_value: any) => { }
const emptyFn = () => { }
export const SubscribeFn = (_next: typeof emptyNext, _error?: typeof emptyError, _complete?: typeof emptyFn) => emptyFn
const emptyUnsubscribe = (_subscription: ObserverSubscription) => { }

export interface ObserverSubscription {
    next: typeof emptyNext
    error?: typeof emptyError
    complete?: typeof emptyFn
    unsubscribe?: Function
    id: string
}

export interface ObserverOptions {
    noInit?: boolean
    nextOnNew?: boolean
    noSubsComplete?: boolean
    matchType?: boolean
    takeFirst?: boolean
    takeLast?: boolean
    onSubscribe?: (subscription?: ObserverSubscription) => void
    formatter?: (toFormat: any, observer?: ObserverInstance) => any
    initialValue?: any
}

export interface ObserverValuesObject {
    errors: string[]
    updated: number
    subscriptions: { [key: string]: ObserverSubscription }
    isComplete: boolean
    eventCallbacks: { [key: string]: { [key: string]: Function } }
    initialType: string
    initialValue: any
    formatter: Function
    matchType: boolean
    nextOnNew: boolean
    noInit: boolean
    noSubsComplete: boolean
    takeFirst: boolean
    takeLast: boolean
    value: any
    previousValue: any
}

export interface ObserverInstance {
    isComplete: boolean
    value: any
    previous: any
    subscriptions: { [key: string]: ObserverSubscription }
    lastUpdate: number
    settings: ObserverOptions
    removed: any[]
    added: any[]
    changed: { [key: string]: any }
    next: typeof emptyNext
    error: typeof emptyError
    complete: typeof emptyFn
    subscribe: typeof SubscribeFn
    unsubscribe: typeof emptyUnsubscribe
    insert: (element: any, index?: number) => void
    insertAll: (elements: any, index?: number) => void
    remove: (element: any, index: any, all?: boolean) => void
    removeElements: (elements: any[]) => void
    reverse: typeof emptyFn
    has: (value: any) => boolean
    indexOf: (value: any) => number
    on: (name: string, callback: Function) => Function
    trigger: (name: string, data: any) => void
    runNext: () => ObserverValuesObject
    merge: (observers: ObserverInstance[]) => void
}

export default function Observer(initialValue?: any, options: ObserverOptions = {}) {
    const noInit = options.noInit ? true : false
    const nextOnNew = options.nextOnNew ? true : false
    const noSubsComplete = options.noSubsComplete === true ? true : false
    const matchType = options.matchType ? true : false
    const onSubscribe = options.onSubscribe && typeof options.onSubscribe === 'function' ? options.onSubscribe : (val: any) => val
    const formatter = options.formatter && typeof options.formatter === 'function' ? options.formatter : (val: any) => val
    const initialType = Type(formatter(initialValue))
    const takeFirst = !!options.takeFirst
    const takeLast = !!options.takeLast
    const debounced = !!takeFirst || !!takeLast

    const formatValue = (toFormat: any, obs: any = {}) => {
        const f = formatter(toFormat, obs)
        return matchType && Type(f) != initialType ? values.value : f
    }

    const states = [formatValue(initialValue)]

    const values: ObserverValuesObject = {
        errors: [],
        updated: new Date().getTime(),
        subscriptions: {},
        isComplete: false,
        initialType,
        initialValue,
        eventCallbacks: {},
        formatter,
        matchType,
        nextOnNew,
        noInit,
        noSubsComplete,
        takeFirst,
        takeLast,
        value: null,
        previousValue: null
    }

    Object.defineProperties(values, {
        value: {
            get() {
                return states[0]
            },
            set(v) {
                states.unshift(v)
                while (states.length > 2) { states.pop() }
            }
        },
        previousValue: {
            get() {
                return states[1]
            }
        }
    })

    const addedRemovedReducer = (source: any[]) => (target: any[], current: any) => {
        if (source.indexOf(current) === -1) { target.push(current) }
        return target
    }

    const bothArray = (source: any, target: any) => Array.isArray(source) && Array.isArray(target)

    const getAddedRemoved = (source: any[], target: any[]) => !bothArray(source, target) ? [] : source.reduce(addedRemovedReducer(target), [])

    const getRemoved = () => values ? getAddedRemoved(values.previousValue, values.value) : []

    const getAdded = () => values ? getAddedRemoved(values.value, values.previousValue) : []

    function destroy() {
        if (!result) { return }
        result.trigger('destroy', values)

        Object.keys(values.subscriptions).forEach(k => Get(values, `subscriptions.${k}.unsubscribe`, emptyFn))

        Object.defineProperties(result, {
            value: { get: function () { return undefined } },
            previous: { get: function () { return undefined } },
            subscriptions: { get: function () { return undefined } },
            next: { value: emptyFn },
            error: { value: emptyFn },
            complete: { value: emptyFn },
            subscribe: { value: emptyFn },
            unsubscribe: { value: emptyFn },
            insert: { value: emptyFn },
            insertAll: { value: emptyFn },
            remove: { value: emptyFn },
            removeElements: { value: emptyFn },
            has: { value: emptyFn },
            indexOf: { value: emptyFn },
            reverse: { value: emptyFn },
            on: { value: emptyFn },
            trigger: { value: emptyFn },
        })

        values.eventCallbacks = {}
        values.isComplete = true
    }

    const callFn = (
        val: any,
        valuesObj: ObserverValuesObject | undefined,
        functionKey: string,
        subscriptions: { [key: string]: ObserverSubscription }
    ) =>
        (id: string) => {
            const fn = Get(subscriptions, `${id}.${functionKey}`)
            typeof fn === 'function' ? fn(val, valuesObj || {}, id) : undefined
        }

    const doLoop = (functionKey: string, val: any, valuesObj?: ObserverValuesObject) => {
        if (result) { result.trigger(functionKey, valuesObj || {}) }
        Object.keys(values.subscriptions).forEach(callFn(val, valuesObj, functionKey, values.subscriptions))
        if (functionKey === 'complete') { destroy() }
    }

    const debouncedLoop = Debounce(doLoop, 1000, !!takeFirst)
    const loop = !debounced ? doLoop : debouncedLoop

    function unsubscribe(subscription: ObserverSubscription) {
        return function unsubscribeInner() {
            delete values.subscriptions[subscription.id]

            if (result) {
                result.trigger('unsubscribe', { subscription, subscriptions: values.subscriptions })
            }

            if (noSubsComplete && Object.keys(values.subscriptions).length === 0) {
                destroy()
            }
        }
    }

    function getArrayIndexOf(element: any, isArray: boolean) {
        if (!isArray) { return }
        const index = values.value.indexOf(element)
        return index > -1 ? index : undefined
    }

    function getObjectKey(value: any) {
        let _result

        const keys = Object.keys(values.value)
        let i = keys.length

        while (i--) {
            if (value === values.value[keys[i]]) {
                _result = keys[i]
                break
            }
        }

        return _result
    }

    let result: ObserverInstance = {
        get isComplete() { return values.isComplete },
        get value() { return values.value },
        get previous() { return values.previousValue },
        get subscriptions() { return values.subscriptions },
        get lastUpdate() { return values.updated },
        get settings() {
            return {
                initialType,
                formatter,
                matchType,
                nextOnNew,
                noInit,
                takeFirst,
                takeLast
            }
        },

        get removed() { return getRemoved() },

        get added() { return getAdded() },

        get changed() {
            return Diff(values.previousValue, values.value)
        },

        next: function (v: any, force?: boolean) {
            const formatted = formatValue(v, result)

            if (!force && nextOnNew && Equals(formatted, values.value)) { return }

            values.value = formatted
            values.updated = new Date().getTime()

            loop('next', values.value, values)
            return values
        },

        error: function (err: string) {
            values.errors = values.errors.concat([err])
            values.updated = new Date().getTime()

            loop('error', err, values)

            result.complete()
        },

        complete: function () { loop('complete', values) },

        subscribe: function (next: (value: any, force?: boolean) => void, error = (_err: string) => { }, complete = emptyFn) {
            const subscription: ObserverSubscription = Object.assign({}, {
                next: next,
                error: error,
                complete: complete,
                id: ID()
            })

            subscription.unsubscribe = unsubscribe(subscription)
            values.subscriptions[subscription.id] = subscription

            if (!noInit && values.value !== undefined && typeof subscription.next === 'function') {
                subscription.next(values.value)
            }

            onSubscribe(subscription)

            return unsubscribe(subscription)
        },

        unsubscribe: function (subscription: ObserverSubscription) {
            if (!subscription || !subscription.id || !values.subscriptions[subscription.id]) { return }

            return unsubscribe(subscription)
        },

        insert: function (element: any, index: number = values.value.length) {
            if (Array.isArray(values.value)) {
                (values.value as any[]).splice(index, 0, element)
                return result.next(values.value, true)
            }

            if (typeof values.value === 'string') {
                values.value = values.value.slice(0, index) + element + values.value.slice(index)
                return result.next(values.value, true)
            }

            values.value[index] = element

            return result.next(values.value, true)
        },

        insertAll: function (elements: any[] | { [key: string]: any }, index: number = values.value.length) {
            if (index === undefined) {
                index = values.value.length
            }

            if (Array.isArray(values.value)) {
                if (!Array.isArray(elements)) { return }
                values.value.splice.apply(values.value, [index, 0, ...elements])
                return result.next(values.value, true)
            }

            const elementsObject = elements as { [key: string]: any }

            Object.keys(elementsObject).forEach(elementKey => values.value[elementKey] = elementsObject[elementKey])

            return result.next(values.value, true)
        },

        remove: function (element: any, index: any, all = false) {
            const isArray = Array.isArray(values.value)
            const isString = typeof values.value === 'string'

            if (index === undefined) {
                index = getArrayIndexOf(element, isArray)
            }

            if (index === undefined && isArray) {
                return values.value
            }

            if (index === undefined && isString) {
                return result.next(values.value.replace(new RegExp(element, all ? 'gm' : ''), ''), true)
            }

            if (index !== undefined) {
                if (isArray) {
                    values.value.splice(index, 1)
                } else if (isString) {
                    values.value = values.value.slice(0, index)
                } else {
                    values.value[index] = undefined
                    delete values.value[index]
                }

                return result.next(values.value, true)
            }

            const objectKey = getObjectKey(element)

            if (objectKey !== undefined) {
                values.value[objectKey] = null
                delete values.value[objectKey]
                return result.next(values.value, true)
            }

            return result.next(values.value, true)
        },

        removeElements: function (elements: any[]) {
            if (Array.isArray(values.value)) {

                for (let i = 0; i < elements.length; i = i + 1) {
                    const index = values.value.indexOf(elements[i])
                    if (index > -1) {
                        values.value.splice(index, 1)
                    }
                }

                return result.next(values.value, true)
            }

            Object.keys(elements).forEach(prop => delete values.value[prop])

            return result.next(values.value, true)
        },

        reverse: function () {
            const isArray = Array.isArray(values.value)
            const isString = typeof values.value === 'string'

            if (isArray) {
                return result.next(values.value.reverse(), true)
            }

            if (isString) {
                return result.next(values.value.split('').reverse(), true)
            }

            result.next(values.value, true)
        },

        has: function (value: any) {
            const isArray = Array.isArray(values.value)
            const isString = typeof values.value === 'string'

            if (isArray) {
                return getArrayIndexOf(value, isArray) || false
            }

            if (isString) {
                return values.value.indexOf(value) > -1
            }

            const objectKey = getObjectKey(value)

            if (objectKey !== undefined) {
                return true
            }

            return false
        },

        indexOf: function (value: any) {
            const isArray = Array.isArray(values.value)
            const isString = typeof values.value === 'string'

            if (isArray) {
                return getArrayIndexOf(value, isArray) || -1
            }

            if (isString) {
                return values.value.indexOf(value)
            }

            return getObjectKey(value) || -1
        },

        on: function (name: string, callback: Function) {
            if (!values.eventCallbacks[name]) {
                values.eventCallbacks[name] = {}
            }

            const id = ID()
            values.eventCallbacks[name][id] = callback

            return () => delete values.eventCallbacks[name][id]
        },

        trigger: function (name: string, data: any) {
            if (!values.eventCallbacks[name]) { return }
            Object.keys(values.eventCallbacks[name]).forEach(prop => values.eventCallbacks[name][prop](data))
        },

        runNext() {
            loop('next', values.value, values)
            return values
        },

        merge(observers: typeof result[]): ObserverInstance {
            const observer = Observer(values.value, options)
            const subscriptions: Function[] = []
            const observerSubscribe = (_observer: ObserverInstance) => subscriptions.push(_observer.subscribe(_observer.next, _observer.error, _observer.complete))
            observer.on('complete', () => subscriptions.forEach(unsubscribe => unsubscribe()))
            observers.forEach(observerSubscribe)
            return observer
        }
    }

    return result
}
