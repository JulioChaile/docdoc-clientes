<template>
  <div id="q-app">
    <transition>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
