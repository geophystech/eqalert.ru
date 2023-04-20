// Declension of numbers for russian language
// Usage: numberDeclension(value, ['one', 'two', 'five'])
// Example: numberDeclension(7, ['балл', 'балла', 'баллов'])
export function numberDeclension(n, titles) {
  n = Math.round(n)
  let title = 2

  if (n === 1) {
    title = 0
  } else if ([2, 3, 4].includes(n)) {
    title = 1
  } else if (!Number.isInteger(n)) {
    title = 1
  }

  return titles[title]
}
