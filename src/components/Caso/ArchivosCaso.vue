<template>
  <q-page style="position:relative">
    <div class="botones_container column" v-if="MultimediaSeleccionado.length > 0">
      <q-btn
        label="Eliminar"
        color="negative"
        @click="modalEliminar = true"
        push
      />
      <q-btn
        label="Enviar por Mail"
        color="teal"
        style="margin-top: 10px"
        @click="modalMail = true"
        push
      />
      <q-btn
        v-if="MultimediaSeleccionado.filter(m => m.Tipo !== 'I').length === 0"
        label="Generar PDF"
        color="teal"
        style="margin-top: 10px"
        @click="modalPDF = true"
        push
      />
    </div>

    <!-- Modal: Eliminar archivos -->
    <q-dialog
      v-model="modalEliminar"
      prevent-close
    >
      <q-card style="padding:1rem;">
        <div v-if="!eliminando">
          <span class="text-h6">Eliminar Archivos</span>
          <span>
            <p>
              Al eliminar archivos, estos no podrán ser recuperados en el futuro.
              <br>
              ¿Está seguro que desea eliminar estos archivos?
            </p>
          </span>
          <div style="float:right;">
            <q-btn color="negative" label="Eliminar" @click="eliminarArchivos()" />
            <q-btn flat label="Cancelar" @click="modalEliminar = false" />
          </div>
        </div>
        <div v-else style="display: flex; justify-content: center; text-align: center; margin-left: 15px; margin-right: 15px; padding: 35px;">
          Espere unos instantes, se estan eliminando los archivos.
          <br>
          Esto puede tardar algunos segundos.
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal: Enviar Mail -->
    <q-dialog v-model="modalMail">
      <EnviarMail
        :Multimedia="MultimediaSeleccionado"
        :ContenidoPDF="ContenidoPDF"
        :asunto="datosCaso.Caratula"
        @mailEnviado="mailEnviado"
        @cerrar="modalMail = false"
      />
    </q-dialog>

    <!-- Modal: Generar PDF -->
    <q-dialog v-model="modalPDF">
      <GenerarPDF
        :Multimedia="MultimediaSeleccionado"
        @enviarMail="enviarPDF"
        @cerrar="modalPDF = false"
      />
    </q-dialog>

    <q-splitter
      v-model="splitterModel"
      style="height: 100%"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          inline-label
          align="left"
          class="text-teal"
          @input="changeTab"
        >
          <q-tab name="caso" :icon="folderIcon('caso')" label="Caso" style="justify-content:initial" />
          <q-tab name="movimientos" :icon="folderIcon('movimientos')" label="Movimientos" style="justify-content:initial" />
          <q-tab name="cliente" :icon="folderIcon('cliente')" label="Chat / Cliente" style="justify-content:initial" />
        </q-tabs>

        <q-separator/>

        <q-uploader
          label="Multimedia"
          auto-upload
          multiple
          :factory="factoryFn"
          @uploaded="uploadedFile"
          @finish="finishUpload"
          @failed="verErrorUpload"
          @factory-failed="verErrorUpload"
          style="width: 97%; margin-top: 10px"
        />
        * Para subir archivos posicionece en la carpeta "Caso" o "Chat/Cliente"  y luego suba los archivos que desee.
        <br>
        * Los archivos que se intenten subir en la carpeta "Movimientos" se subiran en la carpeta "Caso".

        <q-separator
          v-if="$route.path !== '/ArchivosCaso'"
        />

        <q-btn
          v-if="$route.path !== '/ArchivosCaso'"
          label="Ver en otra pestaña"
          color="teal"
          style="margin-top: 10px; margin-bottom: 10px"
          @click="abrirNuevaPestaña()"
          push
        />
      </template>

      <template v-slot:separator>
        <q-avatar color="teal" text-color="white" size="35px" icon="drag_indicator" style="top: 400px" />
      </template>

      <template v-slot:after>
        <q-tabs
          v-model="tabCarpeta"
          indicator-color="transparent"
          active-color="white"
          align="justify"
          class="text-grey-5 bg-teal"
          @input="changeTabCarpeta"
        >
          <q-tab name="todo" label="Todo" />
          <q-tab name="imagenes" label="Imagenes" />
          <q-tab name="videos" label="Videos" />
          <q-tab name="otros" label="Otros Archivos" />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          class="bg-transparent"
          animated
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            v-for="t in tabs"
            :key="t"
            :name="t"
            class="row"
          >
            <div v-if="loading" class="col-12">
              <Loading />
            </div>
            <div v-else-if="filtroCarpeta.length === 0">
              No hay archivos añadidos en esta carpeta.
            </div>
            <div
              v-else
              v-for="m in filtroCarpeta"
              :key="m.URL"
              class="col-grow-3 container_multimedia items-end"
              :style="m.check ? 'border-color: red' : ''"
            >
              <q-checkbox
                v-model="m.check"
                class="check_multimedia"
                @input="selectArchive(m)"
                color="red"
              />
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
                      <q-separator />
                      <q-item clickable v-close-popup @click="editarNombre(false, m.Nombre, m.IdMultimedia)">
                        <q-item-section>Editar Nombre</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
              </q-item>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <!-- Modal Visor -->
    <q-dialog v-model="modalVisor">
      <VisorArchivo
        :archivo="archivoVer"
        @cerrar="modalVisor = false"
      />
    </q-dialog>

    <!-- Modal Editar Nombre -->
    <q-dialog v-model="modalNombre">
      <q-card style="padding: 1em; width: 70%; display: grid">
        <q-input
          class="input"
          type="text"
          v-model="nombreEditar"
        />
        <q-btn
          style="justify-self: center; margin-top: 10px"
          color="teal"
          label="Aceptar"
          @click="editarNombre(true)"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import auth from '../../auth'
