import chant from '../node_modules/chant/server.mjs'
import compile from '../node_modules/silo/compiler.mjs'
import fs from 'fs'
import silo from './input.mjs'
import truth from '../node_modules/truth/truth.mjs'

const 
{config,input,logic,output,util}=silo,
server=output.mkStaticFileServer(),
//@todo public & private defaults (only sync public data with server)
{pre,post,state,update}=truth(util.clone(config.state))
//websocket server


//console.log(server)
chant(server,state,update)

process.on('uncaughtException',function(err)//@todo eliminate if not debug
{
	console.error(err)
	console.log("Node NOT Exiting...")
})

//file watcher/compiler (beta)
const watcher=
{
	delay:200,//prevents duplicate logs on windows
	path:'./../../paper/',
	timer:false
}

fs.watch(watcher.path,{recursive:true},function(type,path)
{
	const dirs=path.split('\\')

	if(!dirs.includes('src')) return
	
	if(watcher.timer) clearTimeout(watcher.timer)

	watcher.timer=setTimeout(async function()
	{
		watcher.timer=false

		await compile(watcher.path+dirs.slice(0,-1).join('/')+'/')

		console.log(path+' recompiled')

	},watcher.delay)
})