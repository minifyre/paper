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
			expires=Date.now()+(1000*60*60*10),//ms*sec*min*hrs
			session={id,user:user.id,expires}

			state.file.session[id]=session
			//@todo gen session token & pass it to the browser via a cookie header (+expiration date as well...)
		}
	}
	//@todo else check that session is not expired

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