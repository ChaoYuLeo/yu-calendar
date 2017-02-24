<template>
  <div id="app">
    单选单panel：<yu-calendar/>
    单选双panel：<yu-calendar :double-panel="calendar.double"/>
    双选单panel：<yu-calendar :range="calendar.range"/>
    双选双panel：<yu-calendar :range="calendar.range" :double-panel="calendar.double"/>
  </div>
</template>

<script>
import YuCalendar from './components/YuCalendar.vue'
export default {
  name: 'app',
  data () {
    return {
      calendar: {
        double: true,
        range: true
      }
    }
  },
  components: {
    YuCalendar
  }
}
</script>

<style>

</style>
