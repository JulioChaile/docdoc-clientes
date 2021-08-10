/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <q-page>
    <!-- <Busqueda style="margin-top:-.5em"/> -->
    <div style="display: grid">
      <div
        class="row justify-center contenedor-opciones"
      >
        <div class="col-12" style="display: flex; justify-content: center">
          <q-checkbox
            v-model="sinFechaEsperada"
          >
            Mostrar sin fecha esperada y realizados
          </q-checkbox>
        </div>
        <div class="col-4" style="display: flex; justify-content: center">
          <q-select
            v-model="TipoMov"
            label="Tipo de Movimiento"
            multiple
            :options="opcionesTiposMov"
            class="bg-white text-black select-clase"
          />
        </div>
        <div class="col-4" style="display: flex; justify-content: center">
          <q-select
            v-model="EstadoAmbito"
            stack-label
            label="Estado de Ambito de Gestión"
            multiple
            :options="opcionesEstadoAmbito"
            class="bg-white text-black select-clase"
          />
        </div>
        <div class="col-4" style="display: flex; justify-content: center">
          <q-select
            v-model="Usuario"
            label="Usuario"
            multiple
            :options="opcionesUsuarios"
            class="bg-white text-black select-clase"
            @input="filtrarPorUsuario()"
          />
        </div>
        <q-input
          v-model="busqueda"
          bg-color="white"
          square
          filled
          outlined
          :debounce="600"
          placeholder="Buscar por detalle del movimiento"
          class="input-clase"
        />
        <div style="margin-top: 20px">
          <q-radio v-model="ver" val="" label="Todos" />
          <q-radio v-model="ver" val="negative" label="Perentorios" />
          <q-radio v-model="ver" val="primary" label="Gestion Estudio" />
          <q-radio v-model="ver" val="warning" label="Gestion Externa" />
          <q-radio v-model="ver" val="positive" label="Finalizados" />
        </div>
      </div>

      <div v-if="movimientos.length === 0">
        <Loading />
      </div>
      <q-infinite-scroll :disable="noHayMasMovimientos" @load="onLoad" style="width: 100%; padding: 0px; margin: 0px" class="movimientos__container" :offset="2000">
        <TarjetaMovimiento
          v-for="(m, i) in filtrarPorTipo"
          @borrar = "eliminarMovimiento($event)"
          :key="i"
          :movimiento="m"
          class="tarjeta-mov"
        />
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="100px" style="position: fixed; bottom: 10px; left: 50%"/>
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>
import { QRadio } from 'quasar'
import Busqueda from '../components/Busqueda.vue'
import TarjetaMovimiento from '../components/TarjetaMovimiento.vue'
import Loading from '../components/Loading'
import request from '../request'
import auth from '../auth'

