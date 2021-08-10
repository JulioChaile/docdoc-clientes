<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      class="text-black margin-tabs"
      active-color="white"
      indicator-color="skyblue"
      align="left"
      narrow-indicator
    >
      <q-tab class="bg-primary tab-class" name="caso" label="Caso"/>
      <q-tab class="bg-primary tab-class" name="archivos" label="Archivos"/>
      <q-tab class="bg-primary tab-class" name="doc" label="Doc"/>
      <q-tab class="bg-primary tab-class" name="datos" label="Datos"/>
    </q-tabs>

    <q-tab-panels
      class="bg-transparent"
      v-model="tab"
      animated
    >
      <q-tab-panel class="padding-top-cero" name="caso">
        <Caso />
      </q-tab-panel>
      <q-tab-panel class="padding-top-cero" name="archivos">
        <ArchivosCaso />
      </q-tab-panel>
      <q-tab-panel class="padding-cero" name="doc">
        <DocEditor />
      </q-tab-panel>
      <q-tab-panel name="datos">
        <DatosCaso />
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
  border-radius: 50px 50px 0 0;
  width: 150px;
  margin-right: -20px;
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
