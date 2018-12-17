import app from './input.js'
import chant from '../node_modules/chant/server.mjs'
import files from '../node_modules/files/fs.js'
import truth from '../node_modules/truth/truth.mjs'

const {config,input,logic,output,util}=app
//@todo public & private defaults (only sync public data with server)
// {pre,post,state,update}=truth(util.clone(config.state))
// //websocket server

// //console.log(server)
// chant(server,state,update)

process.on('uncaughtException',function(err)//@todo eliminate if not debug
{
	console.error(err)
	console.log("Node NOT Exiting...")
})

;(async function init()
{
	const
	users=await files.readFile('./private/db.json')
	.then(txt=>JSON.parse(txt))
	.catch(()=>console.error('private/db.json not found'))

	await output.mkStaticFileServer({file:{users,sessions:{}},view:{}})
})()