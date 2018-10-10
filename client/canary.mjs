import code from './node_modules/code-editor/index.mjs'
import iframe from './node_modules/iframe-viewer/index.mjs'
import pixel from './node_modules/pixel-editor/index.mjs'
import tabbed from './node_modules/tabbed-editor/index.mjs'
import truth from './node_modules/truth/truth.mjs'
import pane from './node_modules/pane-viewer/index.mjs'
import v from './node_modules/v/v.mjs'
import youtube from './node_modules/youtube-player/index.mjs'
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
	read.files[txt.id].value='Hello world!'
	browser.file=txt.id//link browser view to txt file
	read.views[browser.id]=browser
	//create a unique view for this device

	//setup tabbed-panes
	const panes=[txt,browser,pic,vid]
	.map(({id})=>tabbed.logic({tab:id,tabs:[{id,name:'untitled'}]}))
	read.views.window=util.mk({id:'window',panes})
	panes.forEach(pane=>read.views[pane.id]=pane)
	//setup state
	const state=truth(read,(...args)=>renderer(...args))//@todo only sync public data via chant on preop?
	renderer=v.render(document.body,state,output)
	//@todo preop=send data to server & postop= update other panes/files (but not the originator)
}
const
input={},
logic={}

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
		editor.load(logic.getLoadableView(state,open))
	}

	if(close)
	{
		//@todo check if file is referenced by other tabs
			//if not, check if it is empty by comparing to app.logic()'s value via strinigfy equality 
	}
}

logic.getLoadableView=function({files,views},viewId)
{
	const
	view=views[viewId],
	file=files[view.file]
	//@todo this should a proxy through and through, not just file and sub props
	return Object.assign({},view,{file})
}

function output(state)
{
	const
	{files,views}=state,
	on=
	{
		render:function({detail,target})
		{
			const
			tabbedView=views[target.id],
			childView=logic.getLoadableView(state,tabbedView.tab)

			target.childNodes[0].load(childView)
		},
		tab:input.tab
	}
	return Object.values(views.window.panes)
	.map(function({id,tab,fullscreen,type})
	{
		const view=views[tab]
		return v(type,{class:'pane',data:{file:view.file},id,on},
			v(view.type)
		)
	})
}