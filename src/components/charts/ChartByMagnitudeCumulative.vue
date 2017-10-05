<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default Line.extend({
  mixins: [reactiveProp],
  props: ['chartData'],
  data () {
    return {
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
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
</script>
