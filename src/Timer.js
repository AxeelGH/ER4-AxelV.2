export default class Timer{

    constructor(value, timeChangeValue){
        
        this.value = value;                     //timer value in seconds
        this.timeChangeCounter = 0;             //counter to change time
        this.timeChangeValue = timeChangeValue; //time to change value in seconds
    }
}