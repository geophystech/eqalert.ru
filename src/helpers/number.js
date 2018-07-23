// Declension of numbers for russian language
// Usage: numberDeclension(value, ['one', 'two', 'five'])
// Example: numberDeclension(7, ['балл', 'балла', 'баллов'])
export function numberDeclension(n, titles) {
  let title = 2

  if (n % 10 === 1 && n % 100 !== 11) {
    title = 0
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    title = 1
  }

  return titles[title]
}
