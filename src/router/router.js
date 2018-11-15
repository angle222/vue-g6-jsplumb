import Vue from 'vue'
import Router from 'vue-router'
import root from '@/components/root'
import jobManage from '@/components/jobManage/jobManage'
import jobSchedue from '@/components/jobSchedue/jobSchedue'
//import dataSource from '@/components/dataSource/dataSource'



Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', 

  	redirect:"/jobManage",

  	component:root,

  	children:[
//		{
//			path:"dataSource",
//			component:dataSource
//		},
//		{
//			path:"datajob",
//			component:datajob
//		},
      {
        path:"jobManage",
        component:jobManage
      },
     {
        path:"jobSchedue",
        component:jobSchedue
      }
      
  	]
  }
  ]
})
