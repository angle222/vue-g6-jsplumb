//校验身份证

function isIdCardNo(idCardNo) {
	var sBirthday;
	// 15位和18位身份证号码的基本校验
	var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
	if (!check)
		return false;
	// 判断长度为15位或18位
	if (idCardNo.length == 15) {
//		return idCardNoUtil.check15IdCardNo(idCardNo);
	} else if (idCardNo.length == 18) {
		var aCity = {
			11 : "北京",
			12 : "天津",
			13 : "河北",
			14 : "山西",
			15 : "内蒙古",
			21 : "辽宁",
			22 : "吉林",
			23 : "黑龙江",
			31 : "上海",
			32 : "江苏",
			33 : "浙江",
			34 : "安徽",
			35 : "福建",
			36 : "江西",
			37 : "山东",
			41 : "河南",
			42 : "湖北",
			43 : "湖南",
			44 : "广东",
			45 : "广西",
			46 : "海南",
			50 : "重庆",
			51 : "四川",
			52 : "贵州",
			53 : "云南",
			54 : "西藏",
			61 : "陕西",
			62 : "甘肃",
			63 : "青海",
			64 : "宁夏",
			65 : "新疆",
			71 : "台湾",
			81 : "香港",
			82 : "澳门",
			91 : "国外"
		};
		var iSum = 0;
		if (idCardNo == "")
			return true;
		if (!/^\d{17}(\d|x)$/i.test(idCardNo))
			return false;
		idCardNo = idCardNo.replace(/x$/i, "a");
		if (aCity[parseInt(idCardNo.substr(0, 2))] == null)
			return false;
		sBirthday = idCardNo.substr(6, 4) + "-"
				+ Number(idCardNo.substr(10, 2)) + "-"
				+ Number(idCardNo.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
				.getDate()))
			return false;
		for (var i = 17; i >= 0; i--)
			iSum += (Math.pow(2, i) % 11)
					* parseInt(idCardNo.charAt(17 - i), 11);
		if (iSum % 11 != 1)
			return false;
		return true;
	} else {
		return false;
	}
}
// 手机号码校验
function isMobile(str) {
	if (str == '' || $.trim(str) == '')
		return false;
	var one = new RegExp('^13\\d{9}$');
	var two = new RegExp('^15\\d{9}$');
	var thr = new RegExp('^17\\d{9}$');
	var four = new RegExp('^18\\d{9}$');
	var five = new RegExp('^\\d{3,4}-\\d{7,8}');
	if (one.test(str) || two.test(str) || thr.test(str)|| four.test(str)|| five.test(str)) {
		return true;
	}
	return false;
}
export{
	isMobile,
	isIdCardNo
}
