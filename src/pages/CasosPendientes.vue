<template>
  <q-page>
    <q-input
      outlined
      rounded
      class="busqueda-input shadow-3"
      label-color="grey-2"
      color="grey-4"
      v-model="busqueda"
      :debounce="400"
      placeholder="Buscar"
      @change="buscarCaso(1)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          class="cursor-pointer"
          color="positive"
          name="add_circle_outline"
          size="sm"
          @click="modalAlta = true"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 0]">Agregar Caso</q-tooltip>
        </q-icon>
        <q-icon
          class="cursor-pointer"
          color="negative"
          name="explore"
          size="sm"
          @click="mapaCompleto()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 0]">Ver mapa completo</q-tooltip>
        </q-icon>
      </template>
    </q-input>

    <div v-if="loading">
      <Loading />
    </div>
    <GrillaCasosPendientes
      v-else
      :Casos="Casos"
      :pag="pag"
      :maxpags="maxpags"
      :IdEstadoCasoPendiente="IdEstadoCasoPendiente"
      :opcionesEstados="opcionesEstados"
      :opcionesOrigenes="opcionesOrigenes"
      :opcionesLesiones="opcionesLesiones"
      @filtrar="filtrar"
      @page="buscarCaso"
      @eliminar="buscarCaso()"
    />

    <!--Modal Alta Caso Pendiente -->
    <q-dialog v-model="modalAlta">
      <AltaCasoPendiente
        :opcionesEstados="opcionesEstados"
        :opcionesOrigenes="opcionesOrigenes"
        :opcionesLesiones="opcionesLesiones"
        @cerrar="buscarCaso()"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import request from '../request'
import AltaCasoPendiente from '../components/CasosPendientes/AltaCasoPendiente'
import GrillaCasosPendientes from '../components/CasosPendientes/GrillaCasosPendientes'
import Loading from '../components/Loading'

export default {
  components: {
    AltaCasoPendiente,
    GrillaCasosPendientes,
    Loading
  },
  data () {
    return {
      busqueda: '',
      Casos: [],
      pag: 1,
      maxpags: 5,
      loading: true,
      modalAlta: false,
      IdEstadoCasoPendiente: 0,
      opcionesOrigenes: [],
      opcionesEstados: [],
      opcionesLesiones: []
    }
  },
  created () {
    request.Get('/origenes', {}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.opcionesOrigenes = r.map(o => {
          if (o.Origen !== 'TODOS') {
            return {
              label: o.Origen,
              value: parseInt(o.IdOrigen)
            }
          }
        })
      }
    })

    request.Get('/casos-pendientes/estados', {}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.opcionesEstados = r.map(e => {
          return {
            label: e.EstadoCasoPendiente,
            value: parseInt(e.IdEstadoCasoPendiente)
          }
        })
      }
    })

    request.Get('/casos/opciones-parametros', {}, r => {
      r.forEach(o => {
        if (typeof (this[o.Variable]) !== 'undefined') {
          this[o.Variable] = JSON.parse(o.Opciones)
        }
      })
    })

    this.buscarCaso()
  },
  methods: {
    buscarCaso (p = 1) {
      const offset = (p - 1) * 30
      this.pag = p
      this.loading = true
      this.Casos = []
      this.modalAlta = false

      request.Get('/casos-pendientes', {Cadena: this.busqueda, Documento: '', Offset: offset, IdEstadoCasoPendiente: this.IdEstadoCasoPendiente}, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.Casos = r
          this.Casos.forEach(c => {
            c.UltimoMovimiento = c.UltimoMovimiento ? JSON.parse(c.UltimoMovimiento) : null
          })
          const cant = r.length ? r[0].Cant : 0
          this.maxpags = Math.ceil(parseInt(cant) / 30)
          this.loading = false
        }
      })
    },
    mapaCompleto () {
      let routeData = this.$router.resolve({ path: '/Maps?sec=visitas' })
      window.open(routeData.href, '_blank')
    },
    filtrar (f, id) {
      this.IdEstadoCasoPendiente = id
      this.buscarCaso()
    }
  }
}
</script>
