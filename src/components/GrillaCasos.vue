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
            v-if="buscarCaso.length === 0"
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
            v-for="caso in buscarCaso"
            :key="caso.IdCaso"
          >
            <div class="filas__container q-banner q-mb-md">
              <div class="row filas_ relative-position">
                <div
                  class="q-pt-sm column full-width"
                  @click="abrirCaso(caso.IdCaso)"
                >
                  <span
                    class="q-subheading"
                    style="color: #1B43F0"
                  >{{ caratula(caso.Caratula) }}</span>
                  <span
                    class="text-overline text-grey-14"
                  >
                    {{caso.NroExpediente || 'Sin expediente'}}
                  </span>
                </div>
                <q-separator />
                <div class="full-width row">
                  <div class="col-6 column text-start q-px-md q-py-sm">
                    <span
                      class="text-caption text-grey-14"
                    >
                      Origen
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{caso.Origen || "···"}}
                    </span>
                  </div>
                  <div class="col-6 column text-start q-px-md q-py-sm">
                    <span
                      class="text-caption text-grey-14"
                    >
                      Tipo de Caso
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{caso.TipoCaso}}
                    </span>
                  </div>
                  <div class="col-6 column text-start q-px-md q-py-xs">
                    <span
                      class="text-caption text-grey-14"
                    >
                      Gestión
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{ caso.Juzgado }}
                    </span>
                  </div>
                  <div class="col-6 column text-start q-px-md q-py-xs">
                    <span
                      class="text-caption text-grey-14 row"
                    >
                      Estado de Gestión
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{caso.EstadoAmbitoGestion || '···'}}
                    </span>
                    <span style="font-size: 10px; color: #1B43F0">{{diasCambioEstado(caso.FechaEstado)}}</span>
                  </div>
                  <div class="col-6 column text-start q-px-md q-py-sm">
                    <span
                      class="text-caption text-grey-14"
                    >
                      Nominación
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{ nominacion(caso.Nominacion) }}
                    </span>
                  </div>
                  <div class="col-6 column text-start q-px-md q-py-xs">
                    <span
                      class="text-caption text-grey-14"
                    >
                      Estado del Caso
                    </span>
                    <span
                      class="text-subtitle2"
                    >
                      {{ caso.EstadoCaso ? caso.EstadoCaso : '···'}}
                    </span>
                  </div>
                  <q-separator />
                  <div
                    class="text-caption text-center text-grey-9 q-py-sm full-width"
                  >
                    A definir que va aqui
                  </div>
                </div>
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
import { Notify } from 'quasar'
export default {
  components: {
    Loading
  },
  name: 'GrillaCasos',
  data () {
    return {
      casos: [],
      casosAux: [],
      casosTodos: [],
      casosSinTel: [],
      casoCompartido: {},
      show: {},
      busqueda: '',
      tipoBusqueda: 't', // t (Todos) - p (Personas) - j (Juzgados) - c (Tipo de Caso),
      estado: 'A',
      verAlta: true,
      verArchivados: false,
      noHayMasCasos: false,
      modo: 'casos__grilla',
      loading: true,
      objetivos: [],
      idCasos: [],
      filtros: false,
      orden: false,
      agrupar: false,
      verId: false,
      verTipoCaso: true,
      verEstado: false,
      verOrigen: true,
      verEstadoAmbitoGestion: true,
      verAmbito: true,
      verNominacion: true,
      verActivos: true,
      verPendientes: true,
      verFinalizados: false,
      verSinTel: false,
      selectAll: false,
      ModalMensaje: false,
      CasosMensaje: {},
      estadoCaso: 'AP',
      TiposCaso: [],
      Origenes: [],
      Estados: [],
      AmbitosGestion: [],
      Nominaciones: [],
      TipoCaso: ['Todos'],
      Origen: ['Todos'],
      EstadoAmbitoGestion: ['Todos'],
      Ambito: ['Todos'],
      Nominacion: ['Todos'],
      modalComparticiones: false,
      EstadosTodos: []
    }
  },
  created () {
    const cadena = auth.UsuarioLogueado.Usuario
    request.Get('/casos/buscar-cliente', {Cadena: cadena}, (r) => {
      if (!r.Error) {
        r.forEach((c) => {
          this.idCasos.push(c.IdCaso)
          try {
            c.PersonasCaso = JSON.parse(c.PersonasCaso)
          } catch (error) {
            console.log(error)
            c.PersonasCaso = []
          }
          c.Comparticiones = JSON.parse(c.Comparticiones)

          c.model = false

          this.casos.push(c)
          this.casosTodos.push(c)

          let check = false
          c.PersonasCaso.forEach(p => {
            if (p.Telefonos) { check = true }
          })

          if (!check) { this.casosSinTel.push(c) }
        })
        this.casos = this.casos.sort((a, b) => {
          if (a.FechaAlta < b.FechaAlta) {
            return 1
          }
          if (a.FechaAlta > b.FechaAlta) {
            return -1
          }
          return 0
        })
      }
      this.loading = false
      this.onLoad(0, () => {})
    })
    /*
    request.Get('/tipos-caso', {}, r => {
      if (!r.Error) {
        r.forEach(c => {
          this.TiposCaso.push(c.TipoCaso)
        })
      }
    })
    request.Get('/origenes', {}, r => {
      if (!r.Error) {
        r.forEach(c => {
          this.Origenes.push(c.Origen)
        })
      }
    })
    request.Get('/estado-ambito-gestion', {}, r => {
      if (!r.Error) {
        r.forEach(c => {
          this.Estados.push(c.EstadoAmbitoGestion)
        })
      }
    })
    let IdsJuzgados = []
    request.Get('/juzgados', {IncluyeBajas: 'S'}, r => {
      if (!r.Error) {
        r.forEach(c => {
          this.AmbitosGestion.push(c.Juzgado)
          IdsJuzgados.push(c.IdJuzgado)
        })
        request.Get('/juzgados/estados', {}, r => {
          if (!r.Error) {
            this.EstadosTodos = r
          }
        })
        request.Get(`/nominaciones?IdsJuzgado=${JSON.stringify(IdsJuzgados)}`, {}, t => {
          if (!t.Error) {
            this.Nominaciones = ['0 Pendiente', '1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°']
            Object.values(t).forEach(c => {
              if (c.length > 0) {
                c.forEach(p => {
                  if (isNaN(parseInt(p.Nominacion[0]))) {
                    this.Nominaciones.push(p.Nominacion)
                  }
                })
              }
            })
          }
        })
      }
    })
    */
  },
  computed: {
    opcionesEstados () {
      let result = []
      if (this.Estados && this.Estados.length) {
        result = this.Estados
        result.push('Sin estado', 'Todos')
      }
      return result
    },
    opcionesTiposCaso () {
      let result = []
      if (this.TiposCaso && this.TiposCaso.length) {
        result = this.TiposCaso
        result.push('Todos')
      }
      return result
    },
    opcionesOrigenes () {
      let result = []
      if (this.Origenes && this.Origenes.length) {
        result = this.Origenes
        result.push('Sin origen', 'Todos')
      }
      return result
    },
    opcionesAmbitosGestion () {
      let result = []
      if (this.AmbitosGestion && this.AmbitosGestion.length) {
        result = this.AmbitosGestion
        result.push('Todos')
      }
      return result
    },
    opcionesNominaciones () {
      let result = []
      if (this.Nominaciones && this.Nominaciones.length) {
        result = this.Nominaciones
        result.push('Sin nominacion', 'Todos')
      }
      return result
    },
    buscarCaso () {
      let filter = this.casos.filter(
        (c) => c.Estado === this.estado || this.estado === 'T'
      )
      filter = this.filtrarDatos(filter)
      filter.forEach(c => {
        if (c.Caratula) {
          let arrayCaratula = []
          arrayCaratula = c.Caratula.split(' ')

          if (arrayCaratula.indexOf(',') >= 0) {
            const i = arrayCaratula.indexOf(',')
            const p = arrayCaratula[i - 1]
            arrayCaratula.splice(i, 1)
            arrayCaratula.splice(i - 1, 0, p + ',')
          }

          c.Caratula = arrayCaratula.map(word => {
            return word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''
          }).join(' ')
        }
      })
      var hash = {}
      filter = filter.filter(c => {
        var exists = !hash[c.IdCaso]
        hash[c.IdCaso] = true
        return exists
      })
      let casos = []
      switch (this.estadoCaso) {
        case 'T':
          casos = filter
          break
        case 'AP':
          filter.forEach(c => {
            if (c.EstadoCaso !== 'Finalizado') {
              casos.push(c)
            }
          })
          break
        case 'PF':
          filter.forEach(c => {
            if (c.EstadoCaso === 'Finalizado' || c.EstadoCaso === 'Cliente pendiente') {
              casos.push(c)
            }
          })
          break
        case 'AF':
          filter.forEach(c => {
            if (c.EstadoCaso !== 'Cliente pendiente') {
              casos.push(c)
            }
          })
          break
        case 'A':
          filter.forEach(c => {
            if (c.EstadoCaso !== 'Finalizado' && c.EstadoCaso !== 'Cliente pendiente') {
              casos.push(c)
            }
          })
          break
        case 'P':
          filter.forEach(c => {
            if (c.EstadoCaso === 'Cliente pendiente') {
              casos.push(c)
            }
          })
          break
        case 'F':
          filter.forEach(c => {
            if (c.EstadoCaso === 'Finalizado') {
              casos.push(c)
            }
          })
          break
      }

      if (this.agrupar && Object.keys(this.EstadosTodos).length !== 0) {
        let casosAux = []
        let agrupacion = {}

        this.AmbitosGestion.forEach(j => {
          agrupacion[j] = []
          agrupacion[j].push({
            Nulo: [],
            Orden: 100
          })
        })
        agrupacion['Nulo'] = []
        agrupacion['Nulo'].push({
          Nulo: [],
          Orden: 100
        })
        this.EstadosTodos.forEach(e => {
          if (e.EstadoAmbitoGestion) {
            agrupacion[e.Juzgado].push({
              [e.EstadoAmbitoGestion]: [],
              Orden: e.Orden
            })
          }
        })

        this.casos.forEach(c => {
          const i = agrupacion[c.Juzgado ? c.Juzgado : 'Nulo'].findIndex(e => e[c.EstadoAmbitoGestion])
          const j = agrupacion[c.Juzgado ? c.Juzgado : 'Nulo'].findIndex(e => e['Nulo'])

          if (i >= 0) {
            agrupacion[c.Juzgado ? c.Juzgado : 'Nulo'][i][c.EstadoAmbitoGestion].push(c)
          } else if (!c.EstadoAmbitoGestion) {
            agrupacion[c.Juzgado ? c.Juzgado : 'Nulo'][j]['Nulo'].push(c)
          }
        })

        this.AmbitosGestion.forEach(j => {
          agrupacion[j].sort((a, b) => a.Orden - b.Orden)

          agrupacion[j].forEach(a => {
            const estado = Object.keys(a).filter(c => c !== 'Orden')[0]

            a[estado].sort((a, b) => { return new Date(b.FechaEstado).getTime() > new Date(a.FechaEstado).getTime() ? 1 : -1 })

            for (var i = a[estado].length - 1; i >= 0; i--) {
              if (a[estado].indexOf(a[estado][i]) !== i) { a[estado].splice(i, 1) }
            }

            casosAux = casosAux.concat(a[estado])
          })
        })
        agrupacion['Nulo'].forEach(a => {
          const estado = Object.keys(a).filter(c => c !== 'Orden')[0]

          a[estado].sort((a, b) => { return new Date(b.FechaEstado).getTime() > new Date(a.FechaEstado).getTime() ? 1 : -1 })

          for (var i = a[estado].length - 1; i >= 0; i--) {
            if (a[estado].indexOf(a[estado][i]) !== i) { a[estado].splice(i, 1) }
          }

          casosAux = casosAux.concat(a[estado])
        })

        for (var i = casosAux.length - 1; i >= 0; i--) {
          if (casosAux.indexOf(casosAux[i]) !== i) { casosAux.splice(i, 1) }
        }

        return this.filtrarDatos(casosAux)
      }

      return casos
    }
  },
  watch: {
    busqueda () {
      this.casos = []
      this.casosTodos = []
      this.casosSinTel = []
      this.loading = true
      this.onLoad(0, () => {})
    },
    orden () {
      if (this.orden) {
        this.casos = this.casos.sort((a, b) => {
          if (a.Caratula.toLowerCase() > b.Caratula.toLowerCase()) {
            return 1
          }
          if (a.Caratula.toLowerCase() < b.Caratula.toLowerCase()) {
            return -1
          }
          return 0
        })
      } else {
        this.casos = this.casos.sort((a, b) => {
          if (a.FechaAlta < b.FechaAlta) {
            return 1
          }
          if (a.FechaAlta > b.FechaAlta) {
            return -1
          }
          return 0
        })
      }
    },
    selectAll () {
      this.buscarCaso.forEach(c => {
        c.model = this.selectAll
        this.selectAll ? this.CasosMensaje[c.IdCaso] = c : delete this.CasosMensaje[c.IdCaso]
      })
    }
  },
  methods: {
    onLoad (index, done) {
      request.Get(
        '/casos/buscar',
        {
          Offset: this.casosTodos.length,
          Cadena: this.busqueda,
          Tipo: this.tipoBusqueda.toUpperCase()
        },
        (r) => {
          if (!r.Error) {
            r.forEach((c) => {
              try {
                c.PersonasCaso = JSON.parse(c.PersonasCaso)
              } catch (error) {
                console.log(error)
                c.PersonasCaso = []
              }
              c.Comparticiones = JSON.parse(c.Comparticiones)

              c.model = false

              this.casos.push(c)
              this.casosTodos.push(c)

              let check = false
              c.PersonasCaso.forEach(p => {
                if (p.Telefonos) { check = true }
              })

              if (!check) { this.casosSinTel.push(c) }
            })
            this.filtrarCasosSinTel()
            this.casos = this.casos.sort((a, b) => {
              if (a.FechaAlta < b.FechaAlta) {
                return 1
              }
              if (a.FechaAlta > b.FechaAlta) {
                return -1
              }
              return 0
            })
          }
          for (var i = this.casos.length - 1; i >= 0; i--) {
            if (this.casos.indexOf(this.casos[i]) !== i) { this.casos.splice(i, 1) }
          }
          for (var j = this.casosTodos.length - 1; j >= 0; j--) {
            if (this.casosTodos.indexOf(this.casos[j]) !== j) { this.casosTodos.splice(j, 1) }
          }
          this.loading = false
          if (r.length > 0) { this.onLoad(0, () => {}) }
          this.noHayMasCasos = r.length === 0
          done()
        }
      )
    },
    abrirCaso (id) {
      this.$router.push({
        path: `/Caso?id=${id}`
      })
    },
    filtrarArchivados () {
      if (this.verAlta && this.verArchivados) {
        this.estado = 'T'
      } else if (this.verArchivados) {
        this.estado = 'R'
      } else if (this.verAlta) {
        this.estado = 'A'
      } else {
        this.estado = 'A'
      }
    },
    filtrar () {
      switch (true) {
        case this.verActivos && this.verPendientes && this.verFinalizados:
          this.estadoCaso = 'T'
          break
        case this.verActivos && this.verPendientes && !this.verFinalizados:
          this.estadoCaso = 'AP'
          break
        case this.verActivos && !this.verPendientes && this.verFinalizados:
          this.estadoCaso = 'AF'
          break
        case !this.verActivos && this.verPendientes && this.verFinalizados:
          this.estadoCaso = 'PF'
          break
        case this.verActivos && !this.verPendientes && !this.verFinalizados:
          this.estadoCaso = 'A'
          break
        case !this.verActivos && this.verPendientes && !this.verFinalizados:
          this.estadoCaso = 'P'
          break
        case !this.verActivos && !this.verPendientes && this.verFinalizados:
          this.estadoCaso = 'F'
          break
        case !this.verActivos && !this.verPendientes && !this.verFinalizados:
          this.estadoCaso = 'T'
          break
      }
    },
    filtrarDatos (casos) {
      let filter = casos
      filter = this.filtrarTipoCaso(filter)
      filter = this.filtrarEstadoAmbitoGestion(filter)
      filter = this.filtrarOrigen(filter)
      filter = this.filtrarAmbito(filter)
      filter = this.filtrarNominacion(filter)
      return filter
    },
    filtrarTipoCaso (filter) {
      if (this.TipoCaso.length === 0 || this.TipoCaso[this.TipoCaso.length - 1] === 'Todos') {
        this.TipoCaso = ['Todos']
      }
      if (this.TipoCaso.length > 1 && this.TipoCaso.includes('Todos')) {
        const i = this.TipoCaso.indexOf('Todos')
        this.TipoCaso.splice(i, 1)
      }
      if (!this.TipoCaso.includes('Todos')) {
        filter = filter.filter(f => this.TipoCaso.includes(f.TipoCaso))
      }
      return filter
    },
    filtrarEstadoAmbitoGestion (filter) {
      if (this.EstadoAmbitoGestion.length === 0 || this.EstadoAmbitoGestion[this.EstadoAmbitoGestion.length - 1] === 'Todos') {
        this.EstadoAmbitoGestion = ['Todos']
      }
      if (this.EstadoAmbitoGestion.length > 1 && this.EstadoAmbitoGestion.includes('Todos')) {
        const i = this.EstadoAmbitoGestion.indexOf('Todos')
        this.EstadoAmbitoGestion.splice(i, 1)
      }
      if (!this.EstadoAmbitoGestion.includes('Todos')) {
        this.EstadoAmbitoGestion.includes('Sin estado')
          ? filter = filter.filter(f => this.EstadoAmbitoGestion.includes(f.EstadoAmbitoGestion) || !f.EstadoAmbitoGestion)
          : filter = filter.filter(f => this.EstadoAmbitoGestion.includes(f.EstadoAmbitoGestion))
      }
      return filter
    },
    filtrarOrigen (filter) {
      if (this.Origen.length === 0 || this.Origen[this.Origen.length - 1] === 'Todos') {
        this.Origen = ['Todos']
      }
      if (this.Origen.length > 1 && this.Origen.includes('Todos')) {
        const i = this.Origen.indexOf('Todos')
        this.Origen.splice(i, 1)
      }
      if (!this.Origen.includes('Todos')) {
        this.Origen.includes('Sin origen')
          ? filter = filter.filter(f => this.Origen.includes(f.Origen) || !f.Origen)
          : filter = filter.filter(f => this.Origen.includes(f.Origen))
      }
      return filter
    },
    filtrarAmbito (filter) {
      if (this.Ambito.length === 0 || this.Ambito[this.Ambito.length - 1] === 'Todos') {
        this.Ambito = ['Todos']
      }
      if (this.Ambito.length > 1 && this.Ambito.includes('Todos')) {
        const i = this.Ambito.indexOf('Todos')
        this.Ambito.splice(i, 1)
      }
      if (!this.Ambito.includes('Todos')) {
        filter = filter.filter(f => this.Ambito.includes(f.Juzgado))
      }
      return filter
    },
    filtrarNominacion (filter) {
      if (this.Nominacion.length === 0 || this.Nominacion[this.Nominacion.length - 1] === 'Todos') {
        this.Nominacion = ['Todos']
      }
      if (this.Nominacion.length > 1 && this.Nominacion.includes('Todos')) {
        const i = this.Nominacion.indexOf('Todos')
        this.Nominacion.splice(i, 1)
      }
      if (!this.Nominacion.includes('Todos')) {
        this.Nominacion.includes('Sin nominacion')
          ? filter = filter.filter(f => this.filtroNom(f.Nominacion) || !f.Nominacion || f.Nominacion === 'Sin nom')
          : filter = filter.filter(f => this.filtroNom(f.Nominacion))
      }
      return filter
    },
    filtroNom (nominacion) {
      if (nominacion) {
        if (isNaN(parseInt(nominacion[0]))) {
          return this.Nominacion.includes(nominacion)
        } else if (parseInt(nominacion[0]) === 0) {
          return this.Nominacion.includes(nominacion) || this.Nominacion.includes(nominacion.slice(0, -1))
        } else {
          return this.Nominacion.includes(nominacion[0] + '°')
        }
      } else {
        return false
      }
    },
    diasCambioEstado (FechaEstado) {
      if (!FechaEstado) {
        return 'No hay un estado asignado.'
      }
      var fecha = new Date()
      var hoy = new Date()
      var year = FechaEstado.split('-')[0]
      var month = FechaEstado.split('-')[1] - 1
      var day = FechaEstado.split('-')[2].split(' ')[0] - 1
      fecha.setMonth(month)
      fecha.setFullYear(year)
      fecha.setDate(day)
      var resultado =
        Math.ceil(
          (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      return resultado * -1 !== 1 ? `${resultado * -1} días` : `${resultado * -1} día`
    },
    filtrarCasosSinTel () {
      this.verSinTel
        ? this.casos = this.casosSinTel
        : this.casos = this.casosTodos
    },
    verComparticiones (caso) {
      if (caso.Comparticiones) {
        this.casoCompartido = caso
        this.modalComparticiones = true
      }
    },
    eliminarComparticiones (IdsEstudios, IdCaso) {
      const i = this.casos.findIndex(c => c.IdCaso === IdCaso)

      if (i > 0) {
        let indexes = []

        IdsEstudios.forEach(r => {
          const index = this.casos.Comparticiones.EstudiosDestino.findIndex(e => e.IdEstudio === r)

          if (index > 0) { indexes.push(index) }
        })

        if (indexes.length > 0) {
          indexes.forEach(r => {
            this.casos.Comparticiones.EstudiosDestino.splice(r, 0)
          })
        }
      }
    },
    casosMensajeGlobal () {
      const keys = Object.keys(this.CasosMensaje)
      let casos = []

      keys.forEach(i => {
        let check = false
        this.CasosMensaje[i].PersonasCaso.forEach(p => {
          if (p.Telefonos) { check = true }
        })

        if (check) { casos.push(this.CasosMensaje[i]) }
      })

      if (casos.length < keys.length && this.ModalMensaje) {
        Notify.create('Algunos de los casos seleccionados no tienen telefonos asociados.')
        return casos
      }

      return casos
    },
    mensajeEnviado () {
      this.selectAll = false
      this.CasosMensaje = []
      this.casos.forEach(c => {
        c.model = false
      })

      this.ModalMensaje = false
    },
    showSelect (ref) {
      const s = 'select' + ref
      if (!this.show[ref]) {
        this.$refs[s].showPopup()
        this.show[ref] = true
      } else {
        this.$refs[s].hidePopup()
        this.show[ref] = false
      }
    },
    showFiltros () {
      this.filtros
        ? this.$refs.expansionFiltros.hide()
        : this.$refs.expansionFiltros.show()

      this.filtros = !this.filtros
    },
    nominacion (nom) {
      const n = {
        0: 'Pendiente',
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX'
      }
      const i = nom ? nom.slice(0, 1) : '-'
      return n[i] ? n[i] : '···'
    },
    caratula (c) {
      if (!c) {
        return 'Sin Caratula'
      }

      return c.length > 25
        ? c.slice(0, 23) + '...'
        : c
    }
  }
}
</script>

<style>
.opacity-9 {
  opacity: 0.9;
}

.casos__container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0px;
  margin: 0px;
}

.casilla_container, .filas div, .opciones-container > div {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

.opciones-container {
  margin: 20px auto 0px auto;
  width: 21%;
}

.opciones-container .separador_titulo {
  height: 100%;
}

.casilla_container i {
  cursor: pointer;
}

.casilla_container .q-select {
  visibility: hidden;
  width: 0px;
}

.casos__container > div {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
}

.filas_container, .titulos_container {
  background-color: #ffffff;
  width: 100%;
  color: #000 !important;
  height : 60px;
  margin-top:15px;
  padding: 0;
  border-radius : 7px;
  -moz-border-radius : 7px;
  -webkit-border-radius : 7px;
}

.titulos_container {
  font-family: "Avenir Next";
  font-weight: bold;
  height : 70px;
  font-size: 16px;
}

.filtros-container {
  margin-bottom: 60px;
}

.filtros-container .q-item {
  display: none;
}

.busqueda-input {
  border-radius: 28px;
  background-color: white;
  width: auto;
  max-width: 584px;
  height: 44px;
  margin: 60px auto 0px auto;
}

.busqueda-input .q-field__control, .busqueda-input .q-field__marginal {
  height: 44px !important;
}

.filas {
  background : -moz-linear-gradient(50% 100% 90deg,rgba(255, 255, 255, 0.5) 0%,rgba(253, 253, 253, 0.5) 30.79%,rgba(244, 244, 244, 0.5) 49.03%,rgba(230, 230, 230, 0.5) 64%,rgba(210, 210, 210, 0.5) 77.19%,rgba(184, 184, 184, 0.5) 89.1%,rgba(153, 153, 153, 0.5) 100%);
  background : -webkit-linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(253, 253, 253, 0.5) 30.79%, rgba(244, 244, 244, 0.5) 49.03%, rgba(230, 230, 230, 0.5) 64%, rgba(210, 210, 210, 0.5) 77.19%, rgba(184, 184, 184, 0.5) 89.1%, rgba(153, 153, 153, 0.5) 100%);
  background : -webkit-gradient(linear,50% 100% ,50% 0% ,color-stop(0,rgba(255, 255, 255, 0.5) ),color-stop(0.3079,rgba(253, 253, 253, 0.5) ),color-stop(0.4903,rgba(244, 244, 244, 0.5) ),color-stop(0.64,rgba(230, 230, 230, 0.5) ),color-stop(0.7719,rgba(210, 210, 210, 0.5) ),color-stop(0.891,rgba(184, 184, 184, 0.5) ),color-stop(1,rgba(153, 153, 153, 0.5) ));
  background : -o-linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(253, 253, 253, 0.5) 30.79%, rgba(244, 244, 244, 0.5) 49.03%, rgba(230, 230, 230, 0.5) 64%, rgba(210, 210, 210, 0.5) 77.19%, rgba(184, 184, 184, 0.5) 89.1%, rgba(153, 153, 153, 0.5) 100%);
  background : -ms-linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(253, 253, 253, 0.5) 30.79%, rgba(244, 244, 244, 0.5) 49.03%, rgba(230, 230, 230, 0.5) 64%, rgba(210, 210, 210, 0.5) 77.19%, rgba(184, 184, 184, 0.5) 89.1%, rgba(153, 153, 153, 0.5) 100%);
  -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFF', endColorstr='#999999' ,GradientType=0)";
  background : linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(253, 253, 253, 0.5) 30.79%, rgba(244, 244, 244, 0.5) 49.03%, rgba(230, 230, 230, 0.5) 64%, rgba(210, 210, 210, 0.5) 77.19%, rgba(184, 184, 184, 0.5) 89.1%, rgba(153, 153, 153, 0.5) 100%);
  filter: alpha(opacity=50) progid:DXImageTransform.Microsoft.Alpha(opacity=50) progid:DXImageTransform.Microsoft.gradient(startColorstr='#999999',endColorstr='#FFFFFF' , GradientType=0);
  padding: inherit;
  border-radius : inherit;
  -moz-border-radius : inherit;
  -webkit-border-radius : inherit;
  width: inherit;
  height: inherit;
  font-family: "Avenir Next";
  font-weight: 600;
}

.check_casilla {
  margin-left: -3px;
  margin-right: 4px;
}

.separador_titulo {
  height: 45%;
  width: 2px;
  position: absolute;
  right: -1px;
}

.opciones-container .q-toggle__thumb::after {
  background-color: #81E2CE !important;
}

.opciones-container .q-toggle__inner--truthy {
  color: #81E2CE !important;
}

@media only screen and (max-width: 1023px) {
  .filas > div:not(.cliente), .titulos_container > div:not(.cliente) {
    display: none !important;
  }

  .cliente {
    width: 100% !important;
  }

  .opciones-container {
    width: 50%;
  }
}

@media only screen and (max-device-width: 600px) {
  .q-btn-group {
    margin: 0.5em -0.5em 0.5em -0.5em !important;
  }

  .opciones-container {
    width: 75%;
  }
}
</style>
