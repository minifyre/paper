import bcrypt from 'bcrypt'
import silo from './util.js'

const
{config,util}=silo,
logic=opts=>Object.assign({},config.state,opts)
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()

logic.authPwdCheck=async (pwd,hash)=>await bcrypt.compare(pwd,hash)
logic.authPwdHash=async (pwd,saltRounds=10)=>await bcrypt.hash(pwd,saltRounds)

logic.authLogin=async function(db,user,pwd)
{
	const hash=db[user]
	//user does not exist//@todo add random delay to make less obvious
	return !hash?false:await logic.authPwdCheck(pwd,hash)
}

export default Object.assign(silo,{logic})