import fs from 'fs'
import os from 'os'
import silo from './logic.mjs'

const
{config,logic,util}=silo,
output={}

output.dir=path=>util.callback2promise(fs.readdir,path)
output.file=path=>util.callback2promise(fs.readFile,path)
output.index=async function(path)
{
	const
	arr=await output.dir(path.replace(/index\.html$/,'')),
	items=	arr
			.sort()
			.map(file=>`<li><a href="${file}">${file}</a></li>`)
			.join('')

	return `<ul>${items}</ul>`
}

output.ip=function(interfaces=os.networkInterfaces())
{
	return	Object.values(interfaces)
			.map(x=>Object.values(x))
			.reduce((arr,x)=>[...arr,...x],[])//flatten array
			.filter(({family,internal})=>family==='IPv4'&&!internal)
			.map(({address})=>address)[0]
}
output.response=function(res,opts)
{//@todo simplify next line with util.mk?
	const {code,data,encoding,type}=Object.assign({},config.response,opts)
	res.writeHead(code,{'Content-Type':type})
	res.end(data,encoding)
}

export default Object.assign(silo,{output})