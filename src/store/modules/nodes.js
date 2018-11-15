const state = {
 nodes:[],
 selectId:null,
 bottomShow:false,
 rightShow:false,
 linuxCorn:'',
 nodeData:[],
 canvas:null,
 activation:null,
 selectNode:null
}
const getters ={
	getNodes(state){
		return state.nodes
	},
	getselectNd(state){
		return state.selectNd
	}
}
const actions ={
	addNodes({state,commit}){
		commit('addNodes')
	},
}
const mutations = {
	saveNodes(state,nodeInfo){
		state.nodes.push(nodeInfo)
	},
	saveNodeData(state,nodeInfo){
		state.nodeData.push(nodeInfo)
	},
	setNodes(state,nodeInfo){
		state.nodeData = nodeInfo
	},
	setNodesId(state,selectId){
		state.selectId = selectId
	},
	setcron(state,cron){
		state.linuxCorn = cron
	},
	bottomShow(state,status){
		state.bottomShow = status
	},
	rightShow(state,status){
		state.rightShow = status
	},
	canvas(state,data){
		state.canvas = data
	},
	selectNodes(state,data){
		state.selectNode = data
	}
}
export default {
	namespaced: true,
  state,
  getters,
  actions,
  mutations
}