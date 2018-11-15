<template>
	<div class="root">
		<el-container>
		  <el-aside :width="width" v-bind:style="{'min-height': canvas.height+145 + 'px' }">
		  	<h3 class="header">logo</h3>
		  	<el-menu default-active="1-4-1"
		  		class="el-menu-vertical-demo"
		  		:collapse="isCollapse"
		  		background-color="#001529"
      		text-color="#fff"
      		active-text-color="#ffd04b"
		  		 >
				  <el-submenu index="1">
				    <template slot="title">
				      <i class="el-icon-location"></i>
				      <span slot="title">导航一</span>
				    </template>
				    <el-menu-item-group>
				      <span slot="title">分组一</span>
				      <el-menu-item index="1-1">
				      	<router-link tag="span" to="jobManage">antv-g6</router-link>
				      </el-menu-item>
				     	<el-menu-item index="1-2">
				      	<router-link tag="span" to="jobSchedue">jsplumb</router-link>
				      </el-menu-item>
				    </el-menu-item-group>
				  
				 
				  </el-submenu>
				  <el-menu-item index="2">
				    <i class="el-icon-menu"></i>
				    <span slot="title">导航二</span>
				  </el-menu-item>
				  <el-menu-item index="3">
				    <i class="el-icon-document"></i>
				    <span slot="title">导航三</span>
				  </el-menu-item>
				  <el-menu-item index="4">
				    <i class="el-icon-setting"></i>
				    <span slot="title">导航四</span>
				  </el-menu-item>
				</el-menu>
		  
		  </el-aside>
		  <el-container>
		    <el-header>
		    	<div class="left">
		    		<i style="cursor: pointer;" class="el-icon-menu" @click="collapse"></i>
		    	</div>
		    	<div class="right">
		    		<span>user</span>
		    		
		    	</div>
		    </el-header>
		    <el-main>
		    	<router-view></router-view>
		    </el-main>
		  </el-container>
		</el-container>
		
	</div>
	
</template>

<script>
	import router from "../router/router"
	import { mapState, mapGetters, mapActions } from 'vuex'
	import {$http} from "../assets/js/http";
	export default{
		created(){
		
		},
		data(){
			return{
				isShow:false,
				isCollapse:true,
				width:'63px'
			}
		},
		computed: {
			...mapState({
      	canvas:state => state.nodes.canvas,
    	})
    	
		},
		methods:{
			collapse(){
				this.isCollapse = !this.isCollapse
				if(this.isCollapse){
					this.width = "63px"
				}else{
					this.width = "200px"
				}
			},
			setWidth(){
				var obj = {
        	height:document.documentElement.clientHeight-145,
        	width:(document.documentElement.clientWidth-200)*0.83
        }
        this.$store.commit('nodes/canvas',obj)
			}
		},
		beforeMount (){
			const that = this;
			this.setWidth()
    	window.onresize = function temp() {
    		that.setWidth()
    	};
		}
	}
</script>

<style>
aside{
	background: #001529;
	color: #848e98;

}
.el-submenu .el-menu-item{
	min-width: 100px;
}

.header{
	background: #00284d;
	line-height:60px;
	color: #fff;
	padding-left: 24px;
}
header{
	background: #fff;
	height: 59px;
	line-height:59px;
	border-bottom: 1px solid #e9e9e9;
}
.router-link-active{
	color: #ffd04b;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 201px;
    min-height: 400px;
  }
</style>