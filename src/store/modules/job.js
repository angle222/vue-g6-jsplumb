//import { jobDetail} from "../../api/job";
const state = {
 projectData:[],
 tabActiveName:'first',
 newPage:true,
 isCreateJob:true,
 crondialog:false,
  exedialog:false,
 filedialog:false,
 commanddialog:false,
 javadialog:false,
 sparkdialog:false,
 hivedialog:false,
 projobDetail:false,
 logShow:false,
 taskShow:true,
 taskId:'',
 comItem:null,
 sparkItem:{},
 hiveItem:null,
 javaItem:{},
 taskBaseInfo:{},
 code:''
}
const getters ={
	
}
const actions ={
	getBaseinfo({commit,state},id){
		var obj = {
					id:id
				}
				jobDetail(obj).then(res => {
					if(res.data.code == 0){
						commit('setTaskInfo',res.data.data)
					}else{
						
					}
					
				}).catch(function(err){
					console.log(err)
				})
	}
}
const mutations = {
	setActive(state,status){
		state.tabActiveName = status
	},
	setPro(state, data){
		state.projectData = data
	},
	setlog(state, data){
		state.logShow = data
	},
	settask(state, data){
		state.taskShow = data
	},
	setTaskId(state, data){
		state.taskId = data
	},
	setProJobDetail(state, data){
		state.projobDetail = data
	},
	newPageChange(state,status){
		state.newPage = status
	},
	createJob(state,status){
		state.isCreateJob = status
	},
	filedialog(state,status){
		state.filedialog = status
	},
	command(state,status){
		state.commanddialog = status
	},
	setCron(state,status){
		state.crondialog = status
	},
	setExe(state,status){
		state.exedialog = status
	},
	hadoopJava(state,status){
		state.javadialog = status
	},
	hive(state,status){
		state.hivedialog = status
	},
	spark(state,status){
		state.sparkdialog = status
	},
	detailcommand(state,data){
		state.comItem = data
	},
	detailhadoopJava(state,data){
		state.javaItem = JSON.parse(data)
	},
	detailhive(state,data){
		state.hiveItem = data
	},
	detailspark(state,data){
		state.sparkItem =JSON.parse(data)
	},
	setTaskInfo(state,data){
		state.taskBaseInfo = data
	},
	setCode(state,data){
		state.code = data
	},
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}