<template>
    <div class="seccion-item">
      <q-item>
        <q-item-section class="persona-item-titulo">{{ Persona.Apellidos }}, {{ Persona.Nombres }}</q-item-section>

        <q-item-section side>
          <q-icon
            v-if="!editar"
            class="cursor-pointer"
            color="blue-grey"
            name="fas fa-edit"
            size="sm"
            @click="habilitarEdicion()"
          >
            <q-tooltip>Editar Datos</q-tooltip>
          </q-icon>
          <q-icon
            v-else
            class="cursor-pointer"
            color="positive"
            name="done"
            size="lg"
            @click="guardarEdicion()"
          >
            <q-tooltip>Guardar Edicion</q-tooltip>
          </q-icon>
        </q-item-section>
      </q-item>

      <q-separator />

      <div
        v-if="editar"
        class="full-width text-center text-teal text-bold q-mb-xs"
      >
        Solo podrá editar los datos que se encuentren vacios
      </div>

      <!-- Datos Filiatorios -->
      <div class="seccion-item">
        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="person" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">Datos Filiatorios</q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Domicilio: </span>{{ Persona.Domicilio || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Documento: </span>{{ Persona.Documento || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Fecha de Nacimiento: </span>{{ Parametros.DatosFiliatorios.FechaNacimiento || 'Sin datos'}}
          </li>
          <li>
            <span class="item-titulo text-indigo">Estado Civil: </span>{{ Parametros.DatosFiliatorios.EstadoCivil || 'Sin datos'}}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else>
          <q-input
            v-if="permitidoPersona('Domicilio')"
            class="input"
            v-model="Persona.Domicilio"
            label="Domicilio"
          />
          <q-input
            v-if="permitidoPersona('Documento')"
            class="input"
            type="number"
            v-model="Persona.Documento"
            label="Documento"
          />
          <q-input
            v-if="permitido('DatosFiliatorios', 'FechaNacimiento')"
            v-model="Parametros.DatosFiliatorios.FechaNacimiento"
            ref="inputFechaNacimiento"
            label="Fecha de Nacimiento"
            mask="##-##-####"
            :rules="[v => /^-?[0-3]\d-[0-1]\d-[\d]+$/.test(v) || 'Fecha invalida']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy1"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="Parametros.DatosFiliatorios.FechaNacimiento"
                      mask="DD-MM-YYYY"
                      label="Fecha de Nacimiento"
                      @input="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            v-if="permitido('DatosFiliatorios', 'EstadoCivil')"
            v-model="Parametros.DatosFiliatorios.EstadoCivil"
            :options="opcionesEstadoCivil"
            label="Estado Civil"
          />
        </div>
      </div>

      <!-- Rol en el caso -->
      <!--div
        class="seccion-item"
        v-if="editar || Parametros.Rol.check"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="account_box" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Rol en el Caso
            <q-toggle
              v-if="editar"
              v-model="Parametros.Rol.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li v-if="Persona.Observaciones === 'Actor'">
            <span class="item-titulo text-indigo">Legitimación Activa: </span>{{ Parametros.Rol.LegitimacionActiva || 'Sin datos' }}
          </li>
          <li
            v-else
          >
            <span class="item-titulo text-indigo">Legitimación Pasiva: </span>
            <ul>
              <li
                v-for="l in Parametros.Rol.LegitimacionPasiva"
                :key="l"
              >
                {{ l }}
              </li>
            </ul>
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.Rol.check">
          <q-select
            v-if="Persona.Observaciones === 'Actor'"
            v-model="Parametros.Rol.LegitimacionActiva"
            :options="opcionesLegitimacionActiva"
            label="Legitimación Activa"
          />
          <div v-else>
            <q-checkbox v-model="Parametros.Rol.LegitimacionPasiva" val="Conductor" label="Conductor" />
            <q-checkbox v-model="Parametros.Rol.LegitimacionPasiva" val="Titular dominial" label="Titular dominial" />
            <q-checkbox v-model="Parametros.Rol.LegitimacionPasiva" val="Asegurado" label="Asegurado" />
          </div>
        </div>
      </div-->

      <!-- Vehiculo -->
      <div
        class="seccion-item"
        v-if="editar || Parametros.Vehiculo.check"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="directions_car" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Vehículo
            <q-toggle
              v-if="editar"
              v-model="Parametros.Vehiculo.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Tipo: </span>{{ Parametros.Vehiculo.Tipo || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Marca: </span>{{ Parametros.Vehiculo.Marca || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Dominio: </span>{{ Parametros.Vehiculo.Dominio || 'Sin datos' }}
          </li>
          <li v-if="Persona.Observaciones === 'Actor'">
            <span class="item-titulo text-indigo">Valor de Reparacion: </span>{{ Parametros.Vehiculo.ValorReparacion || 'Sin datos' }}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.Vehiculo.check">
          <q-select
            v-if="permitido('Vehiculo', 'Tipo')"
            v-model="Parametros.Vehiculo.Tipo"
            :options="opcionesTipoVehiculo"
            label="Tipo de Vehiculo"
          />
          <q-input
            v-if="permitido('Vehiculo', 'Marca')"
            v-model="Parametros.Vehiculo.Marca"
            label="Marca"
            type="text"
          />
          <q-input
            v-if="permitido('Vehiculo', 'Dominio')"
            v-model="Parametros.Vehiculo.Dominio"
            label="Dominio"
            type="text"
          />
          <q-input
            v-if="permitido('Vehiculo', 'ValorReparacion')"
            v-model="Parametros.Vehiculo.ValorReparacion"
            label="Valor de Reparacion"
            type="number"
          />
        </div>
      </div>

      <!-- Lesiones -->
      <!--div
        v-if="Persona.Observaciones === 'Actor' && (editar || Parametros.Lesiones.check)"
        class="seccion-item"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="healing" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Lesiones
            <q-toggle
              v-if="editar"
              v-model="Parametros.Lesiones.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Incapacidad Estimada: </span>{{ Parametros.Lesiones.Incapacidad ? Parametros.Lesiones.Incapacidad + '%' : 'Sin datos' }}
          </li>
          <li
            v-for="(Lesion, i) in Parametros.Lesiones.Tipos"
            :key="i"
          >
            <span class="item-titulo text-indigo">Tipo de Lesión: </span>{{ Lesion.Tipo || 'Sin datos' }}
            <p v-if="Lesion.Descripcion">{{ Lesion.Descripcion }}</p>
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.Lesiones.check">
          <q-input
            v-model="Parametros.Lesiones.Incapacidad"
            label="Incapacidad Estimada"
            type="number"
          />
          <div
            class="row"
            v-for="(Lesion, i) in Parametros.Lesiones.Tipos"
            :key="i"
          >
            <q-select
              v-model="Lesion.Tipo"
              :options="opcionesLesiones"
              label="Tipo de Lesión"
              class="col-6"
            />
            <q-btn
              color="positive"
              round
              size="sm"
              class="self-center"
              @click="editarOpciones(false, 'opcionesLesiones')"
            >
              +
              <q-tooltip>
                Agregar Otra Opcion a la Lista
              </q-tooltip>
            </q-btn>
            <q-input
              v-model="Lesion.Descripcion"
              label="Descripcion de la Lesión"
              type="textarea"
              rows="3"
              class="col-12"
            />
          </div>
        </div>
      </div-->

      <!-- Historia Clinica -->
      <!--div
        v-if="Persona.Observaciones === 'Actor' && (editar || checkHC)"
        class="seccion-item"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="local_hospital" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Historia Clínica
            <q-toggle
              v-if="editar"
              v-model="checkHC"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Estado: </span>{{ HistoriaClinica.Estado || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Número: </span>{{ HistoriaClinica.Numero || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Centro Médico: </span>{{ HistoriaClinica.CentroMedico || 'Sin datos' }}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="checkHC">
          <q-select
            v-model="HistoriaClinica.Estado"
            :options="opcionesEstadoHC"
            label="Estado"
          />
          <q-input
            v-model="HistoriaClinica.Numero"
            label="Número"
            type="number"
          />
          <div class="row justify-start">
            <q-select
              v-model="HistoriaClinica.CentroMedico"
              class="col-11"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Buscar Centros Medicos"
              :options="opcionesCentroMedico"
              @filter="filterFnCM"
              hint="Escriba 1 letra para comenzar la busqueda. Se mostraran los primeros 10 resultados."
            >
              <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                        No se encontraron elementos que coincidan con la busqueda
                    </q-item-section>
                  </q-item>
              </template>
            </q-select>
            <q-btn
              color="positive"
              round
              size="sm"
              class="self-center"
              @click="modalOpcionNueva = true; tipoOpcion = 'CM'"
            >
              +
              <q-tooltip>
                Agregar Otra Opcion a la Lista
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </div-->

      <!-- Beneficio Litigar -->
      <div
        v-if="Persona.Observaciones === 'Actor' && (editar || Parametros.BeneficioLitigar.check)"
        class="seccion-item"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="gavel" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Beneficio Litigar
            <q-toggle
              v-if="editar"
              v-model="Parametros.BeneficioLitigar.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Personas a Cargo: </span>{{ Parametros.BeneficioLitigar.Personas || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Ingresos Personales: </span>{{ Parametros.BeneficioLitigar.Ingresos || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Inmuebles: </span>{{ Parametros.BeneficioLitigar.Inmuebles || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Automotor: </span>{{ Parametros.BeneficioLitigar.Automotor || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Oficio: </span>{{ Parametros.BeneficioLitigar.Oficio || 'Sin datos' }}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.BeneficioLitigar.check">
          <q-input
            v-if="permitido('BeneficioLitigar', 'Personas')"
            v-model="Parametros.BeneficioLitigar.Personas"
            label="Personas a Cargo"
            type="text"
          />
          <q-input
            v-if="permitido('BeneficioLitigar', 'Ingresos')"
            v-model="Parametros.BeneficioLitigar.Ingresos"
            label="Ingresos Personales"
            type="text"
          />
          <q-input
            v-if="permitido('BeneficioLitigar', 'Inmuebles')"
            v-model="Parametros.BeneficioLitigar.Inmuebles"
            label="Inmuebles"
            type="text"
          />
          <q-input
            v-if="permitido('BeneficioLitigar', 'Automotor')"
            v-model="Parametros.BeneficioLitigar.Automotor"
            label="Automotor"
            type="text"
          />
          <q-input
            v-if="permitido('BeneficioLitigar', 'Oficio')"
            v-model="Parametros.BeneficioLitigar.Oficio"
            label="Oficio"
            type="text"
          />
        </div>
      </div>

      <!-- Cuantificacion -->
      <!--div
        v-if="Persona.Observaciones === 'Actor' && (editar || Parametros.Cuantificacion.check)"
        class="seccion-item"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="attach_money" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Cuantificación
            <q-toggle
              v-if="editar"
              v-model="Parametros.Cuantificacion.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">SMVM-Resolución: </span>{{ Parametros.Cuantificacion.Resolucion || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">SMVM-Monto: </span>{{ Parametros.Cuantificacion.Monto ? '$' + Parametros.Cuantificacion.Monto : 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Resultado Formula Vuotto Méndez: </span>{{ Parametros.Cuantificacion.FormulaVM ? '$' + Parametros.Cuantificacion.FormulaVM + (edadPersona() > 55 ? ' (Formula Méndez, edad +55 a la fecha del hecho)' : ' (Formula Voutto, edad -55 a la fecha del hecho)') : 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Gastos Curacion: </span>{{ Parametros.Cuantificacion.GastosCuracion ? '$' + Parametros.Cuantificacion.GastosCuracion : 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Daño Moral: </span>{{ Parametros.Cuantificacion.DañoMoral ? '$' + Parametros.Cuantificacion.DañoMoral : 'Sin datos' }}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.Cuantificacion.check">
          <q-select
            v-model="Resolucion"
            :options="opcionesResoluciones"
            label="SMVM-Resolucion"
          />
          <q-input
            v-model="Parametros.Cuantificacion.GastosCuracion"
            label="Gastos Curacion"
            type="number"
          />
          <q-input
            v-model="Parametros.Cuantificacion.DañoMoral"
            label="Daño Moral"
            type="number"
          />
        </div>
      </div-->

      <!-- Seguro -->
      <!--div
        v-if="Persona.Observaciones === 'Demandado' && (editar || Parametros.Seguro.check)"
        class="seccion-item"
      >
        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey" name="shield" size="50px" />
          </q-item-section>

          <q-item-section class="persona-item-subtitulo">
            Seguro
            <q-toggle
              v-if="editar"
              v-model="Parametros.Seguro.check"
            />
          </q-item-section>

          <q-item-section v-if="!editar && false" side top>
            <q-badge color="grey" label="Ver Archivos Adjuntos" @click="modalArchivos = true" />
          </q-item-section>
        </q-item>

        <ul v-if="!editar">
          <li>
            <span class="item-titulo text-indigo">Cia. de Seguro: </span>{{ Parametros.Seguro.CiaSeguro || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">Poliza: </span>{{ Parametros.Seguro.Poliza || 'Sin datos' }}
          </li>
          <li>
            <span class="item-titulo text-indigo">N° de Siniestro: </span>{{ Parametros.Seguro.NroSeguro || 'Sin datos' }}
          </li>
        </ul>

        <div class="seccion-item-editar" v-else-if="Parametros.Seguro.check">
          <div class="row justify-start">
            <q-select
              v-model="CiaSeguro"
              class="col-11"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Buscar Cias. de Seguro"
              :options="opcionesCiaSeguro"
              @filter="filterFnCS"
              @input-value="selectCia"
              hint="Escriba 1 letra para comenzar la busqueda. Se mostraran los primeros 10 resultados."
            >
              <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                        No se encontraron elementos que coincidan con la busqueda
                    </q-item-section>
                  </q-item>
              </template>
            </q-select>
            <q-btn
              color="positive"
              round
              size="sm"
              class="self-center"
              @click="modalOpcionNueva = true; tipoOpcion = 'CS'"
            >
              +
              <q-tooltip>
                Agregar Otra Opcion a la Lista
              </q-tooltip>
            </q-btn>
          </div>
          <q-input
            v-model="Parametros.Seguro.Poliza"
            label="Poliza"
            type="text"
          />
          <q-input
            v-model="Parametros.Seguro.NroSeguro"
            label="N° de Seguro"
            type="number"
          />
        </div>
      </div-->
    </div>
</template>

<script>
import request from '../../request'
import moment from 'moment'
import { Notify } from 'quasar'

export default {
  name: 'DatosPersona',
  props: [
    'IdCaso',
    'Persona',
    'FechaHecho',
    'Opciones'
  ],
  data () {
    return {
      permitidos: {},
      editar: false,
      modalArchivos: false,
      varOpciones: '',
      opcionNueva: '',
      opcionNuevaTelefono: '',
      opcionNuevaDireccion: '',
      modalOpcionNueva: false,
      tipoOpcion: '',
      opcionesEstadoCivil: [],
      opcionesLegitimacionActiva: [],
      opcionesTipoVehiculo: [],
      opcionesLesiones: [],
      opcionesResoluciones: [
        {
          label: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/03/2021 $21.600',
          Resolucion: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/03/2021',
          Monto: '21.600'
        },
        {
          label: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/12/2020 $20.500',
          Resolucion: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/12/2020',
          Monto: '20.500'
        },
        {
          label: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/10/2020 $18.900',
          Resolucion: 'RESOL-2020-4-APN-CNEPYSMVYM#MT 01/10/2020',
          Monto: '18.900'
        },
        {
          label: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 01/10/2019 $16.875',
          Resolucion: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 01/10/2019',
          Monto: '16.875'
        },
        {
          label: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 01/09/2019 $15.625',
          Resolucion: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 01/09/2019',
          Monto: '15.625'
        },
        {
          label: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 1/08/2019 $14.125',
          Resolucion: 'RESOL-2019-6-APN-CNEPYSMVYM#MT 1/08/2019',
          Monto: '14.125'
        },
        {
          label: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/06/2019 $12.500',
          Resolucion: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/06/2019',
          Monto: '12.500'
        },
        {
          label: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/03/2019 $11.900',
          Resolucion: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/03/2019',
          Monto: '11.900'
        },
        {
          label: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/12/2018 $11.300',
          Resolucion: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/12/2018',
          Monto: '11.300'
        },
        {
          label: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/09/2018 $10.700',
          Resolucion: 'RESOL-2018-3-APN-CNEPYSMVYM#MT 01/09/2018',
          Monto: '10.700'
        },
        {
          label: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/07/2018 $10.000',
          Resolucion: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/07/2018',
          Monto: '10.000'
        },
        {
          label: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/01/2018 $9.500',
          Resolucion: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/01/2018',
          Monto: '9.500'
        },
        {
          label: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/07/2017 $8.860',
          Resolucion: 'RESOL-2017-3E-APN-CNEPYSMVYM#MT 01/07/2017',
          Monto: '8.860'
        }
      ],
      opcionesCiaSeguro: [],
      opcionesEstadoHC: [],
      opcionesCentroMedico: [],
      CiaSeguro: {
        label: '',
        value: '',
        Telefono: '',
        Direccion: ''
      },
      Parametros: {
        check: true,
        DatosFiliatorios: {
          FechaNacimiento: '',
          EstadoCivil: ''
        },
        Rol: {
          check: false,
          LegitimacionActiva: '',
          LegitimacionPasiva: []
        },
        Vehiculo: {
          check: false,
          Tipo: '',
          Marca: '',
          Dominio: '',
          ValorReparacion: ''
        },
        Lesiones: {
          check: false,
          Incapacidad: '',
          Tipos: [{
            Tipo: '',
            Descripcion: ''
          }]
        },
        Cuantificacion: {
          check: false,
          Resolucion: '',
          Monto: '',
          GastosCuracion: '',
          DañoMoral: '',
          FormulaVM: ''
        },
        Seguro: {
          check: false,
          CiaSeguro: '',
          Poliza: '',
          NroSeguro: '',
          Telefono: '',
          Domicilio: ''
        },
        BeneficioLitigar: {
          check: false,
          Personas: 'No posee',
          Ingresos: 'No posee',
          Inmuebles: 'No posee',
          Automotor: 'No posee',
          Oficio: 'No posee'
        }
      },
      checkHC: false,
      HistoriaClinica: {
        IdHistoriaClinica: null,
        Estado: '',
        Numero: '',
        CentroMedico: ''
      },
      Resolucion: {
        label: '',
        Resolucion: '',
        Monto: ''
      }
    }
  },
  created () {
    if (this.Persona.Parametros !== null && this.Persona.Parametros.check) {
      this.Parametros = this.Persona.Parametros

      /*
      this.CiaSeguro = {
        label: this.Parametros.Seguro.CiaSeguro,
        value: this.Parametros.Seguro.CiaSeguro,
        Telefono: this.Parametros.Seguro.Telefono,
        Direccion: this.Parametros.Seguro.Direccion
      }

      if (!this.Parametros.Cuantificacion.FormulaVM && this.formulaVouttoMendez()) {
        this.Parametros.Cuantificacion.FormulaVM = this.formulaVouttoMendez()
        request.Post(`/personas/parametros`, { Parametros: this.Parametros, IdCaso: this.IdCaso, IdPersona: this.Persona.IdPersona }, (r) => {
          this.$emit('parEdit', this.Parametros, this.Persona.IdPersona)
        })
      }
      */
    }

    /*
    if (this.Persona.IdHistoriaClinica) {
      this.checkHC = true
      this.HistoriaClinica = {
        IdHistoriaClinica: this.Persona.IdHistoriaClinica,
        Estado: this.Persona.EstadoHC,
        Numero: this.Persona.NumeroHC,
        CentroMedico: this.Persona.CentroMedicoHC
      }
    }
    */

    this.Opciones.forEach(o => {
      if (typeof (this[o.Variable]) !== 'undefined') {
        this[o.Variable] = JSON.parse(o.Opciones)
      }
    })
  },
  methods: {
    permitidoPersona (key) {
      if (!this.Persona[key]) {
        this.permitidos['persona' + key] = true
      }

      return this.permitidos['persona' + key]
    },
    permitido (key1, key2) {
      if (!this.Parametros[key1][key2]) {
        this.permitidos[key1 + key2] = true
      }

      return this.permitidos[key1 + key2]
    },
    filterFnCM (val, update, abort) {
      request.Get(`/casos/buscar-contacto-parametros`, {offset: 0, limit: 10, cadena: val, tipo: 'CM'}, r => {
        update(
          () => {
            this.opcionesCentroMedico = r.map(c => {
              return c.CentroMedico
            })
          },
          ref => {
            if (val.length >= 4 && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      })
    },
    filterFnCS (val, update, abort) {
      request.Get(`/casos/buscar-contacto-parametros`, {offset: 0, limit: 10, cadena: val, tipo: 'CS'}, r => {
        update(
          () => {
            this.opcionesCiaSeguro = r.map(c => {
              return {
                label: c.CiaSeguro,
                value: c.CiaSeguro,
                Telefono: c.Telefono,
                Direccion: c.Direccion
              }
            })
          },
          ref => {
            if (val.length >= 4 && ref.options.length > 0) {
              ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
              ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          }
        )
      })
    },
    altaOpcion () {
      if (!this.tipoOpcion) {
        this.editarOpciones(true)
        return
      }

      if (!this.opcionNueva) {
        this.$q.notify('La nueva opcion no puede estar vacia.')
        return
      }

      switch (this.tipoOpcion) {
        case 'CM':
          this.opcionesCentroMedico.push(this.opcionNueva)
          request.Post('/casos/alta-contacto-parametros', {tipo: 'CM', opcion: this.opcionNueva}, r => {
            if (r.Error) {
              this.opcionesCentroMedico.pop()
              this.$q.notify(r.Error)
            } else {
              this.$q.notify('Se agrego la opcion correctamente.')
            }

            this.opcionNueva = ''
            this.modalOpcionNueva = false
            this.tipoOpcion = ''
          })
          break

        case 'CS':
          this.opcionesCiaSeguro.push(this.opcionNueva)
          request.Post('/casos/alta-contacto-parametros', {tipo: 'CS', opcion: this.opcionNueva, telefono: this.opcionNuevaTelefono, direccion: this.opcionNuevaDireccion}, r => {
            if (r.Error) {
              this.opcionesCiaSeguro.pop()
              this.$q.notify(r.Error)
            } else {
              this.$q.notify('Se agrego la opcion correctamente.')
            }

            this.opcionNueva = ''
            this.modalOpcionNueva = false
            this.tipoOpcion = ''
          })
          break
      }
    },
    editarOpciones (check, varOpciones) {
      if (!check) {
        this.varOpciones = varOpciones
        this.modalOpcionNueva = true
        return
      } else if (!this.opcionNueva) {
        this.$q.notify('La nueva opcion no puede estar vacia.')
        return
      }

      const v = this.varOpciones
      const o = this.opcionNueva

      this[v].push(o)

      const i = this.Opciones.findIndex(p => p.Variable === v)

      if (i < 0) {
        this.$q.notify('Hubo un error al editar las opciones, intentelo de nuevo mas tarde.')
      }

      const data = {
        id: this.Opciones[i].IdOpcionesParametrosCaso,
        opciones: JSON.stringify(this[v])
      }

      request.Post('/casos/editar-opciones-parametros', data, r => {
        if (r.Error) {
          this[v].pop()
          this.$q.notify(r.Error)
        } else {
          this.$q.notify('Se agrego la opcion correctamente.')
        }

        this.varOpciones = ''
        this.opcionNueva = ''
        this.modalOpcionNueva = false
      })
    },
    habilitarEdicion () {
      this.editar = true
      /*
      if (this.Parametros.Cuantificacion.Resolucion) {
        this.Resolucion = this.opcionesResoluciones.filter(f => f.Resolucion === this.Parametros.Cuantificacion.Resolucion)[0]
      }
      */
    },
    guardarEdicion () {
      /*
      if (this.Parametros.Lesiones.Incapacidad > 100 || this.Parametros.Lesiones.Incapacidad < 0) {
        Notify.create('El porcentaje de incapacidad debe estar entre 0 y 100')
        return
      }
      this.Parametros.Cuantificacion.Resolucion = this.Resolucion.Resolucion
      this.Parametros.Cuantificacion.Monto = this.Resolucion.Monto
      this.Parametros.Cuantificacion.FormulaVM = this.formulaVouttoMendez()

      this.Parametros.Seguro = {
        ...this.Parametros.Seguro,
        CiaSeguro: this.CiaSeguro.value,
        Telefono: this.CiaSeguro.Telefono,
        Direccion: this.CiaSeguro.Direccion
      }
      */

      this.editar = false

      request.Post(`/personas/parametros`, { Parametros: this.Parametros, IdCaso: this.IdCaso, IdPersona: this.Persona.IdPersona }, (r) => {
        if (r.Error) {
          this.$q.notify(r.Error)
        } else {
          this.$q.notify('Los datos se actualizaron correctamente.')
        }
      })

      request.Put(`/estudios/5/modificar-persona/${this.Persona.IdPersona}`, {persona: this.Persona, IdCaso: this.IdCaso, EsPrincipal: this.Persona.EsPrincipal}, r => {
        if (r.Error) {
          Notify.create(r.Error)
        } else {
          Notify.create('Se editaron los datos con exito.')
        }
      })

      /*
      if (this.checkHC) {
        request.Post(`/personas/historia-clinica`, { HistoriaClinica: JSON.stringify(this.HistoriaClinica), IdCaso: this.IdCaso, IdPersona: this.Persona.IdPersona }, (r) => {
          if (r.Error) {
            this.$q.notify(r.Error)
          } else {
            if (r.IdHistoriaClinica) {
              this.HistoriaClinica.IdHistoriaClinica = r.IdHistoriaClinica
            }
            this.$q.notify('Los datos de historia clínica se actualizaron correctamente.')
          }
        })
      }
      */
    },
    edadPersona () {
      if (!this.Parametros.DatosFiliatorios.FechaNacimiento || !this.FechaHecho) {
        return 'Sin datos'
      }

      const fechaNac = this.Parametros.DatosFiliatorios.FechaNacimiento.split('-').reverse().join('-')
      const fechaHecho = this.FechaHecho.split('-').reverse().join('-')

      return moment(fechaHecho).diff(moment(fechaNac), 'years')
    },
    formulaVouttoMendez () {
      const edad = this.edadPersona()
      const montoMensual = this.Parametros.Cuantificacion.Monto
      const incapacidad = this.Parametros.Lesiones.Incapacidad

      if (!montoMensual || !incapacidad || edad === 'Sin datos') {
        return ''
      }

      let i
      let a
      let n

      if (edad > 55) {
        i = 0.04
        a = montoMensual.replace('.', '') * 13 * (incapacidad / 100) * (60 / edad)
        n = 75 - edad
      } else {
        i = 0.06
        a = montoMensual.replace('.', '') * 13 * (incapacidad / 100)
        n = 65 - edad
      }

      const Vn = 1 / Math.pow(1 + i, n)

      console.log('Vn: ', Vn)
      console.log('a: ', a)
      console.log('n: ', n)
      console.log('i: ', i)

      return (a * (1 - Vn) * (1 / i)).toFixed(2)
    },
    agregarLesion () {
      this.Parametros.Lesiones.Tipos.push({
        Tipo: '',
        Descripcion: ''
      })
    },
    quitarLesion () {
      this.Parametros.Lesiones.Tipos.splice(-1, 1)
    },
    selectCia () {
      console.log(this.CiaSeguro)
    }
  }
}
</script>

<style>
.seccion-item {
  margin: 2em 0px;
}

.cursor-pointer {
  cursor: pointer;
}

.item-titulo {
  font-size: 16px;
  font-weight: 500;
}

.persona-item-titulo {
  font-size: 1.5em;
  font-weight: 600;
  color: #607d8b;
}

.persona-item-subtitulo {
  font-size: 1.75em;
  font-weight: 500;
  color: #616161;
  display: inline;
}

.seccion-item-editar {
  padding: 10px;
  width: 80%
}
</style>
