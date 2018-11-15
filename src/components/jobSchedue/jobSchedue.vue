<template>
    <div class="app">
    
  	
  		
	<div class="job-content" >
		<!--创建关系图-->
		<el-row >
			<el-col :span="3">
				<div class="grid-content">
					<div class="job-node">
						<p>节点</p>
						<ul>
							<li><el-button type="primary" size="small" @click="createNode('脚本类型','command')"> 脚本类型</el-button></li>
							<li><el-button type="primary" size="small" @click="createNode('Hive类型','hive')">Hive类型</el-button></li>
							<li><el-button type="primary" size="small" @click="createNode('HadoopJava类型','hadoopJava')">hadoopJava类型</el-button></li>
							<li><el-button type="primary" size="small" @click="createNode('Spark类型','spark')">Spark类型</el-button></li>
							<li><el-button type="primary" size="small" @click="createNode('机器学习','machine')">机器学习</el-button></li>
							<li>其他</li>
							<li><el-button type="primary" size="small"  @click="createNode('嵌入式工作流','inner')" plain>嵌入式工作流</el-button></li>
						</ul>
					</div>
				</div>
			</el-col>
			<el-col :span="21">
				<div class="grid-content">
					<div class="jobgraph" ref="canvasObj">	
						<div class="text-center">
							<div id="nodeCanvas">
								<div class="s-node" 
									v-for="(item,index) in middleData"
									:id="'drawNode'+item.id"
									:style="{left:(((index%8)*140)+50)+'px',top:(Math.floor((index/8))*60+10)+'px'}"
									@mouseenter="nodeEnter(index)"
									@mouseleave="nodeLeave"
									>
									<li class="content">{{item.name}} <span class="right" @click="nodeRemove(item.id)">X</span> </li>
									<li v-show="selectIndex==index"class="l-footer">
										<span @click="nodeEdit(item.id,item.type)">编辑</span>
										<span @click="jobEditor(item.id,item.type)">配置</span>
									</li>
								</div>
							</div>
							<!--<canvas id="canvas" :width="canvaspx.width" :height="canvaspx.height"></canvas>-->
						</div>
						<el-button type="primary" class="jobset" @click="jobConfig" size="mini">作业 <br /> 配置</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		
	</div>	
	
		<!-- 弹出框 -->
		<el-dialog :title="title" :visible.sync="dialogFormVisible">
			<el-form :model="node">
				<el-form-item label="名称" :label-width="formLabelWidth">
					<el-input v-model="node.id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="node.description" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</div>
		</el-dialog>
	
		<!--自底向上弹出-->
		<transition name="tobottom">
			<div class="toptobottom" v-show="bottomShow">
				<comjob></comjob>
				<javajob></javajob>
				<hivejob></hivejob>
				<sparkjob></sparkjob>
			</div>
		</transition>
	
		
    </div>
</template>

