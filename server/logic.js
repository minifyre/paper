'use strict'
const
config=require('./config.js'),
{util}=require('./util.js'),
logic={}
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()
module.exports={config,logic,util}