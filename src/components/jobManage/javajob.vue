<template>
	<div v-if="javadialog">
			<p class="code-title">
				<span>java</span>			
				<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
				<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 			
			</p>
			<el-form :model="javaItem" ref="item">
				<p style="margin: 10px 0;border-bottom: 1px solid #e8e8e8;">
					<el-form-item prop="foldName"  label="上传jar包:" :label-width="formLabelWidth">
						<el-button icon="el-icon-upload" @click="uploadFj" type="primary">上传文件</el-button>
					</el-form-item>
				</p>
				<div>
					<el-col :span="12">
						<el-form-item prop="fileName" label="主类名称:" :label-width="formLabelWidth">
							<el-input v-model="javaItem.mainClass" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item prop="fileName" label="结果重写:" :label-width="formLabelWidth">
							<el-switch v-model="javaItem.rewrite"></el-switch>
						</el-form-item>
						
					</el-col>
					<el-col :span="12">
						<el-form-item prop="fileName" label="method.run:" :label-width="formLabelWidth">
							<el-input v-model="javaItem.run" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item prop="fileName" label="method.cancel:" :label-width="formLabelWidth">
							<el-input v-model="javaItem.cancel" auto-complete="off"></el-input>
						</el-form-item>
						
					</el-col>
				</div>
				<div style="padding-bottom:10px;margin-bottom:10px;border-bottom: 1px solid #E8E8E8;">	
					<label for="">用户自定义参数:</label>
					<el-table size="mini" :data="userData" border style="width: 70%;margin-left: 150px;">
							<el-table-column label="属性名称" width="">
								<template slot-scope="scope">
									<el-input class="edit-input" v-model="scope.row.attrName"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="属性值" width="">
								<template slot-scope="scope">
									<div class="self-val">
										<el-input class="edit-input" v-model="scope.row.attrValue"></el-input>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="" width="40">
								<template slot-scope="scope">
									<i @click="removeSource(scope.row.index)" class="el-icon-remove remove"></i>
								</template>
							</el-table-column>
					</el-table>
					<div  @click="addSource" class="self-add">
						+ 添加
					</div>
				</div>
				<el-form-item prop="fileName" label="security.manager.class:" :label-width="formLabelWidth">
					<el-input v-model="javaItem.manager" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<el-dialog title="上传文件" :visible.sync="jarDialog" width="35%" >
			<el-upload
			  class="upload-demo text-center"
			  ref="upload"
			  action=""
			  drag
			  :http-request="uploadFile"
			  :multiple="true"
			  
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
//	import { getProject ,upJar} from "../../api/job";
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
				javadialog:state =>state.job.javadialog,
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
				javaItem:{},
				jarDialog:false,
				userData:[]
			}
		},
		components:{codemirror},
		methods:{
			removeSource(index){
				this.userData.splice(index,1)
			},
			addSource(){
				this.userData.push({
					value:''
				})
			},
				//上传文件
			uploadFile(param){
				let that = this;
				var formData = new FormData()	
				formData.append('attachments',param.file)
				formData.append('taskId',that.taskId)
				formData.append('jobType','hadoopJava')	
				upJar(formData).then(res => {	 
						if(res.data.code==0){
							that.$alert('上传成功')
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
			uploadFj(){
				this.jarDialog = true
			},
			cancel(){
				this.jarDialog = false
			},
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/hadoopJava',false)
			},
			saveCode(){
				var javaNode = this.javaItem;
				var javaTableData = this.userData;
				var newJt = []
				for(var jt of javaTableData ){
					newJt.push(jt.attrName+'='+jt.attrValue)
				}
				var javaData = {
					"job.class":javaNode.mainClass,
					"method.run":javaNode.run,
					"method.cancel":javaNode.cancel,
					"security.manager.class":javaNode.manager,
					"main.args":newJt,
				}
				let id =  this.selectNd.id
				//把数据保存在节点中
				for (var i = 0;i<this.nodesAddtion.length;i++) {
					if(this.nodesAddtion[i].id === id){
						this.nodesAddtion[i].data = JSON.stringify(javaData)
						break;
					}
				}
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
		width: 50%;
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
		width: 70%;
		line-height: 30px;
		text-align: center;
		border: 1px dashed #969896;
		margin-left: 150px;
		cursor: pointer;
	}
</style>