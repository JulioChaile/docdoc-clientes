<template>
  <q-page style="position:relative">
    <div class="botones_container column" v-if="MultimediaSeleccionado.length > 0">
      <q-btn
        v-if="MultimediaSeleccionado.filter(m => m.Tipo !== 'I').length === 0"
        label="Generar PDF"
        color="teal"
        style="margin-top: 10px"
        @click="modalPDF = true"
        push
      />
    </div>

    <!-- Modal: Generar PDF -->
    <q-dialog v-model="modalPDF">
      <GenerarPDF
        :Multimedia="MultimediaSeleccionado"
        @cerrar="modalPDF = false"
      />
    </q-dialog>

    <!--q-uploader
      label="Multimedia"
      auto-upload
      multiple
      :factory="factoryFn"
      @uploaded="uploadedFile"
      @finish="finishUpload"
      @failed="verErrorUpload"
      @factory-failed="verErrorUpload"
      style="width: 97%; margin-top: 10px"
    /-->
    <div
      class="row"
    >
      <div v-if="loading" class="col-12">
        <Loading />
      </div>
      <div
        v-else-if="Multimedia.length === 0"
        class="full-width column items-center text-center q-mt-xl"
      >
        <q-icon
          class="q-mb-md"
          name="o_cloud"
          size="md"
          color="teal"
        />
        <div
          class="text-teal text-bold text-subtitle1"
        >
          Este caso no tiene documentacion cargada
        </div>
      </div>
      <div
        v-else
        v-for="m in Multimedia"
        :key="m.URL"
        class="col-grow-3 container_multimedia items-end"
        :style="m.check ? 'border-color: red' : ''"
      >
        <!--q-checkbox
          v-model="m.check"
          class="check_multimedia"
          @input="selectArchive(m)"
          color="red"
        /-->
        <q-item class="column">
          <div v-if="m.Tipo === 'A'">
            <q-avatar
              size="200px"
              color="black"
              text-color="yellow"
              icon="graphic_eq"
            />
            <audio controls>
              <source :src="`https://io.docdoc.com.ar/api/multimedia?file=${m.URL}`">
            </audio>
          </div>
          <video v-else-if="m.Tipo === 'V'" class="img--multimedia" :src="`https://io.docdoc.com.ar/api/multimedia?file=${m.URL}`" controls></video>
          <img  v-else-if="m.Tipo === 'I'" class="img--multimedia" :src="`https://io.docdoc.com.ar/api/multimedia?file=${m.URL}`">
          <q-avatar
            v-else
            square
            rounded
            size="200px"
            color="white"
            text-color="black"
          >
            {{ format(m.URL) }}
          </q-avatar>
          <q-item
            class="nombre_multimedia"
            clickable
          >
            {{ m.Nombre }}
            <q-menu v-model="m.showing">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="descargarArchivo(m.URL, m.Nombre)">
                  <q-item-section>Descargar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="abrirVisor(m)">
                  <q-item-section>Ver Archivo</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
        </q-item>
      </div>
    </div>

    <!-- Modal Visor -->
    <q-dialog v-model="modalVisor">
      <VisorArchivo
        :archivo="archivoVer"
        @cerrar="modalVisor = false"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import auth from '../../auth'
import request from '../../request'
import Loading from '../../components/Loading'
import VisorArchivo from '../../components/Caso/VisorArchivo'
import GenerarPDF from '../../components/Archivos/GenerarPDF'
// import JSZip from 'jszip'
export default {
  name: 'ArchivosCaso',
  components: {
    Loading,
    VisorArchivo,
    GenerarPDF
  },
  data () {
    return {
      id: 0,
      loading: true,
      Multimedia: [],
      MultimediaSeleccionado: [],
      modalVisor: false,
      archivoVer: {},
      modalPDF: false,
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$router.push('GrillaCasos')
      return
    }
    this.id = this.$route.query.id
    request.Get('/multimedia-caso', {IdCaso: this.id}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        this.Multimedia = r.map(m => {
          return {...m, check: false}
        })

        this.loading = false
      }
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
      console.log(data)
      for (let i = 0; i < files.length; i++) {
        const Tipo = files[i].type

        this.Multimedia.push({
          URL: data.Urls[0],
          Nombre: data.Names[0],
          Tipo: Tipo.includes('application') ? 'O' : Tipo.substring(0, 1).toUpperCase(),
          OrigenMultimedia: this.tab === 'cliente' ? 'R' : 'C'
        })
      }
    },
    finishUpload () {
      request.Post('/multimedia-caso/alta', {IdCaso: this.id, Multimedia: this.Multimedia}, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          if (this.tab === 'cliente') {
            this.Multimedia.forEach(m => {
              m.check = false
              this.CarpetaCliente.push(m)
            })
          } else {
            this.Multimedia.forEach(m => {
              m.check = false
              this.CarpetaCaso.push(m)
            })
          }

          this.$q.notify('Los archivos se han terminado de subir con exito.')
        }

        this.Multimedia = []
      })
    },
    abrirVisor (m) {
      this.archivoVer = {
        URL: m.URL,
        Tipo: m.Tipo,
        Formato: this.format(m.URL)
      }

      this.modalVisor = true
    },
    format (name) {
      return name.split('.').reverse()[0]
    },
    selectArchive (m) {
      if (m.check) {
        this.MultimediaSeleccionado.push({
          IdMultimedia: m.IdMultimedia,
          URL: m.URL,
          OrigenMultimedia: m.OrigenMultimedia,
          Tipo: m.Tipo
        })
      } else {
        const i = this.MultimediaSeleccionado.findIndex(f => f.IdMultimedia === m.IdMultimedia)
        this.MultimediaSeleccionado.splice(i, 1)
      }
    },
    descargarArchivo (url, name) {
      location.href = `https://io.docdoc.com.ar/api/multimedia?file=${url}&download=true&name=${name}`
    }
  }
}
</script>

<style>
  .img--multimedia {
    height: auto;
    width: auto;
    max-width: 320px;
    max-height: 240px;
  }

  .container_multimedia {
    height: 300px;
    width: 390px;
    display: flex;
    position: relative;
    margin: 2px;
    justify-content: center;
    text-align: center;
    border: 10px solid;
    border-color: transparent;
    border-radius: 25px;
  }

  .check_multimedia {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 100;
  }

  .botones_container {
    position: absolute;
    top: 50px;
    right: 0px;
    z-index: 100;
  }

  .nombre_multimedia {
    padding: 0px;
    min-height: 40px;
    align-items: end;
    justify-content: center;
    font-weight: bold;
    color: teal;
    font-size: 16px;
    margin-bottom: -10px;
  }
</style>
