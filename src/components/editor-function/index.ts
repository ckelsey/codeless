import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToString from '../../utils/conversion/to-string'
import ToObject from '../../utils/conversion/to-object'
import IfInvalid from '../../utils/checks/if-invalid'
import API from '../../services/api'
import Get from '../../utils/objects/get'
import '../field-text'


const EditorFunction: ComponentArguments = {
    tag: 'editor-function',
    template: require('./index.html'),
    properties: {
        fn: {
            format: Pipe(ToString, IfInvalid('')),
            onChange(fn, host) {
                if (!fn) {
                    // host.elements.name.value = ''
                    return
                }

                API(`/ast?fn=${encodeURIComponent(fn)}`)
                    .then(res => {
                        host.ast = Get(res, 'result.program.body.0')

                        // if (!body) {
                        //     host.fn = undefined
                        // }

                        // console.log('body', body, Get(body, 'id.name'))

                        // host.elements.name.value = Get(body, 'id.name')

                        // const args = Get(body, 'params')
                        // console.log('args', args)
                    })
                    .catch(console.error)

                // host.elements.name.value = fn.name



                // const argsLength = fn.length
                // console.log(argsLength)
            }
        },
        ast: {
            /** Check for type: "FunctionDeclaration" */
            format: Pipe(ToObject, IfInvalid({})),
            onChange(ast) {
                console.log(ast)
            }
        }
    },
    elements: {
        name: {
            selector: 'field-text[name="name"]',
            onChange(el, host) {
                el.events = {
                    name: host.state.ast.subscribe((ast: any) => {
                        el.value = Get(ast, 'id.name')
                    })
                }
            }
        },

        addArgumentBtn: {
            selector: '.add-argument-btn',

        }
    }
}

CreateComponent(EditorFunction)
export default EditorFunction