<template>
  <q-page>
    <!--Puede parecer al pedo este div, sin embargo es necesario para dar el efecto de degradado-->
    <!--en caso de que esta pagina requiera otro fondo distinto al que hay, ademas asi el modal -->
    <!--no agarra el efecto y solo lo tiene el contenido que se ve-->
    <div class="row nuevo-fondo avenir-next--medium login-container full-width full-height">
      <div
        v-if="paso === 'inicio'"
        class="col-sm-6 col-xs-12 container-form column items-center justify-center q-pa-none inicio"
      >
        <q-card-section class="flex titulo-login">
          <span>Orientación Legal de Bolsillo</span>
        </q-card-section>
        <q-card-section class="column botones-login full-width">
          <a
            class="cursor-pointer max-width-cajas --italic recuperar-cuenta"
            @click="habilitarRecuperarCuenta"
          >
            Recuperar cuenta
          </a>
          <q-btn
            dense
            outline
            class="boton-login max-width-cajas avenir-next full-width q-mb-md"
            @click="paso = 'VerificarUsuario'"
          >
            Iniciar sesión
          </q-btn>
          <q-btn
            dense
            outline
            class="boton-login max-width-cajas avenir-next full-width q-mb-md"
            @click="habilitarRegistro"
          >
            Registrarse
          </q-btn>
          <q-btn
            dense
            outline
            class="boton-login max-width-cajas avenir-next full-width"
            @click="consultaModal = true"
          >
            Consulte a DocDoc!
          </q-btn>
        </q-card-section>
      </div>
      <div
        v-if="paso === 'VerificarUsuario'"
        class="col-sm-6 col-xs-12 container-form column items-center justify-center"
      >
        <InicioSesion
          :titulo="'Iniciar sesión'"
          :continuar="'Ingresar'"
          :error="user.validate.Usuario"
          :loading="loading"
          :execute="verificarUsuario"
          :recuperar="habilitarRecuperarCuenta"
          :helper="true ? '' : 'Ingrese su nombre de usuario para continuar'"
          :subtitle="'Accede con tu cuenta Docdoc! Gestión'"
          :label="'Usuario'"
        >
          <q-input
            dense
            borderless
            style="width: 100%; margin: 0; padding: 0;"
            label-color="dark"
            class="--medium"
            :loading="loading"
            :disabled="loading"
            label="Usuario"
            v-model="user.Usuario"
            @keyup.enter="verificarUsuario"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="person" style="margin-left: 10px; color: #1E4B74" />
            </template>
          </q-input>
        </InicioSesion>
      </div>
      <div
        v-if="paso === 'VerificarCodigo'"
        class="col-sm-6 col-xs-12 container-form column items-center justify-center"
      >
        <InicioSesion
          :titulo="'Verificar código'"
          :continuar="'Ingresar'"
          :error="user.validate.Usuario"
          :loading="loading"
          :inicio="inicio"
          :subtitle="'Ingresa el código que enviamos a tu casilla de correo'"
          :codigo="'Ingresa el código que enviamos a tu casilla de correo'"
        >
          <masked-input
            @input="verificarCodigo"
            :loading="loading"
            :disabled="loading"
            type="tel"
            name="codigo"
            class="q-input-target verificacion-codigo"
            v-model="codigoVerificacion"
            :mask="[/\d/, /\d/, /\d/, /\d/, /\d/]"
            :showMask="true"
            placeholderChar="_">
          </masked-input>
        </InicioSesion>
      </div>
      <div
        v-if="paso === 'IngresarPassword'"
        class="col-sm-6 col-xs-12 container-form column items-center justify-center"
      >
        <InicioSesion
          :titulo="'Contraseña'"
          :subtitle="'Ingrese su contraseña para continuar'"
          :continuar="'Ingresar'"
          :error="user.validate.Password"
          :loading="loading"
          :execute="login"
          :inicio="inicio"
        >
          <q-input
            @keyup.enter="login"
            :loading="loading"
            :disabled="loading"
            style="display:none"
            type="text"
            v-model="user.Usuario"
            ref="userInput"
          />
          <q-input
            dense
            borderless
            style="width: 100%; margin: 0; padding: 0;"
            label-color="dark"
            @keyup.enter="login"
            :loading="loading"
            :disabled="loading"
            label="Contraseña"
            v-model="user.Password"
            type="password"
            ref="passInput"
          >
            <template v-slot:prepend>
              <q-icon name="lock" style="margin-left: 10px; color: #1E4B74" />
            </template>
          </q-input>
        </InicioSesion>
      </div>
      <div
        v-if="paso === 'CambiarPassword'"
        class="col-sm-6 col-xs-12 container-form column items-center justify-center"
      >
        <InicioSesion
          :titulo="'Nueva contraseña'"
          :continuar="'Cambiar'"
          :error="errorPassword"
          :loading="loading"
          :execute="cambiarPass"
          :inicio="inicio"
        >
          <q-input
            dense
            style="width: 100%; margin: 0; padding: 0;"
            label-color="dark"
            color="grey-3"
            class="col-12"
            :loading="loading"
            :disabled="loading"
            label="Ingrese su nueva contraseña"
            v-model="user.Password"
            type="password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" style="margin-left: 10px; color: #1E4B74" />
            </template>
          </q-input>
          <q-input
            dense
            style="width: 100%; margin: 0; padding: 0;"
            label-color="dark"
            color="grey-3"
            class="col-12"
            @keyup.enter="cambiarPass"
            :loading="loading"
            :disabled="loading"
            label="Repetir contraseña"
            v-model="nuevoPass"
            type="password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" style="margin-left: 10px; color: #1E4B74" />
            </template>
          </q-input>
        </InicioSesion>
      </div>

      <div class="col-sm-6 col-xs-12 window-height row items-center justify-center img-login">
        <div class="container-img">
          <!--img src="../statics/img/login-img.png" height="auto" width="100%" /-->
          <div class="login-img"></div>
        </div>
      </div>
    </div>

    <!-- Modal Recuperar Cuenta -->
    <q-dialog v-model='recuperarModal' style="background-color: white">
      <q-card style="min-width:400px;">
        <q-item style="background-color: black;">
            <span class="q-subheading" style="color:white;">Recuperar Cuenta</span>
        </q-item>
        <div style="margin-top: 20px; margin-left: 20px; margin-right: 20px; margin-bottom: 20px; display: flex; justify-content: center;">
          Ingrese el email con el que fue registrado y su nueva contraseña.
          <br>
          Se le enviara un mail con su nombre de usuario y su nueva contraseña.
        </div>
        <q-input
          v-model="email"
          autogrow
          label="Email"
          style="padding: 0 1rem 1rem 1rem;"
        />
        <q-input
          v-model="pass"
          label="Contraseña"
          style="padding: 0 1rem 1rem 1rem;"
          type="password"
        />
        <br>
        <q-btn
          @click="cancelar()"
          color="red"
          style="padding-top:0px; float: right; margin-bottom:20px; margin-right: 20px;"
        >Cancelar</q-btn>
        <q-btn
          @click="recuperarCuenta()"
          color="primary"
          style="padding-top:0px; float: right; margin-bottom:20px; margin-right: 20px;"
        >Enviar</q-btn>
      </q-card>
    </q-dialog>

    <!-- Modal Registro -->
    <q-dialog v-model='registroModal' style="background-color: white">
      <q-card style="min-width:400px;">
        <q-item style="background-color: black;">
            <span class="text-subtitle1" style="color:white;">Registrarse</span>
        </q-item>
        <div class="q-px-md">
          <q-input
            v-model="userRegistro.Apellidos"
            class="q-my-sm"
            dense
            label="Apellidos"
            type="text"
          />
          <q-input
            v-model="userRegistro.Nombres"
            class="q-my-sm"
            dense
            label="Nombres"
            type="text"
          />
          <q-input
            v-model="userRegistro.Usuario"
            class="q-my-sm"
            dense
            label="DNI"
            type="number"
            hint="Usamos su DNI para vincularlo con los casos en los que participa y para su usuario"
          />
          <q-input
            v-model="userRegistro.Email"
            class="q-mt-lg"
            dense
            label="Email"
            type="text"
            :color="validarEmail(userRegistro.Email) ? '' : 'red'"
            :label-color="validarEmail(userRegistro.Email) ? '' : 'red'"
            :hint="validarEmail(userRegistro.Email) ? false : 'Ingrese un email valido'"
          />
          <q-input
            v-model="userRegistro.TelefonoUsuario"
            class="q-mb-sm q-mt-xs"
            dense
            label="Telefono"
            type="number"
          />
          <q-input
            v-model="userRegistro.Password"
            class="q-my-sm"
            dense
            label="Contraseña"
            type="password"
            hint="La contraseña debe tener al menos 6 caracteres"
          />
          <q-input
            v-model="passAux"
            class="q-mt-sm"
            dense
            label="Repita la contraseña"
            type="password"
            :color="userRegistro.Password === passAux ? '' : 'red'"
            :label-color="userRegistro.Password === passAux ? '' : 'red'"
            :hint="userRegistro.Password === passAux ? false : 'Las contraseñas no coinciden'"
          />
        </div>
        <span class="text-negative q-pl-lg text-caption">*Todos los campos son obligatorios</span>
        <div class="full-width flex justify-center q-my-md">
          <q-btn
            @click="registro"
            color="primary q-mr-md"
          >Enviar</q-btn>
          <q-btn
            @click="cancelarRegistro"
            color="red"
          >Cancelar</q-btn>
        </div>
      </q-card>
    </q-dialog>

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
  </q-page>
