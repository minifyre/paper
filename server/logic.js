'use strict'
const
silo=require('./config.js'),
{config}=silo,
{util}=require('./util.js'),
logic={}
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()
module.exports={config,logic,util}