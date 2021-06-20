# field-range



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type              | Default     |
| -------------- | -------------- | ----------- | ----------------- | ----------- |
| `autowidth`    | `autowidth`    | PROPS       | `boolean`         | `false`     |
| `disabled`     | `disabled`     |             | `boolean`         | `false`     |
| `error`        | `error`        |             | `string`          | `''`        |
| `helptext`     | `helptext`     |             | `string`          | `undefined` |
| `inputid`      | `inputid`      |             | `string`          | `ID()`      |
| `label`        | `label`        |             | `string`          | `''`        |
| `maxvalue`     | `maxvalue`     |             | `number`          | `100`       |
| `minvalue`     | `minvalue`     |             | `number`          | `0`         |
| `name`         | `name`         |             | `string`          | `''`        |
| `nomargin`     | `nomargin`     |             | `boolean`         | `false`     |
| `required`     | `required`     |             | `boolean`         | `false`     |
| `step`         | `step`         |             | `number`          | `0.01`      |
| `theme`        | `theme`        |             | `"" \| "inverse"` | `''`        |
| `value`        | `value`        |             | `string`          | `undefined` |
| `valueinlabel` | `valueinlabel` |             | `boolean`         | `true`      |


## Events

| Event     | Description | Type               |
| --------- | ----------- | ------------------ |
| `changed` |             | `CustomEvent<any>` |


## Methods

### `getInternal() => Promise<[number, number]>`



#### Returns

Type: `Promise<[number, number]>`




## Dependencies

### Depends on

- [icon-element](../icon-element)

### Graph
```mermaid
graph TD;
  field-range --> icon-element
  style field-range fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
