# color-inputs



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default                         |
| -------- | --------- | ----------- | ------------------- | ------------------------------- |
| `color`  | --        |             | `() => ColorResult` | `() => ColorObject(this.value)` |
| `value`  | `value`   |             | `string`            | `defaultColor`                  |


## Events

| Event                    | Description | Type               |
| ------------------------ | ----------- | ------------------ |
| `colorinputschanged`     |             | `CustomEvent<any>` |
| `colorinputsmodechanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [color-picker](../color-picker)

### Depends on

- [drop-down](../drop-down)
- [element-transition](../element-transition)
- [field-number](../field-number)
- [field-text](../field-text)

### Graph
```mermaid
graph TD;
  color-inputs --> drop-down
  color-inputs --> element-transition
  color-inputs --> field-number
  color-inputs --> field-text
  drop-down --> icon-element
  color-picker --> color-inputs
  style color-inputs fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
