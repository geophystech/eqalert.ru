<template>
  <div class="social-media-links">
    <a href="tg://resolve?domain=eqalert_ru_bot"><i class="fa fa-telegram" aria-hidden="true" /></a>
  </div>
</template>

<script>
  export default {
    name: 'SocialMediaLinks'
  }
</script>

<style lang="scss" scoped>

  @import '~scss/_variables';

  a {
    color: $color-gray-dark;
  }

  .social-media-links {
    display: inline-block;
  }

</style>
