'use strict'
const
silo=require('./config.js'),
{config}=silo,
util={}

util.callback2promise=function(func,...args)
{
	return new Promise(function(res,rej)
	{
		func(...args,(err,data)=>err?rej(err):res(data))
	})
}
util.clone=json=>JSON.parse(JSON.stringify(json))
module.exports=Object.assign(silo,{util})