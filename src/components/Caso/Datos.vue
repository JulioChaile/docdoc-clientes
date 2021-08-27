<template>
  <div class="row container">
    <div class="col-12">
      <!-- Datos del caso como archivo -->
      <div class="row">
        <div class="col-12 col-sm-6">
          <data-item
            :text="datos.Caratula"
            text-class="text-weight-medium text-h4"
            label="Caratula"
            labelColor="accent"
          />
          <q-tooltip>{{ datos.Caratula }}</q-tooltip>
        </div>
        <!--q-space></q-space>
        <div class="col-12 col-sm-6 contenedor_badges">
          <div class="row q-pt-md">
          <div class="col-6 col-sm-12 col-lg-10 estado">
            <q-badge :color="colorEstado()" class="text-uppercase text-body2 q-px-xl badge">{{ estado() }}</q-badge>
          </div>
          <div class="col-6 col-sm-12 col-lg-2 expediente">
            <q-badge
              color="black"
              outline
              class="text-uppercase text-body2 q-px-lg badge"
            >
              Nro: {{ datos.NroExpediente ? datos.NroExpediente : '--' }}
            </q-badge>
          </div>
        </div-->
      </div>
    </div>
  </div>
</template>

<script>
import request from '../../request'
import { Notify } from 'quasar'
import moment from 'moment'
import DataItem from '../Compartidos/DataItem'
import EditableInput from '../Compartidos/EditableInput'
import EditableSelect from '../Compartidos/EditableSelect'
import CompartirCaso from '../Caso/CompartirCaso'
import ObjetivosCaso from '../Caso/ObjetivosCaso'
import MovimientosCaso from '../Caso/MovimientosCaso'
import ArchivarCaso from '../Caso/ArchivarCaso'
import EliminarCaso from '../Caso/EliminarCaso'

