<template>
    <q-card style="padding:1rem;">
        <span class="text-h6">Archivar Caso</span>
        <span>
          <p>
            Al archivar un caso, este se ocultará de la lista.
            Puede volver a ver el caso filtrando la búsqueda en la Página Casos
          </p>
        </span>
        <div style="float:right;">
          <q-btn color="primary" label="Archivar" @click="archivarCaso()" />
          <q-btn flat label="Cancelar" @click="$emit('cerrar')" />
        </div>
      </q-card>
</template>

<script>
import request from '../../request'
import { Notify } from 'quasar'
export default {
  name: 'ArchivarCaso',
  props: [ 'IdCaso' ],
  methods: {
    archivarCaso () {
      request.Put(`/casos/${this.IdCaso}/archivar`, {}, (r) => {
        if (r.Error) {
          Notify.create(r.Error)
          this.$emit('cerrar')
        } else {
          Notify.create('El caso ha sido archivado con exito.')
          this.$emit('archivado')
        }
      })
    }
  }
}
</script>
