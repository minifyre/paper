'use strict';
const config={};
config.mimeTypes=
{
	//web
	html:'text/html',
	js:'text/javascript',
	css:'text/css',
	json:'application/json',
	//doc
	txt:'text/plain',
	//rastor images
	png:'image/png',
	jpg:'image/jpg',
	gif:'image/gif',
	ico:'image/x-icon',
	//movies
	wav:'audio/wav',
	mp4:'video/mp4',
	//fonts
	woff:'application/font-woff',
	ttf:'application/font-ttf',
	eot:'application/vnd.ms-fontobject',
	otf:'application/font-otf',
	//vector images
	svg:'image/svg+xml'
};
config.response=
{
	code:200,
	data:'',
	encoding:'utf-8',
	type:'application/octet-stream'
};
config.server=
{
	port:8080
};
config.state=//default
{
	public:
	{
		apps:{},//@todo convert objects to arrays
		devices:{},
		files:{},
		panes:{},
		tabs:{}
	}
};
module.exports=config;