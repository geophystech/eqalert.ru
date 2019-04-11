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
                labelString: 'RMS'
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
      this.$http.get(apiSettings.endpointAnalyticsRMSAllocation, { params: params })
        .then(response => {
          this.chartData.datasets[0].label = 'Распределение RMS'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = response.data.data.rms_values

          // Ugly hack to prevent showing old data on hovering.
          // No idea why it doesn't covered by https://github.com/apertureless/vue-chartjs/blob/master/src/BaseCharts.js#L71
          // So ¯\_(ツ)_/¯
          // https://github.com/geophystech/eqalert.ru/issues/258
          if (this._chart) this._chart.destroy()

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    }
  },
  watch: {
    filtersParams: function(data) {
      this.drawChart(data)
    }
  }
})
</script>
