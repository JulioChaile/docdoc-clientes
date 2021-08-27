<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      class="text-black margin-tabs"
      active-color="dark"
      indicator-color="skyblue"
      align="left"
      narrow-indicator
    >
      <q-tab class="tab-class" name="caso" label="Mi Caso"/>
      <q-tab class="tab-class" name="archivos" label="Documentacion"/>
    </q-tabs>

    <q-tab-panels
      class="bg-transparent"
      v-model="tab"
      animated
    >
      <q-tab-panel class="padding-cero" name="caso">
        <Caso />
      </q-tab-panel>
      <q-tab-panel class="padding-top-cero" name="archivos">
        <ArchivosCaso />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { QTabPanels, QTabPanel, QTab, QTabs } from 'quasar'
import Caso from '../components/Caso/Caso'
import ArchivosCaso from '../components/Caso/ArchivosCaso'
import DocEditor from '../components/Caso/DocEditor'
import DatosCaso from '../components/Caso/DatosCaso'

export default {
  name: 'CasoPage',
  components: {
    QTabPanels,
    QTabPanel,
    QTab,
    QTabs,
    Caso,
    ArchivosCaso,
    DocEditor,
    DatosCaso
  },
  data () {
    return {
      tab: this.$route.query.tab || 'caso'
    }
  }
}
</script>

<style>
.tab-class {
  width: 35%;
  background : -moz-linear-gradient(50% 100% 90deg,rgba(255, 255, 255, 1) 0%,rgba(253, 253, 253, 1) 30.7%,rgba(244, 244, 244, 1) 48.88%,rgba(230, 230, 230, 1) 63.81%,rgba(210, 210, 210, 1) 76.96%,rgba(184, 184, 184, 1) 88.83%,rgba(153, 153, 153, 1) 99.83%,rgba(152, 152, 152, 1) 100%);
  background : -webkit-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 30.7%, rgba(244, 244, 244, 1) 48.88%, rgba(230, 230, 230, 1) 63.81%, rgba(210, 210, 210, 1) 76.96%, rgba(184, 184, 184, 1) 88.83%, rgba(153, 153, 153, 1) 99.83%, rgba(152, 152, 152, 1) 100%);
  background : -webkit-gradient(linear,50% 100% ,50% 0% ,color-stop(0,rgba(255, 255, 255, 1) ),color-stop(0.307,rgba(253, 253, 253, 1) ),color-stop(0.4888,rgba(244, 244, 244, 1) ),color-stop(0.6381,rgba(230, 230, 230, 1) ),color-stop(0.7696,rgba(210, 210, 210, 1) ),color-stop(0.8883,rgba(184, 184, 184, 1) ),color-stop(0.9983,rgba(153, 153, 153, 1) ),color-stop(1,rgba(152, 152, 152, 1) ));
  background : -o-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 30.7%, rgba(244, 244, 244, 1) 48.88%, rgba(230, 230, 230, 1) 63.81%, rgba(210, 210, 210, 1) 76.96%, rgba(184, 184, 184, 1) 88.83%, rgba(153, 153, 153, 1) 99.83%, rgba(152, 152, 152, 1) 100%);
  background : -ms-linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 30.7%, rgba(244, 244, 244, 1) 48.88%, rgba(230, 230, 230, 1) 63.81%, rgba(210, 210, 210, 1) 76.96%, rgba(184, 184, 184, 1) 88.83%, rgba(153, 153, 153, 1) 99.83%, rgba(152, 152, 152, 1) 100%);
  -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFF', endColorstr='#989898' ,GradientType=0)";
  background : linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 30.7%, rgba(244, 244, 244, 1) 48.88%, rgba(230, 230, 230, 1) 63.81%, rgba(210, 210, 210, 1) 76.96%, rgba(184, 184, 184, 1) 88.83%, rgba(153, 153, 153, 1) 99.83%, rgba(152, 152, 152, 1) 100%);
  opacity: 0.7;
  margin: auto;
  border-radius : 5px 5px 0 0;
  filter: alpha(opacity=50) progid:DXImageTransform.Microsoft.Alpha(opacity=50) progid:DXImageTransform.Microsoft.gradient(startColorstr='#989898',endColorstr='#FFFFFF' , GradientType=0);
}

.padding-top-cero {
  padding-top: 0px;
}

.padding-cero {
  padding: 0px;
}

.margin-tabs {
  margin-top: 5px;
}
</style>
