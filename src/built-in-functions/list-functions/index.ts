/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

//import * as _ from "lodash"; //min max sum reverse union uniq flattenDeep
import L_min from "lodash/min";
import L_max from "lodash/max";
import L_sum from "lodash/sum";
import L_reverse from "lodash/reverse";
import L_union from "lodash/union";
import L_uniq from "lodash/uniq";
import L_flattenDeep from "lodash/flattenDeep";

const listContains = (list, element) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (element === undefined || element === null) {
    return false;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.indexOf(element) > -1;
  }
};

const count = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.length;
  }
};

const min = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return L_min(list);
  }
};

const max = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return L_max(list);
  }
};

const sum = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return L_sum(list);
  }
};

const mean = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  let result;
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (list.length > 0) {
    result = (L_sum(list)) / (list.length);
  }
  return result;
};

const and = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.reduce((recur, next) => recur && next, true);
  }
};

const or = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.reduce((recur, next) => recur || next, false);
  }
};

const append = (list, element) => {
  console.log(list, element, typeof list)
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (element === undefined) {
    return list;
  } else if (Array.isArray(element)) {
    return list.concat(element);
  } else {
    return list.concat([element]);
  }
};

const concatenate = (...args) =>
  args.reduce((result, next) => {
    if (Array.isArray(next)) {
      return Array.prototype.concat(result, next);
    }
    return result;
  }, []);

const insertBefore = (list, position, newItem) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (position === undefined || position === null) {
    return position;
  }
  if (newItem === undefined) {
    return newItem;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (position > list.length || position < 0) {
    throw new Error(`cannot insert ${newItem} at position ${position} in list ${list}`);
  } else { //@ts-ignore, check is done whether or not this is actually an array
    const newList = [].concat(list);//@ts-ignore
    newList.splice(position, 0, newItem);
    return newList;
  }
};

const remove = (list, position) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (position === undefined || position === null) {
    return position;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (position > list.length - 1) {
    throw new Error(`cannot remove element at position ${position} in list ${list}`);
  } else {//@ts-ignore
    const newList = [].concat(list);
    newList.splice(position, 1);
    return newList;
  }
};

const reverse = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return L_reverse(list);
  }
};

const indexOf = (list, match) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (match === undefined) {
    return match;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    const indexes = [];//@ts-ignore
    const remainingList = [].concat(list);
    let offset = 0;//@ts-ignore
    let nextIndex = remainingList.indexOf(match);
    while (nextIndex >= 0) {//@ts-ignore
      indexes.push(nextIndex + offset);
      remainingList.splice(0, nextIndex + 1);
      offset += nextIndex + 1;//@ts-ignore
      nextIndex = remainingList.indexOf(match);
    }
    return indexes;
  }
};

const union = (...args) => L_union(...args);

const distinctValues = (list) => {
  if (list === undefined || list === null) {
    return list;
  }
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return L_uniq(list);
  }
};

const flatten = (...args) => {
 //@ts-ignore // remove context from args array (last element)
  const array = [].concat(args);
  array.splice(array.length - 1, 1);
  if (array.length === 1 && (array[0] === null || array[0] === undefined)) {
    return array[0];
  }
  return L_flattenDeep(array);
};

export default {
  'list contains': listContains,
  count,
  min,
  max,
  sum,
  mean,
  and,
  or,
  append,
  concatenate,
  'insert before': insertBefore,
  remove,
  reverse,
  'index of': indexOf,
  union,
  'distinct values': distinctValues,
  flatten,
};
