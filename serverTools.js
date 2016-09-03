//检查用户名及用户名和密码是否匹配
module.exports = {
	check : function (obj,data,res){
		obj.findOne(data).then(
			function(docs){
				if(docs){
					res.send('1');
				}else{
					res.send('0');
				}
//				db.close();
			}
		);
	}
}