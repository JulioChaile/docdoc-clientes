<template>
    <div>
        <div
            v-if="loading"
            class="full-width flex justify-center q-my-md"
        >
            <q-spinner
                color="teal"
                class="self-center"
                size="2em"
            />
        </div>

        <div v-else>
            <div
                v-if="movimientos.length === 0"
                class="column full-width items-center justify-center text-center"
                style="height: 70vh"
            >
                <q-icon
                    class="q-mb-md"
                    name="event"
                    size="md"
                    color="teal"
                />
                <div class="text-teal text-bold text-subtitle1">
                    Este caso aún no tiene alguna fecha de audiencia asignada
                    <br>
                    Se te notificará en cuanto tengamos novedades
                </div>
            </div>
            <div class="column q-px-md">
                <div
                    v-for="m in movimientos"
                    :key="m.IdMovimientoCaso"
                    class="q-mb-xs"
                    @click="verDetalle(m)"
                >
                    <div class="full-width flex audiencia-fecha items-center">
                        {{ fechaDia(m.FechaEvento) }}<span style="text-transform: lowercase; margin-left: 5px">hs</span>
                    </div>
                    <div class="full-width audiencia-detalle">
                        <div class="texto-una-linea" style="font-weight: 500;">
                            {{ m.Detalle }}
                        </div>
                        <div class="texto-una-linea" style="color: rgb(85, 85, 85);">
                            {{ diasRestantes(m.FechaEsperada) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <q-dialog v-model="modal">
            <q-card class="column items-center q-pa-xs" style="width: 90%">
                <div class="text-weight-bold">
                    {{ movAux.FechaEvento ? movAux.FechaEvento.split(' ')[0].replace(/-/g, '/') : '' }}
                </div>
                <div class="text-weight-bold">
                    {{ movAux.FechaEvento ? movAux.FechaEvento.split(' ')[1].slice(0, -3) + ' ' : '' }}hs
                </div>

                <q-separator class="q-mt-xs" />

                <div class="text-start full-width q-pa-sm text-weight-medium">
                    {{ movAux.Detalle }}
                </div>

                <q-separator class="q-mb-xs" />

                <span class="text-weight-bold">
                    {{ diasRestantes(movAux.FechaEsperada) }}
                </span>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { QSpinner } from 'quasar'
import moment from 'moment'

export default {
    name: 'Audiencias',
    components: {
        QSpinner
    },
    props: ['movimientos', 'loading'],
    data () {
        return {
            movAux: {
                FechaEvento: '',
                FechaEsperada: '',
                Detalle: ''
            },
            modal: false
        }
    },
    methods: {
        fechaDia (f) {
            moment.locale('es')

            const diaNombre = moment(f).format('dddd')
            const dia = moment(f).format('DD')
            const mes = moment(f).format('MMMM')
            const año = moment(f).format('YYYY')
            const hora = moment(f).format('HH:mm')

            return `${diaNombre}, ${dia} de ${mes} de ${año} - ${hora}`
        },
        diasRestantes (f) {
            if (!f) return ''

            const fecha2 = new Date()
            const year = f.split('-')[0]
            const month = f.split('-')[1] - 1
            const day = f.split('-')[2].split(' ')[0] - 1

            fecha2.setMonth(month)
            fecha2.setFullYear(year)
            fecha2.setDate(day)
            const hoy = new Date()

            var dias =
                Math.ceil(
                (fecha2.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1
            
            switch (dias) {
                case 0:
                    return 'Hoy'

                case 1:
                    return 'En 1 día'

                default:
                    return `En ${dias} días`
            }
        },
        verDetalle (m) {
            this.movAux = m
            this.modal = true
        }
    }
}
</script>

<style>
.audiencia-fecha {
    height: 30px;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1.0625rem;
    text-transform: uppercase;
    color: rgb(17, 17, 17);
}

.audiencia-fecha::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 10px;
    background-color: rgb(0, 0, 0);
    margin-right: 8px;
}

.audiencia-detalle {
    height: 54px;
    padding-left: 8px;
    padding-top: 8px;
    border-left: 4px solid rgb(153, 153, 153);
    background-color: rgb(232, 232, 232);
    color: rgb(17, 17, 17);
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.0625rem;
}

.texto-una-linea {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: calc(100vw - 48px) !important;
}
</style>
