/**
 *
 * @param dt1
 * @param dt2
 * @return {{years, months, days, hours, minutes, seconds}}
 */
export function dateTimeDiff(dt1, dt2)
{
  if(!(dt1 instanceof this.$moment)) {
    dt1 = this.$moment(dt1)
  }

  if(!(dt2 instanceof this.$moment)) {
    dt2 = this.$moment(dt2)
  }

  let duration = this.$moment.duration(dt1.diff(dt2))
  let diff = {}

  diff.years = duration.years()
  duration.subtract(this.$moment.duration(diff.years, 'years'))

  diff.months = duration.months()
  duration.subtract(this.$moment.duration(diff.months, 'months'))

  diff.days = duration.days()
  duration.subtract(this.$moment.duration(diff.days, 'days'))

  diff.hours = duration.hours()
  duration.subtract(this.$moment.duration(diff.hours, 'hours'))

  diff.minutes = duration.minutes()
  duration.subtract(this.$moment.duration(diff.minutes, 'minutes'))

  diff.seconds = duration.seconds()
  duration.subtract(this.$moment.duration(diff.seconds, 'seconds'))

  return diff
}
