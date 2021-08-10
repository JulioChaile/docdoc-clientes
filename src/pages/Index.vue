<template>
  <q-page style="padding:1em 2em 2em 2em; position: relative">
    <div class="nuevo-fondo window-width window-height fixed-top">
    </div>
    <div>
      <div style="display:flex; flex-direction: column; justify-content: space-evenly;">
        <!-- Grilla Casos -->
        <div>
          <GrillaCasos />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import GrillaCasos from '../components/GrillaCasos'

export default {
  components: {
    GrillaCasos
  },
  name: 'PageIndex'
}
</script>
