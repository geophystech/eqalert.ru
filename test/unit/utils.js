
export function mapPropDataGen(mapId)
{
  return {
    event: {
      id: `test-${mapId}-event`,
      locValues: {
        data: {
          lat: '58.651',
          lon: '142.395'
        }
      }
    },
    tab: `test-${mapId}-tab`
  }
}

