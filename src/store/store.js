import Vue from 'vue'
import vuex from 'vuex'
//import tableInput from './modules/tableInput'
//import tableOutput from './modules/tableOutput'/
import job from './modules/job'
import nodes from './modules/nodes'

Vue.use(vuex)

export default new vuex.Store({
	 modules: {
    nodes,
    job
  }
})
