import compile from '../node_modules/silo/compiler.mjs'
import files from '../node_modules/files/fs.js'
import os from 'os'
import silo from './logic.js'

const
{config,logic,util}=silo,
output={}

output.dir=files.readDir
output.file=files.readFile
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
output.redirect=function(req,res,path='login.html')
{
	res.writeHead(301,{'Location':'https://'+req.headers['host']+'/'+path})
	res.end()
}
output.siloCompilation=async function(path)
{
	const dirs=path.split(/\\|\//)

	dirs.pop()//remove index.js

	const
	src='../'+dirs.slice(dirs.indexOf('paper')+1).join('/')+'/src/',
	data=await compile(src)

	return Buffer.from(data,'utf8')
}

export default Object.assign(silo,{output})