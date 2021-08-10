<template>
  <div class="q-py-xl q-px-md row" style="padding-top: 0px;">
    <!-- Seccion de datos del caso -->
    <div class="col-12 col-md-4 col-lg-6">
      <Datos :datos="datos" @guardarDatosEditados="guardarDatosEditados" />
    </div>

    <!-- Seccion de personas del caso -->
    <div class="col-12 col-md-7 col-lg-6 contenedor_personas">
      <Personas
        :personas="dataPersonas()"
        @agregarTelefono="agregarTelefono"
        @updateTelefonos="updateTelefonos"
        @eliminarTelefono="eliminarTelefono"
      />
    </div>

    <div class="col-12 q-pt-md" style="display:flex; justify-content:center;">
      <q-btn style="min-width: 100px" class="text-capitalize" color="primary" @click="abrirChat()">
        Chat
      </q-btn>
      <q-btn class="text-capitalize" style="margin-left: 10px; min-width: 100px" color="negative" @click="abrirMediacion()">
        Mediacion
      </q-btn>
    </div>

    <!-- Componente Tribunales -->
    <div class="col-12 q-pt-xl">
      <caso-tribunales :caso="caso" :movimientos="movimientos" :datosChat="datosChat" :idChat="caso.IdChat" />
    </div>

    <!-- Modal Mensaje -->
    <q-dialog v-model='ModalMensaje' style="background-color: white">
      <q-card style="min-width:400px;">
        <q-item style="background-color: black;">
            <span class="q-subheading" style="color:white;">¿Desea comunicar el cambio de estado?</span>
        </q-item>
        <q-input
          v-model="Mensaje"
          autogrow
          label="Mensaje"
          style="padding: 0 1rem 1rem 1rem;"
        />
        <br>
        <q-btn
          @click="cancelarMensaje()"
          color="red"
          style="padding-top:0px; float: right; margin-bottom:20px; margin-right: 20px;"
        >Cancelar</q-btn>
        <q-btn
          @click="enviarMensaje(Mensaje)"
          color="primary"
          style="padding-top:0px; float: right; margin-bottom:20px; margin-right: 20px;"
        >Enviar</q-btn>
      </q-card>
    </q-dialog>

    <!-- Modal Mediacion -->
    <q-dialog v-model="ModalMediacion" style="background-color: white">
      <Mediacion
        :IdMediacion="caso.IdMediacion"
        :IdCaso="id"
        :IdChat="caso.IdChat"
        :CaratulaCaso="caso.Caratula"
        :Personas="dataPersonas()"
        @alta="altaMediacion"
        @cerrar="ModalMediacion = false"
      />
    </q-dialog>

    <!-- Modal Chat Existente -->
    <q-dialog v-model='ModalChat' style="background-color: white">
      <q-card style="min-width:400px;">
        <q-item style="background-color: black;">
            <span class="q-subheading" style="color:white;">Chat Existente</span>
        </q-item>
        <div class="text-center" style="margin-top: 15px; margin-bottom: 15px">
          Ya existe un chat con este numero en el caso <b>{{ CaratulaCasoChat }}</b>
          <br>
          ¿Desea que el chat se inicie en el caso actual de ahora en más?
        </div>
        <div style="display: flex; justify-content: center; margin-bottom:20px">
          <q-btn
            @click="reemplazarCaso()"
            color="primary"
            style="padding-top:0px; float: left; margin-right: 20px;"
          >Aceptar</q-btn>
          <q-btn
            @click="ModalChat = false"
            color="red"
            style="padding-top:0px; float: left"
          >Cancelar</q-btn>
        </div>
      </q-card>
    </q-dialog>

    <!-- Seccion de movimientos del caso
    <div class="col-12">
      <Movimientos :movimientos="movimientos" />
    </div>
    -->
  </div>
</template>

