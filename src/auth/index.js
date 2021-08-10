import request from '../request'
import { Notify } from 'quasar'

const DocdocToken = 'DOCDOCTOKENPWA'
const DebeCambiarPass = 'DOCDOCDEBECAMBIARPASS'
const UsuarioLogueado = 'DOCDOCUSUARIOLOGUEADO'

export default {
  callbacksLogin: [],
  get Token () {
    return localStorage.getItem(DocdocToken)
  },
  get DebeCambiarPass () {
    return localStorage.getItem(DebeCambiarPass)
  },
  get UsuarioLogueado () {
    try {
      return JSON.parse(localStorage.getItem(UsuarioLogueado))
    } catch (err) {
      return {}
    }
  },
  get isLoggedIn () {
    return !!(this.Token && this.DebeCambiarPass === 'N')
  },
  addCallbackLogin (callback) {
    this.callbacksLogin.push(callback)
  },
  login (user, callback) {
    request.Post('/login', {Usuario: user.Usuario, Password: user.Password, Cliente: '7*7d8', InApp: 1}, r => {
      if (r.Error) {
        Notify.create(r.Error)
        callback()
      } else {
        let u = r.Mensaje.Usuario
        localStorage.setItem(DocdocToken, u.Token)
        if (u.DebeCambiarPass === 'S') {
          localStorage.setItem(DebeCambiarPass, u.DebeCambiarPass)
        } else {
          localStorage.setItem(DebeCambiarPass, 'N')
          localStorage.setItem(UsuarioLogueado, JSON.stringify(u))
        }
        callback(u.DebeCambiarPass)
      }
      this.callbacksLogin.forEach(c => c())
    })
  },
  cambiarPass (oldPass, newPass, callback) {
    request.Post('/usuarios/cambiar-password', {
      Token: localStorage.getItem(DocdocToken),
      OldPass: oldPass,
      NewPass: newPass
    }, r => {
      let redirect = false
      if (r.Error) {
        Notify.create(r.Error)
      } else {
        redirect = true
      }
      callback(redirect)
    })
  },
  verificarUsuario (Usuario, callback) {
    request.Post('/usuarios/existe', {Usuario}, r => {
      if (r.Error) {
        Notify.create(r.Error)
      } else if (r.DebeCambiarPass === 'S') {
        localStorage.setItem(DebeCambiarPass, r.DebeCambiarPass)
      } else {
        localStorage.setItem(DebeCambiarPass, 'N')
      }
      callback(r.DebeCambiarPass)
    })
  },
  verificarCodigo (Usuario, Codigo, callback) {
    request.Post('/usuarios/validar-codigo', {Usuario, Codigo}, r => {
      let result = false
      if (r.Error) {
        Notify.create(r.Error)
      } else {
        let u = r.Mensaje.Usuario
        localStorage.setItem(DocdocToken, u.Token)
        result = true
      }
      callback(result)
    })
  },
  logout () {
    localStorage.removeItem(DocdocToken)
    localStorage.removeItem(DebeCambiarPass)
    localStorage.removeItem(UsuarioLogueado)
    this.callbacksLogin.forEach(c => c())
  }
}
