import code from './node_modules/code-editor/code.mjs'
import tabbed from './node_modules/tabbed-editor/index.mjs'
import truth from './node_modules/truth/truth.mjs'
import youtube from './node_modules/youtube-viewer/index.mjs'
const apps={code,tabbed}
onload=async function()
{
	// const {error,value}=await fetch('./node_modules/')
	// .then(x=>x.text())
	// .then(value=>({value}))
	// .catch(error=>{error})
	// if(error) return console.error(error)
// 	<tabbed-editor class=pane>
// 	<code-editor></code-editor>
// </tabbed-editor>
// <iframe class=pane></iframe>
// <youtube-player class=pane></youtube-player>
	await Promise.all([code,tabbed,youtube].map(fn=>fn()))//init custom-els
	const
	read=
	{
		files:{},
		panes:{},
		tabs:{}
	},
	// [browser,tabs,text]=['iframe.pane','tabbed-editor','code-editor']
	// 					.map(x=>document.querySelector(x)),
	renderView=function({type,path,val})
	{
		if(type==='get') return			
		if(path.slice(-1)[0]==='value') renderBrowser(browser,truth.ref(read,path))
	},
	renderBrowser=function({contentWindow},txt)
	{
		const doc=contentWindow.document
		doc.open('text/html')
		doc.write(txt)
		doc.close()
	},
	//@todo +pre op to set target=el or server that the change came from
	state=truth(read,renderView)
	if(!Object.keys(state.panes).length)
	{
		const
		//@todo add tabs to panes
		pane={height:50,id:'sub-pane',type:'app-viewer',width:50,x:0,y:0},
		mkPane=x=>Object.assign({},pane,x)
		Object.assign(state.panes,
		{
			code:mkPane({id:'code',tabs:[{id:'code',name:'index.html'}],type:'code-editor'}),
			iframe:mkPane({id:'iframe',tabs:[{id:'code',name:'index.html'}],type:'iframe-viewer'}),
			youtube:mkPane({id:'youtube',tabs:[{id:'vide',name:'video'}],type:'youtube-viewer'}),
			pixel:mkPane({id:'pixel',tabs:[{id:'pic',name:'pic.png'}],type:'pixel-editor'})
		})
	}
	Object.values(state.panes)
	.forEach(function(pane)
	{
		const
		tabs=Object.assign(new tabbed.editor(pane),{className:'pane'}),
		child=document.createElement(pane.type)
		tabs.append(child)
		document.body.append(tabs)
	})
	//@todo get code from server
	//@todo if files & tabs are empty, set default files
	// if(!state.files.code)
	// {
	// 	//@todo make file creator function
	// 	state.files.code={id:'code',path:'',value:'<!Doctype html>\n<h1>Hello!</h1>'}
		
	// }
	//@tod load tabs with tabs in state
	// tabs.addEventListener('tab',function({detail,target})
	// {
	// 	const
	// 	{close,open}=detail,
	// 	child=target.querySelector(':scope>*')
	// 	if(close)
	// 	{
	// 		delete state.files[close]//@todo preserve if file has a value
	// 		delete state.tabs[close]
	// 	}
	// 	if(open)
	// 	{
	// 		if(!state.files[open])
	// 		{
	// 			state.files[open]={id:open,value:''}
	// 			//@todo get default view from child (sans value)
	// 			state.tabs[open]={id:open,view:{}}
	// 		}
	// 		const [{value},view]=['files','tabs'].map(x=>state[x][open])
	// 		child.state=Object.assign({},{value},view)
	// 	}
	// })
	// text.addEventListener('input',({target})=>state.files[tabs.tab].value=target.value)
}