<script>
import request from '../../request'
import Loading from '../Loading'
import Datos from '../../components/Caso/Datos'
import Personas from '../../components/Caso/Personas'
import Movimientos from '../../components/Caso/Movimientos'
import Mediacion from '../../components/Caso/Mediacion'
import CasoTribunales from '../../components/Compartidos/CasoTribunales'
import { Notify } from 'quasar'
export default {
  name: 'Caso',
  components: {
    Loading,
    Datos,
    Personas,
    Movimientos,
    Mediacion,
    CasoTribunales
  },
  data () {
    return {
      id: 0,
      caso: {},
      casoModificado: {},
      datos: {},
      movimientos: [],
      personas: [],
      telefonos: {},
      casoEditado: {},
      Objetivos: [],
      ModalMensaje: false,
      Mensaje: '',
      ModalMediacion: false,
      ModalChat: false,
      CaratulaCasoChat: '',
      IdExternoChat: ''
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$router.push('GrillaCasos')
      return
    }
    this.id = this.$route.query.id

    request.Get(`/casos/${this.id}/movimientos-sin-realizar`, {}, (r) => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.movimientos = r
      }
    })

    // Busco el caso correspondiente al id que recibo por parametro:
    request.Get(`/casos`, { id: this.id }, (r) => {
      if (!r.Error) {
        this.caso = r
        // Datos del caso:
        this.datos = {
          Caratula: r.Caratula,
          Carpeta: r.Carpeta,
          IdCaso: r.IdCaso,
          Estado: r.Estado,
          FechaAlta: r.FechaAlta,
          FechaEstado: r.FechaEstado,
          FechaUltVisita: r.FechaUltVisita,
          NroExpediente: r.NroExpediente,
          Competencia: r.Competencia,
          IdCompetencia: r.IdCompetencia,
          TipoCaso: r.TipoCaso,
          IdTipoCaso: r.IdTipoCaso,
          Juzgado: r.Juzgado,
          IdJuzgado: r.IdJuzgado,
          Nominacion: r.Nominacion,
          IdNominacion: r.IdNominacion,
          EstadoAmbitoGestion: r.EstadoAmbitoGestion,
          IdEstadoAmbitoGestion: r.IdEstadoAmbitoGestion,
          Origen: r.Origen,
          IdOrigen: r.IdOrigen
        }

        this.IdMediacion = r.IdMediacion
        /*
        // Movimientos del caso:
        this.movimientos = r.MovimientosCaso
        console.log(this.movimientos)
        if (this.Objetivos.length > 0) {
          console.log(this.Objetivos)
          this.Objetivos.forEach(e => {
            const i = this.movimientos.findIndex(f => f.IdMovimientoCaso === parseInt(e.IdMovimientoCaso))
            if (i !== -1) {
              this.movimientos[i].IdObjetivo = e.IdObjetivo
              this.movimientos[i].Objetivo = e.Objetivo
            }
          })
        }
        */

        // Personas del caso:
        this.personas = r.PersonasCaso ? r.PersonasCaso : []
      } else {
        console.log('Hubo un error al traer el caso.')
      }
    })
  },
  computed: {
    datosChat () {
      return {
        IdCaso: this.caso.IdCaso,
        IdPersona: this.personaPrincipal().IdPersona,
        Telefono: this.telefonoPrincipal(this.personaPrincipal().Telefonos)
      }
    }
  },
  methods: {
    volver () {
      window.history.back()
    },
    estado () {
      switch (this.caso.Estado) {
        case 'A':
          return {
            nombre: 'activo',
            color: 'light-green-14'
          }
        case 'P':
          return {
            nombre: 'pendiente',
            color: 'warning'
          }
        default:
          return {
            nombre: 'archivado',
            color: 'secondary'
          }
      }
    },
    dataPersonas () {
      const temp = []
      if (this.personas.length) {
        this.personas.forEach((persona) => {
          const data = {
            Id: persona.IdPersona,
            Apellido: persona.Apellidos,
            Nombre: persona.Nombres,
            Email: persona.Email,
            Principal: persona.EsPrincipal === 'S',
            Domicilio: persona.Domicilio,
            Documento: persona.Documento,
            Tipo: persona.Tipo,
            Rol: persona.RolTipoCaso ? persona.RolTipoCaso : persona.Observaciones,
            Telefonos: this.personaTelefonos(persona.Telefonos),
            TelefonoActivo: this.telefonoPrincipal(persona.Telefonos)
          }
          temp.push(data)
        })
      }
      return temp
    },
    personaPrincipal () {
      if (this.personas.length) {
        return this.personas.filter(persona => persona.EsPrincipal === 'S')[0]
      }
    },
    personaTelefonos (telefonos) {
      const temp = []
      if (telefonos) {
        telefonos.forEach((item) => {
          const ob = {
            Detalle: item.Detalle,
            EsPrincipal: item.EsPrincipal === 'S',
            FechaAlta: item.FechaAlta,
            Telefono: item.Telefono
          }
          temp.push(ob)
        })
      }
      return temp
    },
    telefonoPrincipal (telefonos) {
      if (telefonos) {
        const TelefonosPrincipales = (telefonos || []).filter(
          (telefono) => telefono.EsPrincipal === 'S'
        )
        if (!TelefonosPrincipales.length) {
          return telefonos.length ? telefonos[0].Telefono : 'Sin telefono'
        } else {
          return TelefonosPrincipales[0].Telefono
        }
      } else {
        return ''
      }
    },
    agregarTelefono (data) {
      let tel = {
        Telefono: data.NuevoTelefono.numero,
        Detalle: data.NuevoTelefono.detalle,
        EsPrincipal: data.NuevoTelefono.activo ? 'S' : 'N'
      }
      request.Post(`/personas/${data.idPersona}/alta-telefono`, tel, (r) => {
        if (!r.Error) {
          this.$q.notify('Se guardo el nuevo teléfono correctamente.')
        } else {
          this.$q.notify(
            'Ocurrio un error al guardar el teléfono. Por favor, intente nuevamente.'
          )
        }
      })
      request.Get(`/casos`, { id: this.id }, (r) => {
        if (!r.Error) {
          // Personas del caso:
          this.personas = r.PersonasCaso ? r.PersonasCaso : []
        } else {
          console.log('Hubo un error al actualizar los telefonos.')
        }
      })
      this.dataPersonas()
    },
    updateTelefonos (telefonos, idPersona) {
      if (telefonos) {
        telefonos.forEach((item) => {
          let tel = {
            Telefono: item.Telefono,
            TelefonoOld: item.TelefonoOld,
            Detalle: item.Detalle,
            EsPrincipal: item.EsPrincipal ? 'S' : 'N'
          }
          request.Post(`/personas/${idPersona}/modificar`, tel, (r) => {
            if (!r.Error) {
              this.$q.notify('Los cambios se guardaron correctamente.')
            } else {
              this.$q.notify(r.Error)
            }
          })
        })

        request.Get(`/casos`, { id: this.id }, (r) => {
          if (!r.Error) {
            // Personas del caso:
            this.personas = r.PersonasCaso ? r.PersonasCaso : []
          } else {
            console.log('Hubo un error al actualizar los telefonos.')
          }
        })
        this.dataPersonas()
      }
    },
    eliminarTelefono (data) {
      let tel = {
        Telefono: data.numeroTelEliminar
      }
      request.Post(
        `/personas/${data.idPersona}/eliminar-telefono`,
        tel,
        (r) => {
          if (!r.Error) {
            this.$q.notify('Se ha eliminado correctamente el teléfono')
          } else {
            this.$q.notify('Hubo un error al intentar borrar el telefono')
          }
        }
      )
    },
    guardarDatosEditados (datosModificados) {
      this.casoModificado = {
        Caratula: datosModificados.Caratula
          ? datosModificados.Caratula
          : 'Sin carátula',
        Carpeta: this.caso.Carpeta, // ver si se debe editar carpeta
        NroExpediente: datosModificados.NroExpediente,
        Observaciones: this.caso.Observaciones,
        // Competencia: datosModificados.Competencia,
        // Estado: this.caso.Estado, // ver si se debe editar estado
        // FechaAlta: this.caso.FechaAlta,
        // FechaUltVisita: this.caso.FechaUltVisita,
        IdCaso: this.caso.IdCaso,
        IdCompetencia: datosModificados.IdCompetencia,
        IdEstadoCaso: this.caso.IdEstadoCaso,
        IdJuzgado: datosModificados.IdJuzgado,
        IdNominacion: datosModificados.IdNominacion,
        IdOrigen: datosModificados.IdOrigen,
        IdTipoCaso: datosModificados.IdTipoCaso,
        // Origen: datosModificados.Origen,
        // Juzgado: datosModificados.AmbitoGestion,
        // NroExpediente: this.caso.NroExpediente,
        // Observaciones: this.caso.Observaciones,
        // TipoCaso: datosModificados.TipoCaso,
        // EstadoAmbitoGestion: datosModificados.EstadoAmbitoGestion,
        IdEstadoAmbitoGestion: datosModificados.IdEstadoAmbitoGestion,
        FechaEstado: datosModificados.FechaEstado
      }
      request.Put(`/casos/${this.casoModificado.IdCaso}`, this.casoModificado, r => {
        if (!r.Error) {
          this.$q.notify({
            color: 'primary',
            timeout: 800,
            message: 'Los cambios se guardaron correctamente!'
          })
          this.enviarMensaje(datosModificados.Mensaje)
        } else {
          this.$q.notify({
            color: 'warning',
            timeout: 800,
            message:
                // 'Se produjo un error al editar el caso, por favor, intente nuevamente.'
                r.Error
          })
        }
      }
      )
    },
    enviarMensaje (mensaje) {
      if (this.ModalMensaje) {
        const Mensaje = {
          IdChat: this.caso.IdChat ? this.caso.IdChat : null,
          Contenido: mensaje
        }
        if (!Mensaje.IdChat) {
          const NuevoChat = {
            IdCaso: this.caso.IdCaso,
            IdPersona: this.personaPrincipal().IdPersona,
            Telefono: this.telefonoPrincipal(this.personaPrincipal().Telefonos)
          }
          if (NuevoChat.Telefono) {
            request.Post(`/chats/crear`, NuevoChat, r => {
              if (!r.Error) {
                Notify.create('Nuevo chat creado!')
                Mensaje.IdChat = r.IdChat
                request.Post(`/mensajes/enviar`, Mensaje, q => {
                  if (!q.Error) {
                    Notify.create('Cambio de estado comunicado correctamente')
                    const UltMsjLeido = q.IdMensaje
                    request.Post(`/chats/${Mensaje.IdChat}/actualizar`, { IdUltimoLeido: UltMsjLeido }, p => {
                      if (p.Error) {
                        Notify.create('Falló al actualizar el ultimo mensaje leído. Razon:' + p.Error)
                      }
                    })
                  } else {
                    Notify.create('Falló al comunicar el cambio de estado. Razon: ' + q.Error)
                  }
                })
              } else {
                Notify.create('Falló al comunicar el cambio de estado. Razon: ' + r.Error)
              }
            })
          } else {
            Notify.create('Falló al comunicar el cambio de estado. Razon: no existe un telefono asociado')
          }
        } else {
          request.Post(`/mensajes/enviar`, Mensaje, r => {
            if (!r.Error) {
              Notify.create('Cambio de estado comunicado correctamente')
              const UltMsjLeido = r.IdMensaje
              request.Post(`/chats/${Mensaje.IdChat}/actualizar`, { IdUltimoLeido: UltMsjLeido }, p => {
                if (p.Error) {
                  Notify.create('Falló al actualizar el ultimo mensaje leído. Razon:' + p.Error)
                }
              })
            } else {
              Notify.create('Falló al comunicar el cambio de estado. Razon: ' + r.Error)
            }
          })
        }
        this.Mensaje = ''
        this.ModalMensaje = false
      } else {
        this.Mensaje = mensaje
        this.ModalMensaje = true
      }
    },
    cancelarMensaje () {
      this.Mensaje = ''
      this.ModalMensaje = false
    },
    abrirChat () {
      const telActual = this.telefonoPrincipal(this.personaPrincipal().Telefonos)
      const idPersonaActual = this.personaPrincipal().IdPersona
      if (this.caso.IdChat) {
        request.Get(`/chats/${this.caso.IdChat}`, {}, r => {
          if (r.Error) {
            Notify.create('Falló al iniciar el chat. Razon: ' + r.Error)
          } else if (r.Telefono === telActual || !telActual || telActual === 'Sin telefono') {
            this.$router.push({
              name: 'Chat',
              query: {
                id: this.caso.IdChat,
                caratula: this.caso.Caratula ? this.caso.Caratula : 'Sin Carátula',
                telefono: r.Telefono
              }
            })
          } else {
            request.Post(`/chats/${this.caso.IdChat}/actualizar-telefono`, {Telefono: telActual, IdPersona: idPersonaActual}, c => {
              if (c.Error) {
                Notify.create('Falló al iniciar el chat. Razon: ' + r.Error)
              } else {
                this.$router.push({
                  name: 'Chat',
                  query: {
                    id: this.caso.IdChat,
                    caratula: this.caso.Caratula ? this.caso.Caratula : 'Sin Carátula',
                    telefono: c.Telefono
                  }
                })
              }
            })
          }
        })
      } else {
        const nuevoChat = {
          IdCaso: this.caso.IdCaso,
          IdPersona: this.personaPrincipal().IdPersona,
          Telefono: this.telefonoPrincipal(this.personaPrincipal().Telefonos)
        }
        request.Post(`/chats/crear`, nuevoChat, r => {
          if (r.Caratula) {
            this.ModalChat = true
            this.CaratulaCasoChat = r.Caratula
            this.IdExternoChat = r.IdExternoChat
          } else if (!r.Error) {
            Notify.create('Nuevo chat creado!')
            this.$router.push({
              name: 'Chat',
              query: {
                id: r.IdChat,
                caratula: this.caso.Caratula ? this.caso.Caratula : 'Sin Carátula',
                telefono: nuevoChat.Telefono
              }
            })
          } else {
            Notify.create('Falló al iniciar un nuevo chat. Razon: ' + r.Error)
          }
        })
      }
    },
    abrirMediacion () {
      this.ModalMediacion = true
    },
    altaMediacion (id) {
      this.caso.IdMediacion = id
    },
    reemplazarCaso () {
      request.Post('/chats/reemplazar-caso', {IdExternoChat: this.IdExternoChat, IdCaso: this.caso.IdCaso, IdPersona: this.personaPrincipal().IdPersona}, r => {
        if (r.Error) {
          Notify.create('Falló al iniciar el chat. Razon: ' + r.Error)
        } else {
          this.$router.push({
            name: 'Chat',
            query: {
              id: r.IdChat,
              caratula: this.caso.Caratula ? this.caso.Caratula : 'Sin Carátula',
              telefono: this.telefonoPrincipal(this.personaPrincipal().Telefonos)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.contenedor_personas {
  padding-left: 10px;
}

@media screen and (max-width: 600px) {
  .contenedor_personas {
    padding-left: 0 !important;
  }
}
</style>
