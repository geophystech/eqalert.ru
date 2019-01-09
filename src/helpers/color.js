
function lightenDarkenColor(color, amt)
{
  let usePound = false

  if (color[0] === '#') {
    color = color.slice(1)
    usePound = true
  }

  let num = parseInt(color, 16)
  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00FF) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000FF) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)

}

export function colorDarken(color, percent) {
  return lightenDarkenColor(color, percent * -1)
}

export function colorLighten(color, percent) {
  return lightenDarkenColor(color, percent)
}

export function colorHexToRGB(hex, alpha)
{
  if (hex[0] === '#') {
    hex = hex.slice(1)
  }

  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return `rgb(${r}, ${g}, ${b})`
}
