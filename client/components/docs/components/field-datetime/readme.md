# field-datetime



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type              | Default     |
| -------------- | -------------- | ----------- | ----------------- | ----------- |
| `active`       | `active`       |             | `boolean`         | `false`     |
| `autocomplete` | `autocomplete` | PROPS       | `string`          | `'on'`      |
| `autofocus`    | `autofocus`    |             | `boolean`         | `false`     |
| `autowidth`    | `autowidth`    |             | `boolean`         | `false`     |
| `disabled`     | `disabled`     |             | `boolean`         | `false`     |
| `error`        | `error`        |             | `string`          | `''`        |
| `helptext`     | `helptext`     |             | `string`          | `undefined` |
| `inputid`      | `inputid`      |             | `string`          | `ID()`      |
| `label`        | `label`        |             | `string`          | `''`        |
| `labelup`      | `labelup`      |             | `boolean`         | `false`     |
| `max`          | `max`          |             | `number`          | `undefined` |
| `min`          | `min`          |             | `number`          | `undefined` |
| `name`         | `name`         |             | `string`          | `''`        |
| `nomargin`     | `nomargin`     |             | `boolean`         | `false`     |
| `required`     | `required`     |             | `boolean`         | `false`     |
| `showseconds`  | `showseconds`  |             | `boolean`         | `false`     |
| `theme`        | `theme`        |             | `"" \| "inverse"` | `''`        |
| `value`        | `value`        |             | `Date \| string`  | `undefined` |


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
- [calendar-header](../calendar-header)
- [calendar-month](../calendar-month)
- [field-time](../field-time)

### Graph
```mermaid
graph TD;
  field-datetime --> drop-down
  field-datetime --> calendar-header
  field-datetime --> calendar-month
  field-datetime --> field-time
  drop-down --> icon-element
  calendar-header --> icon-element
  calendar-month --> calendar-day
  field-time --> field-select
  field-select --> icon-element
  style field-datetime fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
