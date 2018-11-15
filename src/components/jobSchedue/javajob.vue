<template>
	<div v-if="javadialog">
			<p class="code-title">
				<span>java</span>			
				<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
				<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 			
			</p>
		<h3>自定义配置数据部门</h3>
	</div>
</template>

<script>
	import {mapGetters, mapState, mapMutations} from 'vuex';

	export default{
		computed:{
			...mapState({

				javadialog:state =>state.job.javadialog,

			})
		},

		data(){
			return{
		
			}
		},
		methods:{
			
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/hadoopJava',false)
			},
			saveCode(){
			
				var javaData = {
					"job.class":javaNode.mainClass,
					
				}
				let id =  this.selectNd
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