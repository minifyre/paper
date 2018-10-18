import chant from '../node_modules/chant/server.mjs'
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