/*
*  ©2017-2018 HBT Hamburger Berater Team GmbH
*  All Rights Reserved.
*/
import moment from 'moment';
//Classes  
const ast = require('./logicParser/feel-ast').default;
//Adding build methods to prototype of each constructor
require('./logicParser/feel-ast-parser').default(ast);

/**
 * Construct function 'build' and its children
 * Obj may have entry like this:  {llqR:'ProgramNode', p1:ppp, p2:location() }
 * @param {*} Obj parsed Data Object
 */
function constructBuildProto(Obj) {
  if (Obj !== null && typeof Obj.llqR !== undefined && Obj.llqR !== null) {
    Object.keys(Obj).forEach(function (key) {

      if (key.charAt(0) !== 'p') return; //only pick out object keys p1 p2 etc.
      
      //of object is an array, loop through it
      if (Array.isArray(Obj[key])) {
          Obj[key].forEach(function (childObj, index) {
              Obj[key][index] = constructBuildProto(childObj);
          });
      }
      else if (typeof Obj[key] !== 'undefined' && Obj[key] !== null && typeof Obj[key].llqR !== 'undefined' && Obj[key].llqR !== null) {
          Obj[key] = constructBuildProto(Obj[key]);
      }
    });

    switch (Obj.llqR) {
      case 'ProgramNode': return new ast.ProgramNode(Obj.p1, Obj.p2); break;
      case 'IntervalStartLiteralNode': return new ast.IntervalStartLiteralNode(Obj.p1, Obj.p2); break;
      case 'IntervalEndLiteralNode': return new ast.IntervalEndLiteralNode(Obj.p1, Obj.p2); break;
      case 'IntervalNode': return new ast.IntervalNode(Obj.p1, Obj.p2, Obj.p3, Obj.p4, Obj.p5); break;
      case 'SimplePositiveUnaryTestNode': return new ast.SimplePositiveUnaryTestNode(Obj.p1, Obj.p2, Obj.p3); break;
      case 'SimpleUnaryTestsNode': return new ast.SimpleUnaryTestsNode(Obj.p1, Obj.p2, Obj.p3); break;
      case 'QualifiedNameNode': return new ast.QualifiedNameNode(Obj.p1, Obj.p2); break;
      case 'ArithmeticExpressionNode': return new ast.ArithmeticExpressionNode(Obj.p1, Obj.p2, Obj.p3, Obj.p4); break;
      case 'SimpleExpressionsNode': return new ast.SimpleExpressionsNode(Obj.p1, Obj.p2); break;
      case 'NameNode': return new ast.NameNode(Obj.p1, Obj.p2); break;
      case 'LiteralNode': return new ast.LiteralNode(Obj.p1, Obj.p2); break;
      case 'DateTimeLiteralNode': return new ast.DateTimeLiteralNode(Obj.p1, Obj.p2, Obj.p3); break;
      case 'FunctionInvocationNode': return new ast.FunctionInvocationNode(Obj.p1, Obj.p2, Obj.p3); break;
      case 'PositionalParametersNode': return new ast.PositionalParametersNode(Obj.p1, Obj.p2); break;
      case 'ComparisonExpressionNode': return new ast.ComparisonExpressionNode(Obj.p1, Obj.p2, Obj.p3, Obj.p4, Obj.p5); break;

      default: console.error('No match of function found');
    }
  }
  else { throw Error('A build function is absent, the interpretation might be incorrect.') }
}

function resolveExpression(expression, obj) {
  const parts = expression.split('.');
  return parts.reduce((resolved, part) => (resolved === undefined ? undefined : resolved[part]), obj);
}

// Sets the given value to a nested property of the given object. The nested property is resolved from the given expression.
// If the given nested property does not exist, it is added. If it exists, it is set (overwritten). If it exists and is
// an array, the given value is added.
// Examples:
//   setOrAddValue('foo.bar', { }, 10) returns { foo: { bar: 10 } }
//   setOrAddValue('foo.bar', { foo: { }, 10) returns { foo: { bar: 10 } }
//   setOrAddValue('foo.bar', { foo: { bar: 9 }, 10) returns { foo: { bar: 10 } }
//   setOrAddValue('foo.bar', { foo: { bar: [ ] }, 10) returns { foo: { bar: [ 10 ] } }
//   setOrAddValue('foo.bar', { foo: { bar: [ 9 ] }, 10) returns { foo: { bar: [9, 10 ] } }
function setOrAddValue(expression, obj, value) {
  const indexOfDot = expression.indexOf('.');
  if (indexOfDot < 0) {
    if (obj[expression] && Array.isArray(obj[expression])) {
      obj[expression].push(value); // eslint-disable-line no-param-reassign
    } else {
      obj[expression] = value; // eslint-disable-line no-param-reassign
    }
  } else {
    const first = expression.substr(0, indexOfDot);
    const remainder = expression.substr(indexOfDot + 1);
    if (obj[first]) {
      setOrAddValue(remainder, obj[first], value);
    } else {
      obj[first] = setOrAddValue(remainder, {}, value); // eslint-disable-line no-param-reassign
    }
  }
  return obj;
}

