# color-wheel



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default                                                                                              |
| -------- | --------- | ----------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| `color`  | --        |             | `() => ColorResult` | `() => ColorObject(`hsla(${this.hue} deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`)` |
| `value`  | `value`   |             | `string`            | `''`                                                                                                 |


## Events

| Event               | Description | Type               |
| ------------------- | ----------- | ------------------ |
| `colorwheelchanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [color-picker](../color-picker)

### Graph
```mermaid
graph TD;
  color-picker --> color-wheel
  style color-wheel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
