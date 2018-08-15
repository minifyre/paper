'use strict';
import {chant} from '../js/chant/chant.mjs';
import {paper} from './paper.js';
const
state=chant(),
input={},
logic={},
output={};
input.updatePic=function(action)//@todo actions don't have id props...
{
	output.renderPic();
};
input.updateTxt=function(action)
{
	action.device!==state.get('private.id')?output.renderCode(action.val):
											output.renderBrowser(action.val);
};
input.updateVid=function(action)
{
	action.device!==state.get('private.id')?output.renderVid(action.val):'';
};
input.eventHandlers=function()
{
	q('textarea').on('input',input.txt);
	q('canvas').on('pointerdown',input.drawing);
};
input.drawing=function(evt)
{
	const
	target=q(evt.target),
	el=target.norm(),
	drawPt=function(evt)
	{
		const
		can=
		{
			h:el.offsetHeight,
			w:el.offsetWidth,
			x:el.offsetLeft,
			y:el.offsetTop
		},
		img=
		{
			h:el.height,
			w:el.width
		},
		x=Math.round((evt.pageX-can.x)*(img.w/can.w)),
		y=Math.round((evt.pageY-can.y)*(img.h/can.h));
		console.log(can,evt);
		state.set('public.files.pic.pts.'+x+'x'+y,1);
	},
	cleanup=function()
	{
		target
		.off('pointerdown,pointermove',drawPt)
		.off('pointerup',cleanup)
		.on('pointerdown',input.drawing);
	};
	target
	.off('pointerdown',input.drawing)
	.on('pointerdown,pointermove',drawPt)
	.on('pointerup',cleanup);
	drawPt(evt);
};
input.init=async function()
{
	await state.with();

	const
	preview=q.create('textarea',{class:'state',style:'height:100vh; width:100vw;'}),
	showState=()=>preview.html(JSON.stringify(state.get(''),null,4));
	q('body').first(preview);
	showState();
	state.on({type:'delete',func:showState});
	state.on({type:'set',func:showState});
	// const
	// userId='tmpUsrId-'+state.get('private.id'),//@todo change this
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
		//setup inital state if no other clients initated it
		//old code
	// 	const
	// 	keys=state.keys('public.files'),
	// 	no=x=>!keys.includes(x);
	// 	no('txt')?state.set('public.files.txt',{data:''}):'';
	// 	no('pic')?state.set('public.files.pic',{pts:{}}):'';
	// 	no('vid')?state.set('public.files.vid',
	// 	{
	// 		id:'PUv66718DII',
	// 		time:0.556959
	// 	}):'';
	// 	//+state listeners
	// 	state.on({path:'public.files.pic',type:'set',func:input.updatePic});
	// 	state.on({path:'public.files.txt',type:'set',func:input.updateTxt});
	// 	state.on({path:'public.files.vid',type:'set',func:input.updateVid});
	// 	//setup panes
	// 	q('main').last
	// 	(
	// 		output.paneVid(),
	// 		output.panePic(),
	// 		output.paneTxt(),
	// 		output.paneBrowser()
	// 	);		
	// 	//inital renders
	// 	output.renderCode(state.get('public.files.txt.data'));
	// 	output.renderPic();
	// 	output.initVideoPlayer();
	// 	input.eventHandlers();
	// })
	// .catch(console.error);
};
input.txt=function(evt)
{
	const val=q(evt.target).val();
	state.set('public.files.txt.data',val);
};
//{app,id,src}pane.output.paneDOM(json)
output.paneBrowser=()=>q.create('iframe',{class:'pane',name:'browser'});
output.panePic=()=>q.create('canvas',{class:'pane'});
output.paneTxt=()=>q.create('textarea',{class:'pane'});
output.paneVid=()=>q.create('div',{class:'pane',id:'player'});
output.renderCode=function(txt)
{
	output.renderEditor(txt);
	output.renderBrowser(txt);
};
output.renderEditor=function(txt)
{
	q('textarea').val(txt);
	//.html(txt);//@todo did html preserve the cursor position?
};
output.renderBrowser=function(txt)
{
	const 
	el=q('iframe'),
	doc=el.norm('contentWindow').document;
	//open('','browser');
	doc.open('text/html');
	doc.write(txt);
	doc.close();
};
output.renderPic=function()
{
	const
	el=q('canvas').norm(),
	ctx=el.getContext('2d'),
	{height,width}=el;
	ctx.clearRect(0,0,width,height);
	state.keys('public.files.pic.pts')
	.forEach(function(pt)
	{
		const [x,y]=pt.split('x');
		ctx.fillRect(x,y,1,1);
	});
};
//youtube player
output.initVideoPlayer=function()
{
	const
	url='https://www.youtube.com/iframe_api',
	tag=q.create('script').attr('src',url).norm();
	q('script').prev(tag);
	var
	player,
	setup=false;
	output.renderVid=function(evt)
	{
		const {id,time}=state.get('public.files.vid');
		player.loadVideoById(id,time);
		player.pauseVideo();
	};
	//@todo find a way to not pollute global scope
	window.onYouTubeIframeAPIReady=function()
	{
		player=new YT.Player('player',
		{
			height:'390',
			width:'640',
			videoId:state.get('public.files.vid.id'),
			/*playerVars:
			{
				listType:'playlist',
				list:'PLjhH01A4YOO3h0LwGNTf2F37L0_Gn7O4D',
			},*/
			events:
			{
				onReady:function()
				{
					if (!setup)
					{
						output.renderVid();
						setup=true;
					}
				},
				onStateChange:function(evt)
				{
					if (evt.data===YT.PlayerState.PAUSED)
					{
						state.set('public.files.vid',
						{
							id:player.getVideoData().video_id,
							time:player.getCurrentTime()
						});
					}
				}
			}
		});
	};
};
onload=input.init;