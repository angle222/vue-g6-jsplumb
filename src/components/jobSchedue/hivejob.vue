<template>
	<div v-if="hivedialog">
		<p class="code-title"><span>Hive</span>
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

				hivedialog:state =>state.job.hivedialog,
			})
		},

		data(){
			return{

			}
		},

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

			canceljobEditor(){
				this.$store.commit('nodes/bottomShow',false)
				this.$store.commit('job/hive',false)
			},
			
		},
		beforeMount () {

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