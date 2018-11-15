import {$http} from '../assets/js/http';
import Qs from 'qs'
/*
 * 随码行
 */
//获取列表
export const getList = params => {
	return $http.get('/mapbjdata/task',{params:params}).then(res => res);
}
//任务详情
export const taskDetail = params => {
	return $http.get('/mapbjdata/task/detail/'+params).then(res => res);
}
//执行
export const execute = params => {
	return $http.post('/mapbjdata/task/exec',params).then(res => res);
}
//重新执行
export const reExecute = params => {
	return $http.post('/mapbjdata/task/reexec/'+params).then(res => res);
}
//重新上传zip文件 执行
export const reUpload = params => {
	return $http.post('/mapbjdata/task/reupload',params).then(res => res);
}
//删除
export const delTask = params => {
	return $http.get('/mapbjdata/task/delete/'+params).then(res => res);
}
//批量删除
export const delBatchDel = params => {
	return $http.get('/mapbjdata/task/delete/',{params:params,paramsSerializer:function(params){return Qs.stringify(params,{arrayFormat:'repeat'})}}).then(res => res);
}
//下载二维码
export const loadQrcode = params => {
	return $http.get('/mapbjdata/task/smd/'+params).then(res => res);
}