</template>

<style>
</style>

<script>
import moment from 'moment'
import { QSpinner } from 'quasar'
import models from '../models'
import InicioSesion from '../components/InicioSesion.vue'
import auth from '../auth'
import request from '../request'

export default {
  name: 'Login',
  components: {
    InicioSesion,
    QSpinner
  },
  data () {
    return {
      paso: 'inicio',
      user: models.Usuarios(),
      codigoVerificacion: '',
      nuevoPass: '',
      oldPass: '',
      loading: false,
      lock: [true],
      recuperarModal: false,
      registroModal: false,
      consultaModal: false,
      email: '',
      pass: '',
      consulta: {
        Apynom: '',
        Texto: '',
        Telefono: ''
      },
      userRegistro: {
        Apellidos: '',
        Nombres: '',
        Usuario: '',
        Password: '',
        Email: '',
        TelefonoUsuario: ''
      },
      passAux: ''
    }
  },
  created () {
    this.inicio()
  },
  methods: {
    habilitarRecuperarCuenta () {
      this.recuperarModal = true
    },
    habilitarRegistro () {
      this.registroModal = true
    },
    inicio () {
      this.paso = 'inicio'
      this.user.Usuario = ''
      this.user.Password = ''
      this.codigoVerificacion = ''
      this.nuevoPass = ''
      this.oldPass = ''
      this.lock = [true]
      auth.logout()
    },
    errorPassword () {
      let v1 = this.user.validate.Password()
      if (v1) {
        return v1
      }
      return ((this.nuevoPass.length >= this.user.Password.length && this.nuevoPass !== this.user.Password) && 'Las contraseñas no coinciden') || ''
    },
    redirect () {
      let path = this.$route.params.redirect
      if (!path || path.includes('Login')) {
        path = '/'
      }
      if (typeof auth.UsuarioLogueado.IdRol !== 'undefined') {
        console.log('cadete')
        path = '/Maps'
      }
      this.$router.push({ path: path })
    },
    login () {
      this.loading = true
      auth.login(this.user, (DebeCambiarPass) => {
        this.loading = false
        if (DebeCambiarPass === 'S') {
          this.oldPass = this.user.Password
          this.paso = 'CambiarPassword'
        } else if (DebeCambiarPass === 'N') {
          this.redirect()
        }
      })
    },
    cambiarPass () {
      if (this.user.Password !== this.nuevoPass) {
        return
      }
      this.loading = true
      auth.cambiarPass(this.oldPass, this.nuevoPass, (redirect) => {
        this.loading = false
        if (!auth.isLoggedIn) {
          this.paso = 'VerificarUsuario'
        }
        if (redirect) {
          this.redirect()
        }
      })
    },
    verificarUsuario () {
      this.loading = true
      auth.verificarUsuario(this.user.Usuario, (DebeCambiarPass) => {
        this.loading = false
        if (DebeCambiarPass === 'S') {
          this.paso = 'VerificarCodigo'
        } else if (DebeCambiarPass === 'N') {
          this.paso = 'IngresarPassword'
          this.$nextTick(() => {
            this.$refs.passInput.focus()
          })
        }
      })
    },
    esNumerico () {
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      for (let i = 0; i < this.codigoVerificacion.length; i++) {
        if (!numbers.includes(this.codigoVerificacion[i])) {
          return false
        }
      }
      return true
    },
    verificarCodigo () {
      if (!this.esNumerico() || !this.lock.pop()) {
        return
      }
      this.loading = true
      auth.verificarCodigo(this.user.Usuario, this.codigoVerificacion, ok => {
        this.lock.push(true)
        this.loading = false
        if (ok) {
          this.oldPass = this.codigoVerificacion
          this.paso = 'CambiarPassword'
        }
        this.codigoVerificacion = ''
      })
    },
    cancelar () {
      this.email = ''
      this.pass = ''
      this.recuperarModal = false
    },
    recuperarCuenta () {
      if (!this.email || !this.pass) {
        this.$q.notify('Rellene ambos campos para continuar')
      } else {
        request.Post('/usuarios/recuperar-cuenta', {Email: this.email, Pass: this.pass}, r => {
          if (r.Error) {
            this.$q.notify(r.Error)
          } else {
            this.email = ''
            this.pass = ''
            this.recuperarModal = false

            this.$q.notify('Se ha cambiado la contraseña exitosamente, ya puedes loguearte con tu cuenta.')
          }
        })
      }
    },
    registro () {
      const keys = Object.keys(this.userRegistro)
      let check = false

      keys.forEach(k => {
        if (!this.userRegistro[k]) {
          check = true
        }
      })

      if (check) {
        this.$q.notify('Debe llenar todos los campos para continuar')
        return null
      }

      if (this.userRegistro.Password !== this.passAux) {
        this.$q.notify('Las contraseñas no coinciden')
        return null
      }

      if (!this.validarEmail(this.userRegistro.Email)) {
        this.$q.notify('Ingrese un email válido')
        return null
      }

      if (this.userRegistro.Usuario.length < 8) {
        this.$q.notify('Ingrese un DNI valido')
        return null
      }

      if (this.userRegistro.Password.length < 6) {
        this.$q.notify('La contraseña debe tener al menos 6 caracteres')
        return null
      }

      request.Post('/usuarios/alta-cliente', this.userRegistro, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.$q.notify('Su cuenta se creo con exito, ya puede loguearse en DocDoc! Clientes')
          this.cancelarRegistro()
        }
      })
    },
    cancelarRegistro () {
      this.userRegistro = {
        Apellidos: '',
        Nombres: '',
        Usuario: '',
        Password: '',
        Email: '',
        TelefonoUsuario: ''
      }
      this.passAux = ''
      this.registroModal = false
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
    validarEmail (e) {
      if (e === '') { return true }

      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!re.test(String(e).toLowerCase())) {
        return false
      }
      return true
    }
  }
}
</script>

