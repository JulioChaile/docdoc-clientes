<template>
  <div class="full-width full-height column">
    <div class="col-9" id="mapGeo">
    </div>
    <div class="q-pa-md col-3">
      <q-input
        class="full-width q-mb-md"
        v-model="domicilio"
        label="Domicilio"
        type="text"
        @keyup.enter="localizar"
      />
      <div class="column items-center justify-center">
        <q-btn
          push
          no-caps
          class="q-mt-md"
          label="Geolozalicar Nuevamente"
          @click="localizar"
          color="primary"
        />
        <div class="q-mt-md">
          <q-btn
            push
            no-caps
            class="q-mr-xs"
            label="Confirmar"
            @click="$emit('confirmado', coords, domicilio)"
            color="positive"
          />
          <q-btn
            push
            no-caps
            class="q-ml-xs"
            label="Cancelar"
            @click="$emit('cerrar')"
            color="negative"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'
import { Notify, QSpinner } from 'quasar'
import axios from 'axios'
import Loading from '../../components/Loading'

export default {
  name: 'MapaGeo',
  components: {
    Loading,
    QSpinner
  },
  props: [
    'Caso'
  ],
  data () {
    return {
      loaderMap: null,
      map: null,
      apiKey: 'AIzaSyDw8NFG-Llw1Kytr1SqaJ0aT7G4lRlP38Y',
      coords: {},
      marker: null,
      infoWindow: null,
      domicilio: ''
    }
  },
  mounted () {
    this.domicilio = this.Caso.Domicilio
    this.loaderMap = new Loader({
      apiKey: this.apiKey,
      version: 'weekly'
    })
    this.loaderMap.load().then(() => {
      // eslint-disable-next-line no-undef
      this.map = new google.maps.Map(document.getElementById('mapGeo'), {
        zoom: 13,
        center: {
          lat: -26.8241400,
          lng: -65.2226000
        }
      })
      if (this.Caso.Latitud) {
        this.coords = {
          Latitud: parseFloat(this.Caso.Latitud),
          Longitud: parseFloat(this.Caso.Longitud)
        }
        this.map.setCenter({
          lat: this.coords.Latitud,
          lng: this.coords.Longitud
        })
        this.addMarker()
      } else {
        this.localizar()
      }
    })
  },
  methods: {
    localizar () {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: this.domicilio + ', Tucuman',
          key: this.apiKey
        }
      })
        .then(res => {
          if (res.data.status === 'OK') {
            this.coords = {
              Latitud: res.data.results[0].geometry.location.lat,
              Longitud: res.data.results[0].geometry.location.lng
            }
            this.map.setCenter({
              lat: res.data.results[0].geometry.location.lat,
              lng: res.data.results[0].geometry.location.lng
            })

            this.addMarker()
          } else {
            Notify.create('No se encontro la direccion buscada.')
          }
        })
    },
    addMarker (props) {
      if (this.marker) {
        this.marker.setMap(null)
      }
      // eslint-disable-next-line no-undef
      this.marker = new google.maps.Marker({
        position: {
          lat: this.coords.Latitud,
          lng: this.coords.Longitud
        },
        map: this.map
      })
      // Creo la ventana con su respectivo contenido
      // eslint-disable-next-line no-undef
      this.infoWindow = new google.maps.InfoWindow({
        content: `<div class="ventana">
                    <table class="tabla-ventana">
                        <th colspan="2"><span>${this.domicilio.split(',').slice(0, -2).join(',').toUpperCase()}<br></span></th>
                        <tr><td><b>DNI:</b></td><td class="celda-value">${this.Caso.Documento}</td></tr>
                        <tr><td><b>Apellido:</b></td><td class="celda-value">${this.Caso.Apellidos}</td></tr>
                        <tr><td><b>Nombre:</b></td><td class="celda-value">${this.Caso.Nombres}</td></tr>
                    </table>
                  </div>`
      })

      // Evento para abrir ventana del marcador al hacerle click
      this.marker.addListener('click', () => {
        this.infoWindow.open(this.map, this.marker)
      })
    }
  }
}
</script>

<style scoped>
.loading {
  width: 100px;
  overflow: hidden;
}

.ventana {
    height: auto;
}

.titulo-tabla {
    color: darkblue;
    margin: 0 auto;
}

.celda-value {
    font-weight: 400;
}
</style>
