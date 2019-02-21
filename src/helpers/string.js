
export function camelToUnderscore(value) {
  return value.replace(/([A-Z])/g, (a, s) => `_${s.toLowerCase()}`)
}

export function camelCase(value) {
  return value.toLowerCase().replace(/_([a-z])/g, (a, s) => s.toUpperCase())
}
