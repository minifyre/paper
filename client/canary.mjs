import code from './node_modules/code-editor/code.mjs'
import tabbed from './node_modules/tabbed-editor/tabbed.mjs'
import truth from './node_modules/truth/truth.mjs'
const apps={code,tabbed}
onload=async function()
{
	await Promise.all([code,tabbed].map(fn=>fn()))//init custom-els
	const
	read=
	{
		files:{},
//panes:{window:apps.pane.logic({id:'window'})},
		tabs:{}
	},
	[browser,tabs,text]=['iframe.pane','tabbed-editor','code-editor']
						.map(x=>document.querySelector(x)),
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
	tabs.addEventListener('tab',function({detail,target})
	{
		const
		{close,open}=detail,
		child=target.querySelector(':scope>*')
		if(close)
		{
			delete state.files[close]//@todo preserve if file has a value
			delete state.tabs[close]
		}
		if(open)
		{
			if(!state.files[open])
			{
				state.files[open]={id:open,value:''}
				//@todo get default view from child (sans value)
				state.tabs[open]={id:open,view:{}}
			}
			const [{value},view]=['files','tabs'].map(x=>state[x][open])
			child.state=Object.assign({},{value},view)
		}
	})
	text.addEventListener('input',({target})=>state.files[tabs.tab].value=target.value)
}