import { isArray, isEmpty as _isEmpty, isNaN as _isNaN, isNil, isObject, isString } from "lodash";

// Wraps lodash's isEmpty: works for arrays ([] -> true), objects ({} -> true),
// and strings ('' -> true). Note lodash also treats plain numbers/booleans as
// "empty" (no length/keys) — use hasValue below when scalars are involved.
export const isEmpty = (value: unknown): boolean => {
    return _isEmpty(value)
}

export const isNotEmpty = (value: unknown): boolean => {
    return !isEmpty(value)
}

// hasValue: true meaningful-value check across arrays, objects, strings, and
// scalars — null/undefined/NaN are never a value; an empty array/object/string
// isn't either; any other number or boolean counts (including 0 and false).
export const hasValue = (value: unknown): boolean => {
    if (isNil(value)) return false
    if (typeof value === 'number') return !_isNaN(value)
    if (typeof value === 'boolean') return true
    if (isArray(value) || isObject(value) || isString(value)) return !_isEmpty(value)

    return true
}
