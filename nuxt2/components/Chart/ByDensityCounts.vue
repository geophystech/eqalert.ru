<script>
import { Line } from 'vue-chartjs'

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
                labelString: 'Магнитуда'
              },
              ticks: {
                callback: (dataLabel, index) => {
                  if (index % 5 === 0) return dataLabel
                  return ''
                }
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
      this.$axios.get(this.$api.endpointAnalyticsDensityCounts, { params: params })
        .then(response => {

          const respData = response.data.data

          this.chartData.datasets[0].label = 'Плотностное распределение повторяемости (ML)'
          this.chartData.datasets[0].data = respData.counts
          this.chartData.labels = respData.magnitudes

          // Ugly hack to prevent showing old data on hovering.
          // No idea why it doesn't covered by https://github.com/apertureless/vue-chartjs/blob/master/src/BaseCharts.js#L71
          // So ¯\_(ツ)_/¯
          // https://github.com/geophystech/eqalert.ru/issues/258
          if (this._chart) this._chart.destroy()

          this.renderChart(this.chartData, this.options)
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
