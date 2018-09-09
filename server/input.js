'use strict'
const
http=require('http'),
chant=require('../node_modules/chant/chant.server.js'),
input={},
{config,logic,output,util}=require('./output.js')
input.httpRequest=function({url},res)
{
	const
	path=	url.match(/\/$/)?url+'index.html':
			!(url.split('/')||['']).pop().match(/\./)?url+'/index.html':
			url,
	ext=logic.ext(path),
	type=config.mimeTypes[ext]
	return output.file('../client'+path)
	.catch(function()//attempt to serve node modules from root dir of modules
	{//avoids needing to install duplicates of modules in lower dirs
		const
		first=path.indexOf('node_modules'),
		last=path.lastIndexOf('node_modules'),
		url=first!==last?path.slice(last-1):path
		return output.file('..'+url)
	})
	.catch(function(err)
	{
		console.log(err)
		return	err.code=='ENOENT'?Promise.resolve('Error: 404'):
				Promise.reject('Error: '+err.code)
	})
	.then(data=>output.response(res,{data,type}))
	.catch(data=>output.response(res,{code:500,data,type:'text/plain'}))
}
input.init=function(opts={})
{
	const
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
module.exports={config,input,logic,output,util}