<style>
.container-form {
  padding-left: 10%;
}

.container-img {
  width: 50%;
  min-width: 300px;
}

.verificacion-codigo {
  letter-spacing: 8px;
  font-size: 20px;
  text-align: center;
}
.volver-inicio:hover {
  cursor: pointer;
}

.login-container {
  min-height: inherit;
}

.img-login {
  align-content: flex-start;
  height: auto !important;
  background-image: url(../statics/img/login-img.png);
  background-repeat: no-repeat;
  background-position: center;
  min-height: 390px;
}

.inicio .q-field__control::before, .inicio .q-btn__wrapper::before {
  content: '';
  background: -moz-linear-gradient(50% 100% 90deg,rgba(255, 255, 255, 1) 0%,rgba(253, 253, 253, 1) 44.8%,rgba(246, 246, 246, 1) 60.93%,rgba(235, 235, 235, 1) 72.43%,rgba(218, 218, 218, 1) 81.73%,rgba(196, 196, 196, 1) 89.7%,rgba(169, 169, 169, 1) 96.62%,rgba(153, 153, 153, 1) 100%);
  background: -webkit-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 44.8%, rgba(246, 246, 246, 1) 60.93%, rgba(235, 235, 235, 1) 72.43%, rgba(218, 218, 218, 1) 81.73%, rgba(196, 196, 196, 1) 89.7%, rgba(169, 169, 169, 1) 96.62%, rgba(153, 153, 153, 1) 100%);
  background: -webkit-gradient(linear,50% 100% ,50% 0% ,color-stop(0,rgba(255, 255, 255, 1) ),color-stop(0.448,rgba(253, 253, 253, 1) ),color-stop(0.6093,rgba(246, 246, 246, 1) ),color-stop(0.7243,rgba(235, 235, 235, 1) ),color-stop(0.8173,rgba(218, 218, 218, 1) ),color-stop(0.897,rgba(196, 196, 196, 1) ),color-stop(0.9662,rgba(169, 169, 169, 1) ),color-stop(1,rgba(153, 153, 153, 1) ));
  background: -o-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 44.8%, rgba(246, 246, 246, 1) 60.93%, rgba(235, 235, 235, 1) 72.43%, rgba(218, 218, 218, 1) 81.73%, rgba(196, 196, 196, 1) 89.7%, rgba(169, 169, 169, 1) 96.62%, rgba(153, 153, 153, 1) 100%);
  background: -ms-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 44.8%, rgba(246, 246, 246, 1) 60.93%, rgba(235, 235, 235, 1) 72.43%, rgba(218, 218, 218, 1) 81.73%, rgba(196, 196, 196, 1) 89.7%, rgba(169, 169, 169, 1) 96.62%, rgba(153, 153, 153, 1) 100%);
  -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFF', endColorstr='#999999' ,GradientType=0)";
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 44.8%, rgba(246, 246, 246, 1) 60.93%, rgba(235, 235, 235, 1) 72.43%, rgba(218, 218, 218, 1) 81.73%, rgba(196, 196, 196, 1) 89.7%, rgba(169, 169, 169, 1) 96.62%, rgba(153, 153, 153, 1) 100%);
  opacity : 0.5;
  filter: alpha(opacity=50) progid:DXImageTransform.Microsoft.Alpha(opacity=50) progid:DXImageTransform.Microsoft.gradient(startColorstr='#999999',endColorstr='#FFFFFF' , GradientType=0);
}

@media screen and (max-width: 1023px) {
  .container-form {
    padding-left: 0%;
  }
}
</style>
