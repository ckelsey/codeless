/**
 * TODO
 * make json field for default value
 * parameter defaultValue = ["a"] is written as string instead of an array
 */
import { Component, h, Prop } from '@stencil/core'
import FunctionReader from '../../../../utils/ast/function-reader'
import RemoveElement from '../../../../utils/dom/remove-element'
// import Get from '../../../../utils/objects/get'
// import Equals from '../../../../utils/checks/equals'

// const actions = ['', 'set', 'call', 'return']
// const operators = ['', '+', '-', '*', '/', '%']

// function getSubjects(parameters = []) { return ['', 'this', 'window'].concat(parameters.map(param => param.name)) }



// get string() {
//     const fnString = `function ${this.name}(${parametersToString(this.parameters)}){ ${this.body.map(statement => statement.action === 'set' ? setToString(statement) : '')} }`
//     return fnString
// }

// addParameter(name?, defaultValue?) {
//     this.parameters = this.parameters.concat([{ name, defaultValue }])
// }

// addBody(action?) {
//     this.body = this.body.concat([{ action }])
// }

// updateFromValue(value) {
//     // this.ast = FunctionReader(value)

//     // const name = Get(this.ast, 'function.name', 'anonymous')
//     // if (name !== this.name) { this.name = name }

//     // const params = Get(this.ast, 'function.parameters', [])
//     // if (!Equals(params, this.parameters)) { this.parameters = params }

//     // const body = Get(this.ast, 'function.body', [])
//     // if (!Equals(body, this.body)) { this.body = body }
// }

// updateFromProperty() {
//     this.value = this.string
// }

// updateProperty(object, property, newValue) {
//     object[property] = Get(newValue, 'detail.value', newValue)
//     this.updateFromProperty()
// }

//         {/* {
//     this.body.map(statement =>
//         <div class="form-row vcenter">
//             <field-select label="Action" value={statement.action} options={actions} autowidth={true} onChanged={e => this.updateProperty(statement, 'action', e)}></field-select>
//             <field-filter label="Subject" value={statement.subject} options={this.getSubjects()} autowidth={true} onChanged={e => this.updateProperty(statement, 'subject', e)} autocomplete="off"></field-filter>
//             <span>=</span>
//             {
//                 !statement.value ? '' : statement.value.map(value =>
//                     <field-filter label={value.kind} value={value.value} options={value.kind === 'operator' ? operators : this.getSubjects()} autowidth={true} onChanged={e => this.updateProperty(value, 'value', e)} autocomplete="off"></field-filter>
//                 )
//             }
//         </div>
//     )
// } */}

// {/* {
//                 this.parameters.map(param =>
//                     <div class="form-row vcenter">
//                         <field-text value={param.name} label="Name" autowidth={true} onChanged={e => this.updateProperty(param, 'name', e)} helptext={!param.type ? '' : `(${param.type})`}></field-text>
//                         <field-text value={param.defaultValue} label="Default" autowidth={true} onChanged={e => this.updateProperty(param, 'defaultValue', e)}></field-text>
//                     </div>
//                 )
//             } */}

@Component({
    tag: 'function-builder',
    styleUrl: 'style.scss',
    shadow: true
})

export class FunctionBuilder {
    /** PROPS */
    @Prop() context: any

    @Prop({ mutable: true }) value: string = ''

    nameElement!: HTMLFieldTextElement
    addParamBtn!: HTMLFieldButtonElement
    addStatementBtn!: HTMLFieldButtonElement
    parameterElement!: HTMLElement
    statementElement!: HTMLElement

    updateFromString(code: string) {
        const ast = FunctionReader(code)
        console.log(ast)

        this.nameElement.value = ast.name

        const existingParamRowElements = Array.from(this.parameterElement.children) as HTMLElement[]
        const params = [].concat(ast.parameters)

        while (existingParamRowElements.length > ast.parameters.length) {
            RemoveElement(existingParamRowElements.pop())
        }

        while (params.length) {
            const index = ast.parameters.length - params.length
            const param = params.shift()
            console.log(index, param)
        }

        console.log(existingParamRowElements)
    }

    componentDidLoad() {
        this.updateFromString(this.value)
    }

    render() {
        return <div class="function-builder-container">
            <field-text label="Name" ref={el => this.nameElement = el as any}></field-text>

            <div class="form-section">
                <h4>
                    <span class="mright-1">Parameters</span>
                    <field-button size="medium" nomargin={true} ref={el => this.addParamBtn = el}>+</field-button>
                </h4>
                <div ref={el => this.parameterElement = el}></div>
            </div>

            <div class="form-section">
                <h4>
                    <span class="mright-1">Body</span>
                    <field-button size="medium" nomargin={true} ref={el => this.addStatementBtn = el}>+</field-button>
                </h4>
                <div ref={el => this.statementElement = el}></div>
            </div>

            <div class="form-section">
                <h4>Code</h4>
                <div class="code-section">
                    <pre><code>{this.value}</code></pre>
                </div>
            </div>
        </div>
    }
}
