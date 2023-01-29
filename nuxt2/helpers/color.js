function lightenDarkenColor(hex, lum)
{
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if(hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  lum = lum || 0
  let rgb = '#'

  for(let i = 0; i < 3; i++) {
    let c = parseInt(hex.substring(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
    rgb += ('00' + c).substring(c.length)
  }

  return rgb

}

export function colorDarken(color, percent)
{
  return lightenDarkenColor(color, percent / 100 * -1)
}

export function colorLighten(color, percent)
{
  return lightenDarkenColor(color, percent / 100)
}

export function colorHexToRGB(hex, alpha)
{
  if(hex[0] === '#')
  {
    hex = hex.slice(1)
  }

  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)

  if(alpha)
  {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return `rgb(${r}, ${g}, ${b})`
}
