import bcrypt from 'bcrypt'
import silo from './util.mjs'

const
{config,util}=silo,
logic=opts=>Object.assign({},config.state,opts)
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase()

export default Object.assign(silo,{logic})