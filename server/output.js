'use strict';
const
fs=require('fs'),
{config}=require('./config.js'),
{util}=require('./util.js'),
{logic}=require('./logic.js'),
output={};
output.file=filePath=>util.callback2promise(fs.readFile)(filePath);
output.response=function(res,opts)
{
	const
	defaults=util.clone(config.response),
	{code,data,encoding,type}=Object.assign({},defaults,opts);
	res.writeHead(code,{'Content-Type':type});
	res.end(data,encoding);
};
module.exports={logic,output};