export default {
  components: {
    Busqueda,
    TarjetaMovimiento,
    Loading,
    QRadio
  },
  name: 'Movimientos',
  data () {
    return {
      movimientos: [],
      objetivos: {},
      noHayMasMovimientos: false,
      TipoMov: ['Todos'],
      TiposMov: [],
      EstadoAmbito: ['Todos'],
      EstadosAmbito: [],
      Usuario: ['Todos'],
      Usuarios: [],
      sinFechaEsperada: false,
      busqueda: '',
      ver: ''
    }
  },
  created () {
    const r = auth.UsuarioLogueado
    this.onLoad(0, () => {})
    request.Get(`/estudios/${r.IdEstudio}/tipos-movimiento`, {}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else if (r.length) {
        this.TiposMov = r
      } else {
        this.$q.notify('No hay tipos de movimiento disponibles para este estudio')
      }
    })
    request.Get(`/estudios/${r.IdEstudio}/usuarios`, {}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else if (r.length) {
        this.Usuarios = r
      }
    })
    request.Get('/estado-ambito-gestion', {}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.EstadosAmbito = r
      }
    })
  },
  watch: {
    busqueda () {
      this.movimientos = []
      this.onLoad(0, () => {})
    },
    ver () {
      this.movimientos = []
      this.onLoad(0, () => {})
    }
  },
  computed: {
    opcionesTiposMov () {
      let result = []
      if (this.TiposMov && this.TiposMov.length) {
        result.push('Todos')
        this.TiposMov.forEach(t => {
          result.push(t.TipoMovimiento)
        })
      }
      return result
    },
    opcionesUsuarios () {
      let result = []
      if (this.Usuarios && this.Usuarios.length) {
        result.push('Todos')
        this.Usuarios.forEach(u => {
          result.push(u.Apellidos + ', ' + u.Nombres)
        })
      }
      return result
    },
    opcionesEstadoAmbito () {
      let result = []
      if (this.EstadosAmbito && this.EstadosAmbito.length) {
        result.push('Todos')
        this.EstadosAmbito.forEach(e => {
          result.push({
            label: e.EstadoAmbitoGestion,
            value: e.IdEstadoAmbitoGestion
          })
        })
      }
      return result
    },
    filtrarPorTipo () {
      let filter = this.sinFechaEsperada ? this.movimientos : this.movimientos.filter(m => m.FechaEsperada && !m.FechaRealizado)
      if (this.TipoMov.length === 0 || this.TipoMov[this.TipoMov.length - 1] === 'Todos') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.TipoMov = ['Todos']
      }
      if (this.TipoMov.length > 1 && this.TipoMov.includes('Todos')) {
        const i = this.TipoMov.indexOf('Todos')
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.TipoMov.splice(i, 1)
      }
      if (!this.TipoMov.includes('Todos')) {
        filter = filter.filter(f => this.TipoMov.includes(f.TipoMovimiento))
      }
      if (this.EstadoAmbito.length === 0 || this.EstadoAmbito[this.EstadoAmbito.length - 1] === 'Todos') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.EstadoAmbito = ['Todos']
      }
      if (this.EstadoAmbito.length > 1 && this.EstadoAmbito.includes('Todos')) {
        const i = this.EstadoAmbito.indexOf('Todos')
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.EstadoAmbito.splice(i, 1)
      }
      if (!this.EstadoAmbito.includes('Todos')) {
        filter = filter.filter(m => {
          const idEstado = m.IdEstadoAmbitoGestion
          if (this.EstadoAmbito.find(e => e.value === idEstado)) {
            return true
          }
        })
      }
      return filter
    }
  },
  methods: {
    eliminarMovimiento (movimiento) {
      this.movimientos.splice(this.movimientos.indexOf(movimiento), 1)
    },
    onLoad (index, done) {
      let usuarios = JSON.stringify(this.Usuario.filter(u => u !== 'Todos'))
      request.Get(`/casos/0/movimientos?Offset=${this.movimientos.length}&Cadena=${this.busqueda}&Color=${this.ver}&Usuarios=${usuarios}`, {}, t => {
        if (t.Error) {
          this.$q.notify(t.Error)
        } else {
          if (t.length === 0) {
            this.noHayMasMovimientos = true
            done()
            return
          }
          let idcasos = []
          t.forEach(m => {
            this.movimientos.push(m)
            if (idcasos.indexOf(m.IdCaso) === -1 && !this.objetivos[m.IdCaso]) {
              idcasos.push(m.IdCaso)
            } else if (this.objetivos[m.IdCaso]) {
              m.ObjetivosCaso = this.objetivos[m.IdCaso]
            }
          })
          if (!idcasos.length) {
            done()
            return
          }
          request.Get(`/objetivos?IdsCaso=[${idcasos}]`, {}, r => {
            if (!r.Error) {
              this.movimientos.map(c => {
                c.ObjetivosCaso = r[c.IdCaso]
                if (!this.objetivos[c.IdCaso]) {
                  this.objetivos[c.IdCaso] = []
                }
                this.objetivos[c.IdCaso] = this.objetivos[c.IdCaso].concat(r[c.IdCaso])
              })
            }
            done()
          })
        }
      })
    },
    filtrarPorUsuario () {
      if (this.Usuario.length === 0 || this.Usuario[this.Usuario.length - 1] === 'Todos') {
        this.Usuario = ['Todos']
      }
      if (this.Usuario.length > 1 && this.Usuario.includes('Todos')) {
        const i = this.Usuario.indexOf('Todos')
        this.Usuario.splice(i, 1)
      }
      this.reOnLoad()
    },
    reOnLoad () {
      this.movimientos = []
      this.onLoad(0, () => {})
    }
  }
}
</script>

<style>
.movimientos__container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.contenedor-opciones {
  justify-self: center;
  width: 90%;
  padding: 0em 1em 1em 1em;
  margin-top:10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  background-color: white
}

.select-clase {
  width: 70%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  padding: 0em 1em 1em 1em;
  margin-bottom: 5px
}

.input-clase {
  margin: .6em .6em 0 .6em;
  width: 90%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
}

.tarjeta-mov {
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
