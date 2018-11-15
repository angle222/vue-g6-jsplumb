<template>
	<div v-if="commanddialog">
		<p class="code-title"><span>脚本测试</span>
							
							<el-button class="right" type="primary" size="mini" @click="canceljobEditor">取消</el-button> 
							<el-button @click="saveCode" class="right" plain size="mini">确定</el-button> 
							<!--<a style="font-size: 14px;color: #0c9fe3;line-height: 40px;cursor: pointer;text-decoration: none;" class="right" @click="uploadFj"> <i class="el-icon-info"></i> 如果有附件，请先上传附件</a>-->
						</p>
	<h3>自定义配置数据部分</h3>
	</div>
</template>

<script>
	import {mapGetters, mapState, mapMutations} from 'vuex';

	export default{
		computed:{
			...mapState({
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
				
			}
		},
	
		methods:{
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
//				this.bottomShow = false
				this.$store.commit('nodes/bottomShow',false)
			},
			
			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/command',false)
			},
			
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