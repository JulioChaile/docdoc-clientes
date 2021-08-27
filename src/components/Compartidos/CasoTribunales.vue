<template>
  <div>
    <!-- Contenido del caso (Movimientos) -->
    <TarjetaTribunales
      v-for="movimiento in movimientosDelCaso(computedMovimientos)"
      :key="movimiento.IdMovimientoCaso"
      :movimiento="movimiento"
      :idChat="parseInt(idChat)"
      :datosChat="datosChat"
      :ultimosMovimientos="ultimosMovimientos(movimiento).slice(0, 3)"
      @mostrarObjetivos="mostrarObjetivos(movimiento)"
      @realizarMovimiento="realizarMovimiento(movimiento, caso.IdCaso)"
      style="margin-bottom:0.6rem;"
    />
  </div>
</template>

<script>
import request from '../../request'
import { Notify } from 'quasar'
import TarjetaTribunales from '../TarjetaTribunales'
import NuevoMovimiento from '../NuevoMovimiento'
import Objetivos from './Objetivos'
import ObjetivosMovimiento from './ObjetivosMovimiento'
import NuevoObjetivo from './NuevoObjetivo'
import EditarObjetivo from './EditarObjetivo'
import TarjetaCaso from '../TarjetaCaso.vue'
import MovimientosCaso from '../Caso/MovimientosCaso'

