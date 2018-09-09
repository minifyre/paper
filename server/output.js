'use strict'
const
fs=require('fs'),
os=require('os'),
{config,logic,util}=require('./logic.js'),
output={}
output.file=filePath=>util.callback2promise(fs.readFile,filePath)
output.ip=function(interfaces=os.networkInterfaces())
{
	return	Object.values(interfaces)
			.map(x=>Object.values(x))
			.reduce((arr,x)=>arr.concat(x),[])//flatten array
			.filter(({family,internal})=>family==='IPv4'&&!internal)
			.map(({address})=>address)[0]
}
output.response=function(res,opts)
{
	const {code,data,encoding,type}=Object.assign({},config.response,opts)
	res.writeHead(code,{'Content-Type':type})
	res.end(data,encoding)
}
module.exports={config,logic,output,util}