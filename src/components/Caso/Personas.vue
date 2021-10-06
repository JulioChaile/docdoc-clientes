<template>
  <ul>
    <li
      v-for="persona in casoAbierto.PersonasCaso.filter(p => p.Observaciones === 'Actor')"
      :key="persona.IdPersona"
    >
      <DatosPersona
        v-if="!loading"
        :IdCaso="casoAbierto.IdCaso"
        :Persona="persona"
        :Opciones="opcionesParametros"
      />
    </li>
  </ul>
</template>

<script>
import request from '../../request'
import DatosPersona from '../Caso/DatosPersona'

export default {
  name: 'Personas',
  components: {
    DatosPersona
  },
  props: ['casoAbierto'],
  data () {
    return {
      opcionesParametros: [],
      loading: true
    }
  },
  created () {
    request.Get('/casos/opciones-parametros', {}, r => {
      this.opcionesParametros = r
      this.loading = false
    })
  }
}
</script>
