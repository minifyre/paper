'use strict'
const
fs=require('fs'),
os=require('os'),
config=require('./config.js'),
{logic}=require('./logic.js'),
{util}=require('./util.js'),
output={}
output.file=filePath=>util.callback2promise(fs.readFile)(filePath)
output.ip=function()
{
	const
	addresses=[],
	interfaces=os.networkInterfaces()
	for (let i in interfaces)//@todo switch to Object.keys?
	{
		for (let i2 in interfaces[i])
		{
			const address=interfaces[i][i2];
			if (address.family==='IPv4'&&!address.internal)
			{
				addresses.push(address.address);
			}
		}
	}
	return addresses[0]
}
output.response=function(res,opts)
{
	const
	defaults=util.clone(config.response),
	{code,data,encoding,type}=Object.assign({},defaults,opts);
	res.writeHead(code,{'Content-Type':type});
	res.end(data,encoding);
}
module.exports={logic,output}