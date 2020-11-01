import Vue from 'vue'

var reposition = (el: HTMLElement, pointer: HTMLElement, marginLeft: number) => {
    el.style.marginLeft = `0px`
    el.style.marginTop = `0px`
    pointer.style.marginLeft = `0px`

    if(el.className.indexOf(`tooltip-active`) === -1){
        return
    }

    let tooltipMax = el.parentElement

    const findMax = (): HTMLElement => {
        if (!tooltipMax || tooltipMax === document.body) {
            return document.body
        }

        if (tooltipMax.hasAttribute(`tool-tip-max`)) {
            return tooltipMax
        }

        tooltipMax = tooltipMax.parentElement

        return findMax()
    }

    tooltipMax = findMax()

    if (!tooltipMax) {
        tooltipMax = window.document.body
    }

    const parentBox = tooltipMax.getBoundingClientRect()
    var box = el.getBoundingClientRect()

    if (parentBox.right - box.right < 0) {
        marginLeft = parentBox.right - box.right
        el.style.marginLeft = `${marginLeft}px`
        pointer.style.marginLeft = `${-marginLeft}px`
    }

    if (box.left - parentBox.left < 0) {
        marginLeft = box.left - parentBox.left
        el.style.marginLeft = `${-marginLeft}px`
        pointer.style.marginLeft = `${marginLeft}px`
    }

    if(box.bottom > window.innerHeight){
        el.style.marginTop = `-${box.bottom - window.innerHeight}px`
    }

    if(box.top < 50){
        el.style.marginTop = `${50 - box.top}px`
    }
}

/** Desc Renders an element as a tooltip */
const Tooltip = {
    /** @desc Attribute name */
    name: `tooltip`,

    update(el: HTMLElement, binding: any) {

        const pointer = el.querySelector(`.tooltip-pointer`) as HTMLElement

        if (!pointer) {
            return
        }

        if (!binding.value) {
            el.classList.remove(`tooltip-active`)
        }

        if (binding.value) {
            el.classList.add(`tooltip-active`)
        }

        reposition(el, pointer, 0)
    },

    /**
     * Vuejs lifecycle inserted hook
     * @param el - This element
     * @param binding - Directive bindings
     */
    inserted(el: HTMLElement, binding: any) {
        var marginLeft = 0

        // Open close the tooltip
        var toggle = () => {
            el.classList.toggle(`tooltip-active`)

            reposition(el, pointer, marginLeft)
        }

        var open = (ev: Event) => {
            const target = ev.target as HTMLElement

            if (!target) {
                return
            }

            if (el.parentElement) {
                const targetIsParent = el.parentElement === target
                const parentContainsTarget = el.parentElement.contains(target)
                const targetIsEl = el === target || el.contains(target)
                var classes = el.className
                var noCloseOnClick = classes && classes.length && classes.indexOf(`do-not-close-tooltip-on-click`) > -1 ? true : false
                var noCloseOnOuterClick = classes && classes.length && classes.indexOf(`do-not-close-tooltip-on-outer-click`) > -1 ? true : false

                if (noCloseOnOuterClick) {
                    if (targetIsParent || (parentContainsTarget && !targetIsEl)) {
                        return toggle()
                    }

                    return
                }

                if (targetIsParent || parentContainsTarget) {
                    var classes = target.className

                    if (el.classList.contains(`tooltip-active`) && noCloseOnClick) {
                        return
                    }

                    return toggle()
                }
            }

            el.classList.remove(`tooltip-active`)

            if (binding.value) {
                window.document.body.classList.remove(binding.value)
            }
        }

        // Set up the element
        el.classList.add(`tooltip`)

        if(!el.getAttribute(`position`)){
            el.setAttribute(`position`, `bottom`)
        }

        if (el.parentElement) {
            el.parentElement.style.cursor = `pointer`
            el.parentElement.style.position = `relative`
        }

        window.document.body.addEventListener(`click`, open)

        var pointer = window.document.createElement(`div`)
        pointer.classList.add(`tooltip-pointer`)
        el.appendChild(pointer)

        var observerConfig = { attributes: true, childList: true, subtree: true }
        var observer = new MutationObserver((mutations)=>{
            mutations.forEach(mutation => {                
                if(mutation.attributeName === `tooltip-update`){
                    reposition(el, pointer, marginLeft)
                }
            });
        })
        observer.observe(el, observerConfig)

        reposition(el, pointer, marginLeft)

        window.addEventListener(`resize`, () => {
            reposition(el, pointer, marginLeft)
        }, true)

        window.addEventListener(`scroll`, () => {
            reposition(el, pointer, marginLeft)
        }, true)
    }
}

export default Tooltip

Vue.directive(`tooltip`, Tooltip)