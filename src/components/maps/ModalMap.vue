<template>
  <div class="modal-map">
    <b-btn size="sm" v-b-modal.map-dialog>Показать на карте</b-btn>
    <b-modal
      id="map-dialog"
      size="lg"
      :hide-footer="true"
      :no-close-on-backdrop="true"
      :lazy="true"
      @shown="onOpen"
      @hide="onClose">
      <div class="map" :id="map.id"/>
    </b-modal>
  </div>
</template>

<script>
  import {createMap} from '@/map_functions'
  export default {
    name: 'ModalMap',
    data() {
      return {
        map: {
          coordinates: [58.651, 142.395],
          id: 'modal-map',
          object: null
        }
      }
    },
    methods: {
      onOpen: function(e)
      {
        this.map.object = createMap(this.map.id, this.map.coordinates, {
          zoom: 4
        })
      },
      onClose: function(e)
      {
        this.map.object.remove()
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';
</style>

<style lang="scss" scoped>

  @import '~scss/global';
  @import '~scss/mixins/_calc';

  .modal-map
  {
    display: inline-block;

    /deep/ .modal
    {
      padding-left: 15px;
      height: 100%;

      .modal-dialog
      {
        @include calc(height, '100% - 57px', 100%);
        max-width: none;

        .modal-content
        {
          height: 100%;

          .modal-header
          {
            padding: 0.6rem 1rem;

            .modal-title {
              text-align: center;
              font-size: 1rem;
              width: 100%;
            }
          }

          .modal-body
          {
            padding: 2px;
            height: 1%;

            .map {
              height: 100%;
            }
          }
        }
      }
    }
  }

</style>
