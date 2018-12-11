import bcrypt from 'bcrypt'
import silo from './util.js'

const
{config,util}=silo,
logic=opts=>Object.assign({},config.state,opts)
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()

logic.authPwdCheck=async (pwd,hash)=>await bcrypt.compare(pwd,hash)
logic.authPwdHash=async (pwd,saltRounds=10)=>await bcrypt.hash(pwd,saltRounds)

logic.getUser=(state,name)=>Object.values(state.file.users).find(user=>name===user.username)

logic.authLogin=async function(state,username,pwd)
{
	const user=logic.getUser(state,username)
	//@todo add random delay to make it less obvious that user does not exist
	return !user?false:await logic.authPwdCheck(pwd,user.password)
}

export default Object.assign(silo,{logic})