// merge the result of the required decision into the context so that it is available as input for the requested decision
function mergeContext(context, additionalContent, aggregate = false) {
  if (Array.isArray(additionalContent)) {
    // additional content is the result of evaluation a rule table with multiple rule results
    additionalContent.forEach(ruleResult => mergeContext(context, ruleResult, true));
    //LLQ addition "if (typeof additionalContent == 'object') " becuase the for ... in should check for object keys
  } else if (typeof additionalContent == 'object'){
    // additional content is the result of evaluation a rule table with a single rule result
    for (const prop in additionalContent) { // eslint-disable-line no-restricted-syntax
      if (additionalContent.hasOwnProperty(prop)) {
        const value = additionalContent[prop];
        if (Array.isArray(context[prop])) {
          if (Array.isArray(value)) {
            context[prop] = context[prop].concat(value); // eslint-disable-line no-param-reassign
          } else if (value !== null && value !== undefined) {
            context[prop].push(value); // eslint-disable-line no-param-reassign
          }
        } else if ((typeof value === 'object') && (value !== null) && !moment.isMoment(value) && !moment.isDate(value) && !moment.isDuration(value)) {
          if ((context[prop] === undefined) || (context[prop] === null)) {
            context[prop] = {}; // eslint-disable-line no-param-reassign
          }
          //LLQ addition, check if a list of strings, than return list, else continue processing
          if (Array.isArray(value) && typeof value[0] == 'string'){
            context[prop] = value;
          }
          else{
            mergeContext(context[prop], value, aggregate);
          }
        } else if (aggregate) {
          context[prop] = []; // eslint-disable-line no-param-reassign
          context[prop].push(value); // eslint-disable-line no-param-reassign
        } else {
          context[prop] = value; // eslint-disable-line no-param-reassign
        }
      }
    }
  }
}

