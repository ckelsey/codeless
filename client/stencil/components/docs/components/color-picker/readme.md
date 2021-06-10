# color-picker



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default                         |
| -------- | --------- | ----------- | ------------------- | ------------------------------- |
| `color`  | --        |             | `() => ColorResult` | `() => ColorObject(this.value)` |
| `value`  | `value`   |             | `string`            | `''`                            |


## Events

| Event                | Description | Type               |
| -------------------- | ----------- | ------------------ |
| `colorpickerchanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [field-color](../field-color)

### Depends on

- [color-wheel](../color-wheel)
- [background-fill](../background-fill)
- [eye-dropper](../eye-dropper)
- [saturation-slider](../saturation-slider)
- [alpha-slider](../alpha-slider)
- [color-inputs](../color-inputs)

### Graph
```mermaid
graph TD;
  color-picker --> color-wheel
  color-picker --> background-fill
  color-picker --> eye-dropper
  color-picker --> saturation-slider
  color-picker --> alpha-slider
  color-picker --> color-inputs
  eye-dropper --> icon-element
  saturation-slider --> slider-bar
  alpha-slider --> slider-bar
  color-inputs --> drop-down
  color-inputs --> element-transition
  color-inputs --> field-number
  color-inputs --> field-text
  drop-down --> icon-element
  field-color --> color-picker
  style color-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
