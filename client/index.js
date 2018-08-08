'use strict';
//modules
import {chant} from '../js/chant/chant.js';
//import {pane} from '../js/pane/pane.js';
//namespaces
const
state=chant(),
input={},
logic={},
output={};
input.updatePic=function(action)
{
	if (action.id!==state.get('private.id'))
	{
		output.renderPic(action.val);
	}
};
input.updateTxt=function(action)
{
	if (action.id!==state.get('private.id'))
	{
		output.renderCode(action.val);
	}
};
input.updateVid=function(action)
{
	if (action.id!==state.get('private.id'))
	{
		output.renderVid(action.val);
	}
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
	ctx=el.getContext('2d'),
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
		x=Math.round((evt.clientX-can.x)*(img.w/can.w)),
		y=Math.round((evt.clientY-can.y)*(img.h/can.h));
		state.set('public.files.pic.pts.'+x+'x'+y,1);
		//ctx.fillRect(x,y,1,1);//@todo remove this & use output.render instead
		//@todo add pt to state
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
input.init=function()
{
	q('main').last
	(
		output.paneBrowser(),
		output.paneTxt(),
		output.paneVid(),
		output.panePic()
	);
	state.with()
	.then(function()//setup inital state if no other clients initated it
	{
		if (!state.get('public.files').txt)
		{
			state.set('public.files.txt',{data:''});
		}
		if (!state.get('public.files').pic)
		{
			state.set('public.files.pic',{pts:{}});
		}
		if (!state.get('public.files').vid)
		{
			state.set('public.files.vid',
			{
				id:'PUv66718DII',
				time:0.556959
			});
		}
		state.on({path:'public.files.pic',type:'set',func:input.updatePic});
		state.on({path:'public.files.txt',type:'set',func:input.updateTxt});
		state.on({path:'public.files.vid',type:'set',func:input.updateVid});
		output.renderCode(state.get('public.files.txt.data'));
		output.renderPic();
	})
	.catch(console.error);
	output.initVideoPlayer();
	input.eventHandlers();
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
	const el=q('textarea');
	el.val(txt);//.html(txt);//@todo determine if val is actually doing anything
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
	Object.keys(state.get('public.files.pic.pts'))
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