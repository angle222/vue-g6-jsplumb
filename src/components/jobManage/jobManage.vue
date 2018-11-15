<template>
	<div id="flowChart">
		<div class="left" style="position: absolute;z-index: 99;top: 77px;">
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
		<div class="operating">
			<!--<div class="btn-group">
				<div class="btn" @click="addCircle" title="起始节点"> <i class="iconfont icon-yuancircle46"></i> </div>
				<div class="btn" @click="addRect" title="常规节点"> <i class="iconfont icon-juxing"></i> </div>
				<div class="btn" @click="addRhombus" title="条件节点"> <i class="iconfont icon-lingxing"></i> </div>
			</div>
			<div class="btn-group">
				<div class="btn" @click="addLine" title="直线"> <i class="iconfont icon-line"></i> </div>
				<div class="btn" @click="addSmooth" title="曲线"> <i class="iconfont icon-quxian"></i> </div>
				<div class="btn" @click="addArrowLine" title="箭头直线"> <i class="iconfont icon-one-line-arrow"></i> </div>
			
			</div>-->
			<div class="btn-group">
				<div class="btn" @click="addArrowSmooth" title="箭头曲线"> <i class="iconfont icon-quxianjiantou"></i> </div>
				<div class="btn" @click="changeMode('edit')" title="选择模式"> <i class="iconfont icon-shubiao"></i> </div>
				<div class="btn" @click="changeMode('drag')" title="拖拽模式"> <i class="iconfont icon-tuozhuai"></i> </div>
				<div class="btn" @click="del" style="margin-top: 5px;" title="删除"> <i class="el-icon-delete"></i> </div>
			</div>
			<div class="btn-group">
				
				<div class="btn" @click="save" title="保存"> <i class="iconfont icon-baocun"></i> </div>
			</div>
			<div class="btn-group">
				<el-input size="mini" v-model="workflowName" placeholder="请输入流图名称..."></el-input>
			</div>
		</div>
		<div class="info" v-show="bottomShow">
			<div class="title"> <span>{{infoTitle}}属性</span> <span class="right">取消</span></div>
			<div class="content">
				<el-checkbox v-if="isBlank === true" v-model="checked">网格对齐</el-checkbox>
				<el-form  v-else label-position="left" label-width="60px">
					 <el-form-item v-if="isNode === true" label="名称">
            <el-input ref="inputFocus" size="mini" v-model="name"></el-input>
          </el-form-item>
					<comjob></comjob>
					<javajob></javajob>
					<hivejob></hivejob>
					<sparkjob></sparkjob>
				</el-form>
				<!--<el-form v-else label-position="left" label-width="60px">
				
					<el-form-item label="颜色">
						<el-color-picker v-model="color"></el-color-picker>
					</el-form-item>
				</el-form>-->
			</div>
		</div>
	</div>
