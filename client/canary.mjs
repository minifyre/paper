import chant from './node_modules/chant/index.mjs'
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


util.counter=function()
{
	if(!util.counter.count) util.counter.count=0
	return util.counter.count+=1
}

onload=async function()
{
	//init custom-els
	await Promise.all(Object.values(apps).map(fn=>fn()))
	const {state:initial,send}=await chant()
	//setup state
	const {pre,post,state,update}=truth(initial)
	post.push(send(update))

	// if(!Object.values(views).length) setupPanes(state)
	// //else @todo open new tab on window


	const
	//get default views,
	views=	'code,iframe,pixel,youtube'
			.split(',')
			.map(app=>apps[app].logic({id:util.counter()})),
	[txt,browser,pic,vid]=views
	//sepearate views & files
	;[txt,pic,vid]
	.forEach(function(view)
	{
		const {id}=view
		console.log(id)
		state.files[id]=Object.assign(view.file,{id})
		state.views[id]=Object.assign(view,{file:id})
	})
	//@todo fix this bug (check that txt file is not stored under a key that differs from its id)

	
	
	state.files[txt.id].value='Hello world!'
	browser.file=txt.id//link browser view to txt file
	state.views[browser.id]=browser
	//create a unique view for this device

	//setup tabbed-panes
	const panes=[txt,browser,pic,vid]
	.map(({id})=>tabbed.logic({tab:id,tabs:[{id,name:'untitled'}]}))
	state.views.window=util.mk({id:'window',panes})
	panes.forEach(pane=>state.views[pane.id]=pane)
	// //setup state
	post.push(v.render(document.body,state,output))
	// //debug
	// window.state=state
}
const
input={},
logic={}

input.tab=function({detail:{close,open},target})
{
	if(open)//@todo move into logic
	{
		state.views[target.getAttribute('data-view')].file=open
		if(!state.views[open])
		{
			const
			app=target.childNodes[0].nodeName.split('-')[0].toLowerCase(),
			view=apps[app].logic(),
			{id}=view
			state.files[id]=Object.assign(view.file,{id})
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

logic.getLoadableView=function(state,viewId)
{
	// const
	// view=state.views[viewId],
	// file=state.files[view.file],
	// {state:refLink,update,post}=truth(Object.assign({},view,{file}))

	// post.push(function({path,type,value})
	// {
	// 	let obj=view
	// 	if(path[0]==='file') [obj,path]=[file,path.slice(1)]
	// 	//@todo maybe this only needed for non-file (or non-nested props)
	// 	update({path,type,value})

	// 	//@todo ELIMINATE THIS TEMP BUG FIX & FIX THE UNDERLYING PROBLEM
	// 	const id=file.id===2?1:file.id

	// 	;[...document.querySelectorAll(`[data-file="${id}"]`)]
	// 	.filter(el=>el.state.id!==viewId)
	// 	.map(el=>el.render)
	// 	.filter(fn=>!!fn)//@todo eliminate this when all editors have a render fn & use console.error as default render fn
	// 	.forEach(render=>render())
	// })

	// return refLink	
}

function output(state)
{
	console.log(state)
	const
	{files,views}=state,
	on=
	{
		render:function({detail,target})
		{
			const tabbedView=views[target.getAttribute('data-view')]
			target.childNodes[0].load(logic.getLoadableView(state,tabbedView.tab))
		},
		tab:input.tab
	}
	return Object.values(views.window.panes)
	.map(function({id,tab,fullscreen,type})
	{
		const view=views[tab]
		return v(type,{class:'pane',data:{view:id},on},
			v(view.type,{data:{file:view.file}})
		)
	})
}