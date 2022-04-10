
import {default as dateTime} from './date-time-files';
import {default as boolean} from './boolean-functions';
import {default as defined} from './defined';
import {default as string} from './string-functions';
import {default as list} from './list-functions';

export default Object.assign({}, dateTime, list, boolean, defined, string);
