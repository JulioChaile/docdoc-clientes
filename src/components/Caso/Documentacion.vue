<template>
  <div>
    <div
      v-if="!doc"
      class="column full-width items-center justify-center text-center"
      style="height: 70vh"
    >
      <q-icon
        class="q-mb-md"
        name="inventory"
        size="md"
        color="teal"
      />
      <div class="text-teal text-bold text-subtitle1">
        Se te notificará en cuanto el estudio requiera documentación para tu caso
      </div>
    </div>

    <div
      v-else
      class="column items-start q-pa-md full-width"
    >
      <div
        v-for="p in casoAbierto.Actores"
        :key="p.IdPersona"
        class="column q-mb-lg full-width"
      >
        <div class="text-weight-bold q-mb-sm column">
          {{ p.Persona }}
          <div
            v-if="p.DocumentacionSolicitada.length"
            class="text-caption"
          >
            {{ progresoDoc(p.DocumentacionSolicitada) }}
          </div>
        </div>

        <div
          v-for="d in p.DocumentacionSolicitada"
          :key="d.Doc"
          class="row items-center"
        >
          <q-icon
            :name="d.Estado ? 'done' : 'close'"
            :color="d.Estado ? 'positive' : 'negative'"
            size="xs"
            class="col-1"
          />

          <div class="text-weight-medium col-11">
            {{ d.Doc }}
          </div>
        </div>

        <div
          v-if="!p.DocumentacionSolicitada.length"
          class="text-caption text-left text-grey full-width text-center q-mt-md"
        >
          No se requiere documentacion de esta persona.
        </div>

        <q-separator class="q-mt-sm" style="width: 50%; margin-left:auto; margin-right:auto" />
      </div>

      <span class="text-weight-bold text-h5">
        Total
      </span>
      {{ progresoDocTotal() }}

      <div
        v-if="porcentajeTotal !== 100"
        class="column items-center text-teal text-weight-bold q-mt-xl text-center"
      >
        Envía la documentación solicitada para que el estudio pueda avanzar en tu caso

        <q-uploader
          label="Documentación"
          auto-upload
          multiple
          :factory="factoryFn"
          @uploaded="uploadedFile"
          @finish="finishUpload"
          @failed="verErrorUpload"
          @factory-failed="verErrorUpload"
          style="width: 70%; margin-top: 10px"
        />
      </div>
      <div
        v-else
        class="column items-center text-teal text-weight-bold q-mt-xl text-center"
      >
        Ya tenemos la documentación necesaria por ahora, se te notificará cualquier novedad del caso.
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../auth'
import request from '../../request'

export default {
  name: 'Documentacion',
  props: ['casoAbierto'],
  data () {
    return {
      doc: false,
      Multimedia: [],
      porcentajeTotal: 0
    }
  },
  created () {
    if (!this.casoAbierto) return

    const actores = this.casoAbierto.Actores

    actores.forEach(a => {
      if (a.DocumentacionSolicitada.length) this.doc = true
    })
  },
  methods: {
    factoryFn () {
      return {
        url: 'https://io.docdoc.com.ar/api/multimedia',
        method: 'POST',
        headers: [
          { name: 'Authorization', value: `Bearer ${auth.Token}` }
        ]
      }
    },
    uploadedFile ({ files, xhr }) {
      const data = JSON.parse(xhr.response)
      for (let i = 0; i < files.length; i++) {
        const Tipo = files[i].type

        const formatosDoc = ['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'pdf']
        const formato = data.Urls[0]
          .split('.')
          .reverse()[0]
          .toLowerCase()

        const origen = formatosDoc.includes(formato) ? 'D' : 'R'

        this.Multimedia.push({
          URL: data.Urls[0],
          Nombre: data.Names[0],
          Tipo: Tipo.includes('application') ? 'O' : Tipo.substring(0, 1).toUpperCase(),
          OrigenMultimedia: origen,
          IdCarpetaCaso: 0
        })
      }
    },
    finishUpload () {
      request.Post('/multimedia-caso/alta', {IdCaso: this.casoAbierto.IdCaso, Multimedia: this.Multimedia}, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.$q.notify('Los archivos se han terminado de subir con exito. Pronto el estudio los revisara y se te notificará del avance.')
        }

        this.Multimedia = []
      })
    },
    progresoDoc (doc) {
      const total = parseInt(doc.length)
      const progreso = parseInt(doc.filter(d => d.Estado).length)
      const porcentaje = (progreso / total) * 100

      return `${progreso}/${total} - ${parseInt(porcentaje)}%`
    },
    progresoDocTotal () {
      let total = 0
      let progreso = 0

      this.casoAbierto.Actores.forEach(a => {
        total += parseInt(a.DocumentacionSolicitada.length)
        progreso += parseInt(a.DocumentacionSolicitada.filter(d => d.Estado).length)
      })

      this.porcentajeTotal = (progreso / total) * 100

      return total !== 0
        ? `${progreso}/${total} - ${parseInt(this.porcentajeTotal)}%`
        : 'Sin documentación solicitada'
    },
    verErrorUpload (info) {
      console.log(info)
    }
  }
}
</script>
