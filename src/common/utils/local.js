export default {
  install(Vue) {
    Vue.prototype.$setItem = (item, val) => { localStorage.setItem(item, val) }
    Vue.prototype.$getItem = item => localStorage.getItem(item)
    Vue.prototype.$removeItem = item => { localStorage.removeItem(item) }
  }
}
