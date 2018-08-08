'use strict';
const
http=require('http'),
chant=require('../node_modules/chant/chant.server.js'),
config=require('./config.js'),
{util}=require('./util.js'),
input={},
{logic,output}=require('./output.js');
input.httpRequest=function(req,res)
{
	let filePath=req.url;
	if (filePath.match(/\/$/))
	{
		filePath=req.url+'index.html';
	}
	else if (!(filePath.split('/')||['']).pop().match(/\./))
	{
		filePath=req.url+'/index.html';
	}
	const
	ext=logic.ext(filePath),
	type=config.mimeTypes[ext];
	return output.file('../client'+filePath)
	.catch(()=>output.file('../node_modules'+filePath))
	.catch(()=>output.file('../node_modules/'+filePath.split('/').slice(2).join('/')))
	.catch(function(err)
	{
		console.log(err);
		const code=err.code=='ENOENT'?404:err.code;
		return	err.code=='ENOENT'?Promise.resolve('Error: 404'):
				Promise.reject('Error: '+err.code);
	})
	.then(data=>output.response(res,{data,type}))
	.catch(data=>output.response(res,{code:500,data,type:'text/plain'}));
};
input.init=function(opts={})
{
	const
	ip=output.ip(),
	{port}=Object.assign({},config.server,opts),
	server=http.createServer(input.httpRequest).listen(port);//static http server
	//@todo public & private defaults (only sync public data with server)
	var state;
	//websocket server
	chant(server,util.clone(config.state))
	.then(function(self)
	{
		state=self;
		state.auth=function(req)
		{
			return new Promise(function(pass,fail)
			{
				pass();
			});
		};
	});
//	if (err.code==='EADDRINUSE')
//	{
//		// port is currently in use
//	}
	process.on('uncaughtException',function(err)
	{
		console.error(err);
		console.log("Node NOT Exiting...");
	});
	console.log('Running at http://'+ip+':'+port+'/');
};
module.exports={input,logic,output};