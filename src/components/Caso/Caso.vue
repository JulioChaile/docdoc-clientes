<template>
  <div class="q-py-xl q-px-sm row" style="padding-top: 0px;padding-bottom: 0px">
    <!-- Seccion de datos del caso -->
    <div class="col-12">
      <data-item
        :text="caratula"
        text-class="text-weight-medium text-h4"
        label="Caratula"
        labelColor="accent"
      />
    </div>

    <!-- Seccion de personas del caso -->
    <!--div class="col-12 col-md-7 col-lg-6 contenedor_personas">
      <Personas
        :personas="dataPersonas()"
        @agregarTelefono="agregarTelefono"
        @updateTelefonos="updateTelefonos"
        @eliminarTelefono="eliminarTelefono"
      />
    </div-->

    <q-separator class="q-mt-sm" />

    <!-- Movimientos -->
    <div class="full-width text-center text-h5 q-my-lg text-weight-bolder">
      Novedades
    </div>

    <q-separator />

    <div
      v-if="loading"
      class="full-width"
    >
      <Loading />
    </div>
    <div
      v-else-if="movimientos.length === 0"
      class="full-width column items-center text-center q-mt-xl"
    >
      <q-icon
        class="q-mb-md"
        name="gavel"
        size="md"
        color="teal"
      />
      <div
        class="text-teal text-bold text-subtitle1"
      >
        Seguimos trabajando en tu caso
        <br>
        Pronto tendremos novedades
      </div>
    </div>
    <div
      v-else
      class="full-width q-pb-sm"
    >
      <div
        v-for="(m, i) in movimientos"
        :key="m.IdMovimientoCaso"
        :class="`bg-white novedad-container q-py-sm q-px-md row full-width q-mt-lg ${classNov(i)}`"
        @click="verNovedad(m)"
        rounded
      >
        <div class="col-9 text-weight-medium ellipsis-3-lines full-height relative-position">
          {{ m.Detalle }}
          <q-separator
            class="absolute-right"
            color="dark"
            size="2px"
            vertical
          />
        </div>
        <div
          v-if="diasRestantes(m.FechaAlta)"
          class="col-3 text-weight-bold column text-center justify-center items-center"
        >
          <span
          class="text-h4"
          >
            {{ diasRestantes(m.FechaAlta) }}
          </span>
          {{ 'Día' + (diasRestantes(m.FechaAlta) === 1 ? '' : 's') }}
        </div>
        <div
          v-else
          class="col-3 text-weight-bold column text-center text-h6 justify-center items-center"
        >
          Hoy
        </div>
      </div>
    </div>

    <!-- Modal Novedad -->
    <q-dialog v-model="modalNov">
      <div class="full-width q-pa-md">
        <div class="text-h6 text-center">
          {{ movAux.FechaAlta.split(' ')[0].split('-').reverse().join('/') }}
        </div>

        <q-separator class="q-my-sm" />
        <span class="text-weight-medium">
          {{ movAux.Detalle }}
        </span>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import request from '../../request'
import DataItem from '../Compartidos/DataItem'
import Personas from '../../components/Caso/Personas'
import Loading from '../../components/Loading'
import { Notify } from 'quasar'
import moment from 'moment'
export default {
  name: 'Caso',
  components: {
    Personas,
    DataItem,
    Loading
  },
  data () {
    return {
      id: 0,
      caratula: '',
      movimientos: [],
      loading: true,
      modalNov: false,
      movAux: {
        FechaAlta: '',
        Detalle: ''
      }
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$router.push('GrillaCasos')
      return
    }
    this.id = this.$route.query.id
    this.caratula = this.$route.query.caratula

    request.Get(`/casos/${this.id}/movimientos-clientes`, {}, r => {
      if (r.Error) {
        this.$q.notify('Ocurrio un error al traer las novedades')
      } else {
        this.movimientos = r.reverse()
        this.loading = false
      }
    })
  },
  methods: {
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
    classNov (i) {
      const c = parseInt(i) % 4 + 1

      return `logo-${c}`
    },
    diasRestantes (fecha) {
      fecha = fecha.split(' ')[0]
      const resultado = moment().diff(moment(fecha), 'days')
      return resultado
    },
    verNovedad (m) {
      this.movAux = m
      this.modalNov = true
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

.logo-1 {
  background-image: linear-gradient(90deg, #ececec, red, #ececec 55%) !important;
}
.logo-2 {
  background-image: linear-gradient(90deg, #ececec, blue, #ececec) !important;
}
.logo-3 {
  background-image: linear-gradient(90deg, #ececec 20%, green, #ececec 80%) !important;
}
.logo-4 {
  background-image: linear-gradient(90deg, #ececec, orange, #ececec) !important;
}
.novedad-container {
  opacity: 0.9;
  height: 80px !important;
  border: solid 1px;
  border-color: #e0e0e0;
  border-radius: 30px;
}
</style>
