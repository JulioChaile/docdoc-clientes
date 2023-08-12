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
          <img src="../statics/img/logo.png" width="30" height="25" />
        </q-btn>

        <q-toolbar-title>{{ headerNombre() }}</q-toolbar-title>
        
        <!--div>
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
        </div-->
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
        <!--q-item to="/Audiencias" style="display:flex; align-items:center;">
          <q-item-section side top>
            <q-icon name="event" />
          </q-item-section>
          <q-item-section>Mis Audiencias</q-item-section>
        </q-item-->
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
        <q-item clickable @click="compartirApp" style="display:flex; align-items:center;">
          <q-item-section side top>
            <q-icon name="share" />
          </q-item-section>
          <q-item-section>Compartir App</q-item-section>
        </q-item>
        <q-item
          v-if="$route.name !== 'Login'"
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

    <q-page-container :key="pageKey">
      <router-view />
    </q-page-container>

    <q-btn
      v-if="$route.name === 'Mis Consultas'"
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
      <q-card>
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
import VentanaUsuario from '../components/UI/VentanaUsuario'
import FCMPushNotifications from '../assets/FCMPushNotifications'

export default {
  name: 'DocdocLayout',
  data () {
    return {
      pageKey: 0,
      leftDrawerOpen: false,
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
    VentanaUsuario,
    QSpinner
  },
  created () {
    FCMPushNotifications(this)
  },
  mounted () {
    document.addEventListener("backbutton", () => {
      this.forceRender()

      this.$router.push({
        name: '',
        query: {
          id: this.$route.query.id || 0,
          tab: 'casos',
          mode: 'back'
        }
      })
    }, false)
  },
  beforeDestroy () {
    document.removeEventListener("backbutton", () => {});
  },
  methods: {
    openURL,
    forceRender () {
      this.pageKey += 1
    },
    enviarConsulta () {
      if (!this.consulta.Apynom || !this.consulta.Texto || !this.consulta.Telefono) {
        this.$q.notify('Debe llenar todos los campos para continuar')
        return null
      }

      this.loading = true

      setTimeout(() => {
        this.consultaModal = false
        this.$q.notify('Se estan cargando los datos de su consulta al servidor')
      }, 1000);

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
    headerNombre () {
      if (this.$route.name === 'Mis Casos') {
        const tab = this.$route.query.tab
        switch (tab) {
          case 'casos':
            return 'Mis Casos'

          case 'novedades':
            return 'Novedades del Caso'

          case 'audiencias':
            return 'Proximas Audiencias'

          case 'archivos':
            return 'Archivos del Caso'

          case 'documentacion':
            return 'Documentación Requerida'

          case 'personas':
            return 'Personas del Caso'

          case 'chat':
            return 'Chat'
        }
      } else {
        return this.$route.name
      }
    },
    compartirApp () {
      window.plugins.socialsharing.shareViaWhatsApp(
        '¡Prueba la nueva app DocDoc! Clientes y obten asesoramiento legal al instante!',
        null,
        'https://play.google.com/store/apps/details?id=com.docdoc_clientes.app',
        function () {
          console.log('share ok')
        },
        function (errormsg) {
          alert(errormsg)
        }
      )
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
