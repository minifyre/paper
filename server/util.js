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

util.cookieParse=function(txt='')
{
	return txt.split(/; /)
	.map(keyVal=>keyVal.split('='))
	.filter(([key])=>key.length)
	.reduce((obj,[key,val])=>Object.assign(obj,{[key]:val}),{})
}
util.cookieStringify=function(opts)
{
	return Object.entries(Object.assign({},config.cookie,opts))
	.map(arr=>arr.filter(x=>x!==true))
	.map(arr=>arr.join('='))
	.join('; ')
}
util.cookieValidate=function(state,cookie,now=Date.now())
{
	const session=state.file.sessions[cookie.session]
	return !!session&&session.expires>now
}
export default Object.assign(silo,{util})