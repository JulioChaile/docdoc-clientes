<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated class="bg-black">
      <q-toolbar id="contenedorToolbar" color="primary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          class="logo-menu"
        >
          <img src="statics/img/logo.png" width="30" height="25" />
        </q-btn>

        <q-toolbar-title>{{ $route.name }}</q-toolbar-title>

        <div>
          <q-btn-dropdown
            v-if="mostrarUsuario()"
            flat
            :label="mostrarUsuario()"
          >
            <ventana-usuario
              :notificaciones="notificacionesComp"
              :notificacionesMediadores="notificacionesMediadoresComp"
              :notificacionesContactos="notificacionesContactosComp"
              @notificacionLeida="confirmarNotificacion"
              :verVencimientos="verVencimientos"
              @vencimientosVistos="verVencimientos = false"
            />
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
      overlay
    >
      <q-list class="column full-height" no-border link inset-delimiter highlight>
        <q-item-label header>Accesos Directos</q-item-label>
        <q-item to="/#" style="display:flex; align-items:center;">
          <q-item-section side top>
            <q-icon name="cases" />
          </q-item-section>
          <q-item-section>Mis Casos</q-item-section>
        </q-item>
        <q-item to="/Consultas" style="display:flex; align-items:center;">
          <q-item-section side top>
            <q-icon name="question_answer" />
          </q-item-section>
          <q-item-section>Mis Consultas</q-item-section>
        </q-item>
        <q-item to="/Reportar" style="display:flex; align-items:center;">
          <q-item-section side top>
            <q-icon name="bug_report" />
          </q-item-section>
          <q-item-section>Reportar error</q-item-section>
        </q-item>
        <q-item
          v-if="isLoggedIn"
          sparse
          style="display:flex; align-items:center;position: absolute; bottom: 0; width: 100%"
          to="/Login"
        >
          <q-item-section side top>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>Cerrar Sesión</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-btn
      v-if="$route.name !== 'Login'"
      round
      class="fixed boton_layout_consulta"
      color="primary"
      icon="add"
      @click="consultaModal = true"
    >
      <q-tooltip
        anchor="center left"
        selft="center right"
        :offset="[80, 0]"
      >Consulte a DocDoc!</q-tooltip>
    </q-btn>

    <!-- Modal Consulta -->
    <q-dialog v-model='consultaModal' style="background-color: white">
      <q-card style="min-width:400px;">
        <q-item style="background-color: black;">
            <span class="text-subtitle1" style="color:white;">Consulte a DocDoc!</span>
        </q-item>
        <q-card-section class="flex titulo-login">
          <span>Respondemos tu consulta legal en menos de 5 minutos</span>
        </q-card-section>
        <div class="q-px-md q-mb-lg">
          <div>
            Deja tu consulta y en unos minutos la respondemos:
          </div>
          <q-input
            v-model="consulta.Texto"
            class="q-my-sm"
            dense
            label="Consulta"
            type="textarea"
            :rows="7"
          />
          <div class="q-mt-lg">
            Tu nombre:
          </div>
          <q-input
            v-model="consulta.Apynom"
            class="q-my-sm"
            dense
            label="Apellido y Nombre"
            type="text"
          />
          <div class="q-mt-lg">
            Dejanos tu celu asi podemos contactarte:
          </div>
          <q-input
            v-model="consulta.Telefono"
            class="q-my-sm"
            dense
            label="Telefono"
            type="number"
            bottom-slots
          >
            <template v-slot:hint>
              Escribí tu número sin cero ni quince y sin guiones o espacios.
              <br>
              Ejemplo: 381785490
            </template>
          </q-input>
        </div>
        <span class="text-negative q-pl-lg text-caption">*Todos los campos son obligatorios</span>
        <div
          class="full-width flex justify-center q-my-md"
        >
          <q-btn
            v-if="!loading"
            @click="enviarConsulta"
            color="primary q-mr-md"
          >Enviar</q-btn>
          <q-btn
            v-if="!loading"
            @click="cancelarConsulta"
            color="red"
          >Cancelar</q-btn>
          <q-spinner
            v-else
            color="teal"
            class="self-center"
            size="2em"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { openURL, Notify, QSpinner } from 'quasar'
import moment from 'moment'
import auth from '../auth'
import request from '../request'
import html2canvas from 'html2canvas'
import LoadingInButton from '../components/LoadingInButton'
import VentanaUsuario from '../components/UI/VentanaUsuario'
import FCMPushNotifications from '../assets/FCMPushNotifications'

