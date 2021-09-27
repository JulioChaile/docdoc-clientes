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
        v-if="movimientos.length === 0"
        class="column full-width items-center justify-center text-center"
        style="height: 70vh"
      >
        <q-icon
          class="q-mb-md"
          name="event"
          size="md"
          color="teal"
        />
        <div
          class="text-teal text-bold text-subtitle1"
        >
          Los casos en los que participas aún no tienen una fecha de audiencia asignada
          <br>
          Se te notificará en cuanto tengamos novedades
        </div>
      </div>

      <div
        class="filas__container q-banner q-mb-md bg-negative"
        v-for="m in movimientos"
        :key="m.IdMovimientoCaso"
      >
        <div
          class="row filas_"
        >
          <div
            class="q-pt-sm column full-width"
          >
            <span
              class="q-subheading"
            >{{ m.Caratula }}</span>
          </div>
          <q-separator />
          <div class="full-width column text-center q-px-md">
            <span class="text-caption text-gris">
              Dentro de
            </span>
            <span class="text-h3">
              {{ diasRestantes(m.FechaEsperada) }}
            </span>

            <span class="text-caption text-gris">
              {{ diasRestantes(m.FechaEsperada) === 1 ? 'día' : 'días' }}
            </span>
          </div>
          <q-separator />
          <div
            class="text-caption text-center text-grey-9 q-py-sm full-width"
          >
            {{ m.Detalle }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import auth from '../auth'
import request from '../request'
import moment from 'moment'
import Loading from '../components/Loading'

export default {
  components: {
    Loading
  },
  data () {
    return {
      loading: true,
      movimientos: []
    }
  },
  created () {
    const usuario = auth.UsuarioLogueado.Usuario
    request.Get('/casos/eventos-clientes', { usuario: usuario }, r => {
      if (r.Error) {
        this.$q.notify('Hubo un error en el servidor, por favor notifiquelo y vuelva a intentarlo mas tarde.')
      } else {
        this.loading = false
        this.movimientos = r
      }
    })
  },
  methods: {
    diasRestantes (fecha) {
      fecha = fecha.split(' ')[0]
      const resultado = moment(fecha).diff(moment(), 'days')
      return resultado
    }
  }
}
</script>
