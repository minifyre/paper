import silo from './config.js'

const
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

util.cookieParse=function(txt)
{
	return txt.split(';')
		.map(keyVal=>keyVal.split('='))
		.reduce((obj,[key,val])=>Object.assign(obj,{[key]:val}),{})
}
util.cookieStringify=function(obj)
{
	return Object.entries(obj)
		.map(([key,val])=>key+'='+val)
		.join(';')
}
export default Object.assign(silo,{util})