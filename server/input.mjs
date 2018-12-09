import http from 'http'
import https from 'https'
import fs from 'fs'
import silo from './output.mjs'

const
{config,logic,output,util}=silo,
input={}

input.httpRequest=async function(req,res)
{
	const
	cookie=util.cookieParse(req.headers.cookie||''),
	login=req.url.match(/^\/login\.html$/)

	if(!cookie.session&&!login)
	{
		res.writeHead(301,{'Location':'https://'+req.headers['host']+'/login.html'})
		res.end()
	}
	else if (login)
	{
		//@todo +rate limiting to block bcrypt-based DDOS
		let body=''

		//@todo make rest of the function wait on this block
		req.on('data',data=>body+=data)
		req.on('end',async function()
		{
			const
			params=new URLSearchParams(body),
			user=params.get('user'),
			pwd=params.get('password')

			if(!(user&&pwd)) return

			const
			db=await util.callback2promise(fs.readFile,'./private/db.json')
			.then(txt=>JSON.parse(txt))
			.catch(()=>console.error('private/db.json not found')),
			valid=db&&await logic.authLogin(db,user,pwd)

			if(valid)
			{
				//@todo gen session token & pass it to the browser via a cookie header (+expiration date as well...)
			}
		})
	}


	const
	{url}=req,
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
		key:fs.readFileSync('./private/server.key'),
		cert:fs.readFileSync('./private/server.crt')
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