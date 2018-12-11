const config={}
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
	svg:'image/svg+xml',
	//zip
	zip:'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip'

}
config.response=
{
	code:200,
	data:'',
	encoding:'utf-8',
	type:'application/octet-stream'
}
config.state=
{
	file:
	{
		users:{},
		sessions:{}
	},
	view:
	{

	}
}
export default {config}