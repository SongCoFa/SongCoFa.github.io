<template>
  <div v-if="nowat === 'RepairSystem'">
  <q-breadcrumbs
    style="position: absolute; top:65px; left:25px; width:200px; height:55px;"
    class="font-weight-bold text_big"
    separator=">"
    color="light"
  >
    <q-breadcrumbs-el :label="local.RepairSystem.main" to="/" />
  </q-breadcrumbs>
  </div>
  <div v-else-if="nowat === 'RepairSystemDetail'">
    <q-breadcrumbs
      style="position: absolute; top:65px; left:25px; width:190px; height:55px;"
      class="font-weight-bold text_big"
      separator="/"
    >
      <q-breadcrumbs-el :label="local.RepairSystem.main" to="/" />
      <q-breadcrumbs-el :label="local.RepairSystem.detail" to="/" />
    </q-breadcrumbs>
  </div>
  <div v-else-if="nowat === 'RepairSystemDetailPrint'">
    <q-breadcrumbs
      style="position: absolute; top:65px; left:25px; width:190px; height:55px;"
      class="font-weight-bold text_big"
      separator="/"
    >
      <q-breadcrumbs-el :label="local.RepairSystem.main" to="/" />
      <q-breadcrumbs-el :label="local.RepairSystem.print" to="/" />
    </q-breadcrumbs>
  </div>
</template>

<script>
export default {
  props: {
    nowat: String
  },
  data () {
    return {
      local: {
        RepairSystem: {
          main: '報修系統',
          detail: '明細',
          print: '列印'
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
