// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import router from "./router/router";
import ElementUI from 'element-ui'
import store from "./store/store.js"
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import "./assets/common/common.css";
import "./assets/reset.css";
import "./assets/iconfont.css";
import VueCodemirror from 'vue-codemirror'
Vue.use(VueCodemirror)
//import  VueQuillEditor from 'vue-quill-editor'
import 'codemirror/lib/codemirror.css'

//Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.use(ElementUI)

window.axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
