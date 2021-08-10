<template>
  <q-page class="q-px-lg q-pt-md">
    <div
      v-if="loading"
    >
        <Loading />
    </div>
    <div
      v-else
      class="q-px-xs"
    >
      <div
        v-if="consultas.length === 0"
        class="column full-width items-center justify-center text-center"
        style="height: 70vh"
      >
        <q-icon
          class="q-mb-md"
          name="question_answer"
          size="md"
          color="teal"
        />
        <div
          class="text-teal text-bold text-subtitle1"
        >
          Aún no realizas ninguna consulta
          <br>
          Envíanos tu consulta y un abogado de nuestros estudios responderá a la brevedad
        </div>
      </div>

      <div
        class="filas__container q-banner q-mb-md"
        v-for="c in consultas"
        :key="c.IdCaso"
      >
        <div
          class="row filas_"
        >
          <div
            class="q-pt-sm column full-width"
          >
            <span
              class="q-subheading"
              style="color: #1B43F0"
            >{{ c.Apynom }}</span>
            <span
              class="text-overline text-grey-14"
            >
              {{ c.Telefono }}
            </span>
          </div>
          <q-separator />
          <div class="full-width flex q-pa-md">
            {{ c.Texto }}
          </div>
          <q-separator />
          <div
            class="text-caption text-center text-grey-9 q-py-sm full-width"
          >
            {{ dias(c.fecha) }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Loading from '../components/Loading'

export default {
  components: {
    Loading
  },
  data () {
    return {
      consultas: [],
      loading: true
    }
  },
  created () {
    setTimeout(() => {
      this.loading = false
    }, 700)

    if (localStorage.getItem('mis_consultas_docdoc')) {
      const ls = localStorage.getItem('mis_consultas_docdoc')
      this.consultas = JSON.parse(ls)
    }
  },
  methods: {
    dias (Fecha) {
      if (!Fecha) {
        return ''
      }
      var fecha = new Date()
      var hoy = new Date()
      var year = Fecha.split('-')[2]
      var month = Fecha.split('-')[1] - 1
      var day = Fecha.split('-')[0].split(' ')[0] - 1
      fecha.setMonth(month)
      fecha.setFullYear(year)
      fecha.setDate(day)
      var resultado =
        Math.ceil(
          (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      if (resultado === 0) {
        return 'Hoy'
      }
      return resultado * -1 !== 1 ? `Hace ${resultado * -1} días` : `Hace ${resultado * -1} día`
    }
  }
}
</script>
