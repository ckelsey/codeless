# field-color



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type              | Default     |
| -------------- | -------------- | ----------- | ----------------- | ----------- |
| `autocomplete` | `autocomplete` | PROPS       | `string`          | `'on'`      |
| `autofocus`    | `autofocus`    |             | `boolean`         | `false`     |
| `autowidth`    | `autowidth`    |             | `boolean`         | `false`     |
| `disabled`     | `disabled`     |             | `boolean`         | `false`     |
| `error`        | `error`        |             | `string`          | `''`        |
| `helptext`     | `helptext`     |             | `string`          | `undefined` |
| `inputid`      | `inputid`      |             | `string`          | `ID()`      |
| `label`        | `label`        |             | `string`          | `''`        |
| `labelup`      | `labelup`      |             | `boolean`         | `false`     |
| `name`         | `name`         |             | `string`          | `''`        |
| `nomargin`     | `nomargin`     |             | `boolean`         | `false`     |
| `required`     | `required`     |             | `boolean`         | `false`     |
| `theme`        | `theme`        |             | `"" \| "inverse"` | `''`        |
| `value`        | `value`        |             | `string`          | `''`        |


## Events

| Event     | Description | Type               |
| --------- | ----------- | ------------------ |
| `changed` |             | `CustomEvent<any>` |


## Methods

### `getValidationMessage() => Promise<string>`



#### Returns

Type: `Promise<string>`



### `getValidity() => Promise<ValidityState>`

METHODS

#### Returns

Type: `Promise<ValidityState>`




## Dependencies

### Depends on

- [drop-down](../drop-down)
- [color-picker](../color-picker)

### Graph
```mermaid
graph TD;
  field-color --> drop-down
  field-color --> color-picker
  drop-down --> icon-element
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
  style field-color fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