import request from '../../request'
import Loading from '../../components/Loading'
import VisorArchivo from '../../components/Caso/VisorArchivo'
import EnviarMail from '../../components/Compartidos/EnviarMail'
import GenerarPDF from '../../components/Archivos/GenerarPDF'
import { QTabPanels, QTabPanel, QTab, QTabs, QSplitter, QSpinner } from 'quasar'
// import JSZip from 'jszip'
export default {
  name: 'ArchivosCaso',
  components: {
    QTabPanels,
    QTabPanel,
    QTab,
    QTabs,
    QSplitter,
    QSpinner,
    Loading,
    VisorArchivo,
    EnviarMail,
    GenerarPDF
  },
  data () {
    return {
      id: 0,
      check: false,
      enviando: false,
      loading: true,
      tab: 'caso',
      tabCarpeta: 'todo',
      tabs: ['caso', 'movimientos', 'cliente'],
      splitterModel: 15,
      CarpetaCaso: [],
      CarpetaMovimientos: [],
      CarpetaCliente: [],
      Multimedia: [],
      MultimediaSeleccionado: [],
      datosCaso: {},
      modalEliminar: false,
      eliminando: false,
      modalVisor: false,
      archivoVer: {},
      modalNombre: false,
      nombreEditar: '',
      IdMultimedia: 0,
      modalMail: false,
      modalPDF: false,
      ContenidoPDF: ''
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$router.push('GrillaCasos')
      return
    }
    this.id = this.$route.query.id

    request.Get(`/casos`, { id: this.id }, (r) => {
      if (!r.Error) {
        this.caso = r
        // Datos del caso:
        this.datosCaso = {
          Caratula: r.Caratula,
          Carpeta: r.Carpeta,
          IdCaso: r.IdCaso,
          Estado: r.Estado,
          FechaAlta: r.FechaAlta,
          FechaEstado: r.FechaEstado,
          FechaUltVisita: r.FechaUltVisita,
          NroExpediente: r.NroExpediente,
          Competencia: r.Competencia,
          IdCompetencia: r.IdCompetencia,
          TipoCaso: r.TipoCaso,
          IdTipoCaso: r.IdTipoCaso,
          Juzgado: r.Juzgado,
          IdJuzgado: r.IdJuzgado,
          Nominacion: r.Nominacion,
          IdNominacion: r.IdNominacion,
          EstadoAmbitoGestion: r.EstadoAmbitoGestion,
          IdEstadoAmbitoGestion: r.IdEstadoAmbitoGestion,
          Origen: r.Origen,
          IdOrigen: r.IdOrigen,
          IdMediacion: r.IdMediacion
        }
        /*
        // Movimientos del caso:
        this.movimientos = r.MovimientosCaso
        console.log(this.movimientos)
        if (this.Objetivos.length > 0) {
          console.log(this.Objetivos)
          this.Objetivos.forEach(e => {
            const i = this.movimientos.findIndex(f => f.IdMovimientoCaso === parseInt(e.IdMovimientoCaso))
            if (i !== -1) {
              this.movimientos[i].IdObjetivo = e.IdObjetivo
              this.movimientos[i].Objetivo = e.Objetivo
            }
          })
        }
        */

        // Personas del caso:
        this.personas = r.PersonasCaso ? r.PersonasCaso : []
      } else {
        console.log('Hubo un error al traer el caso.')
      }
    })
    /* Prueba con JSZip
    request.Get('/multimedia?file=m3BbFI5xgZSWvJ3VdvhyLVWQWH0QiHMD.png', {}, r => {
      console.log(r)
      let zip = new JSZip()
      zip.file('awer.png', r, {base64: true})
      zip.generateAsync({type: 'string'})
        .then(r => {
          location.href = 'data:application/zip;base64,' + r
        })
    })
    */
    request.Get('/multimedia-caso', {IdCaso: this.id}, r => {
      if (r.Error) {
        this.$q.notify(r.Error)
      } else {
        r.forEach(m => {
          m.check = false
          m.showing = false

          switch (m.OrigenMultimedia) {
            case 'M':
              this.CarpetaMovimientos.push(m)
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
        })

        this.loading = false
      }
    })
  },
  computed: {
    filtroCarpeta () {
      const tab = this.tab
      const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)

      switch (this.tabCarpeta) {
        case 'todo':
          return this[Carpeta]

        case 'imagenes':
          return this[Carpeta].filter(m => m.Tipo === 'I')

        case 'videos':
          return this[Carpeta].filter(m => m.Tipo === 'V')

        case 'otros':
          return this[Carpeta].filter(m => m.Tipo === 'A' || m.Tipo === 'O' || m.Tipo === 'D')

        default:
          break
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
    abrirVisor (m) {
      this.archivoVer = {
        URL: m.URL,
        Tipo: m.Tipo,
        Formato: this.format(m.URL)
      }

      this.modalVisor = true
    },
    folderIcon (nameTab) {
      return nameTab === this.tab ? 'folder_open' : 'folder'
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
    changeTab (tab) {
      const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)

      this.tabCarpeta = 'todo'

      this.MultimediaSeleccionado = []

      this[Carpeta].forEach(m => { m.check = false })
    },
    changeTabCarpeta (tabCarpeta) {
      const Carpeta = 'Carpeta' + this.tab[0].toUpperCase() + this.tab.slice(1)

      this.MultimediaSeleccionado = []

      this[Carpeta].forEach(m => { m.check = false })
    },
    eliminarArchivos () {
      /* Codigo para crear archivos zip que hay que ver en algun momento
      let zip = new JSZip()
      let c = 0

      this.MultimediaSeleccionado.forEach(m => {
        fetch(`https://io.docdoc.com.ar/api/multimedia?file=${m.URL}`)
          .then(r => {
            c++
            r.text()
              .then(r => {
                console.log(r)
                zip.file(m.URL, r, {base64: true})
                if (c === this.MultimediaSeleccionado.length) {
                  zip.generateAsync({type: 'base64'})
                    .then(r => {
                      location.href = 'data:application/zip;base64,' + r
                    })
                }
              })
          })
      })
      */
      const tab = this.tab
      const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)
      const Multimedia = this.MultimediaSeleccionado
      const IdCaso = this.id

      this.eliminando = true

      request.Post('/multimedia-caso/eliminar', {IdCaso: IdCaso, Multimedia: JSON.stringify(Multimedia)}, r => {
        if (!r.Error) {
          for (let i = this[Carpeta].length - 1; i >= 0; i--) {
            const IdMultimedia = this[Carpeta][i].IdMultimedia

            const index = Multimedia.findIndex(m => m.IdMultimedia === IdMultimedia)

            if (index >= 0) { this[Carpeta].splice(i, 1) }
          }

          this.$q.notify('Los archivos se han eliminado con exito.')
        } else {
          this[Carpeta].forEach(m => { m.check = false })

          this.$q.notify(r.Error)
        }
        this.eliminando = false
        this.modalEliminar = false

        this.MultimediaSeleccionado = []
      })
    },
    mailEnviado () {
      const tab = this.tab
      const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)
      this[Carpeta].forEach(m => { m.check = false })
      this.modalMail = false
      this.MultimediaSeleccionado = []
      this.ContenidoPDF = ''
    },
    enviarPDF (multimedia, contenido) {
      this.MultimediaSeleccionado = multimedia
      this.ContenidoPDF = contenido
      this.modalMail = true
      this.modalPDF = false
    },
    abrirNuevaPestaña () {
      let routeData = this.$router.resolve({ path: `/ArchivosCaso?id=${this.id}` })
      window.open(routeData.href, '_blank')
    },
    descargarArchivo (url, name) {
      location.href = `https://io.docdoc.com.ar/api/multimedia?file=${url}&download=true&name=${name}`
    },
    verErrorUpload (info) {
      console.log(info)
    },
    editarNombre (editar, nombre, id) {
      if (editar) {
        const tab = this.tab
        const Carpeta = 'Carpeta' + tab[0].toUpperCase() + tab.slice(1)
        request.Post('/multimedia-caso/editar-nombre', {IdCaso: this.id, IdMultimedia: this.IdMultimedia, Nombre: this.nombreEditar}, r => {
          if (!r.Error) {
            const i = this[Carpeta].findIndex(m => parseInt(m.IdMultimedia) === parseInt(this.IdMultimedia))
            this[Carpeta][i].Nombre = this.nombreEditar

            this.$q.notify('Se ha editado el archivo con exito.')
          } else {
            this.$q.notify(r.Error)
          }
          this.modalNombre = false
          this.nombreEditar = ''
          this.IdMultimedia = 0
        })
      } else {
        this.modalNombre = true
        this.nombreEditar = nombre
        this.IdMultimedia = id
      }
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
