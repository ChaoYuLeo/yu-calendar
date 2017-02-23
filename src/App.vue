<template>
  <div id="app">
    <yu-calendar :double-panel="calendar.double" :range="calendar.range"/>
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
