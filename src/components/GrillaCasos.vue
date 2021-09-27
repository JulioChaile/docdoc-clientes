<template>
  <div>
    <div
      class="bg-transparent"
    >
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
          v-for="caso in casos"
          :key="caso.IdCaso"
        >
          <div class="filas__container q-banner q-mb-md" @click="abrirCaso(caso.IdCaso, caso.Caratula)">
            <div
              class="filas_ text-h6 relative-position text-center items-center"
              style="color: #1B43F0; padding-top: 10px !important"
            >
              {{ caso.Caratula }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../request'
import auth from '../auth'
import Loading from '../components/Loading'
export default {
  components: {
    Loading
  },
  name: 'GrillaCasos',
  data () {
    return {
      casos: [],
      loading: true
    }
  },
  created () {
    const cadena = auth.UsuarioLogueado.Usuario
    request.Get('/casos/buscar-cliente', {Cadena: cadena}, (r) => {
      if (!r.Error) {
        this.casos = r
        this.loading = false
      }
    })
  },
  methods: {
    abrirCaso (id, c) {
      this.$router.push({
        path: `/Caso?id=${id}&caratula=${c}`
      })
    }
  }
}
</script>

<style>
.opacity-9 {
  opacity: 0.9;
}
</style>
