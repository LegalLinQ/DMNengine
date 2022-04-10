import evaluateDecision from './decision-table-xml';
import formHandler from './formHandler'
import eventCreator from './eventCreator';

export default function inliner(){
    var decisionId = document.getElementById('decisionIdData')?.innerHTML; //@ts-ignore
    var form = document.getElementById(decisionId);

    if(form){
        form.addEventListener('submit', formSubmit);
        form.addEventListener('reset', formReset);
    }
    //@ts-ignore
    var eventListeners = document.getElementById("eventListners").innerHTML; //@ts-ignore
    if(eventListeners && eventListeners.trim() !== 'undefined'){eventCreator( JSON.parse(eventListeners) ) }

    function formSubmit(event) {
        event.preventDefault(); 
        let formResult = formHandler(event.target);
        //@ts-ignore
        let decisions = pDJ2JS(document.getElementById('decisionData').innerHTML);

        let engineResult = evaluateDecision(decisionId,decisions,formResult);

        if(engineResult.length == 0 ){
            let emptyMessage;
            emptyMessage = [{"default":"... geen resultaat."}]
            //@ts-ignore
            document.getElementById('outputLabels').innerHTML = '{"default":"Helaas ..."}';
            engineResult = emptyMessage;// throw Error('Geen resultaat');
        } 

        if(document.getElementById('resultStorage') !== null){//@ts-ignore
            document.getElementById('resultStorage').innerHTML = JSON.stringify(engineResult); //MutationObserver will pick this up
        }
        else{ console.error("Invalid HTML, result div is missing")}

    }

    function formReset() {
        //@ts-ignore
        form.reset();
    }
    
    //GARAGE, to store things
    function pDJ2JS(d){let result= {}; let h =  JSON.parse(d); Object.keys(h).forEach(dID=>{result[dID]=JSON.parse(h[dID])}); return result;}
}