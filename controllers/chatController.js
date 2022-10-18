const pg = require("../scripts/modules/postgreSQLConnector")
let moment = require("moment");
const clients = new Set();


exports.getUpdates = async function (request, response){
    // // console.log(request.query.id)
    // let lastId = request.query.id;
    // // console.log(lastId)
    // let query;

    // if(lastId == 'undefined'){
    //     query = `select * from
	// 	                (SELECT ch.id, ch.value, ch.date, u.login
    //                     FROM public.chat ch join public.user u 
    //                     on ch.userId = u.id
    //                     order by ch.id desc
    //                     limit 10) t 
    //             order by t.id asc`
    // } else {
    //     query = `SELECT ch.id, ch.value, ch.date, u.login
    //             FROM public.chat ch join public.user u 
    //             on ch.userId = u.id
    //             where ch.id>${lastId}
    //             order by ch.id asc;`
    // }

    // let resObj = await pg.run(query);
    // let result = resObj.getAll();

    // result.forEach(element => {
    //     element.date = moment(element.date).format('HH:mm:ss')
    //     // console.log(element)
    // });
    // // console.log(result)
    // response.send(result)
};


exports.addChatMessage = async function(request, response){

    // let message = request.body;
    // let currentDate = moment().format();
    // message["date"] = currentDate;

    // // console.log(message)

    // let query = `INSERT INTO public.chat (value, date, userId) 
    //              VALUES ('${message.value}', '${message.date}', ${message.userId})`;

    // await pg.run(query);
    // response.sendStatus(200);
};


exports.Common = async function(ws, req){
    clients.add(ws)
    
    query = `select * from
                (SELECT ch.id, ch.value, ch.date, u.login
                FROM public.chat ch join public.user u 
                on ch.userId = u.id
                order by ch.id desc
                limit 10) t 
            order by t.id asc`
    
    let raw = await pg.run(query);
    let result = raw.getAll()
    // console.log(result)
    
    for(let item of result){
        // console.log(item)
        item.date = moment(item.date).format('HH:mm:ss')
        ws.send(JSON.stringify(item))
    }
    
    
    ws.on('message', async function(msg) {
        console.log(msg)
        let message = JSON.parse(msg)
        // console.log(message)
        //
        let login = message.login
        // console.log(login)
    
        let date = moment().format();
        let time = moment(new Date()).format('HH:mm:ss')
    
        let obj = {
            value: message.value,
            date: time,
            login: login,
        }

        // console.log(clients.size)
        clients.forEach(function (client) {
            if(client.readyState != 3){//
                client.send(JSON.stringify(obj));
            }
        });

        let raw_userId = await pg.run(`select id from public.user where login='${login}'`)
        let userId = raw_userId.getFirstObjFirstKeyValue()

        let query = `INSERT INTO public.chat (value, date, userId) 
                     VALUES ('${message.value}', '${date}', ${userId})`;
        await pg.run(query)
    });
}

exports.Text = async function(ws, req){
    clients.add(ws)

    let textId;
    ws.on('message', async function(msg){
        // console.log(msg)
        let message = JSON.parse(msg)
        
        let type = message.type

        let raw_textId = message.textId
        raw_textId != undefined ? textId = raw_textId : undefined;


        if(type == 'initial'){
            
            let query = `select * from
                        (SELECT ch.id, ch.value, ch.date, u.login
                        FROM public.comment ch join public.user u 
                        on ch.userId = u.id
                        where ch.textId = ${textId}
                        order by ch.id desc
                        limit 10) t 
                    order by t.id asc`
            
            let raw = await pg.run(query);
            let result = raw.getAll()
            // console.log(result)
            
            for(let item of result){
                // console.log(item)
                item.date = moment(item.date).format('HH:mm:ss')
                ws.send(JSON.stringify(item))
            }

            return
        }

        let login = message.login
        // console.log('login')
    
        let date = moment().format();
        let time = moment(new Date()).format('HH:mm:ss')
        let value = message.value

        let obj = {
            value: value,
            date: time,
            login: login,
        }

        // console.log(clients.size)
        // console.log(clients)
        clients.forEach(function (client) {
            if(client.readyState != 3){//
                client.send(JSON.stringify(obj));
            }
        });
    
        let raw_userId = await pg.run(`select id from public.user where login='${login}'`)
        let userId = raw_userId.getFirstObjFirstKeyValue()
        

        let query = `INSERT INTO public.comment (value, date, textId, userId) 
                     VALUES ('${value}', '${date}', ${textId}, ${userId})`;
        await pg.run(query)
    });
}