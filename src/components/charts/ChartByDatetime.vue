<script>
import { Line } from 'vue-chartjs'

const moment = require('moment')
require('moment/locale/ru')

export default Line.extend({
  data() {
    return {
      chartData: this.$store.getters.chartDataset,
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Временной период'
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Количество землетрясений'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    }
  },
  created() {
    this.drawChart()
  },
  methods: {
    drawChart: function() {
      this.$http.get(this.$root.$options.settings.api.endpointAnalyticsEarthquakeCounts)
        .then(response => {
          const dates = this.prepareDates(response.data.data.dates)
          this.chartData.datasets[0].label = 'Количество землетрясений'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = dates

          // Pass data to the Analytics.vue component.
          this.$emit('update', {
            eventsCount: response.data.data.total_count,
            startDate: moment.utc(response.data.data.range.start).locale('ru').format('L'),
            endDate: moment.utc(response.data.data.range.end).locale('ru').format('L')
          })

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    },
    prepareDates: function(dates) {
      return dates.map(date => {
        let _date = moment.utc(date).locale('ru').format('MMMM YYYY')
        _date = _date[0].toUpperCase() + _date.substr(1)

        return _date
      })
    }
  }
})
</script>
