'use strict';
const config={};
config.mimeTypes=
{
	//web
	html:'text/html',
	js:'text/javascript',
	mjs:'text/javascript',
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
//@todo remove hardcoded users & import them from a different source
//also, don't pass the pwd hash property onto users
config.state=//default
{
	public:
	{
		files:{},
		tabs:{},
		panes:{},
		devices:{},
		users:
		{
			'e9ee8d17-9262-4750-9283-9766de0870de':
			{
				id:'e9ee8d17-9262-4750-9283-9766de0870de',
				name:'user',
				pwd:'add-ecrypted-hash-here'
			}
		}
	}
};
module.exports=config;