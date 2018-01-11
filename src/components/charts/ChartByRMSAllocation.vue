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
                labelString: 'Количество землетрясений (M \u2265 2.5)'
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
      this.$http.get(this.$root.$options.settings.api.endpointAnalyticsRMSAllocation)
        .then(response => {
          this.chartData.datasets[0].label = 'Распределение RMS'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = response.data.data.rms_values

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    }
  }
})
</script>
