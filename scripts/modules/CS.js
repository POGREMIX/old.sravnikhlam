//доработать совпадение имен
//доработать механизм удаления после подтверждения
class CS {
    constructor(timeout){
        this.timeout = timeout;
        this.collection = new Map();

        this.timerId = setInterval(() => {
            let curTime = new Date()//

            for(let elem of this.collection){
                let time = elem[0];
                let map = elem[1];

                let parsedTime = new Date(time)

                let now = curTime.getTime()
                let timeoutTime = parsedTime.getTime()+this.timeout

                if(now >= timeoutTime){
                    //console.log('@')
                    this.collection.delete(time)
                    //console.log(this.collection)
                }
            }
        }, this.timeout)
    }

    Add(name, data){
        let date = new Date()
        this.collection.set(date, new Map([[name, data]]))
    }

    //Remove(){
    //    this.collection.delete()
    //}

    Show(){
        console.log(this.collection)
    }

    Stop(){
        this.collection = null;
        clearInterval(this.timerId);
    }

    GetValue(name){
        for(let elem of this.collection){
            let time = elem[0]
            let map = elem[1]
            let mapped = new Map(map)
            
            let temp = mapped.get(name)
            if(temp != undefined){

                //удаление кода сразу
                //добавить позже условие, если мап пустой, то затирать.
                let t = this.collection.get(time).delete(name)
                
                return temp;
            }
        }
    }
}

function Create(timeout){
    return new CS(timeout);
}

module.exports.Create = Create