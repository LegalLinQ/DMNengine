import evaluateDecision from './decision-table-xml';
import eventCreator from './eventCreator';
import formHandler from './formHandler';
import inliner from './inline';

if( document.getElementById('llqEngine') !== null ) inliner();

export { evaluateDecision, eventCreator, formHandler, inliner }