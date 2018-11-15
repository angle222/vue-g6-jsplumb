<template>
	<div v-if="hivedialog">
		<el-row>
			<el-col :span="8">
				<div class="grid-content">
					<el-tabs v-model="bottomActiveName" @tab-click="hqlClick">
						<el-tab-pane label="函数列表" name="first">
							<el-tree :data="funData"
							:expand-on-click-node="false"
								lazy
							:load = "nodeLoad"
							>
								<span class="custom-tree-node" slot-scope='{node,data}'>
									<el-popover v-if="node.level>1" 
										@show="hoverShow(node)"
										placement="right-start"
										width="300" 
										trigger="hover"
										>
										<div class="func">
											<div class="con"><span>描述</span>
												<p>{{hoverContent.description}}</p>
											</div>
											<div class="con"><span>Function参数说明</span>
												<p>{{hoverContent.signature}}</p>
												<span>返回值</span>
												<p>{{hoverContent.returnType}}</p>
											</div>
										</div>
										<span slot="reference" @click="nodeClick(node)">{{node.label}}</span>
									</el-popover>
									<span v-else @click="nodeClick(node)">{{node.label}}</span>
								</span>		
							</el-tree>
						</el-tab-pane>
						<el-tab-pane label="数据库表" name="second">
							<el-tree :data="treeData"
								  	:expand-on-click-node="false">
							<span class="custom-tree-node" slot-scope='{node,data}'>
								<span>{{node.label}}</span>
								<span class="tree-node">
									<!--<el-button type='text' size="mini" @click="()=>remove(node,data)">
									  	删除
									</el-button>-->
								</span>
							</span>	
							</el-tree>
						</el-tab-pane>
						<el-tab-pane label="已存脚本" name="third">
							<li class="saveHql" v-for="(item,index) in savedHqls"><span>{{item.hql}}</span><span>{{item.executeTime}}</span></li>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
			<el-col :span="16">
				<div class="grid-content">
					<div class="code-mirror">
						<p class="code-title"><span>Hive</span>
							<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
							<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 
						</p>
						<div class="my-codemirror">
							<p>
								<span v-show="!isExecute" @click="executeCode" class="el-icon-caret-right">运行</span>
								<span v-show="isExecute"  class="stop"><i class="stop"></i> 停止</span>
							</p>
							<codemirror v-model="code" :options="cmOption"></codemirror>
							<div class="log" v-show="logShow">
									<p>执行结果</p>
						  		<div class="exe1" v-show="errorCode == 0">
						  			<li class="li-result li-th"><span v-for="(title,index) in exeTitleData">{{title}}</span> </li>
										<div v-for="(item,index) in exeData">
											<li class="li-result"><span v-for="(obj,cindex) in item">{{obj}}</span></li>
										</div>
						  		</div>
						  		<div v-show="errorCode == 1">
						  			<div class="error" v-for="(item,index) in exeData">{{item}}</div>
						  		</div>
							</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {mapGetters, mapState, mapMutations} from 'vuex';