function evaluateRule(rule, resolvedInputExpressions, outputNames, context) {
  for (let i = 0; i < rule.input.length; i += 1) {
    try {
      const inputVariableName = resolvedInputExpressions[i].inputVariableName;
      rule.input[i] = constructBuildProto(rule.input[i]);
      const inputFunction = rule.input[i].build(Object.assign({ _inputVariableName: inputVariableName }, context)); // eslint-disable-line no-await-in-loop
      if (!inputFunction(resolvedInputExpressions[i].value)) {
        return {
          matched: false,
        };
      }
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to evaluate input condition in column ${i + 1}: '${rule.inputValues[i]}': ${err}`);
    }
  }
  const outputObject = {};
  for (let i = 0; i < rule.output.length; i += 1) {
    if (rule.output[i] !== null) { //LLQ toevoeging: && rule.output[i] !== "-"
      rule.output[i] = constructBuildProto(rule.output[i]);
      const outputValue = rule.output[i].build(context); // eslint-disable-line no-await-in-loop
      //LLQ addition, for date with LLQformatted (in date.ts with momentjs)
      if(Array.isArray(outputValue) && typeof  outputValue[0] !== 'undefined' && outputValue[0].isDate && typeof outputValue[0].LLQformatted !== 'undefined'){
        setOrAddValue(outputNames[i], outputObject, outputValue[0].LLQformatted); //formatted date
      }
      else{ //the original standard option without LLQ addition
        setOrAddValue(outputNames[i], outputObject, outputValue[0]);
      }
    } else {
      setOrAddValue(outputNames[i], outputObject, undefined);
    }
  }
  return { matched: true, output: outputObject };
}

export default function evaluateDecision(decisionId, decisions, context, alreadyEvaluatedDecisions) {
  /*console.log("EVALUATE DATA,\n decisionID: ", JSON.parse(JSON.stringify(decisionId)), 
    "\nParsed Decisions: ", JSON.parse(JSON.stringify(decisions)), 
    "\nContext: ", JSON.parse(JSON.stringify(context)), 
    "\nAlreadyEvaluated: ", alreadyEvaluatedDecisions );
  */
  if (!alreadyEvaluatedDecisions) {
    console.log("Submitted form data to evaluate: ", JSON.parse(JSON.stringify(context))); //in this 'if' so will only fire once!
    alreadyEvaluatedDecisions = []; // eslint-disable-line no-param-reassign
  }
  const decision = decisions[decisionId];
  if (decision === undefined) {
    throw new Error(`No such decision "${decisionId}"`);
  }

  // execute required decisions recursively first
  for (let i = 0; i < decision.requiredDecisions.length; i += 1) {
    const reqDecision = decision.requiredDecisions[i];
    // check if the decision was already executed, to prevent unecessary evaluations if multiple decisions require the same decision
    if (!alreadyEvaluatedDecisions[reqDecision]) {
      const requiredResult = evaluateDecision(reqDecision, decisions, context, alreadyEvaluatedDecisions); // eslint-disable-line no-await-in-loop
      mergeContext(context, requiredResult);
      alreadyEvaluatedDecisions[reqDecision] = true; // eslint-disable-line no-param-reassign
    }
  }
  console.log(`Evaluating decision "${decisionId}"...`);
  const decisionTable = decision.decisionTable;

  // resolve input expressions
  const resolvedInputExpressions = [];
  for (let i = 0; i < decisionTable.parsedInputExpressions.length; i += 1) {
    const parsedInputExpression = decisionTable.parsedInputExpressions[i];
    const plainInputExpression = decisionTable.inputExpressions[i];
    try {
      let parsedInputExpressionConstructed = constructBuildProto(parsedInputExpression);
      const resolvedInputExpression = parsedInputExpressionConstructed.build(context); // eslint-disable-line no-await-in-loop
      // check if the input expression is to be treated as an input variable - this is the case if it is a qualified name
      let inputVariableName;
      if (parsedInputExpressionConstructed.simpleExpressions && parsedInputExpressionConstructed.simpleExpressions[0].type === 'QualifiedName') {
        inputVariableName = parsedInputExpressionConstructed.simpleExpressions[0].names.map(nameNode => nameNode.nameChars).join('.');
      }//@ts-ignore
      resolvedInputExpressions.push({ value: resolvedInputExpression[0], inputVariableName });
    } catch (err) {
      throw new Error(`Failed to evaluate input expression ${plainInputExpression} of decision ${decisionId}: ${err}`);
    }
  }

  // initialize the result to an object with undefined output values (hit policy FIRST or UNIQUE) or to an empty array (hit policy COLLECT or RULE ORDER)
  const decisionResult = (decisionTable.hitPolicy === 'FIRST') || (decisionTable.hitPolicy === 'UNIQUE') ? {} : [];
  decisionTable.outputNames.forEach((outputName) => {
    if ((decisionTable.hitPolicy === 'FIRST') || (decisionTable.hitPolicy === 'UNIQUE')) {
      setOrAddValue(outputName, decisionResult, undefined);
    }
  });

  // iterate over the rules of the decision table of the requested decision,
  // and either return the output of the first matching rule (hit policy FIRST)
  // or collect the output of all matching rules (hit policy COLLECT)
  let hasMatch = false;
  for (let i = 0; i < decisionTable.rules.length; i += 1) {
    const rule = decisionTable.rules[i];
    let ruleResult;
    try {
      ruleResult = evaluateRule(rule, resolvedInputExpressions, decisionTable.outputNames, context); // eslint-disable-line no-await-in-loop
    } catch (err) {
      throw new Error(`Failed to evaluate rule ${rule.number} of decision ${decisionId}:  ${err}`);
    }
    if (ruleResult.matched) {
      // only one match for hit policy UNIQUE!
      if (hasMatch && (decisionTable.hitPolicy === 'UNIQUE')) {
        throw new Error(`Decision "${decisionId}" is not unique but hit policy is UNIQUE.`);
      }
      hasMatch = true;
      console.log(`Result for decision "${decisionId}": ${JSON.stringify(ruleResult.output)} (rule ${i + 1} matched)`);

      // merge the result of the matched rule
      if ((decisionTable.hitPolicy === 'FIRST') || (decisionTable.hitPolicy === 'UNIQUE')) {
        decisionTable.outputNames.forEach((outputName) => {
          const resolvedOutput = resolveExpression(outputName, ruleResult.output);
          if (resolvedOutput !== undefined || decisionTable.hitPolicy === 'FIRST' || decisionTable.hitPolicy === 'UNIQUE') {
            setOrAddValue(outputName, decisionResult, resolvedOutput);
          }
        });
        if (decisionTable.hitPolicy === 'FIRST') {
          // no more rule results in this case
          break;
        }
      } else {//@ts-ignore, whether decsionResult is an array depends on the Hitpolicy
        decisionResult.push(ruleResult.output);
      }
    }
  }
  if (!hasMatch && decisionTable.rules.length > 0) {
    console.log(`No rule matched for decision "${decisionId}".`);
  }
  return decisionResult;
}