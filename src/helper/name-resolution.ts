/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */

const resolveName = (name, args) => args.context && args.context[name];

export default resolveName;
