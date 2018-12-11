import app from './output.js'
import crypto from 'crypto'
import http from 'http'
import https from 'https'
import fs from 'fs'

import silo from '../node_modules/silo/index.js'

//node crypto differs from browser crypto
silo.util.idRand=()=>crypto.randomBytes(1)

const
{config,logic,output,util}=app,
{curry}=silo.util,
input={}

input.login=function(state,req)
{
	let body=''

	return new Promise(function(pass,fail)
	{
		req.on('data',data=>body+=data)
		req.on('end',async function()
		{
			const
			params=new URLSearchParams(body),
			user=params.get('user'),
			pwd=params.get('password')

			if(!(user&&pwd)) return pass()

			pass(await logic.authLogin(state,user,pwd)?user:false)
		})
	})
}
input.request=async function(state,req,res)
{
	const
	cookie=util.cookieParse(req.headers.cookie||''),
	login=!!req.url.match(/^\/login\.html$/)

	//@todo add redirect location as url parameter
	if(!cookie.session&&!login) return output.redirect(req,res)
	else if(login)//@todo +rate limiting to block bcrypt-based DDOS
	{
		const
		username=await input.login(state,req),
		user=logic.getUser(state,username)

		if(username)
		{
			const
			id=silo.util.id(),
			//@todo expires does not seem to be working...
			expires=Date.now()+(1000*60*60*10)//ms*sec*min*hrs

			state.file.sessions[id]={id,user:user.id,expires:expires.valueOf()}

			res.setHeader('Set-Cookie',util.cookieStringify(
			{
				session:id,
				Expires:new Date(expires).toString().split(' (')[0]
			}))

			//@todo allow redirects to other pages via url parameter
			return output.redirect(req,res,'index.html')
		}
	}
	else if(!util.cookieValidate(state,cookie))
	{
		delete state.file.sessions[cookie.session]
		res.setHeader('Set-Cookie',util.cookieStringify())
		return output.redirect(req,res)
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
	//@todo switch to finally and make sure that it doesn't trigger an auto-download
}
//@todo move to output
output.mkStaticFileServer=function(state)
{
	const
	ip=output.ip(),
	certOpts=
	{
		key:fs.readFileSync('./private/server.key'),
		cert:fs.readFileSync('./private/server.crt')
	},
	server=https.createServer(certOpts,curry(input.request,state)).listen(443)//static http server
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
export default Object.assign(app,{input})