//	import { getProject,startCode,stopCode} from "../../api/job";
//	import {getHiveData, funDetail,funList,childFunList,getCommand,executeCommand } from "../../api/dataInterge";
	import {$http} from '../../assets/js/http';
	import { codemirror } from 'vue-codemirror'
  	import 'codemirror/mode/sql/sql.js'
  	import 'codemirror/theme/paraiso-light.css'
	export default{
		computed:{
			...mapState({
				selectNd:state =>state.nodes.selectNd,
				nodesAddtion:state =>state.nodes.nodes,
				bottomShow:state =>state.nodes.bottomShow,
				hivedialog:state =>state.job.hivedialog,
			})
		},
		watch:{
			bottomShow:function(newval,oldval){
				if(newval){
					this.code = ''
				}
			}
		},
		data(){
			return{
				treeData:[],
		       funData:[],
		       code:'',
				cmOption: {
			          tabSize: 4,
			          styleActiveLine: true,
			          lineNumbers: true,
			          line: true,
			          mode: 'text/x-mysql',
			          theme: 'paraiso-light'
			       },
			       bottomActiveName:"first",
			       isExecute:false,
			       logShow:false,
			       logContent:[],
			       savedHqls:[],
			       errorCode: -1,
			       exeTitleData:[],
			       exeData:[],
			       hoverContent:'暂无介绍'
			}
		},
		components:{codemirror},
		methods:{
			...mapMutations('nodes',['saveNodes']),
			//保存脚本
			saveCode(){
				let _this = this
				let id =  _this.selectNd.id
				for (var i = 0;i<_this.nodesAddtion.length;i++) {
					if(_this.nodesAddtion[i].id === id){
						_this.nodesAddtion[i].data = _this.code
						break;
					}
				}
				//底部弹框消失
				this.canceljobEditor()
				
			},
			showLog(){
				this.logShow = !this.logShow
			},
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/hive',false)
			},
			//执行脚本
			executeCode(){
				let that = this;
				let hiveSql = that.code.replace(/\n/g,'').split(';')
				if(hiveSql[hiveSql.length-1]==''){
					hiveSql.pop()
				}
				that.isExecute = true
				executeCommand(hiveSql).then(res => {
					that.isExecute = false
					that.logShow = true;
					if(res.data.code == 0){
						that.errorCode = 0
						if(res.data.data.length<=0){
							that.exeData = [];
							that.errorCode = 1;
							that.exeData.push('暂无数据')
							return false
						}
						that.exeTitleData = Object.keys(res.data.data[0])
						var b = []
						for(var i = 0;i<res.data.data.length;i++){
							var a = []
							for(var exekey in res.data.data[i]){
								a.push(res.data.data[i][exekey])
							}
							b.push(a)
						}
//						console.log(b)
						that.exeData = b
					}else{
						that.exeData = [];
						that.errorCode = 1;
						that.exeData.push(res.data.message)
					}
				}).catch(function(err){
					console.log(err)
				})
			},
			//获取表
			getTreeData () {
				let that = this;
				getHiveData().then(res => {
					var data = []
					for(var i = 0;i<res.data.length;i++){
						var obj = res.data[i]
						for(var k in obj){
							var o = {label:k,children:[]}
							for(var j = 0;j < obj[k].length;j++){
								o.children.push({label:obj[k][j]})								
							}
							data.push(o)
						}	
					}
					that.treeData = data	
				}).catch(function(err){
					console.log(err)
				})
			},
			//获取函数
			getfunTreeData () {
				let that = this;
				funList().then(res => {
//					console.log(res.data)
					let fun = res.data.data//统计函数
					var data = [];
					for(var j in fun){
						for(var b of fun[j]){
								var o = {
									id:j,
									label:b,
									children:[]
								}
								data.push(o)
							}
					}
//					console.log(data)
					that.funData = data	
				}).catch(function(err){
					console.log(err)
				})
			},
			//查询已存脚本
			querySave(){
				let that = this;
				getCommand().then(res => {
					that.savedHqls = res.data.data
				}).catch(function(err){
					console.log(err)
				})
			},
			hqlClick(tab,event){
				if(tab.name=='first'){
					this.getfunTreeData()
				}else if(tab.name=='second'){
					this.getTreeData()
				}else if(tab.name=='third'){
					this.querySave()
				}
			},
			nodeLoad(node,resolve){
				
				if(node.level==0){
					return false
				}
				if(node.level>1){
					return	resolve([]);
				}
				var postData = {
					mainType:node.data.id,
					subType:{
						subType:node.data.label
					}
				}
				
				//添加子节点
				childFunList(postData).then(res => {
					let tj = res.data.data
					if(tj.length>0){
					let newChild = []
					for(var a of tj){
						let o = {
							id:a.id,
							label:a.funName
						}
						newChild.push(o)
					}
					resolve(newChild)
					}
				}).catch(function(err){
					console.log(err)
				})
			},
			hoverShow(node){
				funDetail(node.id).then(res => {
					this.hoverContent=res.data.data
				}).catch(function(err){
					console.log(err)
				})
			},
			nodeClick(node){
				if(node.level>1){
					this.code = node.data.label
				}
			},
		
			//上传附件
			uploadFj(){
				this.$store.commit('job/filedialog',true)
			}
		},
		beforeMount () {
//			this.getfunTreeData()
//			this.getTreeData()    // 挂载前请求表格数据
		}
	}
</script>

<style scoped="scoped">
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
		/**/
	.my-codemirror{
		width: 100%;
		height: 400px;
		position: relative;
	}
	.my-codemirror p{
		line-height: 40px;
	}
	.my-codemirror p span{
		margin: 0 10px;
		cursor: pointer;
	}
	.log{
		border: 1px solid #E8E8E8;
		width: 100%;
		overflow-y: scroll;
		padding: 5px;
    background: #fff;
	}
	.log li{
		line-height: 28px;
	}
	i.stop{
		display: inline-block;
		width: 10px;
		height: 10px;
		background: #F56C6C;
	}
	.stop{
		color: #F56C6C;
	}
.log p{
	line-height: 20px;
	border-left: 5px solid #1890FF;
	padding-left: 5px;
	margin: 10px 0;
	
}
.li-result{
	display: flex;
	line-height: 30px;
	border-bottom: 1px solid #E8E8E8;
}
.li-result span{
	flex: 1;
	text-align: center;
	min-width: 100px;
}
	.li-th{
	line-height: 40px;
	border-top: 1px solid #E8E8E8;
}
.li-th span{
	font-size: 18px;
	font-weight: bold;
	min-width: 100px;
}
.error{
	color: red;
	
}
.exe1{
	overflow-x: auto
}
.con span{
	line-height: 40px;
	font-size: 16px;
	font-weight: bold;
	color: #409EFF;
}
.con p{
	padding: 0 10px;
	line-height: 40px;
	background: #f5f5f5;
}
</style>