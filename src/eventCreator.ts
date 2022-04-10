/**
 * Webform support - webbrowser event creator to have response on select of checkbox or radio
 * @param data 
 */

export default function eventCreator(data){
    console.log("EventCreator Data: ", data)   //@ts-ignore
    data.forEach(field => {
        console.log("Event created for: ", field.TargetField+'_wrap')

        //Data structure:  { TargetField : nameID, ConditionField : conditionField, Operator : operator, Condition : condition }
        const targetField = document.getElementById(field.TargetField+'_wrap');
        //@ts-ignore Start to hide this field
        targetField.style.display = "none";
        //@ts-ignore set required to false to be sure
        targetField.required = false;

        const conditionField = document.getElementById(field.ConditionField+'_wrap');             
        console.log("EventCreator Conditionfield: ", conditionField)   //@ts-ignore

        conditionField.addEventListener('change', updateValue.bind({
            TargetField:field.TargetField,
            Condition:field.Condition,
            Operator:field.Operator,
            //Required:field.Required //not used, implementation is difficult as it is different per form control etc.
        }));          //@ts-ignore

    });

    
    function updateValue(this: any, evt) {
        let value = evt.target.value.repeat(1);
        if(value == 'on' && evt.target.type == 'checkbox'){
            value = evt.target.checked?'true':'false';
        }
        else if(value == 'on' && evt.target.type == 'radio'){
            value = evt.target.id
        }
        //normalize to exclude capitals
        if(typeof value == 'string') value = value.toLowerCase();
        if(typeof this.Condition == 'string') this.Condition = this.Condition.toLowerCase();

        //console.log(`Event fired with value: "${value}"`, "\n",evt, "\n", this);
        console.log(`Event fired with value: "${value}"`);

        if(
            ((this.Operator == '==' || this.Operator == '===')  && value == this.Condition)
            || (this.Operator == '<' && value < this.Condition)
            || (this.Operator == '>' && value > this.Condition)
            || (this.Operator == '<=' && value <= this.Condition)
            || (this.Operator == '>=' && value >= this.Condition)
        ){
            //@ts-ignore
            document.getElementById(this.TargetField+'_wrap').style.display = "block";
        }
        else { //@ts-ignore
            document.getElementById(this.TargetField+'_wrap').style.display = "none"; 
        }
        evt.stopPropagation();
    }

}