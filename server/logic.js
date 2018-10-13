'use strict'
const
silo=require('./util.js'),
{config,util}=silo,
logic={}

logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()
module.exports={config,logic,util}