import Debounce from "../../../utils/timing/debounce"

const WatchValue = that => {

    if (!that) { return }

    let { value, max, min, maxlength } = that

    // has internal methods for modifying value
    if (typeof that.externalToInternal === 'function') {
        Debounce(() => that.externalToInternal(), 0)
    } else if (that.inputElement) {

        value = max === undefined || value < max ? value : max
        value = min === undefined || value > min ? value : min

        if (Object.hasOwnProperty.call(value, 'length')) {
            value = maxlength === undefined || value.length < maxlength ? value : value.slice(-maxlength)
        }

        that.inputElement.value = value
    }

    if (typeof that.handleInput === 'function') { that.handleInput() }
}

export default WatchValue