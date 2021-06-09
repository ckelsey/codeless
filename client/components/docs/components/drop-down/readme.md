# drop-down



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type      | Default |
| -------------- | -------------- | ----------- | --------- | ------- |
| `arrow`        | `arrow`        |             | `boolean` | `true`  |
| `closeonclick` | `closeonclick` |             | `boolean` | `true`  |
| `open`         | `open`         |             | `boolean` | `false` |
| `openonhover`  | `openonhover`  |             | `boolean` | `true`  |


## Events

| Event                 | Description | Type               |
| --------------------- | ----------- | ------------------ |
| `dropdownitemclicked` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [color-inputs](../color-inputs)
 - [field-color](../field-color)
 - [field-date](../field-date)
 - [field-datetime](../field-datetime)
 - [field-filter](../field-filter)
 - [field-multiselect](../field-multiselect)

### Depends on

- [icon-element](../icon-element)

### Graph
```mermaid
graph TD;
  drop-down --> icon-element
  color-inputs --> drop-down
  field-color --> drop-down
  field-date --> drop-down
  field-datetime --> drop-down
  field-filter --> drop-down
  field-multiselect --> drop-down
  style drop-down fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
