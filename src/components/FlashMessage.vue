<template>
  <b-row>
    <b-col :class="status" cols="12" v-for="message in messages" :key="message">
      {{ message }}
    </b-col>
  </b-row>
</template>

<script>
  export default {
    props: ['messages', 'status']
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global';

  .row {
    color: $color-white;
    font-size: 16px;
    margin-top: 4%;
    opacity: .9;
    text-align: center;
    top: 0;
    z-index: 100;

    .col-12 {
      height: auto;
      padding: 15px;
    }

    .error {
      background-color: $color-red-2;
    }

    .notice {
      background-color: $color-blue-2;
    }
  }
</style>
