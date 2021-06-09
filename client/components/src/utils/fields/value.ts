/**
 * PROPS
 * - autofocus: bool
 * - autowidth: bool
 * - disabled: bool
 * - help: string
 * - label: string
 * - name: string
 * - margin: bool
 * - required: bool
 * - theme: string
 * - value
 *
 * PROPS OPTIONAL
 * - arrow: bool                    - filter
 * - autocomplete: string|bool      - text, textarea, number, filter
 * - fullwidth: bool                - textarea
 * - kind: string                   - button
 * - max                            - text, textarea, number, time, datetime
 * - min                            - text, textarea, number, time, datetime
 * - mixed: bool                    - checkbox
 * - options: array                 - select, multiselect, radio, filter
 * - showcount: bool                - text, textarea
 * - showseconds: bool              - time, datetime
 * - size: string                   - button
 * - spinner: bool                  - button
 * - step: num                      - number, slider, range
 * - type: string                   - text, button
 * - valueinlabel: bool             - slider, range
 *
 *
 * PROPS INTERNAL
 * - active:bool                    - datetime, date
 * - count: number                  - text, textarea, filter, multiselect
 * - error: string
 * - inputid: string
 * - labelup: bool
 *
 * VALUE FLOW
 * - FROM ATTR
 *      - validate
 *          - validate type
 *          - hand off to custom validator
 *      - if not valid, trigger error and stop
 *      - set internal input
 *      - emit changed
 *
 * - FROM USER
 *
 *
 * emit event
 */