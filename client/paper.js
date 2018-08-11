'use strict';
const
util=
{
	//uuid
	id:()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,util.idHelper),
	idHelper:c=>(c^util.rand()[0]&15>>c/4).toString(16),
	rand:()=>crypto.getRandomValues(new Uint8Array(1)),
	//object creation
	mk:defaultObj=>(opts={})=>Object.assign({id:util.id()},defaultObj,opts),
},
logic=
{
	mkFile:util.mk({data:{},src:'',owner:''}),//@todo add reviewers & editors
	mkPane:util.mk({height:0,tabs:[],type:'apps',width:100,x:0,y:0,}),
	mkTab:util.mk({file:''}),
	mkWindow:util.mk({fullscreen:'',panes:[]})
},
output=
{
	btn:(type,title)=>`<button title=${title} data-target="${type}">${type}</button>`
},
input={},
paper={input,logic,output};
output.pane=function(json)
{
	const
	{app,id}=json,
	btnFullscreen=output.btn('toggleFullscreen','toggle fullscreen'),
	btnNewTab=output.btn('tabOpen','new tab'),
	style=output.paneStyle(json);
	return `<div class="col pane" data-app=${app} id=${id} style="${style}">
		<header class=col>
			<div class=row>
				${btnFullscreen}
				${btnNewTab}
				<div class="row stretch tabs"></div>
			</div>
		</header>
		<div class="content stretch"></div>
	</div>`;
};
output.paneStyle=function(json)
{
	const {height,width,x:left,y:top}=json;
	return Object.entries({height,left,top,width})
	.reduce(function(style,entry)
	{
		const [key,val]=entry;
		return style+=`${key}:${val}%;`;
	},'');
};
output.tab=function(json)
{
	return `<div id=${json.id} class="row tab" data-target=tabSwitch>
		<div class=icon data-target=tabClose></div>
		<div class=title>file name</div>
	</div>`;
};
/*
input.download=function(evt)
{
	
};
input.trueTarget=(el,selector)=>el.matches(selector)?el:el.parent(selector);
input.evt2target=evt=>input.trueTarget(q(evt.target),'[data-target]');
input.hideLayerSelector=function(evt)
{
	q('.layers').hide();
};
input.init=function()
{
	const
	{btn}=output,
	layers=state.get('public.layers'),
	hideLayerSelectorBtn=btn('hideLayerSelector','Hide Layer Selection'),
	newLayerBtn=btn('layerOpen','new layer'),
	layersDOM=q.create('div',{class:'layers'}).first(hideLayerSelectorBtn,newLayerBtn),
	resizeDOM=q.create('div',{class:'resize-layer','data-view-pane':'layers'}),
	panesDOM=q.create('main',{class:'panes stretch','data-view-pane':'layers'});
	output.layers(Object.values(layers));
	q('body').first(layersDOM,panesDOM.last(resizeDOM));
	input.eventListeners();
};
input.eventListeners=function()
{
	q('.layers').on('click',input.target);
};
input.target=function(evt)//@note impure
{
	const target=input.evt2target(evt);
	if (target+0)
	{
		input[target.data('target')](evt);
	}
};
input.layerOpen=function(evt)
{
	const
	target=input.evt2target(evt),
	pane=logic.mkPane(),
	layer=logic.mkLayer();
	layer.panes.push(pane.id);
	state.set('public.layers.'+layer.id,layer);
	state.set('public.panes.'+pane.id,pane);
	q('.panes').data('view-pane','layer');
	q('.panes .pane').remove();
	output.layer(layer);
	q('.panes .pane>header:first-child').on('click',input.target);
	target.parent('.layers').hide().q('.layer').remove();
};
input.refresh=function(evt)
{
	
};
input.tabClose=function(evt)
{
	const
	target=input.evt2target(evt),
	tab=target.parent('.tab'),
	id=tab.attr('id');
	tab.remove();
	state.delete('public.tabs.'+id);//@todo check linked file.id and delete it if there is no data
};
input.tabOpen=function(evt)
{
	const
	target=input.evt2target(evt),
	tabJSON=logic.mkTab(),
	tab=output.tab(tabJSON);
	state.set('public.tabs.'+tabJSON.id,tabJSON);
	if (!Object.keys(state.get('public.files')).some(x=>x===tabJSON.file))
	{
		const newFile=logic.mkFile({id:tabJSON.file});
		state.set('public.files.'+tabJSON.file,newFile);
	}
	target.parent('.pane').q('.tabs').first(tab);
};
input.tabSwitch=function(evt)
{
	const
	tab=input.evt2target(evt),
	id=tab.attr('id');
};
input.toggleFullscreen=function(evt)
{
	const
	target=input.evt2target(evt),
	pane=target.parent('.pane'),
	id=pane.attr('id'),
	path='public.panes.'+id,
	fullscreen=state.get(path+'.fullscreen');
	state.set(path+'.fullscreen',!fullscreen);
	pane.attr('style',output.paneStyle(state.get(path)));
	//@todo toggle off all other fullscreen tabs in this device
};
input.viewLayers=function(evt)
{
	const
	target=input.evt2target(evt);
	q('.layers').toggleVisibility();
};
*/
export {paper};