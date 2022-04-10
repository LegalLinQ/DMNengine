/**
 * Some helpfull functions, specials from DMN by Legal LinQ for certain use cases
 */

import difference from "lodash/difference";
//import { format } from './built-in-functions/date-time-files/misc';
import moment from 'moment';


//LLQ addition, to make a list from excel
const list = (...args) => {
    let resultArray = args.filter(function (el) {
      return typeof el == 'string' && el.length > 0;
    });
    return resultArray;
  }

const makeString = (...args) => {
    return JSON.stringify(args);
}

//What elements of the mainList are not in the subList
const listDifference = (mainList, subList) => {
    
    if(!Array.isArray(mainList) || !Array.isArray(subList)){
        console.error(`List Intersection types are for mainlist: "${typeof mainList}" and for subList: "${typeof subList}".`)
        return 'ERROR, one of the entries is not a list';
    }

    return difference(mainList,subList);
}

const dateFormatting = (dateProxy, requestedFormat, language = null) => {
    if(!dateProxy.isDate || typeof requestedFormat !== 'string') return dateProxy;

    moment.locale('en'); // default the locale to English
    var localLocale = moment(dateProxy);

    //locale taal, defaults to English
    if(language !== null && typeof language == 'string') localLocale.locale(String(language));

    let formattedDate = localLocale.format(requestedFormat);
    //console.log("DATE Formatting", "\nProxy: ", dateProxy, "\nFormat: ", requestedFormat, "\nResult: ",formattedDate, "\nTypeof: ",typeof formattedDate)

    return formattedDate;
}

const docxObj = (docx, docxStyle = null, docxTag = null) =>{
    //console.log('\ndocx:',docx, '\ndocxStyle:',docxStyle,'\ndocxTag:',docxTag)
    return JSON.stringify({'docx':docx,'docxTag':docxTag, 'docxStyle':docxStyle});
}


//export default Object.assign({}, dateTime, list, boolean, defined, string);
export default {
    'LLQlist': list,
    'LLQstring' : makeString,
    'LLQdiff' : listDifference,
    'LLQfDate' : dateFormatting,
    'LLQdocx' : docxObj,
};