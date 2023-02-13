<template>
  <b-row class="mt-4">

    <b-col cols="12" md="8">

      <div class="text-error">

        <div>
          Данной страницы не существует.
          Пожалуйста, посмотрите, <NuxtLink to="/">последние землетрясения</NuxtLink>
          или выполните <NuxtLink to="/events">поиск в архиве</NuxtLink>.
        </div>

      </div>

    </b-col>

  </b-row>
</template>

<script>

export default {
  props: ['error'],
  layout: 'default'
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/_variables';
</style>