export default {
  name: 'CasoTribunales',
  props: {
    caso: {
      type: Object,
      default: () => {}
    },
    movimientos: {
      type: Array,
      default: () => []
    },
    datosChat: {
      type: Object,
      default: () => {}
    },
    idChat: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      Objetivos: [],
      ObjSinMovs: [],
      movimientosRealizados: [],
      idMovimientoSeleccionado: '',
      modalAlta: false,
      movimientoAlta: {},
      Casos: {},
      modalObjetivos: false,
      modalObjetivosMovimiento: false,
      modalNuevoObjetivo: false,
      modalEditar: false,
      modalObjetivoLibre: false,
      objetivoEditar: {},
      modalCaso: false,
      IdObjetivoLibre: 0
    }
  },
  components: {
    TarjetaTribunales,
    NuevoMovimiento,
    Objetivos,
    NuevoObjetivo,
    ObjetivosMovimiento,
    EditarObjetivo,
    TarjetaCaso,
    MovimientosCaso
  },
  created () {
    this.traerObjetivos()

    request.Get(`/casos/${this.caso.IdCaso}/movimientos-realizados`, {}, (r) => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.movimientosRealizados = r
      }
    })
  },
  computed: {
    computedMovimientos () {
      return this.movimientos
    },
    computedObjSinMovs () {
      return this.ObjSinMovs
    }
  },
  methods: {
    movimientosDelCaso (movimientos) {
      var respuesta = []
      this.movimientos.forEach((m) => {
        if (!m.FechaRealizado) {
          if (m.Color === 'negative') {
            m.Orden = 1
          }
          if (m.Color === 'primary') {
            m.Orden = 2
          }
          if (m.Color === 'warning') {
            m.Orden = 3
          }
          respuesta.push(m)
        }
      })
      return respuesta.sort(function (a, b) {
        if (a.Color === 'positive') {
          return 1
        }
        if (b.Color === 'positive') {
          return -1
        }
        if (!a.Objetivo && !b.Objetivo) {
          if (a.Orden > b.Orden) {
            return 1
          }
          if (a.Orden < b.Orden) {
            return -1
          } else return 0
        }
        if (!a.Objetivo) {
          return 1
        }
        if (!b.Objetivo) {
          return -1
        }
        if (a.Objetivo > b.Objetivo) {
          return 1
        }
        if (a.Objetivo < b.Objetivo) {
          return -1
        } else {
          if (a.Orden > b.Orden) {
            return 1
          }
          if (a.Orden < b.Orden) {
            return -1
          }
        }
        return 0
      })
    },
    ultimosMovimientos (movimiento) {
      let respuesta = []
      this.movimientosRealizados.forEach((m) => {
        if (m.Objetivo === movimiento.Objetivo && m.FechaRealizado) {
          respuesta.push(m)
        }
      })
      return respuesta.sort(function (m1, m2) {
        if (m1.FechaRealizado > m2.FechaRealizado) {
          return -1
        } else if (m1.FechaRealizado < m2.FechaRealizado) {
          return 1
        } else return 0
      })
    },
    realizarMovimiento (movimiento, IdCaso) {
      this.movimientos = this.movimientos.filter(c => c.IdMovimientoCaso !== movimiento.IdMovimientoCaso)
      request.Put(
        `/movimientos/${movimiento.IdMovimientoCaso}/realizar`,
        {},
        (r) => {
          if (r.Error) {
            Notify.create(r.Error)
          } else {
            this.$q.notify({
              color: 'green',
              message: `Se marcó como realizado el movimiento '${movimiento.Detalle}'`
            })
          }
          this.movimientoAlta = movimiento
          this.altaMovimiento(this.caso)
        }
      )
    },
    traerObjetivos () {
      request.Get(`/objetivos?IdsCaso=[${this.caso.IdCaso}]`, {}, r => {
        if (!r.Error) {
          this.Objetivos = r[this.caso.IdCaso]
          this.Objetivos.forEach(objetivo => {
            if (this.movimientos.findIndex(mov => mov.IdObjetivo === objetivo.IdObjetivo) === -1) {
              this.ObjSinMovs.push(objetivo)
            }
          })
        } else {
          Notify.create('Error al traer todos los objetivos')
        }
      })
    },
    mostrarObjetivos (movimiento) {
      this.idMovimientoSeleccionado = movimiento.IdMovimientoCaso
      if (movimiento.Objetivo) {
        this.modalObjetivosMovimiento = true
      } else {
        this.modalObjetivos = true
      }
    },
    asociarObjetivo (objetivo) {
      request.Post(`/movimientos/${this.idMovimientoSeleccionado}/asociar-objetivo/${objetivo.IdObjetivo}`, {}, res => {
        if (!res.Error) {
          Notify.create('Objetivo asociado!')
          this.ObjSinMovs.splice(this.ObjSinMovs.findIndex(o => o.IdObjetivo === objetivo.IdObjetivo), 1)
          const i = this.movimientos.findIndex(f => f.IdMovimientoCaso === this.idMovimientoSeleccionado)
          if (i !== -1) {
            this.movimientos[i].IdObjetivo = objetivo.IdObjetivo
            this.movimientos[i].Objetivo = objetivo.Objetivo
          }
        } else {
          Notify.create(res.Error)
        }
      })
    },
    desasociarObjetivo (payload) {
      request.Put(`/movimientos/${payload.idMov}/desasociar-objetivo/${payload.idObj}`, {}, res => {
        if (!res.Error) {
          Notify.create('Desasociado correctamente')
          this.ObjSinMovs.push({ IdObjetivo: payload.idObj, Objetivo: payload.obj })
        } else {
          Notify.create(res.Error)
        }
      })
    },
    editarObjetivo (objetivo) {
      this.objetivoEditar = objetivo
      this.modalEditar = true
    },
    guardarObjetivo (objetivo) {
      let obj = { Objetivo: objetivo.Objetivo }
      request.Put(`/objetivos/${objetivo.IdObjetivo}`, obj, res => {
        if (!res.Error) {
          Notify.create('Objetivo editado correctamente')
        } else {
          Notify.create(res.Error)
        }
      })
    },
    eliminarObjetivo (objetivo) {},
    nuevoObjetivo () {
      this.modalNuevoObjetivo = true
    },
    agregarObjetivo (objetivo) {
      let nuevoObj = {
        FechaAlta: this.fechaActual(),
        IdCaso: this.caso.IdCaso,
        Objetivo: objetivo
      }
      request.Post(`/objetivos`, nuevoObj, res => {
        if (!res.error) {
          Object.defineProperty(nuevoObj, 'IdObjetivo', {
            value: res.IdObjetivo
          })
          this.ObjSinMovs.push(Object.assign({}, nuevoObj))
        } else {
          this.$q.notify(res.error)
        }
      })
    },
    altaMovimiento (caso) {
      this.modalAlta = true
      if (caso) {
        this.movimientoAlta.Caso = caso.Caratula
        this.Casos = [caso]
      }
    },
    cancelarAlta () {
      this.modalAlta = false
    },
    guardarMovimiento (movimiento) {
      this.modalAlta = false
      movimiento.IdCaso = this.caso.IdCaso
      movimiento.NroExpediente = this.caso.NroExpediente
      request.Get(`/casos/${movimiento.IdCaso}/movimientos`, {}, (r) => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          var contador = true
          r.forEach((m) => {
            if (m.Detalle === movimiento.Detalle) {
              movimiento.IdMovimientoCaso = m.IdMovimientoCaso
              if (contador === true && !movimiento.FechaRealizado) {
                if (this.movimientoAlta.Objetivo) {
                  var objetivo = {}
                  this.Objetivos.forEach((o) => {
                    if (o.Objetivo === this.movimientoAlta.Objetivo) {
                      objetivo = o
                    }
                  })
                  request.Post(
                    `/movimientos/${movimiento.IdMovimientoCaso}/asociar-objetivo/${objetivo.IdObjetivo}`,
                    {},
                    (r) => {
                      movimiento.Objetivo = objetivo.Objetivo
                      // this.MovimientosPendientes.push(movimiento)
                      this.movimientos.push(movimiento)
                      contador = false
                    }
                  )
                } else {
                  // this.MovimientosPendientes.push(movimiento)
                  this.movimientos.push(movimiento)
                  contador = false
                }
              }
            }
          })
          this.movimientoAlta = {}
        }
      })
    },
    enviarMensaje (Mensaje) {
      request.Post(`/mensajes/enviar`, Mensaje, r => {
        if (!r.Error) {
          Notify.create('Movimiento comunicado correctamente')
          const UltMsjLeido = r.IdMensaje
          request.Post(`/chats/${Mensaje.IdChat}/actualizar`, { IdUltimoLeido: UltMsjLeido }, p => {
            if (p.Error) {
              Notify.create('Falló al actualizar el ultimo mensaje leído. Razon:' + p.Error)
            }
          })
        } else {
          Notify.create('Falló al comunicar el movimiento. Razon: ' + r.Error)
        }
      })
    },
    nuevoChat (NuevoChat, Mensaje) {
      request.Post(`/chats/crear`, NuevoChat, r => {
        if (!r.Error) {
          Notify.create('Nuevo chat creado!')
          Mensaje.IdChat = r.IdChat
          request.Post(`/mensajes/enviar`, Mensaje, q => {
            if (!q.Error) {
              Notify.create('Movimiento comunicado correctamente')
              const UltMsjLeido = q.IdMensaje
              request.Post(`/chats/${Mensaje.IdChat}/actualizar`, { IdUltimoLeido: UltMsjLeido }, p => {
                if (p.Error) {
                  Notify.create('Falló al actualizar el ultimo mensaje leído. Razon:' + p.Error)
                }
              })
            } else {
              Notify.create('Falló al comunicar el movimiento. Razon: ' + q.Error)
            }
          })
        } else {
          Notify.create('Falló al comunicar el movimiento. Razon: ' + r.Error)
        }
      })
    },
    fechaActual () {
      var anoActual = new Date().getFullYear()
      var mesActual = new Date().getUTCMonth() + 1
      var diaActual = new Date().getDate()
      const fechaActual = `${anoActual}-${mesActual}-${diaActual}`
      var hoy = new Date()
      const tiempo = `${hoy.getHours()}:${hoy.getMinutes()}:${hoy.getSeconds()}`
      return `${fechaActual} ${tiempo}`
    },
    verCaso (caso) {
      this.modalCaso = true

      this.caso.Objetivos = this.Objetivos

      let respuesta = []
      this.movimientos.forEach((m) => {
        if (!m.FechaRealizado) {
          respuesta.push(m)
        }
      })
      respuesta.forEach(m => {
        m.ObjetivosCaso = this.Objetivos
      })
      this.caso.UltimosMovimientos = JSON.stringify(respuesta.sort(function (m1, m2) {
        if (m1.FechaAlta > m2.FechaAlta) {
          return -1
        } else if (m1.FechaAlta < m2.FechaAlta) {
          return 1
        } else return 0
      }))
    },
    mostrarMovObjLibre (id) {
      this.modalObjetivoLibre = true
      this.IdObjetivoLibre = id
    }
  }
}
</script>

<style scoped>
.expansion-caso {
  margin: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: 200ms;
}
.caso_header {
  font-size:16px;
  font-weight:700;
}
</style>
