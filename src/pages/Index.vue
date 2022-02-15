<template>
  <q-page style="position: relative">
    <div class="nuevo-fondo window-width window-height fixed-top">
    </div>

    <q-tab-panels
      v-model="tab"
      animated
      keep-alive-include="casos"
      swipeable
      class="bg-transparent panel-index"
    >
      <q-tab-panel name="casos" class="q-pa-none">
        <GrillaCasos
          :casos="casos"
          :casoAbierto="casoAbierto"
          :loading="loadingCasos"
          @abrirCaso="abrirCaso"
        />
      </q-tab-panel>
      <q-tab-panel name="novedades" class="q-pa-none">
        <Caso 
          :casoAbierto="casoAbierto"
        />
      </q-tab-panel>
      <q-tab-panel name="audiencias" class="q-pa-none">
        <Audiencias
          :movimientos="audienciasPorCaso"
          :loading="loadingAudiencias"
        />
      </q-tab-panel>
      <q-tab-panel name="archivos" class="q-pa-none">
        <ArchivosCaso
          :casoAbierto="casoAbierto"
        />
      </q-tab-panel>
      <q-tab-panel name="documentacion" class="q-pa-none">
        <Documentacion 
          :casoAbierto="casoAbierto"
        />
      </q-tab-panel>
      <q-tab-panel name="personas" class="q-pa-none">
        <Personas 
          :casoAbierto="casoAbierto"
        />
      </q-tab-panel>
    </q-tab-panels>

    <q-tabs
      v-if="casos.length"
      v-model="tab"
      dense
      no-caps
      align="justify"
      class="text-grey-7 fixed-bottom bg-grey-3 tabs-index"
      active-color="dark"
    >
      <q-tab
        name="casos" 
        label="Casos"
        icon="home"
      />
      <q-tab
        name="novedades"
        label="Novedades"
        icon="feedback"
      />
      <q-tab
        name="audiencias"
        label="Audiencias"
        icon="event"
      />
      <q-tab
        name="archivos"
        label="Archivos"
        icon="perm_media"
      />
      <q-tab
        name="documentacion"
        label="Documentación"
        icon="cloud_upload"
      />
      <q-tab
        name="personas"
        label="Personas"
        icon="group"
      />
    </q-tabs>
  </q-page>
</template>

<style>
</style>

<script>
import { QTabPanels, QTabPanel, QTab, QTabs } from 'quasar'
import request from '../request'
import auth from '../auth'
import GrillaCasos from '../components/GrillaCasos'
import Caso from '../components/Caso/Caso'
import ArchivosCaso from '../components/Caso/ArchivosCaso'
import Audiencias from '../components/Caso/Audiencias'
import Documentacion from '../components/Caso/Documentacion'
import Personas from '../components/Caso/Personas'

export default {
  name: 'PageIndex',
  components: {
    QTabPanels,
    QTabPanel,
    QTab,
    QTabs,
    GrillaCasos,
    Caso,
    ArchivosCaso,
    Audiencias,
    Documentacion,
    Personas
  },
  data () {
    return {
      tab: 'casos',
      casos: [],
      movimientos: [],
      casoAbierto: {},
      loadingCasos: true,
      loadingAudiencias: true
    }
  },
  created () {
    const mode = this.$route.query.mode

    if (mode !== 'notificacion') this.$router.push({
        query: {
          ...this.$route.query,
          tab: this.tab
        }
      })

    const cadena = auth.UsuarioLogueado.Usuario
    
    request.Get('/casos/buscar-cliente', {Cadena: cadena}, (r) => {
      if (!r.Error) {
        this.casos = r

        this.casos.forEach(c => {
          c.Actores = []
          c.Demandados = []

          c.PersonasCaso.forEach(p => {
            if (p.Observaciones === 'Demandado') {
              if (p.Parametros.check) {
                if (p.Parametros.Seguro.check)
                c.Demandados.push(p.Parametros.Seguro.CiaSeguro)
              }

              if (p.Apellidos) {
                c.Demandados.push(p.Apellidos + ', ' + p.Nombres)
              } else {
                c.Demandados.push(p.Nombres)
              }
            } else {
              c.Actores.push({
                IdPersona: p.IdPersona,
                Persona: p.Apellidos
                  ? p.Apellidos + ', ' + p.Nombres
                  : p.Nombres,
                DocumentacionSolicitada: p.DocumentacionSolicitada || []
              })
            }
          })

          c.Estudios = JSON.parse(c.Estudios)

          let hash = {}
          c.Estudios = c.Estudios
          ? c.Estudios.filter(e => {
              if (!hash[e]) {
                hash[e] = true
                return e
              }
            })
          : []
        })

        if (mode === 'notificacion' || mode === 'back') {
          const id = this.$route.query.id
          const tab = this.$route.query.tab
          
          const i = this.casos.findIndex(c => parseInt(c.IdCaso) === parseInt(id))

          i > -1
            ? this.casoAbierto = this.casos[i]
            : this.casoAbierto = this.casos[0]

          this.$nextTick(() => {
            document.getElementById(this.casoAbierto.IdCaso + 'caso').scrollIntoView(true)

            setTimeout(() => {
              this.tab = tab
            }, 600);
          })
        } else {
          this.casoAbierto = this.casos[0]
        }

        this.loadingCasos = false
      }
    })

    this.buscarAudiencias()
  },
  watch: {
    tab () {
      if (this.tab === 'casos') {
        this.$nextTick(() => {
          document.getElementById(this.casoAbierto.IdCaso + 'caso').scrollIntoView(true)
        })
      }

      if (this.tab === 'audiencias') {
        this.loadingAudiencias = true
        this.buscarAudiencias()
      }

      this.$router.push({
        query: {
          ...this.$route.query,
          tab: this.tab
        }
      })
    }
  },
  computed: {
    audienciasPorCaso () {
      if (!this.casoAbierto.IdCaso) return []

      const idCaso = parseInt(this.casoAbierto.IdCaso)

      return this.movimientos.filter(m => parseInt(m.IdCaso) === idCaso)
    }
  },
  methods: {
    abrirCaso (c) {
      this.casoAbierto = c

      this.$router.push({
        query: {
          ...this.$route.query,
          id: c.IdCaso
        }
      })
      
      setTimeout(() => {
        this.tab = 'novedades'
      }, 150);
    },
    buscarAudiencias () {
      const usuario = auth.UsuarioLogueado.Usuario

      request.Get('/casos/eventos-clientes', { usuario: usuario }, r => {
        if (r.Error) {
          this.$q.notify('Hubo un error en el servidor, por favor notifiquelo y vuelva a intentarlo mas tarde.')
        } else {
          this.loadingAudiencias = false
          this.movimientos = r
        }
      })
    }
  }
}
</script>

<style>
.tabs-index .q-tab {
  width: calc(100% / 6) !important;
  padding: 0;
}

.tabs-index .q-tab__label {
  font-weight: 600;
  font-size: 10px !important;
  line-height: 14px;
}

.tabs-index .q-tab__icon {
  width: 40px;
  height: 40px;
  font-size: 30px;
}

.panel-index {
  height: calc(100vh - 112px) !important;
}
</style>
