/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
import date from './date';
import dateAndTime from './date-time';
import duration from './duration'; //export default { duration, 'years and months duration': yearsAndMonthsDuration, 'days and time duration': daysAndTimeDuration };
import {setTimezone, formatDateTime, formatDate, formatTime, format} from './misc';
import time from './time';
//Do not export following, was originally in another folder and not part of BuiltInFns (see feel-ast-parser.ts)
//import { valueT, valueInverseT, valueDT, valueInverseDT, valueDTD, valueInverseDTD, valueYMD, valueInverseYMD } from './value';

export default {date, dateAndTime, duration, setTimezone, formatDateTime, formatDate, formatTime, format, time}