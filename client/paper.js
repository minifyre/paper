'use strict';
import {chant} from '../js/chant/chant.mjs';
import {q} from '../node_modules/qwick/qwick.mjs';
const
state=chant(),
util=//private helper funcs
{
	//uuid
	id:()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,util.idHelper),
	idHelper:c=>(c^util.rand()[0]&15>>c/4).toString(16),
	rand:()=>crypto.getRandomValues(new Uint8Array(1)),
	//maker
	mk:defaultObj=>(opts={})=>Object.assign({id:util.id()},defaultObj,opts),
	//input
	mkHanlder:function(type)
	{
		return function(evt)
		{
			//@todo fix qwick.js bug .parent(sel) return plain element
			const el=q(util.trueTarget(evt.target,`[data-${type}]`));
			input[el.data(type)](evt,el);
		};
	},
	trueTarget:(el,selector)=>el.matches(selector)?el:el.parent(selector)
},
logic=
{
	mkFile:util.mk({data:{},src:'',owner:''}),//@todo add reviewers & editors
	mkPane:util.mk({height:100,fullscreen:false,tabs:[],type:'pane',width:100,x:0,y:0}),
	mkTab:util.mk({file:'',view:{}})
},
output={},
input=
{
	pointerDown:util.mkHanlder('pointerdown')
};
logic.addTab2PaneAtIndex=function(tab,appId,index=-1)
{
	state.set(`public.tabs.${tab.id}`,tab);
	index===-1&&state.push(`public.apps.${appId}.tabs`,tab.id);
	//@todo state.splice(`public.apps.${appId}.tabs`,index,0,tab);
};
//@todo input.download,refresh,tabClose,tabSwitch (rename input.newTab vs openTab or viewTab for switching)
input.paneInit=function(app)
{
	const el=output.pane(app);
	el.q('.controls').on('pointerdown',input.pointerDown);
	return el;
};
input.paneUninit=function(el)
{
	el.q('.controls').off('pointerdown',input.pointerDown);
};
input.paneToggleFullscreen=function(evt,el)
{
	const
	pane=el.parent('[data-app]'),
	id=pane.attr('id'),
	path='public.panes.'+id,
	fullscreen=state.get(path+'.fullscreen');
	state.set(path+'.fullscreen',!fullscreen);
	pane.attr('style',output.paneStyle(state.get(path)));
	//@todo toggle off all other fullscreen tabs in this device
};
input.tabOpen=function(evt,el)
{
	const
	tab=logic.mkTab(),
	paneId=el.parent('[data-app]').attr('id');
	logic.addTab2PaneAtIndex(tab,paneId);
	console.log(state.get(`public.panes.${paneId}`));
};
output.pane=function(json)
{
	const
	{id,type}=json,
	style=output.paneStyle(json),
	vdom=
	{'data-app':type,id,style,children:[
		{nodeName:'header',class:'controls',children:[
			{nodeName:'button',title:'toggle fullscreen','data-pointerdown':'toggleFullscreen',children:['x']},
			{nodeName:'button',title:'new tab','data-pointerdown':'tabOpen',children:['+']},
			{class:'tabs'}
		]},
		{class:'content'}
	]};
	return q.create('div',{'data-app':type,id,style}).html
	(`<header class=controls>
		<button title="toggle fullscreen" data-pointerdown="toggleFullscreen">x</button>
		<button title="new tab" data-pointerdown="tabOpen">+</button>
		<ul class=tabs></ul>
	</header>
	<div class=content></div>`);
};
output.paneStyle=function(json)
{
	const {height,width,x:left,y:top}=json;
	return Object.entries({height,left,top,width})
	.reduce((style,keyProp)=>style+=`${keyProp[0]}:${keyProp[1]}%; `,'');
};
output.tab=function(json)
{
	return `<div id=${json.id} class="row tab" data-pointerdown=tabSwitch>
		<div class=icon data-pointerdown=tabClose></div>
		<div class=title>file name</div>
	</div>`;
};
input.init=async function()
{
	await state.with();//@todo add error catcher
	//add arbitrary user to data store @todo revamp when login functionality is added
	const userId=state.keys('public.users')[0];
	state.set('private.user',userId);
	
	//setup IDE
	const
	panePath=`public.panes.${userId}`;
	if (!state.keys('public.panes').length)
	{
		state.set(panePath,logic.mkPane({id:userId,type:'window'}));
	}
	const
	pane=state.get(panePath),
	dom=input.paneInit(pane);
	q('body').first(dom);

	// const
	// pageId=state.get('private.id');
	// if (!state.keys('public.views').length)
	// {
	// 	state.set(`public.views.${userId}`,paper.logic.mkPane({id:userId,type:'paper'}));
	// }
	// //add new tab for device
	// state.set(`public.views.${pageId}`,paper.logic.mkPane({id:pageId,type:'pane'}));
	
	//state.push(`public.views.${userId}.tabs`)
		// if (state.values('public.panes').length<4)
		// {
		// 	[
		// 		{type:'browser'},
		// 		{x:50,type:'code'},
		// 		{y:50,type:'youtubePlayer'},
		// 		{x:50,y:50,type:'raster'}
		// 	]
		// 	.forEach(function(opts)
		// 	{
		// 		const
		// 		pane=paper.logic.mkPane(Object.assign(opts,{height:50,width:50})),
		// 		{id}=pane;
		// 		state.set(`public.panes.${id}`,pane);
		// 	});
		// }
		// const
		// panes=state.values('public.panes').reduce((rtn,pane)=>rtn+paper.output.pane(pane),'');
		// q('.panes').html(panes);
};
onload=input.init;