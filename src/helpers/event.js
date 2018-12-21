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

export const EVENTS_RANGES = {
  lastDayEvents: {
    title: 'События за последние сутки',
    minDateSubtract: [1, 'days'],
    label: '< 24 ч',
    color: '#FF0000',
    limit: 500
  },
  lastWeekEvents: {
    title: 'События за последнюю неделю',
    minDateSubtract: [1, 'weeks'],
    label: '1-7 дн',
    color: '#FFA500',
    limit: 500
  },
  last2WeekEvents: {
    title: 'События за последние две недели',
    minDateSubtract: [2, 'weeks'],
    label: '7-14 дн',
    color: '#FFFF00',
    limit: 500
  },
  past3MonthsEvents: {
    title: 'События за последние 3 месяца',
    minDateSubtract: [3, 'months'],
    label: '> 14 дн',
    color: '#808080',
    limit: 500
  }
}

export function eventColor(timeDifference) {
  if (timeDifference <= 24) {
    return EVENTS_RANGES.lastDayEvents.color
  } else if (timeDifference > 24 && timeDifference <= 168) {
    return EVENTS_RANGES.lastWeekEvents.color
  } else if (timeDifference > 168 && timeDifference <= 336) {
    return EVENTS_RANGES.last2WeekEvents.color
  } else {
    return EVENTS_RANGES.past3MonthsEvents.color
  }
}

export function eventRadius(magnitude) {
  if (magnitude < 3.0) {
    return 4
  } else if (magnitude >= 3.0 && magnitude < 4.0) {
    return 6
  } else if (magnitude >= 4.0 && magnitude < 5.0) {
    return 8
  } else if (magnitude >= 5.0 && magnitude < 6.0) {
    return 12
  } else if (magnitude >= 6.0 && magnitude < 7.0) {
    return 16
  } else if (magnitude >= 7.0 && magnitude < 8.0) {
    return 21
  } else if (magnitude > 8) {
    return 26
  }
}
