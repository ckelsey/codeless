import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'
import '../calendar-day'
// import Create from '../../utils/dom/create'

const PagesList: ComponentArguments = {
    tag: 'pages-list',
    template: require('./index.html'),
    elements: {
        root: { selector: '.pages-list-container' },
        day: { selector: 'calendar-day' },
    },
    properties: {
        clickable: { format: Pipe(ToBool, IfInvalid(true)) }
    },
    onConnected(host) {
        requestAnimationFrame(() => {
            host.events = {
                clickable: host.state.clickable.subscribe((clickable: boolean) => {
                    const day = host.elements.day
                    const root = host.elements.root

                    /**
                     * TODO:
                     * 
                     * - requestAnimationFrame is required in order for this to have any affect
                     *  - Maybe set the initial object to have placeholder stores for when a prop is set it can then carryout stored actions
                     * 
                     * - replacing the day el causes clickable to stop working completely
                     *  - check CreateComponent timing
                     */

                    // day.clickable = clickable

                    console.log(clickable, root, day)
                    // root.removeChild(day)

                    // root.appendChild(Create({
                    //     tag: 'calendar-day',
                    //     properties: { clickable }
                    // }))


                    // host.elements.day = root.querySelector('calendar-day')
                })
            }
        })
    }
}

CreateComponent(PagesList)
export default PagesList