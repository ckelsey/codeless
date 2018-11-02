import Vue from 'vue'
import './drag-drop.scss'

class Service {
    dragIndex: number | null = null
    dropIndex: number | null = null
    dragGroup: string | null = null
    onReleaseSubscriptions: Function[] = []
    onRelease = () => {
        this.onReleaseSubscriptions.forEach(cb => {
            cb()
        })
    }
}

const service = new Service()

const DragDrop = {
    /** @desc Attribute name */
    name: `dragdrop`,

    /**
     * Vuejs lifecycle inserted hook
     * @param el - This element
     * @param binding - Directive bindings
     */
    inserted(el: HTMLElement, binding: any, vnode: any) {
        service.onReleaseSubscriptions.push(() => {
            document.body.classList.remove(`dragging-elements`)
            el.classList.remove(`dragover`)
            el.setAttribute(`draggable`, `false`)
        })
        
        const setDrag = (e:Event) => {
            const target = e.target as HTMLElement
            
            if(target && target.getAttribute(`draggable`) === `false`){
                return
            }

            el.setAttribute(`draggable`, `true`)
            service.dragIndex = vnode.context.dragDropIndex
            service.dragGroup = binding.value.group
        }

        const startDrag = (e: Event) => {
            document.body.classList.add(`dragging-elements`)
        }

        const drop = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()

            if(service.dragGroup && service.dragGroup !== binding.value.group){
                return
            }

            if(service.dragGroup === binding.value.group && service.dragIndex === vnode.context.dragDropIndex){
                return
            }

            binding.value.ondrop({
                dragIndex: service.dragIndex,
                dropIndex: vnode.context.dragDropIndex,
                group: service.dragGroup,
                event:e
            })
        }

        const dragover = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()

            if(service.dragGroup && service.dragGroup !== binding.value.group && service.dragGroup !== binding.value.canAddTo){
                return
            }

            if(service.dragGroup === binding.value.group && service.dragIndex === vnode.context.dragDropIndex){
                return
            }

            if(binding.value.ondragover && typeof binding.value.ondragover === `function`){
                binding.value.ondragover({
                    dragIndex: service.dragIndex,
                    dropIndex: vnode.context.dragDropIndex,
                    group: service.dragGroup,
                    event:e
                })
            }

            if (service.dragGroup !== binding.value.group || service.dragIndex !== vnode.context.dragDropIndex) {
                el.classList.add(`dragover`)
            }
        }

        const dragleave = (e: Event) => {
            if (e.preventDefault) {
                e.preventDefault();
            }

            if(binding.value.ondragout && typeof binding.value.ondragout === `function`){
                binding.value.ondragout({
                    dragIndex: service.dragIndex,
                    dropIndex: vnode.context.dragDropIndex,
                    group: service.dragGroup,
                    event:e
                })
            }

            el.classList.remove(`dragover`)
        }

        const releaseDrag = () => {
            service.onRelease()
        }

        el.addEventListener(`dragstart`, startDrag)
        el.addEventListener(`dragover`, dragover)
        el.addEventListener(`drop`, drop)
        el.addEventListener(`dragleave`, dragleave)
        el.addEventListener(`dragend`, releaseDrag)

        if(binding.value.handle){
            const handle = el.querySelector(binding.value.handle)

            if(handle){
                
                handle.addEventListener(`mousedown`, setDrag)
                handle.addEventListener(`mouseup`, releaseDrag)
                return
            }
        }else{
            el.addEventListener(`mousedown`, setDrag)
            el.addEventListener(`mouseup`, releaseDrag)
        }

        
    }
}

export default DragDrop

Vue.directive(`dragdrop`, DragDrop)