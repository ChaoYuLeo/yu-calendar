import YuCalendar from './components/YuCalendar.vue'

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return (root.YuCalendar = factory())
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require())
  } else {
    root.YuCalendar = factory()
  }
}(window, function() {
  return YuCalendar
}))
