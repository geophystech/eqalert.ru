export function agency(agency, long = true) {
  switch (agency) {
    case 'SAK': return long === false ? 'GPT' : 'GEOPHYSTECH LLC'
    case 'USGS': return long === false ? 'USGS' : 'USGS Earthquake Hazards Program'
    default: return 'Unknown'
  }
}

export function agencyDescription(agency) {
  switch (agency) {
    case 'SAK': return 'GEOPHYSTECH LLC'
    case 'USGS': return 'USGS Earthquake Hazards Program'
    default: return 'Unknown'
  }
}
