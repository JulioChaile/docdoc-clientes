<template>
  <div class="bg-transparent" style="position: relative">
    <div
      v-if="loading"
    >
      <Loading />
    </div>
    <div v-else :key="keyContainer">
      <!--q-btn
        class="fixed-bottom bg-white q-mx-auto text-positive"
        style="z-index: 1000; width: 80px; height: 80px; opacity: .9; font-size: 22px; bottom: 70px"
        round
        icon="chat"
        @click="$emit('abrirChat', casoAbierto)"
      >
        <q-badge v-if="casoAbierto.mensajesNuevos" style="border-radius: 1em;padding: 7px;z-index: 5000" floating color="red" rounded>
          {{ casoAbierto.mensajesNuevos }}
        </q-badge>
      </q-btn-->

      <div
        v-if="casos.length === 0"
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
        v-for="c in casos"
        :key="c.IdCaso + c.mensajesNuevos"
        :id="c.IdCaso + 'caso'"
        :class="`row contenedor_caso ${casoAbierto.IdCaso === c.IdCaso ? 'caso_abierto' : ''}`"
        @click="$emit('abrirCaso', c)"
      >
        <q-badge v-if="c.mensajesNuevos" class="q-mt-sm q-mr-sm" color="red" floating transparent>
          {{ c.mensajesNuevos }}
        </q-badge>
        <div class="col-11 column q-py-sm q-px-md">
          <div class="caratula_caso q-mb-sm">
            {{ c.Demandados.length ? c.Demandados.join(' - ') : c.Caratula }}
          </div>
          <span class="text-overline estudios_caso">
            {{ c.Estudios.join(', ')}}
          </span>
        </div>
        <div class="col-1 flex items-center justify-center q-pr-md">
          <q-icon
            v-if="casoAbierto.IdCaso === c.IdCaso"
            name="arrow_forward_ios"
            size="xs"
          />
        </div>
        <q-separator />
      </div>
    </div>
  </div>
</template>

<script>
import request from '../request'
import Loading from '../components/Loading'
import { Notify } from 'quasar'
export default {
  components: {
    Loading
  },
  name: 'GrillaCasos',
  props: [ 'casos', 'loading', 'casoAbierto'],
  data() {
    return {
      mensajesSinLeer: [],
      keyContainer: 1
    }
  },
  watch: {
    loading () {
      if (!this.loading) {
        this.buscarMensajes()
        
        if (sessionStorage.intervalBuscarMensajes) {
          clearInterval(sessionStorage.intervalBuscarMensajes)
        }
        sessionStorage.intervalBuscarMensajes = setInterval(this.buscarMensajes, 30000)
      }
    }
  },
  mounted () {
    if (!this.loading) {
      this.buscarMensajes()
      
      if (sessionStorage.intervalBuscarMensajes) {
        clearInterval(sessionStorage.intervalBuscarMensajes)
      }
      sessionStorage.intervalBuscarMensajes = setInterval(this.buscarMensajes, 30000)
    }
  },
  methods: {
    buscarMensajes () {
      request.Get(`/mensajes-interno/nuevos-mensajes`, { IdCaso: 0, Cliente: 'N' }, r => {
        this.loading = false
        if (!r.Error) {
          if (r.length) {
            let mensajesSession = sessionStorage.getItem('msjInterno') ? JSON.parse(sessionStorage.getItem('msjInterno')) : []
            const ids = mensajesSession.map(m => parseInt(m.IdMensajeChatInterno))
            console.log({ids})

            const mensajesNuevos = r.filter(m => !ids.includes(parseInt(m.IdMensajeChatInterno)))

            mensajesSession = mensajesSession.concat(mensajesNuevos)

            this.casos.forEach(c => {
              const i = mensajesNuevos.filter(m => parseInt(m.IdCaso) === parseInt(c.IdCaso)).length

              c.mensajesNuevos = c.mensajesNuevos ? c.mensajesNuevos + i : i
            })

            sessionStorage.setItem('msjInterno', JSON.stringify(mensajesSession))

            if (mensajesNuevos.length > 0) {
              Notify.create(`Tienes ${mensajesNuevos.length} mensajes nuevos`)
              this.keyContainer++
            }
          }
        } else {
          console.log('Error en el loop.')
          console.log(r)
        }
      })
    }
  }
}
</script>

<style>
.opacity-9 {
  opacity: 0.9;
}

.contenedor_caso {
  height: 64px;
  position: relative;
}

.caso_abierto::before {
  content: '';
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 64px;
  background: transparent;
  background: grey;
  opacity: 0.5;
}

.caratula_caso {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.1875rem;
  color: rgb(17, 17, 17);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

.estudios_caso {
  font-weight: 400;
  line-height: 1.0625rem;
  color: rgb(85, 85, 85);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
