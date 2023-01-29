<template>
  <b-container>
    <AppHeader/>
    <AppNavbar/>
<!--    <MobileAppAlert v-if="is_android" message="Мы сделали приложение для Android" :url="googlePlayUrl" />-->
<!--    <MobileAppAlert v-if="is_iOS" message="Мы сделали приложение для iOS" :url="appStoreUrl" />-->
    <slot />
    <AppFooter/>
  </b-container>
</template>
