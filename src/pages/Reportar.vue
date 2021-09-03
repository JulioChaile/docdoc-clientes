<template>
    <q-page>
        <div
            v-if="!enviado"
            class="full-width column items-center text-center q-pt-xl"
        >
            <q-icon
                class="q-mb-md"
                name="settings"
                size="md"
                color="teal"
            />
            <div
                class="text-teal text-bold text-subtitle1"
            >
                Estamos trabajando para brindarte la mejor atención
                <br>
                Si encontraste algun error por favor repórtalo y trataremos de solucionarlo a la brevedad
            </div>
        </div>
        
        <q-separator
            v-if="!enviado"
            size="2px"
            class="q-my-md"
            style="width: 80%; margin-left: 10%"
        />

        <div
            v-if="!enviando && !enviado"
            class="q-pa-sm column items-center"
        >
            <q-input
              v-model="reporte"
              class="full-width"
              filled
              label="Reporte"
              type="textarea"
              :rows="4"
              color="teal"
            />
            <q-btn
              push
              no-caps
              class="q-mt-lg"
              label="Enviar"
              @click="enviarReporte"
              color="teal"
            />
        </div>

        <div
            v-else-if="!enviado"
            class="flex justify-center q-pt-lg"
        >
            <q-spinner
                color="teal"
                class="self-center"
                size="2em"
            />
        </div>
        <div
            v-else
            class="full-width column items-center text-center q-pt-xl"
        >
            <q-icon
                class="q-mb-md"
                name="o_sentiment_very_satisfied"
                size="md"
                color="teal"
            />
            <div
                class="text-teal text-bold text-subtitle1"
            >
                Gracias por ayudarnos a mejorar
            </div>
        </div>
    </q-page>
</template>

<script>
import { QSpinner } from 'quasar'
import request from '../request'

export default {
    components: { QSpinner },
    data () {
        return {
            reporte: '',
            enviando: false,
            enviado: false
        }
    },
    methods: {
        enviarReporte () {
            if (!this.reporte) {
                this.$q.notify('No puede enviar un reporte vacio')
                return
            }

            this.enviando = true

            request.Post('/usuarios/reporte-cliente', {reporte: this.reporte}, r => {
                if (r.Error) {
                    this.$q.notify('Ha ocurrido un error en nuestro servidor, intenta de nuevo mas tarde.')
                    this.enviando = false
                    this.reporte = ''
                } else {
                    this.$q.notify('Su reporte ha sido enviado satisfactoriamente')
                    this.enviado = true
                    this.reporte = ''
                }
            })
        }
    }
}
</script>
