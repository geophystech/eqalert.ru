<script>
import { Line } from 'vue-chartjs'
import apiSettings from '@/settings/api'

export default Line.extend({
  props: ['filtersParams'],
  data() {
    return {
      chartData: {
        datasets: [{
          label: '',
          data: [],
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(51,122,183,0.4)',
          borderColor: 'rgba(51,122,183,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(51,122,183,1)',
          pointBackgroundColor: 'rgba(51,122,183,1)',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(51,122,183,1)',
          pointHoverBorderColor: 'rgba(51,122,183,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10
        }],
        labels: []
      },
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
  methods: {
    drawChart: function(params = {}) {
      this.$http.get(apiSettings.endpointAnalyticsEarthquakeCounts, { params: params })
        .then(response => {
          const dates = this.prepareDates(response.data.data.dates)
          this.chartData.datasets[0].label = 'Количество землетрясений'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = dates

          // Pass data to the Analytics.vue component.
          this.$emit('update', {
            eventsCount: response.data.data.total_count,
            startDate: this.$moment(response.data.data.range.start).format('L'),
            endDate: this.$moment(response.data.data.range.end).format('L')
          })

          // Ugly hack to prevent showing old data on hovering.
          // No idea why it doesn't covered by https://github.com/apertureless/vue-chartjs/blob/master/src/BaseCharts.js#L71
          // So ¯\_(ツ)_/¯
          // https://github.com/geophystech/eqalert.ru/issues/258
          if (this._chart) this._chart.destroy()

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    },
    prepareDates: function(dates) {
      return dates.map(date => {
        let _date = this.$moment(date).format('MMMM YYYY')
        _date = _date[0].toUpperCase() + _date.substr(1)

        return _date
      })
    }
  },
  watch: {
    filtersParams: function(data) {
      this.drawChart(data)
    }
  }
})
</script>
