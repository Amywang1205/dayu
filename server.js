/*模块引入及初始化入口文件*/
//模块引入
var express = require('express'),
	mongodb = require('mongodb'),
	bodyParser = require('body-parser'),
	swig = require('swig'),
	fs = require('fs'),
	tools = require('./serverTools.js'),
//初始化入口文件
	app = express(),
	mongodbClient = mongodb.MongoClient,
//变量
	db = null;

/*swig模板引擎设置*/
app.engine('html', swig.renderFile);
app.set('html', './html');
app.set('view engine', 'html');
swig.setDefaults({cache: false});//注意：上线的时候，应删除s
/*中间件*/
//静态资源托管
app.use( '/source', express.static('source') );

//处理提交过来的数据（转换为url格式）
app.use(bodyParser.urlencoded({ extended: false }))

/*分配路由*/
app.get('/',function(req,res){
	let content = fs.readFileSync('html/index.html').toString();
	res.send(content);
});
app.get('/sign',function(req,res){
	let content = fs.readFileSync('html/sign.html').toString();
	res.send(content);
});
app.get('/infos',function(req,res){
	let content = fs.readFileSync('html/infos.html').toString();
	res.send(content);
});
app.get('/comments',function(req,res){
	let content = fs.readFileSync('html/comments.html').toString();
	res.send(content);
});

app.get('/check',function(req,res){
	let name = db.collection('users'),
		val = req.query.name;
	tools.check(name,
		{
			username: val	
		},
		res
	);
})
app.get('/getPics',function(req,res){
	fs.readdir('source/img/pics',function(err,files){
		res.send(files);
	});
})
app.post('/logoin',function(req,res){
	let collection = db.collection('users'),
		name = req.body.name,
		pw = parseInt(req.body.pw);
	tools.check(collection,{
		username: name,
		password: pw
	},res);
});
app.post('/signup',function(req,res){
	let collection = db.collection('users'),
		name = req.body.name,
		pw = parseInt(req.body.pw),
		d = new Date();
	collection.insertOne(
		{
			username: name,
			password: pw,
			createTime: [d.getFullYear(),d.getMonth(),d.getDate()]
		}
	).then(function(err){
		res.send('0');
	});
})
app.post('/data',function(req,res){
	let collection = db.collection('comments');
	collection
	.find()
	.toArray(
		function(err,docs) {
			res.send(docs);
		}
	)	
});
app.post('/addComment',function(req,res){
	let val = req.body,
		collection = db.collection('comments'),
		d = new Date(),
		data = {
			username: val.name,
			comment: val.comment,
			time: [d.getFullYear(),d.getMonth(),d.getDate()]
		};
	collection
	.insertOne(data)
	.then(
		function(err){
			res.send(err.result.ok + '');
		}
	);
})
/*数据库连接*/
var url = 'mongodb://localhost:27017/dayu';
mongodbClient.connect(url).then(function(d){
	db = d;
	console.log('服务器连接成功');
}).catch(function(err){
	console.log(err);
	console.log('服务器连接失败')
});

/*开启服务*/
app.listen(9999);