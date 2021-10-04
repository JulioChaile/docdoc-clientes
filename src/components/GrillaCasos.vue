<template>
  <div class="bg-transparent">
    <div
      v-if="loading"
    >
      <Loading />
    </div>
    <div v-else>
      <div
        v-if="casos.length === 0"
        class="column full-width items-center justify-center text-center"
        style="margin-top: 50%"
      >
        <q-icon
          class="q-mb-md"
          name="sentiment_dissatisfied"
          size="lg"
          color="teal"
        />
        <span
          class="text-teal text-bold text-subtitle1 opacity-9"
        >
          Parece que aún no hay casos en los que estes participando
        </span>
      </div>
      <div
        v-for="c in casos"
        :key="c.IdCaso"
        :id="c.IdCaso + 'caso'"
        :class="`row contenedor_caso ${casoAbierto.IdCaso === c.IdCaso ? 'caso_abierto' : ''}`"
        @click="$emit('abrirCaso', c)"
      >
        <div class="col-11 column q-py-sm q-px-md">
          <div class="caratula_caso q-mb-sm">
            {{ c.Demandados.length ? c.Demandados.join(' - ') : c.Caratula }}
          </div>
          <span class="text-overline estudios_caso">
            {{ c.Estudios.join(', ')}}
          </span>
        </div>
        <div class="col-1 flex items-center justify-center q-pr-md">
          <q-icon
            v-if="casoAbierto.IdCaso === c.IdCaso"
            name="arrow_forward_ios"
            size="xs"
          />
        </div>
        <q-separator />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../components/Loading'
export default {
  components: {
    Loading
  },
  name: 'GrillaCasos',
  props: [ 'casos', 'loading', 'casoAbierto']
}
</script>

<style>
.opacity-9 {
  opacity: 0.9;
}

.contenedor_caso {
  height: 64px;
  position: relative;
}

.caso_abierto::before {
  content: '';
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 64px;
  background: transparent;
  background: grey;
  opacity: 0.5;
}

.caratula_caso {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.1875rem;
  color: rgb(17, 17, 17);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

.estudios_caso {
  font-weight: 400;
  line-height: 1.0625rem;
  color: rgb(85, 85, 85);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
