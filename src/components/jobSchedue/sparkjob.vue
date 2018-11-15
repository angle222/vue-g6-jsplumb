<template>
	<div v-if="sparkdialog">
			<p class="code-title">
				<span>spark</span>			
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
				sparkdialog:state =>state.job.sparkdialog,
			})
		},

		data(){
			return{
	
			}
		},

		methods:{
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/spark',false)
			},
			saveCode(){
		
				var javaData = {
					data:''
				}
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