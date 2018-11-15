<template>
	<div v-if="commanddialog">
		<el-row>
			<el-col :span="8" v-if="false">
				<div class="grid-content">
					<el-tabs v-model="bottomActiveName">
						<el-tab-pane label="函数列表" name="first">
							<el-tree :data="funData"
							:expand-on-click-node="false"
							@node-click = "nodeClick"
							>
								<span class="custom-tree-node" slot-scope='{node,data}'>
									<span>{{node.label}}</span>
									<span class="tree-node">
										<el-button type='text' size="mini" @click="()=>remove(node,data)">
										  	删除
										</el-button>
									</span>
								</span>	
							</el-tree>
						</el-tab-pane>
						<el-tab-pane label="表列表" name="second">
							<el-tree :data="treeData"
								  	:expand-on-click-node="false"
								  	
								  	>
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
					</el-tabs>
				</div>
			</el-col>
			<el-col :span="24">
				<div class="grid-content">
					<div class="code-mirror">
						<p class="code-title"><span>脚本测试</span>
							
							<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
							<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 
							<!--<a style="font-size: 14px;color: #0c9fe3;line-height: 40px;cursor: pointer;text-decoration: none;" class="right" @click="uploadFj"> <i class="el-icon-info"></i> 如果有附件，请先上传附件</a>-->
						</p>
						<div class="my-codemirror">
							<p>
								<span v-show="!isExecute" @click="executeCode" class="el-icon-caret-right">运行</span>
								<span v-show="isExecute"  @click="stopexeCode" class="stop"><i class="stop"></i> 停止</span>
								<span v-show="!logShow"  @click="showLog">显示日志</span>
								<span v-show="logShow" @click="showLog">隐藏日志</span>
							</p>
							<div style="border: 1px solid #E8E8E8; height: 302px;">
								
							
							<codemirror v-model="code" :options="cmOption"></codemirror>
							</div>
							<div class="log" v-show="logShow">
								<li v-for="(item,index) in logContent">{{item}}</li>
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
//	import { getProject,startCode,stopCode } from "../../api/job";
//	import { funList,childFunList,getHiveData } from "../../api/dataInterge";
	import {$http} from '../../assets/js/http';
	import { codemirror } from 'vue-codemirror'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/theme/eclipse.css'
	export default{
		computed:{
			...mapState({
				selectNd:state =>state.nodes.activation,
				nodesAddtion:state =>state.nodes.nodes,
				bottomShow:state =>state.nodes.bottomShow,
				commanddialog:state =>state.job.commanddialog,
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
			          theme: 'eclipse'
			       },
			       bottomActiveName:"first",
			       isExecute:false,
			       logShow:false,
			       logContent:[]
			}
		},
		components:{codemirror},
		methods:{
			...mapMutations('nodes',['saveNodes']),
			//保存脚本
			saveCode(){
				let _this = this
				let id =  _this.selectNd.id
				
				_this.selectNd.get('model').data = _this.code;
				console.log(_this.selectNd.get('model'))
//				for (var i = 0;i<_this.nodesAddtion.length;i++) {
//					if(_this.nodesAddtion[i].id === id){
//						_this.nodesAddtion[i].data = _this.code
//						break;
//					}
//				}
				//底部弹框消失
//				this.bottomShow = false
				this.$store.commit('nodes/bottomShow',false)
			},
			showLog(){
				this.logShow = !this.logShow
			},
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/command',false)
			},
			//执行脚本
			executeCode(){
				let that = this;
				var obj = {
					command:that.code
				}
				that.logContent = [];
				that.isExecute = true
				startCode(obj).then(res => {
					that.isExecute = false
				
					if(res.data.code == 0){
							that.logShow = true
						var str1 = res.data.data.split('\n')
						that.logContent = str1
					}else{
						that.$alert(res.data.message)
					}
					
				}).catch(function(err){
						console.log(err)
				})
			},
			//停止脚本
			stopexeCode(){
				let that = this;
				var obj = {
					command:that.code
				}
				stopCode().then(res => {
					that.isExecute = false
					if(res.data.code == 0){
						that.$alert('操作成功')
					}else{
						that.$alert(res.data.message)
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
			getfunTreeData () {
				let that = this;
				funList().then(res => {
					console.log(res.data)
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
					
					console.log(data)
					that.funData = data	
				}).catch(function(err){
					console.log(err)
				})
			},
			nodeClick(obj,node,component){
				var postData = {
					mainType:obj.id,
					subType:{
						subType:obj.label
					}
				}
				//添加子节点
				childFunList(postData).then(res => {
					console.log(res.data.data)
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
					obj.children = newChild
					}
				}).catch(function(err){
					console.log(err)
				})
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
		width: 300px;
		height: 100%;
		overflow-y: scroll;
		padding: 0 5px;
		position: absolute;
		right: 0;
		top: 0;
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
</style>