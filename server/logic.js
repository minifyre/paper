'use strict';
const logic={};
logic.ext=x=>(x.split('.')||['']).pop().toLowerCase();
module.exports={logic};