export default {
  name: 'Datos',
  props: {
    datos: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DataItem,
    EditableInput,
    EditableSelect,
    CompartirCaso,
    ObjetivosCaso,
    MovimientosCaso,
    ArchivarCaso,
    EliminarCaso
  },
  data () {
    return {
      modoEdicion: false,
      origenes: [],
      nominaciones: [],
      competencias: [],
      tiposCaso: [],
      ambitosGestion: [],
      estadosAmbitoGestion: [],
      caratulaEditable: '',
      DataOpcionesOrigenes: [],
      DataOpcionesNominaciones: [],
      DataOpcionesCompetencias: [],
      DataOpcionesTiposCaso: [],
      DataOpcionesAmbitosGestion: [],
      DataOpcionesEstadoAmbitoGestion: [],
      mensajes: [],
      loading: false,
      compartir: false,
      archivar: false,
      eliminar: false,
      opcionesDummy: ['a', 'b'],
      casoViejo: false,
      origenDefault: {},
      datosEditar: {},
      checkEdicion: false,
      verObjetivos: false,
      verMovimientos: false,
      FechaEstado: '',

      // valores elegidos en la edicion:
      origenSeleccionado: '',
      idOrigenSeleccionado: '',

      nominacionSeleccionada: '',
      idNominacionSeleccionada: '',

      competenciaSeleccionada: '',
      idCompetenciaSeleccionada: '',

      tipoCasoSeleccionado: '',
      idTipoCasoSeleccionado: '',

      ambitoGestionSeleccionado: '',
      idAmbitoGestionSeleccionado: '',

      estadoAmbitoGestionSeleccionado: '',
      idEstadoAmbitoGestionSeleccionado: ''
    }
  },
  computed: {
    opcionesOrigenes () {
      return this.DataOpcionesOrigenes
    },
    opcionesNominaciones () {
      return this.DataOpcionesNominaciones
    },
    opcionesCompetencias () {
      return this.DataOpcionesCompetencias
    },
    opcionesTiposCaso () {
      return this.DataOpcionesTiposCaso
    },
    opcionesAmbitosGestion () {
      return this.DataOpcionesAmbitosGestion
    },
    opcionesEstadoAmbitoGestion () {
      return this.DataOpcionesEstadoAmbitoGestion
    }
  },
  methods: {
    habilitarEdicion () {
      this.modoEdicion = true
      this.checkEdicion = true
      this.caratulaEditable = this.datos.Caratula
      this.nroExpedienteEditable = this.datos.NroExpediente

      this.datosEditar.Origen = this.datos.Origen
      this.datosEditar.Competencia = this.datos.Competencia
      this.datosEditar.TipoCaso = this.datos.TipoCaso
      this.datosEditar.Juzgado = this.datos.Juzgado
      this.datosEditar.Nominacion = this.datos.Nominacion
      this.datosEditar.EstadoAmbitoGestion = this.datos.EstadoAmbitoGestion
      this.FechaEstado = this.datos.FechaEstado.split(' ')[0].split('-').reverse().join('-')

      // lleno todas las opciones
      this.traerCompetencias()
      this.traerOrigenes()
      this.traerAmbitosGestion(this.datos.IdTipoCaso)
      this.traerEstadosAmbitoGestion(this.datos.IdJuzgado)
      this.traerNominaciones(this.datos.IdJuzgado)

      this.origenSeleccionado = this.datos.Origen ? this.datos.Origen : this.origenDefault.Origen
      this.idOrigenSeleccionado = this.datos.IdOrigen ? this.datos.IdOrigen : this.origenDefault.IdOrigen
      this.nominacionSeleccionada = this.datos.Nominacion
      this.idNominacionSeleccionada = this.datos.IdNominacion
      this.competenciaSeleccionada = this.datos.Competencia
      this.idCompetenciaSeleccionada = this.datos.IdCompetencia
      this.tipoCasoSeleccionado = this.datos.TipoCaso
      this.idTipoCasoSeleccionado = this.datos.IdTipoCaso
      this.ambitoGestionSeleccionado = this.datos.Juzgado
      this.idAmbitoGestionSeleccionado = this.datos.IdJuzgado
      this.estadoAmbitoGestionSeleccionado = this.datos.EstadoAmbitoGestion
      this.idEstadoAmbitoGestionSeleccionado = this.datos.IdEstadoAmbitoGestion
    },
    traerCompetencias () {
      request.Get('/competencias', {}, (r) => {
        if (!r.Error) {
          this.competencias = r
          r.forEach(competencia => {
            this.DataOpcionesCompetencias.push(competencia.Competencia)
          })
          const CompetenciaObject = this.competencias.filter(item => item.Competencia === this.datos.Competencia)[0]
          for (var key in CompetenciaObject.TiposCaso) {
            this.DataOpcionesTiposCaso.push(CompetenciaObject.TiposCaso[key].TipoCaso) // voy insertando los tipos caso en el array de las opciones para la edicion posterior
          }
          // Guardo los tipos caso de la competencia seleccionada para utilizarlos luego
          Object.entries(CompetenciaObject.TiposCaso).forEach(
            ([IdTipoCaso, TipoCaso]) => {
              if (TipoCaso.Estado === 'A') {
                let tipocaso = {
                  IdTipoCaso: IdTipoCaso,
                  TipoCaso: TipoCaso.TipoCaso
                }
                this.tiposCaso.push(tipocaso)
              }
            }
          )
        } else {
          Notify.create(r.Error)
        }
      })
    },
    traerOrigenes () {
      request.Get('/origenes', {}, (r) => {
        if (!r.Error) {
          this.origenes = r
          r.forEach(item => {
            this.opcionesOrigenes.push(item.Origen)
          })
          this.origenDefault = this.origenes[0]
        } else {
          Notify.create(r.Error)
        }
      })
    },
    traerAmbitosGestion (id) {
      request.Get(`/tipos-caso/${id}/juzgados`, {}, r => {
        if (!r.Error) {
          this.ambitosGestion = r.Juzgados
          r.Juzgados.forEach(item => {
            this.DataOpcionesAmbitosGestion.push(item.Juzgado)
          })
        } else {
          console.log('hubo error al traer ambitos de gestion')
        }
      })
    },
    traerEstadosAmbitoGestion (id) {
      request.Get(`/estado-ambito-gestion/estados-juzgado?id=${id}`, {}, r => {
        if (!r.Error) {
          this.estadosAmbitoGestion.splice(0)
          this.mensajes.splice(0)
          if (r.EstadoAmbitoGestion) {
            Object.entries(r.EstadoAmbitoGestion).forEach(
              ([orden, estadoambitogestion, idestado]) => {
                let e = {
                  Orden: estadoambitogestion.Orden,
                  EstadoAmbitoGestion: estadoambitogestion.EstadoAmbitoGestion,
                  IdEstadoAmbitoGestion: estadoambitogestion.IdEstadoAmbitoGestion
                }
                let m = {
                  IdEstadoAmbitoGestion: estadoambitogestion.IdEstadoAmbitoGestion,
                  Mensaje: estadoambitogestion.Mensaje
                }
                this.estadosAmbitoGestion.push(e)
                this.mensajes.push(m)
              }
            )
            this.estadosAmbitoGestion.sort((a, b) => {
              if (a.Orden > b.Orden) {
                return 1
              }
              if (a.Orden < b.Orden) {
                return -1
              }
              if (a.Orden === b.Orden) {
                return 0
              }
            })
            this.DataOpcionesEstadoAmbitoGestion.splice(0)
            this.estadosAmbitoGestion.forEach(item => {
              this.DataOpcionesEstadoAmbitoGestion.push(item.EstadoAmbitoGestion)
            })

            if (!this.checkEdicion) { this.datosEditar.EstadoAmbitoGestion = this.estadosAmbitoGestion[0].EstadoAmbitoGestion }
            this.seleccionoEstadoAmbitoGestion(this.datosEditar.EstadoAmbitoGestion)
          } else {
            let e = {
              Orden: 1,
              EstadoAmbitoGestion: 'Sin estado',
              IdEstadoAmbitoGestion: 0
            }
            let m = {
              IdEstadoAmbitoGestion: 0,
              Mensaje: ''
            }
            this.estadosAmbitoGestion.push(e)
            this.mensajes.push(m)
            this.DataOpcionesEstadoAmbitoGestion.splice(0)
            this.estadosAmbitoGestion.forEach(item => {
              this.DataOpcionesEstadoAmbitoGestion.push(item.EstadoAmbitoGestion)
            })

            if (!this.checkEdicion) { this.datosEditar.EstadoAmbitoGestion = this.estadosAmbitoGestion[0].EstadoAmbitoGestion }
            this.seleccionoEstadoAmbitoGestion(this.datosEditar.EstadoAmbitoGestion)
          }
        } else {
          Notify.create(r.Error)
        }
      })
    },
    traerNominaciones (id) {
      request.Get(`/nominaciones?IdsJuzgado=${JSON.stringify([id])}&IncluyeBajas=N`, {}, r => {
        if (!r.Error) {
          this.nominaciones.splice(0)
          for (var item in r) {
            r[item].forEach(nom => {
              this.DataOpcionesNominaciones.push(nom.Nominacion)
              this.nominaciones.push(nom)
            })
          }
          if (this.nominaciones.length === 0) {
            this.DataOpcionesNominaciones.push('Sin Nom')
            if (!this.checkEdicion) { this.datosEditar.Nominacion = 'Sin nom' }
          } else {
            if (!this.checkEdicion) {
              if (this.nominaciones.filter(n => n.Nominacion === this.datosEditar.Nominacion).length === 0) {
                if (this.nominaciones.findIndex(n => n.Nominacion[0] === this.datosEditar.Nominacion[0]) >= 0) {
                  const i = this.nominaciones.findIndex(n => n.Nominacion[0] === this.datosEditar.Nominacion[0])
                  this.datosEditar.Nominacion = this.nominaciones[i].Nominacion
                } else {
                  this.datosEditar.Nominacion = this.nominaciones[0].Nominacion
                }
              }
            }
          }
          this.seleccionoNominacion(this.datosEditar.Nominacion)
        } else {
          Notify.create(r.Error)
        }

        setTimeout(() => { this.checkEdicion = false }, 500)
      })
    },

    seleccionoOrigen (origen) {
      const id = this.origenes.filter(item => item.Origen === origen)[0].IdOrigen
      this.origenSeleccionado = origen
      this.idOrigenSeleccionado = id
    },
    seleccionoCompetencia (competencia) {
      // Dejo vacios los datos seleccionados para volver a llenarlos
      this.tipoCasoSeleccionado = ''
      this.idTipoCasoSeleccionado = ''

      this.ambitoGestionSeleccionado = ''
      this.idAmbitoGestionSeleccionado = ''

      this.estadoAmbitoGestionSeleccionado = ''
      this.idEstadoAmbitoGestionSeleccionado = ''

      this.nominacionSeleccionada = ''
      this.idNominacionSeleccionada = ''

      // Busco el id correspondiente a la competencia que eligió el usuario
      const id = this.competencias.filter(item => item.Competencia === competencia)[0].IdCompetencia

      // Armo el objeto Competencia con la Competencia seleccionada por el usuario
      const CompetenciaObject = this.competencias.filter(item => item.Competencia === competencia)[0]
      // Guardo los tipos caso de la competencia seleccionada para utilizarlos luego
      this.tiposCaso.splice(0)
      Object.entries(CompetenciaObject.TiposCaso).forEach(
        ([IdTipoCaso, TipoCaso]) => {
          if (TipoCaso.Estado === 'A') {
            let tipocaso = {
              IdTipoCaso: IdTipoCaso,
              TipoCaso: TipoCaso.TipoCaso
            }
            this.tiposCaso.push(tipocaso)
          }
        }
      )

      // Recorro la propiedad TiposCaso de ese objeto Competencia (TiposCaso tiene los tipos casos relacionados a esa competencia)
      this.DataOpcionesTiposCaso.splice(0)
      for (var key in CompetenciaObject.TiposCaso) {
        this.DataOpcionesTiposCaso.push(CompetenciaObject.TiposCaso[key].TipoCaso) // voy insertando los tipos caso en el array de las opciones para la edicion posterior
      }
      this.competenciaSeleccionada = competencia
      this.idCompetenciaSeleccionada = id

      this.datosEditar.TipoCaso = this.tiposCaso[0].TipoCaso
      this.seleccionoTipoCaso(this.tiposCaso[0].TipoCaso)
    },
    seleccionoTipoCaso (tipoCaso) {
      // Dejo vacios los datos seleccionados para volver a llenarlos
      this.ambitoGestionSeleccionado = ''
      this.idAmbitoGestionSeleccionado = ''

      this.estadoAmbitoGestionSeleccionado = ''
      this.idEstadoAmbitoGestionSeleccionado = ''

      this.nominacionSeleccionada = ''
      this.idNominacionSeleccionada = ''

      const id = this.tiposCaso.filter(item => item.TipoCaso === tipoCaso)[0].IdTipoCaso
      this.DataOpcionesAmbitosGestion.splice(0)
      this.traerAmbitosGestion(id)
      this.tipoCasoSeleccionado = tipoCaso
      this.idTipoCasoSeleccionado = id

      if (this.ambitosGestion.filter(a => a.Juzgado === this.datosEditar.Juzgado).length === 0) {
        this.datosEditar.Juzgado = this.ambitosGestion[0].Juzgado
      }
      this.seleccionoAmbitoGestion(this.datosEditar.Juzgado)
    },
    seleccionoAmbitoGestion (ambitoGestion) {
      this.datosEditar.Juzgado = ambitoGestion

      // Dejo vacios los datos seleccionados para volver a llenarlos
      this.estadoAmbitoGestionSeleccionado = ''
      this.idEstadoAmbitoGestionSeleccionado = ''

      this.nominacionSeleccionada = ''
      this.idNominacionSeleccionada = ''

      // Busco estados ambito de gestion
      this.ambitoGestionSeleccionado = ambitoGestion
      this.idAmbitoGestionSeleccionado = this.ambitosGestion.filter(item => item.Juzgado === ambitoGestion)[0].IdJuzgado

      this.DataOpcionesEstadoAmbitoGestion.splice(0)
      this.traerEstadosAmbitoGestion(this.idAmbitoGestionSeleccionado)

      // Traigo nominaciones
      this.DataOpcionesNominaciones.splice(0)
      this.traerNominaciones(this.idAmbitoGestionSeleccionado)
    },
    seleccionoEstadoAmbitoGestion (estadoAmbitoGestion) {
      const id = this.estadosAmbitoGestion.filter(item => item.EstadoAmbitoGestion === estadoAmbitoGestion)[0].IdEstadoAmbitoGestion
      this.idEstadoAmbitoGestionSeleccionado = id
      this.estadoAmbitoGestionSeleccionado = estadoAmbitoGestion
      if (this.estadoAmbitoGestionSeleccionado === this.datos.EstadoAmbitoGestion) {
        this.FechaEstado = this.datos.FechaEstado.split(' ')[0].split('-').reverse().join('-')
      } else {
        this.FechaEstado = moment().format('DD-MM-YYYY')
      }
    },
    seleccionoNominacion (nominacion) {
      const id = nominacion !== 'Sin nom' ? this.nominaciones.filter(item => item.Nominacion === nominacion)[0].IdNominacion : 0
      this.idNominacionSeleccionada = id
      this.nominacionSeleccionada = nominacion
    },
    guardarEdicion () {
      if (this.caratulaEditable === '' || this.competenciaSeleccionada === '' || this.tipoCasoSeleccionado === '' || this.ambitoGestionSeleccionado === '') {
        Notify.create('Por favor, complete todos los campos para poder realizar la edición')
      } else {
        const Mensaje = this.mensajes.filter(e => e.IdEstadoAmbitoGestion === parseInt(this.idEstadoAmbitoGestionSeleccionado)).length === 0
          ? null
          : this.mensajes.filter(e => e.IdEstadoAmbitoGestion === parseInt(this.idEstadoAmbitoGestionSeleccionado))[0].Mensaje

        this.modoEdicion = false
        this.competencias = []
        this.tiposCaso = []
        this.ambitosGestion = []
        this.nominaciones = []
        this.origenes = []
        this.estadosAmbitoGestion = []
        this.DataOpcionesOrigenes = []
        this.DataOpcionesNominaciones = []
        this.DataOpcionesCompetencias = []
        this.DataOpcionesTiposCaso = []
        this.DataOpcionesAmbitosGestion = []
        this.DataOpcionesEstadoAmbitoGestion = []

        const datosModificados = {

          Caratula: this.caratulaEditable,

          NroExpediente: this.nroExpedienteEditable,

          Origen: this.origenSeleccionado,
          IdOrigen: this.idOrigenSeleccionado,

          Nominacion: this.nominacionSeleccionada,
          IdNominacion: this.idNominacionSeleccionada,

          Competencia: this.competenciaSeleccionada,
          IdCompetencia: this.idCompetenciaSeleccionada,

          TipoCaso: this.tipoCasoSeleccionado,
          IdTipoCaso: this.idTipoCasoSeleccionado,

          AmbitoGestion: this.ambitoGestionSeleccionado,
          IdJuzgado: this.idAmbitoGestionSeleccionado,

          EstadoAmbitoGestion: this.estadoAmbitoGestionSeleccionado,
          IdEstadoAmbitoGestion: this.idEstadoAmbitoGestionSeleccionado,

          Mensaje: Mensaje,

          FechaEstado: this.FechaEstado
        }
        this.datos.Caratula = datosModificados.Caratula
        this.datos.NroExpediente = datosModificados.NroExpediente
        this.datos.Origen = datosModificados.Origen
        this.datos.IdOrigen = datosModificados.IdOrigen
        this.datos.Competencia = datosModificados.Competencia
        this.datos.IdCompetencia = datosModificados.IdCompetencia
        this.datos.TipoCaso = datosModificados.TipoCaso
        this.datos.IdTipoCaso = datosModificados.IdTipoCaso
        this.datos.Juzgado = datosModificados.AmbitoGestion
        this.datos.IdJuzgado = datosModificados.IdJuzgado
        this.datos.Nominacion = datosModificados.Nominacion
        this.datos.IdNominacion = datosModificados.IdNominacion
        this.datos.EstadoAmbitoGestion = datosModificados.EstadoAmbitoGestion
        this.datos.IdEstadoAmbitoGestion = datosModificados.IdEstadoAmbitoGestion
        this.datos.FechaEstado = this.FechaEstado

        this.$emit('guardarDatosEditados', datosModificados)
      }
    },
    cancelarEdicion () {
      this.modoEdicion = false
      this.origenes = []
      this.nominaciones = []
      this.competencias = []
      this.tiposCaso = []
      this.ambitosGestion = []
      this.estadosAmbitoGestion = []
      this.caratulaEditable = this.datos.Caratula
      this.DataOpcionesOrigenes = []
      this.DataOpcionesNominaciones = []
      this.DataOpcionesCompetencias = []
      this.DataOpcionesTiposCaso = []
      this.DataOpcionesAmbitosGestion = []
      this.DataOpcionesEstadoAmbitoGestion = []
      this.disabled = 1
      this.datosEditar.Origen = this.datos.Origen
      this.datosEditar.Competencia = this.datos.Competencia
      this.datosEditar.TipoCaso = this.datos.TipoCaso
      this.datosEditar.Juzgado = this.datos.Juzgado
      this.datosEditar.Nominacion = this.datos.Nominacion
      this.datosEditar.EstadoAmbitoGestion = this.datos.EstadoAmbitoGestion
    },
    diasDesdeCreacion () {
      if (this.datos.FechaAlta) {
        var anoActual = new Date().getFullYear()
        var mesActual = new Date().getUTCMonth()
        var diaActual = new Date().getDate()
        const fechaActual = moment([anoActual, mesActual, diaActual])

        var anoFechaAlta = this.datos.FechaAlta ? this.datos.FechaAlta.slice(0, 4) : '--'
        var mesFechaAlta = this.datos.FechaAlta ? this.datos.FechaAlta.slice(5, 7) - 1 : '--'
        var diaFechaAlta = this.datos.FechaAlta ? this.datos.FechaAlta.slice(8, 10) : '--'
        const fechaAlta = moment([anoFechaAlta, mesFechaAlta, diaFechaAlta])

        if (fechaActual.diff(fechaAlta, 'days') > 0) {
          this.casoViejo = true
        }

        return `${fechaActual.diff(fechaAlta, 'days') > 0 ? fechaActual.diff(fechaAlta, 'days') : ''} ${this.calcularMensajeDias(fechaActual.diff(fechaAlta, 'days'))}`
      } else {
        return 'Sin fecha'
      }
    },
    diasDesdeVisita () {
      return '4'
    },
    calcularMensajeDias (diferencia) {
      switch (diferencia) {
        case 0:
          return 'HOY'
        case 1:
          return 'día'
        default:
          return 'días'
      }
    },
    colorEstado () {
      switch (this.datos.Estado) {
        case 'A':
          return 'green'
        case 'P':
          return 'warning'
        case 'R':
          return 'brown'
        default:
          return 'primary'
      }
    },
    estado () {
      switch (this.datos.Estado) {
        case 'A':
          return 'activo'
        case 'P':
          return 'pendiente'
        case 'R':
          return 'archivado'
        default:
          return 'sin estado'
      }
    },
    archivarCaso () {
      this.datos.Estado = 'R'
      this.archivar = false
    },
    eliminarCaso () {
      this.$router.push({
        name: 'Inicio'
      })
    },
    caratulaVer () {
      if (!this.datos.Caratula) { return 'Sin Caratula' }

      let caratula
      this.datos.Caratula.length > 35
        ? caratula = this.datos.Caratula.slice(0, 30) + '...'
        : caratula = this.datos.Caratula

      return caratula
    }
  }
}
</script>