<script>
	import { jsPlumb }  from "jsplumb"
  import {mapGetters, mapState, mapMutations} from 'vuex';
  import router from "../../router/router"

  import comjob from './comjob'
  import javajob from './javajob'
  import hivejob from './hivejob'
  import sparkjob from './sparkjob'

  import Qs from 'qs'

	export default {
		mounted(){
			this.addNode()
		},
		data () {
			return {
				middleData:[],
				selectIndex:-1,
				dditem: {scheduled:'1'},
				node: {},
        		formLabelWidth: '90px',	
				dialogFormVisible: false,	// dialog是否显示
				bottomActiveName: 'first',
		       	nodeIndex:0,
		        isModal:false,
			
				jspNode:null,
				isdrawLine:false,
				beginNode:null,
				endNode:null,
				drawArry:[],
			    rightClick:{},
			    rightClickShow:false,
			    isDrag:'',
			    flow:null,
			    rules:{
			    	projectId:[{required:true,message:'请选择项目',trigger:'blur'}],
			    	taskName:[{required:true,message:'请输入作业名字',trigger:'blur'}],
			    	description:[{required:true,message:'请输入描述',trigger:'blur'}],
			    	
			    },
			    proDetail:false
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
			  if(from.path =='/projectDetail/joblist'){
					//从项目详情跳转
					vm.proDetail = true
				}
			})
		},
		watch:{
			isCreateJob:function(newval,oldval){
				var that = this;
				if(newval){
					this.dditem = {scheduled:'1'}
				}else{
					setTimeout(function(){
						that.canvaspx = {
							width:that.$refs.canvasObj.getBoundingClientRect().width - 100,
							height:that.$refs.canvasObj.getBoundingClientRect().height
						}
					},100)
				}
			}

		},
		computed: {
			// 弹出框标题
			title () {
				return '编辑节点'
			},
			...mapState({
				userName:state =>state.login.userName,
				projectData:state =>state.job.projectData,
				newPage:state =>state.job.newPage,
				isCreateJob:state =>state.job.isCreateJob,
				bottomShow:state =>state.nodes.bottomShow,
				rightShow:state =>state.nodes.rightShow,
				nodeData:state =>state.nodes.nodeData,
				selectId:state =>state.nodes.selectId,
				linuxCorn:state =>state.nodes.linuxCorn,
				taskId:state =>state.job.taskId,
			})
		},
		components:{comjob,javajob,hivejob,sparkjob},
		methods: {
			addNode(){
				var that = this;
					
				jsPlumb.ready(function(){
				
					var instance = window.jsp = jsPlumb.getInstance({
		        // default drag options
		         		DragOptions: { cursor: 'pointer', zIndex: 2000 },
                PaintStyle: { stroke: '#aaa', strokeWidth: 2},  //配置自己拖拽小点的时候连接线的默认样式
                Endpoint: ["Dot", { radius: 8 }], //这个是控制连线终端那个小点的半径
                EndpointStyle : { fill : "#1e8151" }, //这个是控制连线终端那个小点的样式
                EndpointHoverStyle  : { fill : "blue" },
                Anchor:['Right','Left','Top','Bottom'],
                connector: ['Straight', { stub: [0, 0],gap: 5, cornerRadius: 5, alwaysRespectStubs: true }],
								               
                ConnectionOverlays: [
                       ['Arrow', {
									      width: 12,
									      length: 12,
									      location: 1,
									      paintStyle: {
						              lineWidth: 5,
						              stroke: '#61b7cf',
						              fill: '#61b7cf',
						            },
									    }]
                ],
		        Container: "nodeCanvas"
		    	});
		    	
		    	
		    	 instance.bind('click', (conn) => {
                
                if(confirm("确定删除连线?")){
                	instance.deleteConnection(conn)
                }
                
            })
		    	that.jspNode = instance
				})
			},
			//添加节点
			createNode(name,type){
				let that = this;
				let o = {
					name,
					type,
					id:this.nodeIndex
				}
				this.middleData.push(o)
				this.$store.commit('nodes/saveNodeData',o);
				setTimeout(function(){
					that.addEndpoint(o.id)
				},300)
				this.nodeIndex += 1
			},
			//添加连接点
			addEndpoint(id){
				var conf = {
					isSource: true,
        	isTarget: true,
        	connectorStyle: {
				    outlineStroke: '#61b7cf',
				    strokeWidth: 1
				  },
				  connectorHoverStyle:{
				  	strokeStyle: 'red',
				  },
				  maxConnections: -1
				}
				this.jspNode.addEndpoint('drawNode'+id,conf)
				this.jspNode.draggable(jsPlumb.getSelector("#drawNode"+id))
			},
			//hover事件
			nodeEnter(index){
				this.selectIndex = index
			},
			nodeLeave(){
				this.selectIndex = -1
			},
			
			//编辑节点，弹框
			nodeEdit(id){
				this.$store.commit('nodes/setNodesId',id);
				this.dialogFormVisible = true
				this.node = {};
//				this.rightClickShow = false
			},
			//删除节点，
			nodeRemove(id){
				let that = this;
				//删除接点的时候要删除连接点
				this.jspNode.remove('drawNode'+id)
				//删除store里面的node
				var ndata = Object.assign([],that.nodeData) ;
				for (var j = 0;j<ndata.length;j++) {
					if(id == ndata[j].id){
						ndata.splice(j,1)
					}
				}
				that.$store.commit('nodes/setNodes',ndata)
				
			},
			//编辑任务流从下往上的弹框
			jobEditor(id,type){
				console.log(id)
				this.$store.commit('nodes/setNodesId',id);
				this.$store.commit('nodes/bottomShow',true);
				this.$store.commit('job/'+type,true);
				//把数据初始化为空
				this.$store.commit('job/detail'+type,null);
				this.rightClickShow = false
			},
			//接点命名
			save(){
				let _this = this
				var allNodes = this.nodeData
				if(allNodes.length > 0){
					for(var j = 0;j<allNodes.length;j++){
						if(allNodes[j].name == _this.node.id){
							_this.$alert('节点名称不能重复')
							return false;
							break
						}
					}
				}
				//根据id 找到存的node
				let id =  _this.selectId
				for (var i = 0;i<this.nodeData.length;i++) {
					if(this.nodeData[i].id === id){
						this.nodeData[i].name = _this.node.id
						this.nodeData[i].description = _this.node.description
						break;
					}
				}
				
				_this.dialogFormVisible = false
			},
			//开始执行
			startExecute(){
				let that = this;
				if(!that.flow){
					that.$alert('请先保存工作流之后再进行执行操作')
					return false;
				}
				let postData = {
					id:that.taskId
				}
				exejob(postData).then(res => {
					if(res.data.code == 0){
						that.$alert('操作成功')	
					}else{
						that.$alert(res.data.message)
					}
				}).catch(function(err){
					console.log(err)
				})
			},

			//作业配置右侧划出
			jobConfig(){
				this.$store.commit('nodes/rightShow',true)
			},
			// 点击添加按钮显示弹出框
			showDialog () {
				this.type = 0						// 改为添加状态
				this.dialogFormVisible = true		// 显示弹出框
				this.item = {}						// 清空当前编辑数据
			},
			back(){
				this.$store.commit('job/createJob',true)
				this.$store.commit('job/newPageChange',true)
			},
			//创建工作流
			createJob(formName){
				let that = this;
//				that.$store.commit('job/createJob',false)
//				return false;
				this.$refs[formName].validate((valid)=>{
					if(valid){
						let postData = that.dditem
						createjob(postData).then(res => {
							if(res.data.code == 0){
								that.$alert('创建成功')
								that.$store.commit('job/setTaskId',res.data.data.id)
								//store里面的nodes置为空
								that.$store.commit('nodes/setNodes',[])
								that.$store.commit('job/createJob',false)
							}else{
								that.$alert(res.data.message)
							}
						}).catch(function(err){
							console.log(err)
						})
					}
				})
				
			},
			cancelCreateJob(formName){
				this.$refs[formName].resetFields();
				
				if(this.proDetail){
					//从详情跳转过来的，需要在回到项目详情
					router.go(-1)
				}else{
					this.$store.commit('job/newPageChange',true)
				}
			},
		
			// 弹出框保存
			saveAll () {
				const loading = this.$loading({
					lock:true,
					text:'正在保存',
					spinner:'el-icon-loading',
					background:'rgba(0,0,0,0.7)'
				})
				var connects = this.jspNode.getAllConnections()
				var postNodes = [];
				var flowCount = 0;
				let flow
				if(connects.length == 0){
					flow =  this.nodeData[0].name
				}
				for(var n of this.nodeData){
					let ins = [];
					for(var c of connects){
						let t = c.targetId.substr(8)
						let s = c.sourceId.substr(8)
						if(n.id == t){
							for(var j of this.nodeData){
								if(s == j.id){
									ins.push(j.name)
								}
							}
						}
					}
					if(!n.data){
							loading.close()
						this.$alert('存在未配置项')
					
						return false;
					}
					var obj = {
								id:n.name,
								type:n.type,
								description:n.description,
								data:n.data,
								in:ins
							}
					postNodes.push(obj);	
				}
				console.log(postNodes);
				let flowInfo = {
					nodes:postNodes,
					taskId:this.taskId,
					flow:flow,
					cron:this.linuxCorn
				}
				//保存工作流
				savejob(flowInfo).then(res => {
					console.log(res.data)
					if(res.data.code==0){
						this.$alert('保存成功')
						loading.close()
						this.flow = flow;
						//把索引置为初始化
//						this.nodeIndex = 0
					}else{
						loading.close()
						this.$alert(res.data.message)
					}
				}).catch(function(err){
					loading.close()
					console.log(err)
				})
				console.log(flowInfo)
			},
			
		}
	}
