import code from './node_modules/code-editor/index.mjs'
import iframe from './node_modules/iframe-viewer/index.mjs'
import pixel from './node_modules/pixel-editor/index.mjs'
import tabbed from './node_modules/tabbed-editor/index.mjs'
import truth from './node_modules/truth/truth.mjs'
import pane from './node_modules/pane-viewer/index.mjs'
import v from './node_modules/v/v.mjs'
import youtube from './node_modules/youtube-viewer/index.mjs'
//@todo dynamically load all editors in node_modules
const
apps={code,iframe,pixel,tabbed,youtube},
{util}=pane

onload=async function()
{
	await Promise.all(Object.values(apps).map(fn=>fn()))//init custom-els
	let renderer=x=>x
	//@todo get data from the server
	// if(!Object.values(views).length) setupPanes(state)
	// //else @todo open new tab on window
	const
	read={files:{},views:{}},
	//get default views,
	views=	'code,iframe,pixel,youtube'
			.split(',')
			.map(app=>apps[app].logic()),
	[txt,browser,pic,vid]=views;
	//sepearate views & files
	[txt,pic,vid]
	.forEach(function(view)
	{
		const {id}=view

		read.files[id]=Object.assign(view.file,{id})
		read.views[id]=Object.assign(view,{file:id})
	});
	browser.file=txt.id//link browser view to txt file
	//create a unique view for this device

	//setup tabbed-panes
	const panes=[txt,browser,pic,vid]
	.map(({id})=>tabbed.logic({tab:id,tabs:[{id,name:'untitled'}]}))
	read.views.window=util.mk({id:'window',panes})
	//setup state
	const state=truth(read,(...args)=>renderer(...args))//@todo only sync public data via chant on preop?
	renderer=v.render(document.body,state,output)
	//@todo preop=send data to server & postop= update other panes/files (but not the originator)
}
const input={}

input.tab=function({detail:{close,open},target})
{
	if(open)//@todo move into logic
	{
		state.views[target.id].file=detail.open
		if(!state.views[open])
		{
			const
			[app]=target.childNodes[0].nodeName.split('-'),
			view=apps[app].logic(),
			{id}=tmp

			state.files[id]=Object.assign(tmp.file,{id})
			view.file=id

			state.views[id]=view
		}

		const
		view=state.views[open],
		file=state.files[view.file]
		editor.load(Object.assign({},view,{file}))
	}

	if(close)
	{
		//@todo check if file is referenced by other tabs
			//if not, check if it is empty by comparing to app.logic()'s value via strinigfy equality 
	}
}

function output(state)
{
	return Object.values(state.views.window.panes)
	.map(function({id,tab,fullscreen,type})
	{
		return v(type,{class:'pane'})
	})
	// return Object.keys(state.files[state.views.window.file])
	// .map(id=>state.views[id])
	// .map(function({file,id,type})
	// {
	// 	const on=
	// 	{
	// 		render:function({detail,target})
	// 		{
	// 			const
	// 			view=target.id,state.views[target.id]
	// 			//target.childNodes[0].load()
	// 		},
	// 		tab:input.tab
	// 	}
	// 	return v('tabbed-editor',{class:'pane',data:{file},id,on},
	// 		v(type)
	// 	)
	// })
}