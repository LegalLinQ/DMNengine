/**
 * Handle input data from form
 */

import date from './built-in-functions/date-time-files/date';
import {default as LLQfunctions} from './LLQ-functions';

/**
 * Get all the data and return data object in DMN 'context' format
 * @param data = event.target from the onSubmit form event
 */
export default function formHandler(data){
    var FormValues = {};

    for (var i = 0; i < data.length; i++) {

        if (data[i].nodeName == 'SELECT' || data[i].nodeName == 'INPUT' || data[i].nodeName == 'TEXTAREA') {

            let v = data[i].value;

            if(data[i].nodeName == 'SELECT' && v == ""){
                v = false; //empty select, set false to exclude data
            }

            if(data[i].nodeName == 'TEXTAREA'){
                v = String(v);
            }
            else if (data[i].type == 'checkbox') {
                if (data[i].closest("fieldset").id == data[i].name) {
                    //add checked box id to array of values
                    if(data[i].checked){
                        //when first checked checkbox, make array first
                        if(typeof FormValues[data[i].name] == 'undefined')FormValues[data[i].name] = [];
                        FormValues[data[i].name].push(data[i].id);
                    } 
                    continue;//this checkbox is handled at FIELDSET
                }
                //output is boolean
                else{ 
                    v = data[i].checked;
                }
            }
            else if(data[i].type == 'radio') {
                //all radio items pass by, but the checked one is "true" and hence incorporated in results
                //manipulate result: not question as "key" of the object, but "name" (same for all radio's) as key and question as "value"
                data[i].checked?v=data[i].id:v="";
            }
            else if(!isNaN(v)){ 

                v = Number(v);

            }
            else if (validateDate(v)){

                v = date( new Date(v) ); 
                //v = date( v );
            }
            else v = String(v);

            let key = data[i].name?data[i].name:data[i].id;
            if ((v || typeof v == 'boolean') && v !== ""){ FormValues[key] = v; }
        }
    }

        function validateDate(isoDate) {
            if (isNaN(Date.parse(isoDate))) {  return false; }
            else { if (isoDate != (new Date(isoDate)).toISOString().substr(0,10)) { return false;} //reken terug, moet gelijk zijn met origineel
            }  return true; //is een date
        }
    
    return Object.assign({}, FormValues, LLQfunctions); 
}