</script>

<style scoped="scoped">
	.title{
		height: 44px;
		border-bottom:1px solid #e8e8e8;
	
	}
	.title b{
		font-size: 20px;
		color: #000;
	}
	.title button{
		margin-left: 20px;
	}
	.nav span{
		cursor: pointer;
	}
	
	.pager {
		margin-top: 15px;
	}
	.job-content{
		padding: 15px 0;
	}
	.job-node{
		/*width: 130px;*/
		border: 1px solid #E9E9E9;
		text-align: center;
		background: #d9edf7;
		height: calc(100vh - 200px);
    min-height: 560px
	}
	.job-node ul{
		padding: 0 10px;
	}
	.job-node button{
		width: 100%
	}
	.job-node p{
		border-bottom: 1px solid #E9E9E9;
	}
	.job-node p,.job-node li{
		line-height: 35px;
		margin-bottom: 10px;
	}
	.jobgraph{
		width: 100%;
		position: relative;
		height: calc(100vh - 200px);
		min-height: 560px;
		background: #dff0d8;
	}
	/*.jobgraph canvas{
		width: 95%;
		height: calc(100vh - 200px);
		min-height: 410px;
	}*/
	.jobset{
		position: absolute;
		bottom: 20px;
		right: 50px;
	}
	/*右侧划出*/
	.bounceF{
		position: absolute;
		right: 1px;
		top: 169px;
		width: 410px;
		height: 540px;
		background: #fff;
		border-radius: 5px;
	}
	.job-transtion{
		border: 1px solid #E9E9E9;
		padding: 0 10px 10px 10px;
		overflow-y: scroll;
	}
	.conf-title{
		line-height: 45px;
		border-bottom: 1px solid #E9E9E9;
	}
	.conf-title button{
		margin-top: 6px;
	}
	.transHide{
		display: inline-block;
		width:15px;
		height: 80px;
		line-height: 80px;
		position: absolute;
		top: 180px;
		left: -15px;
		z-index: 100;
		color: #fff;
		font-size: 15px;
		background: rgba(0,0,0,0.6);
		/*border: 1px solid #E9E9E9;*/
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		cursor: pointer;
	}
	.bounce-enter-active{
		animation: bounce-in .5s;
	}
	.bounce-leave-active{
		animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in{
		from{right: -320px;}
		to{right: 0px;}
	}
	/*底部划出*/
	.toptobottom{
		position: absolute;
		left: 8.5%;
		bottom: 0;
		width: 83%;
		height: 440px;
		background: #fff;
		border-radius: 5px;
		padding: 0 32px;
		box-shadow: 0 0 5px rgba(0,0,0,0.5);
		overflow-y: scroll;
	}
	.code-title{
		line-height: 40px;
		border-bottom: 1px solid #e4e7ed;
	}
	.code-title button{
		margin: 6px 10px;
	}
	.tobottom-enter-active{
		animation: to-bottom .5s;
	}
	.tobottom-leave-active{
		animation: to-bottom .5s reverse;
	}
	@keyframes to-bottom{
		from{bottom: -440px;}
		to{bottom: 0px;}
	}

	/*右键弹出*/
	.right_click{
		position: absolute;
		background: #fff;
		width: 100px;
		text-align: center;
		box-shadow: 0 0 5px rgba(0,0,0,0.5);
	}
	.right_click li{
		line-height: 35px;
		border-bottom: 1px solid #e8e8e8;
		cursor: pointer;
	}
	/*节点样式*/
	#nodeCanvas{
		position: relative;
	}
	.s-node{
		position: absolute;
		text-align: center;
		min-width:100px;
		border: 1px solid #4cae4c;
		color: #fff;
		border-radius: 5px;
	}
	.s-node li.content{
		background-color: #5cb85c;
		padding: 0 10px;
		height: 50px;
		line-height: 50px;
	}
	.s-node li.content span.right{
		cursor: pointer;
		margin-left: 10px;
	}
	.s-node li.content span.right:hover{
		color: red;
	}
	.l-footer{
		height: 40px;
		line-height: 40px;
		display: flex;
	}
	.l-footer span{
		flex: 1;
		color:  #5cb85c;
		cursor: pointer;
	}
</style>
