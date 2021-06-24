# alpha-slider



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default                                                                                              |
| -------- | --------- | ----------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| `color`  | --        |             | `() => ColorResult` | `() => ColorObject(`hsla(${this.hue} deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`)` |
| `value`  | `value`   |             | `string`            | `''`                                                                                                 |


## Events

| Event              | Description | Type               |
| ------------------ | ----------- | ------------------ |
| `alphasliderinput` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [color-picker](../color-picker)

### Depends on

- [slider-bar](../slider-bar)

### Graph
```mermaid
graph TD;
  alpha-slider --> slider-bar
  color-picker --> alpha-slider
  style alpha-slider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
