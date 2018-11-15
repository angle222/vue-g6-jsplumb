function saveTicket(name,value){
	sessionStorage.setItem(name,value)
}
function getTicket(name){
	return sessionStorage.getItem(name)
}
function deleteTicket(name){
	sessionStorage.removeItem(name)
}
export{
	saveTicket,
	getTicket,
	deleteTicket
}
