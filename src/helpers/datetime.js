import moment from 'moment'

/**
 *
 * @param dt1
 * @param dt2
 * @return {{years, months, days, hours, minutes, seconds}}
 */
export function dateTimeDiff(dt1, dt2)
{
  if(!(dt1 instanceof moment)) {
    dt1 = moment(dt1)
  }

  if(!(dt2 instanceof moment)) {
    dt2 = moment(dt2)
  }

  let duration = moment.duration(dt1.diff(dt2))
  let diff = {}

  diff.years = duration.years()
  duration.subtract(moment.duration(diff.years, 'years'))

  diff.months = duration.months()
  duration.subtract(moment.duration(diff.months, 'months'))

  diff.days = duration.days()
  duration.subtract(moment.duration(diff.days, 'days'))

  diff.hours = duration.hours()
  duration.subtract(moment.duration(diff.hours, 'hours'))

  diff.minutes = duration.minutes()
  duration.subtract(moment.duration(diff.minutes, 'minutes'))

  diff.seconds = duration.seconds()
  duration.subtract(moment.duration(diff.seconds, 'seconds'))

  return diff
}
