<template>
	<div v-if="sparkdialog">
			<p class="code-title">
				<span>spark</span>			
				<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
				<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 			
			</p>
			<el-form :model="sparkItem"  ref="item">
				<p style="margin: 10px 0;border-bottom: 1px solid #e8e8e8;">
					<el-form-item prop="foldName"  label="上传jar包:" :label-width="formLabelWidth">
						<el-button icon="el-icon-upload" @click="uploadFj(0)" type="primary">上传文件</el-button>
						<span>{{fileName1}}</span>
					</el-form-item>
				</p>
				<div>
					<el-form-item prop="fileName" label="主类名称:" :label-width="formLabelWidth">
						<el-input v-model="sparkItem.mainClass" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item prop="fileName" label="自定义参数:" :label-width="formLabelWidth">
						<div v-for="(item,index) in paramsData">
							<el-input v-model="item.value" auto-complete="off"></el-input>
							<i @click="removeParam(index)" class="el-icon-remove remove"></i>
						</div>
						<div  @click="addParam" class="self-add">
							+ 添加
						</div>
					</el-form-item>
				</div>
				<div >	
					<el-form-item prop="foldName"  label="资源jar包:" :label-width="formLabelWidth">
						<el-button icon="el-icon-upload"  @click="uploadFj(1)" type="primary">上传文件</el-button>
						<span>{{fileName2}}</span>
					</el-form-item>
					<el-form-item prop="foldName"  label="配置资源包:" :label-width="formLabelWidth">
						<li class="selftr stitle"><span>GroupId</span><span>ArtifactId</span><span>Version</span></li>
							<li  class="selftr" v-for="(item,index) in setArry">
								<input v-model="item.groupId" auto-complete="off"></input>
								<input v-model="item.artifactId" auto-complete="off"></input>
								<input v-model="item.version" auto-complete="off"></input>
								<i  @click="removeSource(index)" class="el-icon-remove remove"></i>
							</li>
							<div  @click="addSource" class="self-add">
								+ 添加
							</div>
					</el-form-item>
					<el-form-item prop="foldName"  label="配置资源仓库:" :label-width="formLabelWidth">
						<li class="selftr stitle"><span>属性名称</span><span>仓库地址</span></li>
							<li  class="selftr" v-for="(item,index) in wareArry">
								<input v-model="item.name" auto-complete="off"></input>
								<input v-model="item.value" auto-complete="off"></input>
								
								<i  @click="removeWare(index)" class="el-icon-remove remove"></i>
							</li>
							<div  @click="addWare" class="self-add">
								+ 添加
							</div>
					</el-form-item>
					<el-form-item prop="foldName"  label="自定义配置:" :label-width="formLabelWidth">
						<li class="selftr stitle"><span>属性名称</span><span>属性值</span></li>
							<li  class="selftr" v-for="(item,index) in selfArry">
								<input v-model="item.name" auto-complete="off"></input>
								<input v-model="item.value" auto-complete="off"></input>
								<i  @click="removeSelf(index)" class="el-icon-remove remove"></i>
							</li>
							<div  @click="addSelf" class="self-add">
								+ 添加
							</div>
					</el-form-item>
					<el-form-item prop="fileName" label="详细日志输出:" :label-width="formLabelWidth">
						<el-switch v-model="sparkItem.log" ></el-switch>
					</el-form-item>
					<el-col :span="8">
						<el-form-item prop="fileName" label="executor的内核数:" :label-width="formLabelWidth">
							<el-input type="number" size="mini" v-model="sparkItem.core"></el-input>
						</el-form-item>
						</el-col>
						<el-col :span="8">
						<el-form-item prop="fileName" label="executor的个数:" :label-width="formLabelWidth">
								<el-input type="number" size="mini" v-model="sparkItem.num"></el-input>
						
						</el-form-item>
						</el-col>
						<el-col :span="8">
						<el-form-item prop="fileName" label="executor的内存大小:" :label-width="formLabelWidth">
							<el-input style="width: 45%;" type="number" size="mini" v-model="sparkItem.size"></el-input>
							<el-select style="width: 50%;" v-model="sparkItem.memory">
								<el-option label="MB" value="MB"></el-option>
								<el-option label="GB" value="GB"></el-option>
							</el-select>
						</el-form-item>
						</el-col>
						
				
				</div>
				
				
			</el-form>
			<el-dialog title="上传文件" :visible.sync="jarDialog" width="35%" >
			<el-upload
			  class="upload-demo text-center"
			  ref="upload"
			  action=""
			  drag
			  :http-request="uploadFile"
			  :multiple=true
			  
			  :auto-upload="false"
			  >
			  <i class="el-icon-upload"></i>
			  <div class="el-upload__text">
			  	<p> 将文件拖到此处，或<em>点击上传</em></p>
			  	<p>支持扩展名：.rar .zip .doc .docx .png .jpg...</p>
			  </div>
			 
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitUpload">上传到服务器</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {mapGetters, mapState, mapMutations} from 'vuex';
//	import { getProject,upJar } from "../../api/job";
	import {$http} from '../../assets/js/http';
	import { codemirror } from 'vue-codemirror'
  	import 'codemirror/mode/sql/sql.js'
  	import 'codemirror/theme/paraiso-light.css'
	export default{
		computed:{
			...mapState({
				selectNd:state =>state.nodes.activation,
				nodesAddtion:state =>state.nodes.nodes,
				bottomShow:state =>state.nodes.bottomShow,
				sparkdialog:state =>state.job.sparkdialog,
				taskId:state =>state.job.taskId,
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
				formLabelWidth:'150px',
				sparkItem:{},
				jarDialog:false,
				setArry:[],
				paramsData:[],
				wareArry:[],
				selfArry:[],
				fileName1:'',
				fileName2:''
			}
		},
		components:{codemirror},
		methods:{
			removeSource(index){
				this.setArry.splice(index,1)
			},
			addSource(){
				this.setArry.push({
					value:''
				})
			},
			addParam(){
				this.paramsData.push({
					value:''
				})
			},
			removeParam(index){
				this.paramsData.splice(index,1)
			},
			addWare(){
				this.wareArry.push({
					value:''
				})
			},
			removeWare(index){
				this.wareArry.splice(index,1)
			},
			addSelf(){
				this.selfArry.push({
					value:''
				})
			},
			removeSelf(index){
				this.selfArry.splice(index,1)
			},
			//上传文件
			uploadFile(param){
				let that = this;
				console.log(param.file)
				var formData = new FormData()	
				formData.append('attachments',param.file)
				formData.append('taskId',that.taskId)
				formData.append('jobType','spark')	
				upJar(formData).then(res => {	 
						if(res.data.code==0){
							that.$alert('上传成功')
							if(that.jarIndex ==0){
								that.fileName1 = param.file.name
							}else{
								that.fileName2 = param.file.name
							}
							
						}else {
							that.$alert(res.data.message)
						}
					}).catch(function(err){
						console.log(err)
					})
			},
			submitUpload(){
				this.$refs.upload.submit()
			},
			//上传附件
			uploadFj(index){
				this.jarDialog = true
				this.jarIndex = index
			},
			uploadSource(){
				this.sourcejarDialog = true
			},
			cancel(){
				this.jarDialog = false
			},
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/spark',false)
			},
			saveCode(){
				var pData = this.paramsData;
				var sparkNode = this.sparkItem;
				var params = []
				for(var p of pData ){
					params.push(p.value)
				}
				var zy = []
				for(var z of this.setArry ){
					zy.push(z.groupId+':'+z.artifactId+':'+z.version)
				}
				var ware = []
				for(var w of this.wareArry){
					ware.push(w.value)
				}
				var conf = []
				for(var c of this.selfArry){
					conf.push(c.value)
				}
				var javaData = {
					"job.class":sparkNode.mainClass,
					"main.args":params,
					"packages":zy,
					"repositories":ware,
					"conf":conf,
					"verbose":sparkNode.log,
					"executor.cores":sparkNode.core,
					"executor.num":sparkNode.num,
					"executor.memory":sparkNode.size+sparkNode.memory,
				}
//				let id =  this.selectNd.id
				this.selectNd.get('model').data =JSON.stringify(javaData);
				//把数据保存在节点中
//				for (var i = 0;i<this.nodesAddtion.length;i++) {
//					if(this.nodesAddtion[i].id === id){
//						this.nodesAddtion[i].data = JSON.stringify(javaData)
//						break;
//					}
//				}
				this.canceljobEditor()
			}
		},
		beforeMount () {
			// 挂载前请求表格数据
		}
	}
</script>

<style scoped="scoped">

	.code-title{
		line-height: 40px;
		border-bottom: 1px solid #e4e7ed;
	}
	.code-title button{
		margin: 6px 10px;
	}
	.el-input{
		width: 85%;
	}
	.add{
		font-size: 20px;
		color: #409eff;
	}
	.self-val{
		position: relative;
	}
	.remove{
		font-size: 20px;
		color: #f56c6c;
		
	}
	.el-table th{
		padding: 0;
	}
	.el-table__empty-block{
		min-height: 35px;
	}
	.edit-input{
		width: 100%;
		border: none;
	}
	.self-add{
		width: 85%;
		line-height: 30px;
		text-align: center;
		border: 1px dashed #969896;
		margin-top: 10px;
		cursor: pointer;
	}
		.selftr{
		line-height: 30px;
		border: 1px solid #e8e8e8;
		display: flex;
		position: relative;
		width: 85%;
	}
	.stitle span{
		background: #e8e8e8;
		
	}
	.selftr span{
		flex: 1;
		text-align: center;
	}
	.selftr input{
		flex: 1;
		border: none;
		line-height: 30px;
		border-right: 1px solid #e8e8e8;
	}
</style>