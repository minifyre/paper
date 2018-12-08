import http from 'http'
import https from 'https'
import fs from 'fs'
import silo from './output.mjs'

const
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

		return noEntry&&path.match(/index\.html$/)?await output.index(path):
				noEntry&&path.match(/index\.js$/)?await output.siloCompilation(path):
				`Error: ${noEntry?404:code}`
	})
	.then(data=>output.response(res,{data,type}))
	.catch(data=>output.response(res,{code:500,data,type:'text/plain'}))
}
//@todo move to output
output.mkStaticFileServer=function(opts)
{
	const
	ip=output.ip(),
	{port}=Object.assign({},config.server,opts),
	certOpts=
	{
		key:fs.readFileSync('./cert/server.key'),
		cert:fs.readFileSync('./cert/server.crt')
	},
	server=https.createServer(certOpts,input.httpRequest).listen(port)//static http server
	//@todo if(err.code==='EADDRINUSE')//port is currently in use

	//upgrade http to https
	http.createServer(function(req,res)
	{
		res.writeHead(301,{'Location':'https://'+req.headers['host']+req.url})
		res.end()
	})
	.listen(80)

	console.log(`File Server running at https://${ip}/`)
	return server
}
export default Object.assign(silo,{input})