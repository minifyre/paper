'use strict'
const
http=require('http'),
chant=require('../node_modules/chant/chant.server.js'),
silo=require('./output.js'),

{config,logic,output,util}=silo,
input={}

input.httpRequest=function({url},res)
{
	const
	path=	url.match(/\/$/)?url+'index.html':
			!(url.split('/')||['']).pop().match(/\./)?url+'/index.html':
			url,
	type=config.mimeTypes[logic.ext(path)]

	//@todo make sure files above paper directory cannot be served up & pass an error code
	return (path.match(/^\/server/)?Promise.resolve('Access Denied'):output.file('../client'+path))
	.catch(function()//attempt to serve node modules from root dir of modules
	{//avoids needing to install duplicates of modules in lower dirs
		const last=path.lastIndexOf('node_modules')
		return output.file('..'+path.slice(last!==-1?last-1:0))
	})
	.catch(async function({code,path})
	{
		const noEntry=code==='ENOENT'

		return	noEntry&&path.match(/index\.html$/)?
				await await output.index(path):
				`Error: ${noEntry?404:code}`
	})
	.then(data=>output.response(res,{data,type}))
	.catch(data=>output.response(res,{code:500,data,type:'text/plain'}))
}
input.init=async function(opts={})
{
	const
	truth=await import('../node_modules/truth/truth.mjs'),
	ip=output.ip(),
	{port}=Object.assign({},config.server,opts),
	server=http.createServer(input.httpRequest).listen(port)//static http server
	//@todo public & private defaults (only sync public data with server)
	var state
	//websocket server
	chant(server,util.clone(config.state))
	.then(function(self)
	{
		state=self
		state.auth=function(req)
		{
			return new Promise(function(pass,fail)
			{
				pass()
			})
		}
	})
//	if (err.code==='EADDRINUSE')
//	{
//		// port is currently in use
//	}
	process.on('uncaughtException',function(err)
	{
		console.error(err)
		console.log("Node NOT Exiting...")
	})
	console.log('Running at http://'+ip+':'+port+'/')
}
module.exports=Object.assign(silo,{input})