export default {
  name: 'DocdocLayout',
  data () {
    return {
      leftDrawerOpen: false,
      isLoggedIn: false,
      consultaModal: false,
      usuarioLogueado: '',
      Notificaciones: [],
      screenshotModal: false,
      screenshot_titulo: '',
      screenshot_descripcion: '',
      inputFillCancelled: false,
      textareaFillCancelled: false,
      screenshotImage: '',
      loading: false,
      cantidadNotificaciones: 0,
      notificaciones: [],
      notificacionesMediadores: [],
      notificacionesContactos: [],
      // notificaciones: sessionStorage.getItem(this.mostrarUsuario()) ? JSON.parse(sessionStorage.getItem(this.mostrarUsuario())) : []
      verVencimientos: false,
      IdInterval: '',
      consulta: {}
    }
  },
  components: {
    LoadingInButton,
    VentanaUsuario,
    QSpinner
  },
  computed: {
    notificacionesComp () {
      if (this.notificaciones.length) {
        return this.notificaciones
      } else {
        return sessionStorage.getItem(this.mostrarUsuario()) ? JSON.parse(sessionStorage.getItem(this.mostrarUsuario())) : []
      }
    },
    notificacionesMediadoresComp () {
      if (this.notificacionesMediadores.length) {
        return this.notificacionesMediadores
      } else {
        return sessionStorage.getItem('msjMediador') ? JSON.parse(sessionStorage.getItem('msjMediador')) : []
      }
    },
    notificacionesContactosComp () {
      if (this.notificacionesContactos.length) {
        return this.notificacionesContactos
      } else {
        return sessionStorage.getItem('msjContacto') ? JSON.parse(sessionStorage.getItem('msjContacto')) : []
      }
    },
    textareaShadowText () {
      if (this.textareaFillCancelled === true) {
        return ''
      }
      const t = '',
        empty =
          typeof this.screenshot_descripcion !== 'string' ||
          this.screenshot_descripcion.length === 0

      if (empty === true) {
        return t.split('\n')[0]
      } else if (t.indexOf(this.screenshot_descripcion) !== 0) {
        return ''
      }

      return t
        .split(this.screenshot_descripcion)
        .slice(1)
        .join(this.screenshot_descripcion)
        .split('\n')[0]
    }
  },
  created () {
    FCMPushNotifications(this)
    this.isLoggedIn = auth.isLoggedIn
    if (this.isLoggedIn) {
      request.Get('/movimientos/movimientos-del-dia', {}, (r) => {
        if (!r.Error) {
          if (r.length > 1) {
            this.verVencimientos = true
          }
        }
      })

      // Loop
      if (localStorage.intervalChatGlobal) {
        clearInterval(localStorage.intervalChatGlobal)
      }
      // localStorage.intervalChatGlobal = setInterval(this.buscarNotificaciones, 10000)
    }
    auth.addCallbackLogin(() => {
      this.isLoggedIn = auth.isLoggedIn
    })
    auth.addCallbackLogin(() => {
      if (this.isLoggedIn) {
        request.Get('/movimientos/movimientos-del-dia', {}, (r) => {
          if (!r.Error) {
            if (r.length > 1) {
              this.verVencimientos = true
            }
          }
        })

        // Loop
        if (localStorage.intervalChatGlobal) {
          clearInterval(localStorage.intervalChatGlobal)
        }
        // localStorage.intervalChatGlobal = setInterval(this.buscarNotificaciones, 10000)
      }
    })

    let arrayNotificaciones = []
    sessionStorage.setItem(this.mostrarUsuario(), JSON.stringify(arrayNotificaciones))

    // setInterval(this.reactivarLoop(), 2000)
  },
  methods: {
    openURL,
    altaMovimiento () {
      let idCaso = 0
      if (this.$route.params && this.$route.params.idCaso) {
        idCaso = this.$route.params.idCaso
      }
      this.$router.push(`/AltaMovimiento/${idCaso}`)
    },
    enviarConsulta () {
      if (!this.consulta.Apynom || !this.consulta.Texto || !this.consulta.Telefono) {
        this.$q.notify('Debe llenar todos los campos para continuar')
        return null
      }

      this.loading = true

      request.Post('/consultas', this.consulta, r => {
        if (r.Error) {
          this.$q.notify('Hubo un error en el servidor, por favor intentelo de nuevo mas tarde.')
        } else {
          const c = {
            ...r,
            ...this.consulta,
            fecha: moment().format('DD-MM-YYYY')
          }
          let mc = []

          if (localStorage.getItem('mis_consultas_docdoc')) {
            const ls = localStorage.getItem('mis_consultas_docdoc')
            mc = JSON.parse(ls)
          }

          mc.push(c)

          localStorage.setItem('mis_consultas_docdoc', JSON.stringify(mc))

          this.$q.notify('Su consulta fue enviada con exito, en breve un abogado de nuestros estudios se comunicara con usted')

          this.$router.push({
            path: '/Consultas'
          })
        }

        this.consultaModal = false
        this.loading = false
      })
    },
    cancelarConsulta () {
      this.consulta = {
        Apynom: '',
        Texto: '',
        Telefono: ''
      }
      this.consultaModal = false
    },
    mostrarUsuario () {
      let usuario = auth.UsuarioLogueado
      if (!usuario) { return '' }
      return `${usuario.Apellidos ? usuario.Apellidos : 'sin datos'}, ${
        usuario.Nombres ? usuario.Nombres : 'sin datos'
      }`
    },
    cerrarScreenshotModal () {
      this.screenshotModal = false
      this.screenshot_titulo = ''
      this.screenshot_descripcion = ''
    },
    tomarScreenshot () {
      this.screenshotModal = true
      html2canvas(document.getElementsByTagName('body')[0], {
        dpi: 192,
        x: window.scrollX,
        y: window.scrollY
      }).then(function (canvas) {
        document.getElementById('screenshot_container').appendChild(canvas)
      })
    },
    enviarScreenshot () {
      if (
        this.screenshot_titulo.length &&
        this.screenshot_descripcion.length >= 100
      ) {
        const elementoCanvas = document.getElementById('screenshot_container')
          .firstChild
        var image = elementoCanvas.toDataURL('image/jpeg', 1.0)
        const dataImg = {
          title: this.screenshot_titulo,
          desc: this.screenshot_descripcion,
          image: image.slice(23, image.length)
        }
        this.loading = true

        request.Post('/report', dataImg, (res) => {
          if (!res.error) {
            this.$q.notify({
              color: 'primary',
              timeout: 800,
              message: 'Reporte enviado exitosamente!'
            })
            this.loading = false
            this.screenshotModal = false
            this.screenshot_titulo = ''
            this.screenshot_descripcion = ''
          } else {
            this.$q.notify({
              color: 'secondary',
              timeout: 800,
              message: res.error
            })
            this.screenshot_titulo = ''
            this.screenshot_descripcion = ''
          }
        })
      } else {
        Notify.create('Por favor, complete los campos correctamente')
      }
    },
    buscarNotificaciones () {
      request.Get(`/mensajes/nuevos-mensajes`, {}, r => {
        if (!r.Error) {
          if (r.length) {
            if (sessionStorage.getItem(this.mostrarUsuario())) {
              let arrayNotificaciones = []
              r.forEach(item => {
                if (!this.notificacionRepetida(item, 'caso')) {
                  arrayNotificaciones.push(item)
                }
              })
              this.enviarNotificacion(arrayNotificaciones, 'caso')
            } else {
              this.enviarNotificacion(r, 'caso')
            }
          }
        } else {
          console.log('Error en el loop global.')
        }
      })
      request.Get(`/mensajes/nuevos-mensajes`, {mediador: 'mediador'}, r => {
        if (!r.Error) {
          if (r.length) {
            if (sessionStorage.getItem('msjMediador')) {
              let arrayNotificaciones = []
              r.forEach(item => {
                if (!this.notificacionRepetida(item, 'mediador')) {
                  arrayNotificaciones.push(item)
                }
              })
              this.enviarNotificacion(arrayNotificaciones, 'mediador')
            } else {
              this.enviarNotificacion(r, 'mediador')
            }
          }
        } else {
          console.log('Error en el loop global.')
        }
      })
      request.Get(`/mensajes/nuevos-mensajes`, {contacto: 'contacto'}, r => {
        if (!r.Error) {
          if (r.length) {
            if (sessionStorage.getItem('msjContacto')) {
              let arrayNotificaciones = []
              r.forEach(item => {
                if (!this.notificacionRepetida(item, 'contacto')) {
                  arrayNotificaciones.push(item)
                }
              })
              this.enviarNotificacion(arrayNotificaciones, 'contacto')
            } else {
              this.enviarNotificacion(r, 'contacto')
            }
          }
        } else {
          console.log('Error en el loop global.')
        }
      })
    },
    enviarNotificacion (mensajes, tipo) {
      if (mensajes.length) {
        let item = ''

        switch (tipo) {
          case 'caso':
            item = this.mostrarUsuario()
            break

          case 'mediador':
            item = 'msjMediador'
            break

          case 'contacto':
            item = 'msjContacto'
            break
        }

        let arrayNotificaciones = sessionStorage.getItem(item)
          ? JSON.parse(sessionStorage.getItem(item))
          : []

        mensajes.forEach(mensaje => {
          arrayNotificaciones.push(mensaje)
        })
        sessionStorage.setItem(item, JSON.stringify(arrayNotificaciones))
        switch (tipo) {
          case 'caso':
            this.notificaciones = arrayNotificaciones
            break

          case 'mediador':
            this.notificacionesMediadores = arrayNotificaciones
            break

          case 'contacto':
            this.notificacionesContactos = arrayNotificaciones
            break
        }
        var hash = {}
        const notificacionesPorCaso = this.notificaciones.filter(c => {
          var exists = !hash[c.IdChat]
          hash[c.IdChat] = true
          return exists
        })

        var hash2 = {}
        const notificacionesPorMediador = this.notificacionesMediadores.filter(c => {
          var exists = !hash2[c.IdChat]
          hash2[c.IdChat] = true
          return exists
        })

        var hash3 = {}
        const notificacionesPorContacto = this.notificacionesContactos.filter(c => {
          var exists = !hash3[c.IdChat]
          hash3[c.IdChat] = true
          return exists
        })
        this.cantidadNotificaciones = notificacionesPorCaso.length + notificacionesPorMediador.length + notificacionesPorContacto.length
        Notify.create(`Recibiste ${mensajes.length} mensajes nuevos`)
      }
    },
    notificacionRepetida (item, tipo) {
      let result = false

      let itemSession = ''

      switch (tipo) {
        case 'caso':
          itemSession = this.mostrarUsuario()
          break

        case 'mediador':
          itemSession = 'msjMediador'
          break

        case 'contacto':
          itemSession = 'msjContacto'
          break
      }

      if (sessionStorage.getItem(itemSession)) {
        const arraySesion = JSON.parse(sessionStorage.getItem(itemSession))
        arraySesion.forEach(mensajeSesion => {
          if (mensajeSesion.IdMensaje === item.IdMensaje) {
            result = true
          }
        })
      }

      return result
    },
    async confirmarNotificacion (data, tipo) {
      const backup = await this.borrarNotificacion(data.item, tipo)
      switch (tipo) {
        case 'caso':
          this.notificaciones = backup
          sessionStorage.setItem(this.mostrarUsuario(), JSON.stringify(backup))
          break

        case 'mediador':
          this.notificacionesMediadores = backup
          sessionStorage.setItem('msjMediador', JSON.stringify(backup))
          break

        case 'contacto':
          this.notificacionesContactos = backup
          sessionStorage.setItem('msjContacto', JSON.stringify(backup))
          break
      }
      var hash = {}
      const notificacionesPorCaso = this.notificaciones.filter(c => {
        var exists = !hash[c.IdChat]
        hash[c.IdChat] = true
        return exists
      })

      var hash2 = {}
      const notificacionesPorMediador = this.notificacionesMediadores.filter(c => {
        var exists = !hash2[c.IdChat]
        hash2[c.IdChat] = true
        return exists
      })

      var hash3 = {}
      const notificacionesPorContacto = this.notificacionesContactos.filter(c => {
        var exists = !hash3[c.IdChat]
        hash3[c.IdChat] = true
        return exists
      })
      this.cantidadNotificaciones = notificacionesPorCaso.length + notificacionesPorMediador.length + notificacionesPorContacto.length
    },
    borrarNotificacion (item, tipo) {
      switch (tipo) {
        case 'caso':
          return this.notificaciones.filter(notificacion => notificacion.Caratula !== item.Caratula)

        case 'mediador':
          return this.notificacionesMediadores.filter(notificacion => notificacion.IdMediador !== item.IdMediador)

        case 'contacto':
          return this.notificacionesContactos.filter(notificacion => notificacion.IdContato !== item.IdContato)
      }
    },
    processTextareaFill (e) {
      if (e === void 0) {
        return
      }

      if (e.keyCode === 27) {
        if (this.textareaFillCancelled !== true) {
          this.textareaFillCancelled = true
        }
      } else if (e.keyCode === 9) {
        if (
          this.textareaFillCancelled !== true &&
          this.textareaShadowText.length > 0
        ) {
          // eslint-disable-next-line no-undef
          stopAndPrevent(e)
          this.screenshot_descripcion =
            (typeof this.screenshot_descripcion === 'string'
              ? this.screenshot_descripcion
              : '') + this.textareaShadowText
        }
      } else if (this.textareaFillCancelled === true) {
        this.textareaFillCancelled = false
      }
    }
  }
}
</script>

<style>
.boton_layout_consulta {
  right: 18px;
  bottom: 18px;
  width: 56px;
  height: 56px;
  z-index: 99999;
}
body {
  width: 100%;
  background: url(../statics/img/pattern.png) #ececec;
}
.toolbar-subheader {
  background-color: #303f9f;
  padding-bottom: 5px;
  font-size: 1.4rem;
  color: white;
  text-align: center;
  font-family: "Lobster", cursive;
}
.logo-menu:hover {
  transform: rotate(90deg);
  transition: all 0.5s;
}
.q-dialog__inner > div {
  background-color: white;
}
#screenshot_container {
  max-width: 600px;
  max-height: 240px;
  overflow: auto;
}
@media (max-width: 600px) {
  #screenshot_container {
    max-width: 250px;
    max-height: 200px;
    overflow: auto;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
}
#screenshot_container canvas {
  border: 2px solid #ccc;
  border-radius: 10px;
}

 /* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
