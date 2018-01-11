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
                labelString: 'Количество станций'
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
      this.$http.get(this.$root.$options.settings.api.endpointAnalyticsStationCounts)
        .then(response => {
          this.chartData.datasets[0].label = 'События по количеству станций'
          this.chartData.datasets[0].data = response.data.data.counts
          this.chartData.labels = response.data.data.station_counts

          this.renderChart(this.chartData, this.options)
        })
        .catch(error => { console.log(error) })
    }
  }
})
</script>
