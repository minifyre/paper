'use strict';
const
util=
{
	id:()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,util.idHelper),
	idHelper:c=>(c^util.rand()[0]&15>>c/4).toString(16),
	mk:defaultObj=>(opts={})=>Object.assign({id:util.id()},defaultObj,opts),
	rand:()=>crypto.getRandomValues(new Uint8Array(1))
},
input={},
logic=
{
	mkFile:util.mk(	{data:{},path:'',owner:''})//@todo add reviewers & editors
},
output={},
paper={input,logic,output}
export {paper};