<style scoped>
.no_padding {
  padding: 0 !important;
}
.fecha_container {
  border: 2px solid #1289a7;
  display: flex;
  justify-content: center;
  padding: 5px 0;
  border-radius: 0.4em;
}

.estado {
  display: flex;
  justify-content: flex-end;
}

.contenedor_fecha {
  background-image: linear-gradient(to right, #00605B, transparent);
  margin: 2px 0;
  padding: 8px;
  color: white;
}
@media screen and (max-width: 600px) {
  .estado {
    display: flex;
    justify-content: flex-start;
  }
  .expediente {
    display: flex;
    justify-content: flex-start;
  }
  .badge {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
}

.icono_editar {
  position: absolute;
  top: 12px;
  transition: all 0.2s linear;
}

.icono_editar:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

.icono_compartir {
  top: 10px;
  right: 30px;
  transition: all 0.2s linear;
}

.icono_compartir:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

.icono_objetivos {
  top: 10px;
  right: 90px;
  transition: all 0.2s linear;
}

.icono_objetivos:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

.icono_movimientos {
  top: 10px;
  right: 150px;
  transition: all 0.2s linear;
}

.icono_movimientos:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

.icono_archivar {
  top: 10px;
  right: 210px;
  transition: all 0.2s linear;
}

.icono_archivar:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

.icono_eliminar {
  top: 10px;
  right: 270px;
  transition: all 0.2s linear;
}

.icono_eliminar:hover {
  color:deepskyblue !important;
  cursor: pointer;
}

@media screen and (min-width: 1439px) {
  .contenedor_badges {
    padding-right: 100px;
  }
  .icono_editar {
    padding-right: 20px !important;
  }
}

@media screen and (min-width: 601px) and (max-width: 1439px) {
  .expediente {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
