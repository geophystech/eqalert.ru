<template>
  <b-row class="mobile-app-alert">
    <b-col cols="12">
      <b-alert variant="danger" show dismissible>
        <a :href="url" class="alert-link">{{ message }}</a>
      </b-alert>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'MobileAppAlert',
  props: ['url', 'message']
}
</script>

<style lang="scss" scoped>

.mobile-app-alert
{
  .alert
  {
    border-color: darken(tomato, 10%);
    background-color: tomato;
    margin: 10px auto 5px;

    &, .alert-link {
      color: white;
    }

    .alert-link {
      text-decoration: underline;
    }
  }
}

</style>
