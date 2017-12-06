<template>
  <div class="event-tab moment-tensor">
    <b-row>
      <b-col class="text-center">
        <img :alt="hashid" :src="`https://eqalert.ru/uploads/images/moment_tensors/fullsize/${image}`" class="img-responsive" />
      </b-col>
    </b-row>

    <b-row>
      <b-col class="edit-moment-tensor text-center">
        <b-button size="sm" variant="secondary" href="#">Редактировать тензор момента</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <div class="table-title text-center">Moment Tensor (deviatoric)</div>
        <b-table
          hover
          outlined
          :fields="fields.momentTensor"
          :items="items.momentTensor">
          <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
          <template slot="description" slot-scope="data">
            <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.auto="data.value" />
          </template>
        </b-table>
      </b-col>

      <b-col cols="6">
        <div class="table-title text-center">Moment Tensor Components</div>
        <b-table
          hover
          outlined
          :fields="fields.momentTensorComponents"
          :items="items.momentTensorComponents">
          <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
        </b-table>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="6">
        <div class="table-title text-center">Principal Axes</div>
        <b-table
          hover
          outlined
          :fields="fields.principalAxes"
          :items="items.principalAxes">
        </b-table>
      </b-col>

      <b-col cols="6">
        <div class="table-title text-center">Nodal Planes</div>
        <b-table
          hover
          outlined
          :fields="fields.nodalPlanes"
          :items="items.nodalPlanes">
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ['hashid'],
  data() {
    return {
      fields: {
        momentTensor: [
          { key: 'index', label: '#' },
          { key: 'parameter', label: 'Параметр' },
          { key: 'value', label: 'Значение', 'class': 'text-center' },
          { key: 'description', label: ' ', 'class': 'text-center' }
        ],
        momentTensorComponents: [
          { key: 'index', label: '#' },
          { key: 'parameter', label: 'Параметр' },
          { key: 'value', label: 'Значение', 'class': 'text-center' }
        ],
        principalAxes: [
          { key: 'axis', label: 'Axis', 'class': 'text-center' },
          { key: 'plunge', label: 'Plunge', 'class': 'text-center' },
          { key: 'azimuth', label: 'Azimuth', 'class': 'text-center' }
        ],
        nodalPlanes: [
          { key: 'plane', label: 'Plane', 'class': 'text-center' },
          { key: 'strike', label: 'Strike', 'class': 'text-center' },
          { key: 'dip', label: 'Dip', 'class': 'text-center' },
          { key: 'rake', label: 'Rake', 'class': 'text-center' }
        ]
      },
      items: {
        momentTensor: [
          { parameter: 'M0', value: null, description: 'Сейсмический момент' },
          { parameter: 'Mw', value: null, description: 'Моментная магнитуда' },
          { parameter: 'C-depth', value: null, description: 'Глубина центроида' },
          { parameter: 'C-time', value: null, description: 'Время относительно исходной локации' },
          { parameter: 'DC', value: null, description: 'Величина двухдипольной компоненты решения' },
          { parameter: 'CLVD', value: null, description: 'Величина недвухдипольной компоненты решения' },
          { parameter: 'VR', value: null, description: 'Корреляция данных для всех станций' },
          { parameter: 'FM only', value: null, description: 'Только двухдипольное приближение' },
          { parameter: 'Agency', value: 'SAK', description: 'Агентство' }
        ],
        momentTensorComponents: [
          { parameter: 'Mrr', value: null },
          { parameter: 'Mtt', value: null },
          { parameter: 'Mpp', value: null },
          { parameter: 'Mrt', value: null },
          { parameter: 'Mrp', value: null },
          { parameter: 'Mtp', value: null }
        ],
        nodalPlanes: [
          { plane: 'NP1', strike: null, dip: null, rake: null },
          { plane: 'NP2', strike: null, dip: null, rake: null }
        ],
        principalAxes: [
          { axis: 'T', plunge: null, azimuth: null },
          { axis: 'P', plunge: null, azimuth: null }
        ]
      },
      momentTensorData: {}
    }
  },
  computed: {
    image: function() {
      return this.momentTensorData.image_fullsize
    }
  },
  created() {
    this.getMomentTensor()
  },
  methods: {
    getMomentTensor: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/49d849c7a7719e08aa562c55d50fd0c0/raw/0168feb46134e70d6cefd25e6743cfe920c2e647/eq_QgpAn7OW_moment_tensor.json')
        .then(response => {
          this.momentTensorData = response.data.moment_tensor
          this.populateItems()
        })
        .catch(error => { console.log(error) })
    },
    populateItems: function() {
      this.populateMomentTensorItems()
      this.populateMomentTensorComponentsItems()
      this.populatePrincipalAxesItems()
      this.populateNodalPlanesItems()
    },
    populateMomentTensorItems: function() {
      this.items.momentTensor[0].value = `${this.momentTensorData.m0}e+${this.momentTensorData.m0_exp} N-m`
      this.items.momentTensor[1].value = this.momentTensorData.mw
      this.items.momentTensor[2].value = `${this.momentTensorData.c_depth} км`
      this.items.momentTensor[3].value = `${this.momentTensorData.c_time} сек`
      this.items.momentTensor[4].value = `${this.momentTensorData.dc}%`
      this.items.momentTensor[5].value = `${this.momentTensorData.clvd}%`
      this.items.momentTensor[6].value = this.momentTensorData.vrr
      this.items.momentTensor[7].value = this.momentTensorData.mech_only
    },
    populateMomentTensorComponentsItems: function() {
      this.items.momentTensorComponents[0].value = this.momentTensorData.m_rr
      this.items.momentTensorComponents[1].value = this.momentTensorData.m_tt
      this.items.momentTensorComponents[2].value = this.momentTensorData.m_pp
      this.items.momentTensorComponents[3].value = this.momentTensorData.m_rt
      this.items.momentTensorComponents[4].value = this.momentTensorData.m_rp
      this.items.momentTensorComponents[5].value = this.momentTensorData.m_tp
    },
    populatePrincipalAxesItems: function() {
      this.items.principalAxes[0].plunge = `${this.momentTensorData.t_pl}&deg`
      this.items.principalAxes[0].azimuth = `${this.momentTensorData.t_az}&deg`
      this.items.principalAxes[1].plunge = `${this.momentTensorData.p_pl}&deg`
      this.items.principalAxes[1].azimuth = `${this.momentTensorData.p_az}&deg`
    },
    populateNodalPlanesItems: function() {
      this.items.nodalPlanes[0].strike = `${this.momentTensorData.np1_stk}&deg`
      this.items.nodalPlanes[0].dip = `${this.momentTensorData.np1_dip}&deg`
      this.items.nodalPlanes[0].rake = `${this.momentTensorData.np1_rake}&deg`
      this.items.nodalPlanes[1].strike = `${this.momentTensorData.np2_stk}&deg`
      this.items.nodalPlanes[1].dip = `${this.momentTensorData.np2_dip}&deg`
      this.items.nodalPlanes[1].rake = `${this.momentTensorData.np2_rake}&deg`
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';

  .moment-tensor {
    .edit-moment-tensor {
      margin: 5% 0;
    }

    .table-title {
      font-size: 120%;
      margin-bottom: 1%;
    }
  }
</style>

