import app from './input.js'
import chant from '../node_modules/chant/server.mjs'
import fs from 'fs'
import truth from '../node_modules/truth/truth.mjs'

import silo from '../node_modules/silo/index.js'

const 
{config,input,logic,output,util}=app,
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