</template>
<script>
	import {mapGetters, mapState, mapMutations} from 'vuex';
  import router from "../../router/router"
  import comjob from './comjob'
  import javajob from './javajob'
  import hivejob from './hivejob'
  import sparkjob from './sparkjob'
	export default {
		name: "index",
		components: {javajob,hivejob,sparkjob,comjob},
		mounted() {
			
			this.initG6();
		},
		computed:{
			...mapState({
				bottomShow:state =>state.nodes.bottomShow
				
			}),
			activation:{
				 get: function () {
		      return this.$store.state.nodes.activation
		    },
		    set: function (newValue) {
			    this.$store.state.nodes.activation = newValue
			  }
			}
			
		},
		
		data() {
			return {
				action: '',
				
				workflowName:'',
				nodeType: 0,
				color: '',
				net: '',
				Util: '',
				name:'',
				isNode: false, //当前是节点 
				isBlank: true, //当前是空白区 
				checked: true, //网格对齐 
				infoTitle: '画布', //属性标题 
				oldColor: '', //获取节点本身颜色 
				type: '', //有值为编辑状态 
				nodeData:null
			}
		},
		methods: {
			initG6() {
				let self = this;
				self.Util = G6.Util;
				let grid;
				if(self.checked) {
					grid = {
						forceAlign: true, // 是否支持网格对齐
						cell: 25, // 网格大小 
					};
				} else {
					grid = null;
				}
				self.net = new G6.Net({
					id: 'flowChart', // 容器ID 
					mode: 'edit',
					grid: grid,
					/*width: 500, // 画布宽*/
					height: window.innerHeight // 画布高 
				});
				/*self.net.tooltip({ title: '信息', // @type {String} 标题 split: ':', // @type {String} 分割符号 dx: 0, // @type {Number} 水平偏移 dy: 0 // @type {Number} 竖直偏移 });*/
				/** *点击空白处 */
				self.net.on('click', (ev) => {
					if(!self.Util.isNull(ev.item)) {
						self.isBlank = false
					} else {
						self.isBlank = true;
						self.infoTitle = '画布'
					}
					self.$store.commit('nodes/bottomShow',false);
				}); /** *点击节点 */
				self.net.on('itemclick', function(ev) {
					self.isNode = self.Util.isNode(ev.item); //是否为Node 
					self.activation = ev.item;
					if(self.isNode) { /* 激活节点后节点名称input聚焦*/
						self.$store.commit('nodes/selectNodes',ev.item)
						self.$nextTick(() => {
							self.$refs.inputFocus.$el.querySelector('input').focus();
						});
						self.infoTitle = '节点';
						self.$store.commit('nodes/bottomShow',true);
						self.$store.commit('job/'+ev.item.get('model').nodeType,true);
						console.log(ev.item.get('model').data)
						if(ev.item.get('model').data){
							self.nodeData = ev.item.get('model').data
						}
						self.name = ev.item.get('model').label;
						self.nodeType = ev.item.get('model').nodeType;
					} else {
						self.infoTitle = '边';
						self.action = ev.item.get('model').action;
					}
					self.color = self.oldColor;
				}); /** * 鼠标移入移出事件改变颜色 */
				self.net.on('itemmouseenter', ev => {
					const item = ev.item;
					self.oldColor = item.get('model').color; //获取节点颜色 
					self.net.update(item, {
						color: '#108EE9',
					});
					self.net.refresh();
				});
				self.net.on('itemmouseleave', ev => {
					const item = ev.item;
					self.net.update(item, {
						color: self.oldColor
					});
					self.net.refresh();
				}); /** * 提示信息 */
				/* self.net.node().tooltip(['label', 'func', 'role', 'color']); self.net.edge().tooltip(['label', 'color']);*/
				/** * 渲染 */
				/*self.net.source(self.nodes, self.edges);*/ //加载资源数据 
				self.net.render();
			},
			createNode(name,type){
				var text = type;
				let data = this.net.save();
				console.log(data.source.nodes)
				let count = 0
    		for(var k = 0;k<data.source.nodes.length;k++){
    			if(data.source.nodes[k].nodeType == type){
    				count++
    			}
    		}
    		if(count>0){
    			text += count
    		}
				this.net.beginAdd('node', {
					shape: 'rect',
					nodeType: type,
					id:text,
					label:text
				})
			},
			addCircle() {
				this.net.beginAdd('node', {
					shape: 'circle',
					nodeType: 0
				})
			}, 
			//添加起始节点
			addRect() {
				this.net.beginAdd('node', {
					shape: 'rect',
					nodeType: 0
				})
			}, 
//			添加常规节点
			addRhombus() {
				this.net.beginAdd('node', {
					shape: 'rhombus',
					nodeType: 0
				})
			},
			//添加条件节点
			addLine() {
				this.net.beginAdd('edge', {
					shape: 'line'
				});
			}, 
			//添加直线
			addSmooth() {
				this.net.beginAdd('edge', {
					shape: 'smooth'
				})
			}, 
			//添加曲线
			addArrowSmooth() {
				this.net.beginAdd('edge', {
					shape: 'smoothArrow'
				})
			},
			//添加箭头曲线
			addArrowLine() {
				this.net.beginAdd('edge', {
					shape: 'arrow'
				});
			}, //添加箭头直线 
			addPolyLine() {
				this.net.beginAdd('edge', {
					shape: 'polyLineFlow'
				});
			}, //添加折线 
			changeMode(mode) {
				this.net.changeMode(mode)
			}, //拖拽与编辑模式的切换
			del() {
				this.net.del()
			}, //删除 
			save() { /* 验证流图名称*/
				if(this.workflowName !== '') {
					let data = this.net.save();
					console.log(this.net);
					if(data.source.nodes.length === 0) {
						this.$message({
							type: 'error',
							message: '流图内容不能为空'
						});
						return false
					} /* 验证节点名称*/
					for(let item of data.source.nodes) {
						if(item.label === '' || item.label === null || item.label === undefined) {
							this.$message({
								type: 'error',
								message: '节点名称不能为空'
							});
							return false
						}
					}
					data.source['name'] = this.workflowName; /*let json = JSON.stringify(data, null, 2);*/
					console.log(data);
					this.$emit('saveData', data.source, this.type);
				} else {
					this.$message({
						type: 'error',
						message: '流图名称不能为空'
					})
				}
				
			}, //保存 
			update() {
				console.log(this.activation.get('type'))
				
				if(this.activation.get('type') === 'node') {
					this.net.update(this.activation, {
						label: this.name,
						nodeData: this.nodeData,
						nodeType: this.nodeType,
						color: this.color
					});
				} else { /* 根据ID取出label*/
					//线
					let label = this.actionList.map(item => {
						if(item.id === this.action) {
							return item.label
						}
					}).join('');
					this.net.update(this.activation, {
						label: label,
						color: this.color,
						action: this.action
					});
				}
			}, //更新节点
			clearView() {
				this.type = '';
				this.workflowName = '';
				this.net.changeData()
			}, //清空视图 
			source(nodes, edges, name, type) {
				this.type = type;
				this.workflowName = name;
				this.net.changeData(nodes, edges)
			}, //更新数据 
		},
		watch: { /** * 监听输入框 */
			action: function() {
				this.update()
			},
			name: function() {
				this.update()
			},
		
			nodeType: function() {
				this.update()
			},
			color: function() {
				this.update()
			},
			/** * 网格切换 */
			checked: function() {
				let _saveData = this.net.save();
				this.net.destroy(); //销毁画布
				this.initG6();
				this.net.read(_saveData);
				this.net.render()
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	#flowChart {
		border: 1px solid #ebeef5;
		position: relative;
		overflow: hidden;
	}
	
	.operating {
		position: absolute;
		left: 0px;
		z-index: 99;
		background-color: #ffffff;
		padding: 20px 10px;
		box-shadow: 1px 1px 4px 0 #0a0a0a2e;
	}
	
	.info {
		position: absolute;
		bottom: 0px;
		z-index: 99;
		box-shadow: 1px 1px 4px 0 #0a0a0a2e;
		width: 100%;
		background: #f5f5f5;
		.title {
			height: 40px;
			padding-left: 10px;
			border-top: 1px solid #DCE3E8;
			border-bottom: 1px solid #DCE3E8;
			border-left: 1px solid #DCE3E8;
			background: rgb(235, 238, 242);
			line-height: 40px;
			span {
				font-size: 14px;
			}
		}
		.content {
			background: rgba(247, 249, 251, 0.45);
			width: 100%;
			height: 500px;
			border-left: 1px solid #E6E9ED;
			padding: 10px;
			overflow-y: scroll;
		}
	}
	
	.btn-group {
		border-right: 1px solid #efefef;
		display: inline-block;
		padding-left: 10px;
		padding-right: 14px;
		&:last-of-type {
			border-right: 0;
		}
		.btn {
			display: inline-block;
			margin: 2px;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			cursor: pointer;
			border: 1px solid rgba(233, 233, 233, 0);
			i {
				font-size: 20px;
			}
			&:hover {
				border: 1px solid #E9E9E9;
				color: #767A85;
				border-radius: 2px;
				background: #FAFAFE;
			}
		}
		.el-form-item {
			margin-bottom: 0 !important;
		}
	}
</style>