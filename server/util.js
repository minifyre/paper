'use strict'
const util={}
util.callback2promise=function(func)
{
	return function(...args)
	{
		return new Promise(function(res,rej)
		{
			func(...args,(err,data)=>err?rej(err):res(data))
		})
	}
}
util.clone=json=>JSON.parse(JSON.stringify(json))
module.exports={util}