
export function camelToUnderscore(value) {
  return value.replace(/([A-Z])/g, (a, s) => `_${s.toLowerCase()}`)
}

export function camelCase(value, sep = '_') {
  return value.toLowerCase().replace(new RegExp(`${sep}([a-z])`, 'g'), (a, s) => s.toUpperCase())
}
