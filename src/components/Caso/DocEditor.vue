<template>
  <q-page>

    <!-- Contenedor -->
    <q-splitter
      v-model="splitterModel"
      style="height: 100%"
    >
      <!-- Plantillas -->
      <template v-slot:before>
        <div v-if="!rellenar">
          <q-banner class="bg-teal text-white" align="center">
            PLANTILLAS
          </q-banner>

          <q-list>
            <q-item v-for="p in plantillas" :key="p.IdPlantilla">
              <q-item-section class="col-1" style="cursor: pointer" @click="prepararPlantilla(p)">
                <q-icon name="description" color="black" size="20px" />
              </q-item-section>

              <q-item-section class="col-8" style="cursor: pointer" @click="prepararPlantilla(p)">
                <q-item-label>{{ `${p.Nombre} (${p.Actores}-A ${p.Demandados}-D)` }}</q-item-label>
              </q-item-section>

              <q-item-section class="col-3">
                <div>
                  <q-btn size="12px" flat dense round icon="delete" @click="eliminarPlantilla(p.IdPlantilla)" />
                  <q-btn size="12px" flat dense round icon="edit" @click="editarPlantilla(p)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />

          * Para crear una plantilla seleccione la opcion "Plantilla" en la barra superior del documento, cuando termine haga click en "SUBIR" y se añadira una nueva plantilla a la lista.
          <br>
          * Puede seleccionar parametros del caso en el menu despregable que aparecera luego de activar la opcion "Plantilla".
          <br>
          * Las plantillas pueden verse desde cualquier caso en el estudio.
        </div>

        <!-- Seleccion de personas para rellenar plantilla -->
        <div v-else>
          <q-banner class="bg-teal text-white" align="center">
            Seleccionar personas
          </q-banner>

          <q-list>
            <q-item v-for="(label, i) in inputActores" :key="label.label" class="column">
              <q-item-label>{{label.label}}</q-item-label>
              <Select
                :multiple="false"
                :label="label.label"
                :hint="'Seleccione una persona'"
                :tooltip="false"
                :opciones="opcionesPersonas"
                @seleccion="actorSeleccionado($event, i+1)"
              />
            </q-item>

            <q-separator />

            <q-item v-for="(label, i) in inputDemandados" :key="label.label" class="column">
              <q-item-label>{{label.label}}</q-item-label>
              <Select
                :multiple="false"
                :label="label.label"
                :hint="'Seleccione una persona'"
                :tooltip="false"
                :opciones="opcionesPersonas"
                @seleccion="demandadoSeleccionado($event, i+1)"
              />
            </q-item>

            <q-separator />

            <div style="display: flex; justify-content: center; margin-top: 10px">
              <q-btn color="teal" label="Rellenar Plantilla" @click="rellenarPlantilla(IdPlantilla)" />
            </div>
          </q-list>
        </div>
      </template>

      <template v-slot:separator>
        <q-avatar color="teal" text-color="white" size="35px" icon="drag_indicator" style="top: 350px"/>
      </template>

      <!-- Editor -->
      <template v-slot:after>
        <q-editor
          v-model="doc"
          ref="docEditor"
          min-height="500px"
          @input="ajustarDivs()"
          :content-style="marginCm"
          :readonly="rellenar"
          :dense="$q.screen.lt.md"
          :toolbar="[
            ['editar'],
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              }
            ],
            ['bold', 'italic', 'underline'],
            ['token', 'hr', 'custom_btn'],
            ['print', 'margin', 'fullscreen'],
            [
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7'
                ]
              },
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              },
              'removeFormat'
            ],
            ['unordered', 'ordered'],
            ['undo', 'redo'],
            ['upload', 'save'],
            ['plantilla'],
            ['parametros']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
          :definitions="{
            save: {
              tip: 'Guardar en tu dispositivo',
              icon: 'save',
              label: 'Descargar',
              handler: descargarDoc
            },
            upload: {
              tip: checkPlantilla ? 'Subir plantilla' : 'Subir a DocDoc!',
              icon: 'cloud_upload',
              label: 'Subir',
              handler: checkPlantilla ? () => { modalPlantilla = true } : subirDoc
            },
            print: {
              handler: imprimirDoc
            },
            margin: {
              tip: 'Ajustar margenes',
              icon: 'margin',
              handler: () => { modalMargin = true }
            }
          }"
        >

        <!-- Slot Toolbar: Botones de edicion de plantilla -->
        <template v-if="editar" v-slot:editar>
          <div class="column">
            <q-btn
              color="primary"
              label="Guardar Edicion"
              @click="modalEditar = true"
              size="xs"
            />
            <q-btn
              color="negative"
              label="Cancelar Edicion"
              @click="cancelarEdicionPlantilla()"
              size="xs"
            />
          </div>
        </template>

        <!-- Slot Toolbar: Check Plantilla -->
        <template v-if="!editar" v-slot:plantilla>
          <q-checkbox
            v-model="checkPlantilla"
            color="black"
            size="xs"
            label="Plantilla"
          />
        </template>

        <!-- Slot Toolbar: Parametros de Plantilla -->
        <template v-if="checkPlantilla || editar" v-slot:parametros>
          <q-btn-dropdown
            unelevated
            color="white"
            text-color="black"
            label="Caso"
            size="xs"
          >
            <q-list dense>
              <q-item v-for="p in parametrosCaso" :key="p" clickable @click="añadirParametro(p, false, p === 'Firma')">
                <q-item-section>{{ p }}</q-item-section>
              </q-item>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Causa Penal"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosCausaPenal" :key="p" clickable @click="añadirParametro(p, false)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-list>
          </q-btn-dropdown>

          <q-separator />

          <q-btn
            round
            color="primary"
            @click="actores.push('actor')"
            size="5px"
            icon="add"
          >
            <q-tooltip>Agregar Actor</q-tooltip>
          </q-btn>
          <q-btn
            round
            v-if="actores.length > 1"
            color="negative"
            @click="actores.splice(0, 1)"
            size="5px"
            icon="remove"
          >
            <q-tooltip>Remover Actor</q-tooltip>
          </q-btn>
          <q-btn-dropdown
            unelevated
            v-for="(actor, i) in actores"
            :key="`actor${i}`"
            color="white"
            text-color="black"
            :label="actores.length === 1 ? 'Actor' : `Actor-${i+1}`"
            size="xs"
          >
            <q-list dense style="width: 250px">
              <q-item v-for="p in parametrosPersona" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                <q-item-section>{{ p }}</q-item-section>
              </q-item>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Rol"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosRol" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Vehículo"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosVehiculo" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Lesiones"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosLesiones" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Historia Clínica"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosHistoriaClinica" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Beneficio Litigar"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosBeneficioLitigar" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Cuantificación"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosCuantificacion" :key="p" clickable @click="añadirParametro(p, `Actor-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-list>
          </q-btn-dropdown>

          <q-separator />

          <q-btn
            round
            color="primary"
            @click="demandados.push('demandado')"
            size="5px"
            icon="add"
          >
            <q-tooltip>Agregar Demandado</q-tooltip>
          </q-btn>
          <q-btn
            round
            v-if="demandados.length > 1"
            color="negative"
            @click="demandados.splice(0, 1)"
            size="5px"
            icon="remove"
          >
            <q-tooltip>Remover Demandado</q-tooltip>
          </q-btn>
          <q-btn-dropdown
            unelevated
            v-for="(demandado, i) in demandados"
            :key="`demandado${i}`"
            color="white"
            text-color="black"
            :label="demandados.length === 1 ? 'Demandado' : `Demandado-${i+1}`"
            size="xs"
          >
            <q-list dense>
              <q-item v-for="p in parametrosPersona" :key="p" clickable @click="añadirParametro(p, `Demandado-${i+1}`)">
                <q-item-section>{{ p }}</q-item-section>
              </q-item>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Rol"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosRol" :key="p" clickable @click="añadirParametro(p, `Demandado-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Vehículo"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosVehiculo" :key="p" clickable @click="añadirParametro(p, `Demandado-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn-dropdown
                dense
                color="white"
                text-color="black"
                label="Seguro"
                style="width: 100%"
              >
                <q-list dense>
                  <q-item v-for="p in parametrosSeguro" :key="p" clickable @click="añadirParametro(p, `Demandado-${i+1}`)">
                    <q-item-section>{{ p }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-list>
          </q-btn-dropdown>
        </template>
        </q-editor>
      </template>
    </q-splitter>

    <!-- Modal: Subir plantilla -->
    <q-dialog
      v-model="modalPlantilla"
      prevent-close
    >
      <q-card style="padding:1rem;">
        <div>
          <span class="text-h6">Nombre de la plantilla</span>
          <span>
            <p>
              Por favor escriba el nombre de la plantilla.
            </p>
          </span>
          <q-input
            v-model="nombrePlantilla"
            label="Nombre"
            style="width: 100%; margin-bottom: 15px"
          />
          <div style="display: flex;justify-content: center;">
            <q-btn color="teal" label="Subir Plantilla" @click="subirPlantilla()" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal: Guardar edicion de plantilla -->
    <q-dialog
      v-model="modalEditar"
      prevent-close
    >
      <q-card style="padding:1rem;">
        <div>
          <span class="text-h6">Nombre de la plantilla</span>
          <span>
            <p>
              Si desea, puede cambiar el nombre de la plantilla.
            </p>
          </span>
          <q-input
            v-model="datosEditar.Nombre"
            label="Nombre"
            style="width: 100%; margin-bottom: 15px"
          />
          <div style="display: flex;justify-content: center;">
            <q-btn color="teal" label="Terminado" @click="editarPlantilla()" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal: Eliminar plantilla -->
    <q-dialog
      v-model="modalEliminar"
      prevent-close
    >
      <q-card style="padding:1rem;">
        <div style="text-align: center;">
          <span>
            <p>
              ¿Esta seguro que desea eliminar esta plantilla?
              <br>
              Esta accion es permanente.
            </p>
          </span>
          <div style="display: flex;justify-content: center; margin-botton:2rem;">
            <q-btn
              color="negative"
              label="Eliminar"
              @click="eliminarPlantilla()"
              style="padding-top:0px; float: center; margin-right: 10px"
            />
            <q-btn
              color="primary"
              label="Cancelar"
              @click="modalEliminar = false"
              style="padding-top:0px; float: center"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal: Modificar margenes del documento -->
    <q-dialog
      v-model="modalMargin"
      prevent-close
    >
      <q-card style="padding:1rem;">
        <div class="row items-center" style="margin-left: 10px; margin-right: 10px">
          <span class="col-5" style="text-align: start">Superior</span>
          <q-input outlined dense class="col-5" type="number" v-model="margin.marginTop" />
          <span class="col-2" style="text-align: end"><b>cm</b></span>
          <q-separator style="margin-top: 5px; margin-bottom: 5px" />
          <span class="col-5" style="text-align: start">Derecho</span>
          <q-input outlined dense class="col-5" type="number" v-model="margin.marginRight" />
          <span class="col-2" style="text-align: end"><b>cm</b></span>
          <q-separator style="margin-top: 5px; margin-bottom: 5px" />
          <span class="col-5" style="text-align: start">Inferior</span>
          <q-input outlined dense class="col-5" type="number" v-model="margin.marginBottom" />
          <span class="col-2" style="text-align: end"><b>cm</b></span>
          <q-separator style="margin-top: 5px; margin-bottom: 5px" />
          <span class="col-5" style="text-align: start">Izquierdo</span>
          <q-input outlined dense class="col-5" type="number" v-model="margin.marginLeft" />
          <span class="col-2" style="text-align: end"><b>cm</b></span>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import auth from '../../auth'
import request from '../../request'
import numeroALetras from '../../assets/numeroALetras'
import Select from '../../components/Compartidos/Select'
import { QSplitter } from 'quasar'
import moment from 'moment'
export default {
  name: 'DocCaso',
  components: {
    QSplitter,
    Select
  },
  data () {
    return {
      IdCaso: 0,
      IdEstudio: 0,
      IdPlantilla: 0,
      doc: '',
      margin: {
        marginLeft: 3,
        marginTop: 2,
        marginRight: 1.5,
        marginBottom: 2
      },
      modalMargin: false,
      splitterModel: 18,
      checkPlantilla: false,
      inputActores: [],
      inputDemandados: [],
      datosCaso: {},
      datosActores: {},
      datosDemandados: {},
      opcionesPersonas: [],
      personasCaso: [],
      parametrosCaso: [
        'Caratula',
        'FechaAlta',
        'NroExpediente',
        'Competencia',
        'TipoCaso',
        'AmbitoGestion',
        'Nominacion',
        'EstadoAmbitoGestion',
        'FechaActual',
        'FechaHecho',
        'RelatoHecho',
        'TotalDemanda',
        'TotalDemandaLetra',
        'Firma'
      ],
      parametrosCausaPenal: [
        'NroExpedienteCausaPenal',
        'Radicacion',
        'Comisaria'
      ],
      parametrosPersona: [
        'Apellidos',
        'Nombres',
        'Documento',
        'Cuit',
        'Domicilio',
        'Telefono',
        'Email',
        'FechaNacimiento',
        'EstadoCivil',
        'EdadAlHecho'
      ],
      parametrosRol: [
        'LegitimacionActiva',
        'LegitimacionPasiva'
      ],
      parametrosVehiculo: [
        'Tipo',
        'Marca',
        'Dominio',
        'ValorReparacion'
      ],
      parametrosLesiones: [
        'Incapacidad',
        'TipoLesion',
        'DescripcionLesion'
      ],
      parametrosCuantificacion: [
        'Resolucion',
        'MontoResolucion',
        'GastosCuracion',
        'DañoMoral',
        'FormulaVM'
      ],
      parametrosSeguro: [
        'CiaSeguro',
        'Poliza',
        'NroSeguro'
      ],
      parametrosBeneficioLitigar: [
        'Personas',
        'Ingresos',
        'Inmuebles',
        'Automotor',
        'Oficio'
      ],
      parametrosHistoriaClinica: [
        'NumeroHC',
        'CentroMedico'
      ],
      plantillas: [],
      actores: ['actor'],
      demandados: ['demandado'],
      nombrePlantilla: '',
      modalPlantilla: false,
      modalEliminar: false,
      modalEditar: false,
      editar: false,
      rellenar: false,
      datosEditar: {},
      dragStartX: 0,
      dragStartY: 0
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$router.push('GrillaCasos')
      return
    }
    this.IdCaso = this.$route.query.id
    this.IdEstudio = auth.UsuarioLogueado.IdEstudio

    request.Get(`/casos`, { id: this.IdCaso }, (r) => {
      if (!r.Error) {
        this.personasCaso = r.PersonasCaso

        this.personasCaso.forEach(p => {
          this.opcionesPersonas.push({
            label: `${p.Apellidos}, ${p.Nombres}`,
            value: p
          })
        })

        this.opcionesPersonas.push({
          label: 'Sin datos',
          value: {}
        })

        let totalDemanda = 0

        this.personasCaso.forEach(p => {
          if (p.Parametros !== null && p.Parametros.check && p.Observaciones === 'Actor') {
            const gc = p.Parametros.Cuantificacion.GastosCuracion
            const dm = p.Parametros.Cuantificacion.DañoMoral
            const vm = p.Parametros.Cuantificacion.FormulaVM
            const vr = p.Parametros.Vehiculo.ValorReparacion
            totalDemanda = totalDemanda + (parseInt(gc) || 0) + (parseInt(dm) || 0) + (parseInt(vm) || 0) + (parseInt(vr) || 0)
          }
        })

        const totalDemandaLetra = numeroALetras(totalDemanda, {
          plural: 'PESOS',
          singular: 'PESO',
          centPlural: 'CENTAVOS',
          centSingular: 'CENTAVO'
        })

        this.datosCaso = {
          Caratula: r.Caratula,
          FechaAlta: r.FechaAlta,
          NroExpediente: r.NroExpediente,
          Competencia: r.Competencia,
          TipoCaso: r.TipoCaso,
          AmbitoGestion: r.Juzgado,
          Nominacion: r.Nominacion,
          EstadoAmbitoGestion: r.EstadoAmbitoGestion,
          FechaActual: moment().format('DD/MM/YYYY'),
          TotalDemanda: totalDemanda,
          TotalDemandaLetra: totalDemandaLetra,
          ...r.Parametros,
          NroExpedienteCausaPenal: r.CausaPenal.NroExpedienteCausaPenal,
          Radicacion: r.CausaPenal.RadicacionCausaPenal,
          Comisaria: r.CausaPenal.Comisaria
        }
      } else {
        console.log('Hubo un error al traer el caso.')
      }
    })

    request.Get('/plantillas', {IdEstudio: this.IdEstudio}, r => {
      this.plantillas = r
    })
  },
  mounted () {
    let qEditor = document.getElementsByClassName('q-editor--default')[0]
    let toolbar = document.getElementsByClassName('q-editor__toolbars-container')[0]
    let qEditorContent = document.getElementsByClassName('q-editor__content')[0]

    window.addEventListener('click', e => {
      if (qEditor.contains(e.target) && !toolbar.contains(e.target)) {
        this.$refs.docEditor.focus()
      }
    })

    qEditorContent.style.position = 'relative'
  },
  computed: {
    marginCm () {
      const m = this.margin

      return {
        marginTop: m.marginTop + 'cm',
        marginRight: m.marginRight + 'cm',
        marginBottom: m.marginBottom + 'cm',
        marginLeft: m.marginLeft + 'cm'
      }
    }
  },
  methods: {
    imprimirDoc () {
      const m = this.margin

      let ventana = window.open('', 'PRINT', 'height=400,width=600')
      ventana.document.write('<html><head><title></title>')
      ventana.document.write(`<style type="text/css">
                              @page {
                                margin-top: ${m.marginTop}cm;
                                margin-right: ${m.marginRight}cm;
                                margin-bottom: ${m.marginBottom}cm;
                                margin-left: ${m.marginLeft}cm;
                              }
                            </style>`)
      ventana.document.write('</head><body >')
      ventana.document.write(this.doc)
      ventana.document.write('</body></html>')
      ventana.document.close()

      ventana.focus()

      setTimeout(() => {
        ventana.print()
        ventana.close()
      }, 500)
    },
    descargarDoc () {
      const url = this.urlDoc()

      const nombre = 'document.doc'

      let downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      downloadLink.href = url

      downloadLink.download = nombre

      downloadLink.click()

      document.body.removeChild(downloadLink)
    },
    subirDoc () {
      const url = this.urlDoc()

      request.Post('/multimedia-caso/documento', {IdCaso: this.IdCaso, Doc: url}, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.$q.notify('El documento se ha subido con exito')
        }
      })
    },
    urlDoc () {
      const m = this.margin
      const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
                      "<head><meta charset='utf-8'><title>Export HTML To Doc</title>" +
                      `<style type="text/css">
                        @page {
                          margin-top: ${m.marginTop}cm;
                          margin-right: ${m.marginRight}cm;
                          margin-bottom: ${m.marginBottom}cm;
                          margin-left: ${m.marginLeft}cm;
                        }
                      </style>` +
                      '</head><body>'
      const postHtml = '</body></html>'
      const html = preHtml + this.doc + postHtml

      const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

      return url
    },
    añadirParametro (parametro, i, firma) {
      const p = firma
        ? '<img id="firma" style="cursor: pointer; position: absolute" width="200px" height="auto" src="https://io.docdoc.com.ar/api/multimedia?file=MDgfUeCdZw2sGFf2PrZhPDawNrT6STjr.jpeg&download=true" />'
        : '${' + parametro + (i ? `-${i}}` : '}')
      this.$refs.docEditor.runCmd('insertHTML', p, true)

      if (firma) {
        let f = document.getElementById('firma')
        f.ondragstart = e => {
          this.dragStartX = e.screenX
          this.dragStartY = e.screenY
        }
        f.ondragend = e => {
          this.acomodarFirma(e.screenX, e.screenY)
        }
      }
    },
    subirPlantilla () {
      const a = this.actores.length
      const d = this.demandados.length

      let plantilla = {
        IdEstudio: this.IdEstudio,
        Nombre: this.nombrePlantilla,
        Plantilla: this.doc,
        Actores: a,
        Demandados: d
      }

      this.modalPlantilla = false

      request.Post('/plantillas/alta', plantilla, r => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.plantillas.push({
            IdPlantilla: r.IdPlantilla,
            Nombre: plantilla.Nombre,
            Plantilla: plantilla.Plantilla,
            Actores: a,
            Demandados: d
          })

          plantilla.IdPlantilla = r.IdPlantilla

          this.prepararPlantilla(plantilla)

          this.$q.notify('La plantilla se ha guardado con exito.')
        }
      })

      this.nombrePlantilla = ''
    },
    prepararPlantilla (plantilla) {
      const a = plantilla.Actores
      const d = plantilla.Demandados

      this.IdPlantilla = plantilla.IdPlantilla
      this.doc = plantilla.Plantilla

      this.rellenar = true

      this.inputActores = []
      this.inputDemandados = []

      for (let i = 1; i <= a; i++) {
        this.inputActores.push({
          label: `Actor-${i}`
        })
      }
      for (let i = 1; i <= d; i++) {
        this.inputDemandados.push({
          label: `Demandado-${i}`
        })
      }
    },
    actorSeleccionado (seleccion, i) {
      const persona = seleccion.value
      const p = persona.Parametros

      this.datosActores[i] = {
        Apellidos: persona.Apellidos,
        Nombres: persona.Nombres,
        Documento: persona.Documento,
        Cuit: persona.Cuit,
        Domicilio: persona.Domicilio,
        Telefono: persona.Telefonos
          ? persona.Telefonos.filter(t => t.EsPrincipal === 'S' || persona.Telefonos.length === 1)[0].Telefono
          : '',
        Email: persona.Email,
        NumeroHC: persona.NumeroHC,
        CentroMedico: persona.CentroMedicoHC
      }

      if (p.check) {
        this.datosActores[i] = {
          ...this.datosActores[i],
          ...p.DatosFiliatorios,
          LegitimacionActiva: p.Rol.LegitimacionActiva,
          ...p.Vehiculo,
          TipoLesion: p.Lesiones.Tipos[0].Tipo,
          DescripcionLesion: p.Lesiones.Tipos[0].Descripcion,
          Incapacidad: p.Lesiones.Incapacidad,
          ...p.Cuantificacion,
          MontoResolucion: p.Cuantificacion.Monto,
          ...p.BeneficioLitigar,
          EdadAlHecho: this.edadPersona(p)
        }
      }
    },
    demandadoSeleccionado (seleccion, i) {
      const persona = seleccion.value
      const p = persona.Parametros

      this.datosDemandados[i] = {
        Apellidos: persona.Apellidos,
        Nombres: persona.Nombres,
        Documento: persona.Documento,
        Cuit: persona.Cuit,
        Domicilio: persona.Domicilio,
        Telefono: persona.Telefonos
          ? persona.Telefonos.filter(t => t.EsPrincipal === 'S' || persona.Telefonos.length === 1)[0].Telefono
          : '',
        Email: persona.Email
      }

      if (p.check) {
        this.datosDemandados[i] = {
          ...this.datosDemandados[i],
          ...p.DatosFiliatorios,
          LegitimacionPasiva: p.Rol.LegitimacionPasiva.join(', '),
          ...p.Vehiculo,
          ...p.Seguro,
          EdadAlHecho: this.edadPersona(p)
        }
      }
    },
    edadPersona (p) {
      if (!p.DatosFiliatorios.FechaNacimiento || !this.datosCaso.FechaHecho) {
        return '-'
      }

      const fechaNac = p.DatosFiliatorios.FechaNacimiento.split('-').reverse().join('-')
      const fechaHecho = this.datosCaso.FechaHecho.split('-').reverse().join('-')

      return moment(fechaHecho).diff(moment(fechaNac), 'years')
    },
    rellenarPlantilla (id) {
      if (!this.datosActores || !this.datosDemandados) {
        this.$q.notify('Debe seleccionar Actores y Demandados.')
        return
      }

      const i = this.plantillas.findIndex(p => p.IdPlantilla === id)
      const plantilla = this.plantillas[i]

      let doc = plantilla.Plantilla
      const a = plantilla.Actores
      const d = plantilla.Demandados

      this.parametrosCaso.forEach(p => {
        const parametro = '\\${' + p + '}'
        const reg = new RegExp(parametro, 'g')

        doc = doc.replace(reg, this.datosCaso[p])
      })

      this.parametrosCausaPenal.forEach(p => {
        const parametro = '\\${' + p + '}'
        const reg = new RegExp(parametro, 'g')

        doc = doc.replace(reg, this.datosCaso[p])
      })

      this.parametrosPersona.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
        for (let i = 1; i <= d; i++) {
          const parametro = '\\${' + p + '-Demandado-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosDemandados[i][p])
        }
      })

      this.parametrosRol.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
        for (let i = 1; i <= d; i++) {
          const parametro = '\\${' + p + '-Demandado-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosDemandados[i][p])
        }
      })

      this.parametrosVehiculo.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
        for (let i = 1; i <= d; i++) {
          const parametro = '\\${' + p + '-Demandado-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosDemandados[i][p])
        }
      })

      this.parametrosLesiones.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
      })

      this.parametrosCuantificacion.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
      })

      this.parametrosSeguro.forEach(p => {
        for (let i = 1; i <= d; i++) {
          const parametro = '\\${' + p + '-Demandado-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosDemandados[i][p])
        }
      })

      this.parametrosBeneficioLitigar.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
      })

      this.parametrosHistoriaClinica.forEach(p => {
        for (let i = 1; i <= a; i++) {
          const parametro = '\\${' + p + '-Actor-' + i + '}'
          const reg = new RegExp(parametro, 'g')

          doc = doc.replace(reg, this.datosActores[i][p])
        }
      })

      this.doc = doc
      this.rellenar = false
      this.datosActores = {}
      this.datosDemandados = {}
    },
    eliminarPlantilla (id) {
      if (!this.modalEliminar) {
        this.modalEliminar = true
        this.IdPlantilla = id
      } else {
        request.Post('/plantillas/eliminar', {id: this.IdPlantilla}, r => {
          if (r.Error) {
            this.$q.notify(r.Error)
          } else {
            const i = this.plantillas.findIndex(p => p.IdPlantilla === this.IdPlantilla)
            this.plantillas.splice(i, 1)

            this.IdPlantilla = 0
            this.modalEliminar = false

            this.$q.notify('La plantilla se ha eliminado con exito.')
          }
        })
      }
    },
    editarPlantilla (plantilla) {
      if (plantilla) {
        this.editar = true
        this.datosEditar = {
          IdEstudio: this.IdEstudio,
          IdPlantilla: plantilla.IdPlantilla,
          Nombre: plantilla.Nombre,
          Actores: plantilla.Actores,
          Demandados: plantilla.Demandados
        }
        this.doc = plantilla.Plantilla
        this.IdPlantilla = plantilla.IdPlantilla
        this.actores = new Array(plantilla.Actores)
        this.demandados = new Array(plantilla.Demandados)
      } else {
        this.datosEditar.Plantilla = this.doc
        this.datosEditar.Actores = this.actores.length
        this.datosEditar.Demandados = this.demandados.length

        request.Post('/plantillas/editar', this.datosEditar, r => {
          if (r.Error) {
            this.$q.notify(r.Error)
          } else {
            const i = this.plantillas.findIndex(p => p.IdPlantilla === this.IdPlantilla)
            this.plantillas[i] = this.datosEditar

            this.datosEditar = {}
            this.editar = false
            this.modalEditar = false
            this.IdPlantilla = 0

            this.prepararPlantilla(this.plantillas[i])

            this.$q.notify('La plantilla se ha modificado con exito.')
          }
        })
      }
    },
    cancelarEdicionPlantilla () {
      this.datosEditar = {}
      this.doc = ' '
      this.editar = false
    },
    acomodarFirma (x, y) {
      let f = document.getElementById('firma')

      f.ondragstart = e => {
        this.dragStartX = e.screenX
        this.dragStartY = e.screenY
      }
      f.ondragend = e => {
        this.acomodarFirma(e.screenX, e.screenY)
      }

      f.style.top = f.offsetTop + y - this.dragStartY + 'px'
      f.style.left = f.offsetLeft + x - this.dragStartX + 'px'
    },
    ajustarDivs () {
      if (this.doc.includes('<div>')) {
        const reg = new RegExp('<div>', 'g').source

        this.doc = this.doc.replace(reg, '<div style="position: relative">')
      }
    }
  }
}
</script>
