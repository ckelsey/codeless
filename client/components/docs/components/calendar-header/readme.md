# calendar-header



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type             | Default      |
| -------- | --------- | ----------- | ---------------- | ------------ |
| `date`   | `date`    | PROPS       | `Date \| string` | `new Date()` |


## Events

| Event        | Description | Type               |
| ------------ | ----------- | ------------------ |
| `datechange` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [field-date](../field-date)
 - [field-datetime](../field-datetime)

### Depends on

- [icon-element](../icon-element)

### Graph
```mermaid
graph TD;
  calendar-header --> icon-element
  field-date --> calendar-header
  field-datetime --> calendar-header
  style calendar-header fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
