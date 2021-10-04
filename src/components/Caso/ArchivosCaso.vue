<template>
  <div class="relative-position">
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
      <!--div
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
      </div-->

      <q-tab-panels
        class="bg-transparent col-12"
        v-model="tab"
        animated
      >
        <q-tab-panel class="q-pa-none" name="carpetas__tab">
          <div class="header-documentacion flex bg-teal text-start items-center q-pl-sm text-h5 text-white text-weight-medium">
            <q-icon
              name="o_folder"
              size="sm"
              class="q-mr-sm"
            />
            Carpetas
          </div>

          <q-tabs
            v-model="tab"
            vertical
            inline-label
            class="text-black text-teal"
            content-class="panel-carpetas"
            active-color="dark"
            indicator-color="skyblue"
            align="left"
            style="height: auto !important"
          >
            <q-tab
              v-for="t in tabsPorDefecto"
              :key="t"
              :name="t"
              :icon="oldTab === t ? 'folder_open' : 'folder'"
              :label="labelCarpeta(t)"
              style="justify-content:initial"
              content-class="carpeta"
            >
              <div
                v-if="oldTab === t"
                class="icon_carpeta"
              >
                <q-icon
                  name="arrow_forward_ios"
                  size="sm"
                  class="q-mr-sm"
                />
              </div>
            </q-tab>

            <q-separator style="width: 90%; margin: auto" />

            <q-tab
              v-for="c in CarpetasCaso"
              :key="c.IdCarpetaCaso"
              :name="c.Nombre"
              :icon="oldTab === c.Nombre ? 'folder_open' : 'folder'"
              :label="c.Nombre"
              content-class="carpeta"
            >
              <div
                v-if="oldTab === c.Nombre"
                class="icon_carpeta"
              >
                <q-icon
                  name="arrow_forward_ios"
                  size="sm"
                  class="q-mr-sm"
                />
              </div>
            </q-tab>
          </q-tabs>
        </q-tab-panel>

        <q-tab-panel
          v-for="t in tabs"
          :key="t"
          class="q-pa-none row relative-position panel-archivos"
          :name="t"
        >
          <div class="header-documentacion fixed-top flex bg-teal text-start items-center q-pl-sm text-h6 text-white text-weight-medium">
            <q-icon
              name="arrow_back_ios"
              size="sm"
              class="q-mx-sm"
              @click="tab = 'carpetas__tab'"
            />
            {{ tab.toUpperCase() }}
            <q-select
              dense
              v-if="tab !== 'documentos'"
              v-model="filtro"
              style="margin-left: auto; margin-right: 15px"
              :options="['Todo', 'Imagenes', 'Videos', 'Otros']"
              color="dark"
            />
          </div>

          <div style="width: 100%; height: 50px">
          </div>

          <div
            v-if="filtroCarpeta.length === 0"
            class="full-width column items-center text-center"
          >
            <q-icon
              class="q-mb-md"
              name="o_cloud"
              size="md"
              color="teal"
            />
            <div
              v-if="filtro === 'Todo'"
              class="text-teal text-bold text-subtitle1"
            >
              Esta carpeta no tiene documentación cargada
            </div>
            <div
              v-else
              class="text-teal text-bold text-subtitle1"
            >
              No hay archivos que coincidan con el criterio de busqueda
            </div>
          </div>

          <div
            v-else
            v-for="m in filtroCarpeta"
            :key="m.URL"
            class="col-grow-3 container_multimedia items-end"
            :style="m.check ? 'border-color: red' : ''"
          >
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
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Modal Visor -->
    <q-dialog v-model="modalVisor">
      <VisorArchivo
        :archivo="archivoVer"
        @cerrar="modalVisor = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { QTabPanels, QTabPanel, QTab, QTabs } from 'quasar'
import auth from '../../auth'
import request from '../../request'
import Loading from '../../components/Loading'
import VisorArchivo from '../../components/Caso/VisorArchivo'
import GenerarPDF from '../../components/Archivos/GenerarPDF'

