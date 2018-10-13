import chant from '../node_modules/chant/chant.server.js'
import silo from './input.mjs'
import truth from '../node_modules/truth/truth.mjs'

const 
{config,input,logic,output,util}=silo,
//truth=await import('../node_modules/truth/truth.mjs'),
server=output.mkStaticFileServer()
//@todo public & private defaults (only sync public data with server)
//tmp=console.log(truth),
//{pre,post,state,update}=truth(util.clone(config.state))
//websocket server



process.on('uncaughtException',function(err)//@todo eliminate if not debug
{
	console.error(err)
	console.log("Node NOT Exiting...")
})