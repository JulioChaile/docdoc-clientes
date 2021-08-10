<template>
  <q-card>
    <q-list bordered>
      <!-- Notificaciones -->
      <q-item-label header>
          Notificaciones
      </q-item-label>
      <q-item sparse>
        <q-item-section>
          <NotificacionesMensajes
            :notificaciones="notificaciones"
            :notificacionesMediadores="notificacionesMediadores"
            :notificacionesContactos="notificacionesContactos"
            @notificacionLeida="leerNotificacion"
          />
        </q-item-section>
      </q-item>

      <!-- Vencimientos -->
      <q-item sparse v-if="verVencimientos">
        <q-item-section>
        <BotonVencimientos @vencimientosVistos="$emit('vencimientosVistos')" />
        </q-item-section>
      </q-item>
      <q-separator />

      <!-- Ajustes y cerrar sesión -->
      <q-item sparse class="ventana_user_btn" to="/Login">
        <q-item-section side top>
          <q-icon name="exit_to_app" />
        </q-item-section>
        <q-item-section>
          Cerrar Sesión
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import NotificacionesMensajes from './NotificacionesMensajes'
import BotonVencimientos from './BotonVencimientos'

export default {
  name: 'VentanaUsuario',
  components: { NotificacionesMensajes, BotonVencimientos },
  props: {
    notificaciones: {
      type: Array,
      default: () => []
    },
    notificacionesMediadores: {
      type: Array,
      default: () => []
    },
    notificacionesContactos: {
      type: Array,
      default: () => []
    },
    verVencimientos: {
      type: Boolean,
      default: () => []
    }
  },
  methods: {
    leerNotificacion (data, tipo) {
      this.$emit('notificacionLeida', data, tipo)
    }
  }
}
</script>

<style scoped>
.ventana_user_btn {
  display:flex;
  align-items:center;
  bottom: 0;
  width: 100%
}
</style>
