<script>
import { Line } from 'vue-chartjs'

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
                beginAtZero: true,
                callback: (dataLabel, index) => {
                  if (index % 2 === 0) return dataLabel
                  return ''
                }
              },
              type: 'logarithmic'
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
      this.$http.get(this.$root.$options.settings.api.endpoints.analyticsCumulativeCounts)
        .then(response => {
          this.chartData.datasets[0].label = 'Кумулятивный график повторяемости (ML)'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = response.data.data.magnitudes

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    }
  }
})
</script>
