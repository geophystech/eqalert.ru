// Round float numbers correctly.
export function camelToUnderscore(value) {
  return value.replace(/([A-Z])/g, `_$1`).toLowerCase()
}

