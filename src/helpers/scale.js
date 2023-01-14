// temp solution due to `leaflet-src.js` lines: 7554 & 7567
export function translateScale() {
  setInterval(() => {
    const items = document.querySelectorAll('.map .leaflet-control-scale-line')
    items.forEach((item, i) => {
      if (item.innerText.includes('km')) {
        item.innerText = item.innerText.toString().replace('km', 'км')
      } else if (item.innerText.includes('mi')) {
        item.innerText = item.innerText.toString().replace('mi', 'миль')
      }
    })
  }, 100)
}