export default {
  name: 'ArchivosCaso',
  components: {
    Loading,
    VisorArchivo,
    GenerarPDF,
    QTabPanels,
    QTabPanel,
    QTab,
    QTabs
  },
  props: ['casoAbierto'],
  data () {
    return {
      id: 0,
      loading: true,
      filtro: 'Todo',
      tab: 'carpetas__tab',
      oldTab: '',
      tabs: ['caso', 'documentos', 'cliente'],
      tabsPorDefecto: ['caso', 'documentos', 'cliente'],
      CarpetasCaso: [],
      CarpetaCaso: [],
      CarpetaDocumentos: [],
      CarpetaCliente: [],
      Multimedia: [],
      MultimediaSeleccionado: [],
      MultimediaCarpetas: [],
      modalVisor: false,
      archivoVer: {},
      modalPDF: false,
    }
  },
  created () {
    this.id = this.casoAbierto.IdCaso

    request.Get('/casos/listar-carpetas', {IdCaso: this.id}, r => {
      if (r.Error) {
        this.$q.notify('Ha ocurrido un error al traer las carpetas del caso')
      } else {
        r.forEach(c => {
          this.tabs.push(c.Nombre)
        })

        this.CarpetasCaso = r

        this.CarpetasCaso.sort((a, b) => {
          if (a.Nombre > b.Nombre) {
            return 1
          } else if (a.Nombre < b.Nombre) {
            return -1
          } else {
            return 0
          }
        })
      }
    })

    request.Get('/multimedia-caso', {IdCaso: this.id}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        const formatosDoc = ['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'odt', 'pdf']
        r.forEach(m => {
          m.check = false
          m.showing = false

          const formato = m.URL.split('.').reverse()[0].toLowerCase()

          m.OrigenMultimedia = formatosDoc.includes(formato) ? 'D' : m.OrigenMultimedia

          if (!m.IdCarpetaCaso) {
            switch (m.OrigenMultimedia) {
              case 'D':
                this.CarpetaDocumentos.push(m)
                break

              case 'R':
                this.CarpetaCliente.push(m)
                break

              case 'C':
                this.CarpetaCaso.push(m)
                break

              default:
                break
            }
          } else {
            this.MultimediaCarpetas.push(m)
          }
        })

        this.loading = false
      }
    })
  },
  watch: {
    tab () {
      if (this.tab !== 'carpetas__tab') this.oldTab = this.tab

      this.filtro = 'Todo'
    }
  },
  computed: {
    filtroCarpeta () {
      const tab = this.tab
      let multimedia

      if (tab === 'carpetas__tab') return []

      if (!this.tabsPorDefecto.includes(tab)) {
        const i = this.CarpetasCaso.findIndex(c => c.Nombre === tab)
        const IdCarpeta = parseInt(this.CarpetasCaso[i].IdCarpetaCaso)
        multimedia = this.MultimediaCarpetas.filter(m => parseInt(m.IdCarpetaCaso) === IdCarpeta)
      } else {
        const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)
        multimedia = this[Carpeta].filter(m => !m.IdCarpetaCaso)
      }

      switch (this.filtro) {
        case 'Todo':
          return multimedia

        case 'Imagenes':
          return multimedia.filter(m => m.Tipo === 'I')

        case 'Videos':
          return multimedia.filter(m => m.Tipo === 'V')

        case 'Otros':
          return multimedia.filter(m => m.Tipo === 'A' || m.Tipo === 'O' || m.Tipo === 'D')

        default:
          return []
      }
    }
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
    labelCarpeta (c) {
      switch (c) {
        case 'caso':
          return 'Caso'

        case 'documentos':
          return 'Documentos'

        case 'cliente':
          return 'Chat / Cliente'
      }
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
  .header-documentacion {
    width: 100%;
    height: 50px;
    top: auto;
    z-index: 1000;
  }

  .panel-archivos {
    height: calc(100vh - 112px) !important;;
    overflow: scroll;
  }

  .icon_carpeta {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .q-tab__content.carpeta {
    width: 100% !important;
    justify-content: flex-start;
  }

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
