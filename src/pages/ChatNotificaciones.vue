<template>
  <q-table
    title="Mensajes sin leer"
    :data="mensajes"
    :columns="columnas"
    row-key="caso"
    :rows-per-page-options="[10, 20, 30, 0]"
    :loading="loading"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="Caratula" :props="props">
          {{ props.row.Caratula }}
        </q-td>
        <q-td key="Contenido" :props="props">
          {{ props.row.Contenido }}
        </q-td>
        <q-td key="Acciones" :props="props">
          <q-icon
              name="clear"
              size="xs"
              color="red"
              style="cursor:pointer;"
              @click="marcarLeido(props.row.IdChat, props.row.IdMensaje, props.row.IdMediador ? props.row.IdMediador : null, props.row.IdContacto ? props.row.IdContacto : null)"
            >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <span class="text-body2">Marcar como leido</span>
              </q-tooltip>
            </q-icon>
            <q-icon
              name="chat"
              size="xs"
              color="primary"
              style="cursor:pointer; margin-left: 30px"
              @click="abrirChat(props.row)"
            >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <span class="text-body2">Ir al chat</span>
              </q-tooltip>
            </q-icon>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import request from '../request'
import { Notify } from 'quasar'
export default {
  data () {
    return {
      loading: false,
      columnas: [
        {
          name: 'Caratula',
          required: true,
          label: 'Caso',
          align: 'left',
          sortable: true
        },
        {
          name: 'Contenido',
          required: true,
          label: 'Ultimo Mensaje',
          align: 'left',
          sortable: true
        },
        {
          name: 'Acciones',
          required: true,
          label: 'Acciones',
          align: 'left',
          sortable: true
        }
      ],
      mensajes: []
    }
  },
  created () {
    if (sessionStorage.getItem('mensajes')) {
      this.mensajes = JSON.parse(sessionStorage.getItem('mensajes'))
      sessionStorage.removeItem('mensajes')
      if (this.mensajes[0].IdMediador) {
        this.columnas[0].label = 'Mediador'
      }
      if (this.mensajes[0].IdContacto) {
        this.columnas[0].label = 'Contacto'
      }
    }
  },
  methods: {
    marcarLeido (IdChat, IdMensaje, IdMediador, IdContacto) {
      this.loading = true
      request.Post(`/chats/${IdChat}/actualizar`, { IdUltimoLeido: IdMensaje, mediador: IdMediador, contacto: IdContacto }, r => {
        if (r.Error) {
          Notify.create(r.Error)
        } else {
          const i = this.mensajes.findIndex(m => m.IdChat === IdChat)
          this.mensajes.splice(i, 1)

          this.$nextTick(() => {
            this.loading = false
          })

          Notify.create('Ultimo mensaje leido actualizado')
        }
      })
    },
    abrirChat (item) {
      const routeData = this.$router.resolve({
        name: 'Chat',
        query: {
          id: item.IdChat,
          idCaso: item.IdCaso,
          telefono: item.Telefono,
          caratula: item.Caratula,
          idContacto: item.IdContacto,
          idMediacion: item.IdMediador
        }
      })
      window.open(routeData.href, '_blank')
      this.marcarLeido(item.IdChat, item.IdMensaje, item.IdMediador ? item.IdMediador : null, item.IdContacto ? item.IdContacto : null)
    }
  }
}
</script>
