const pg = require("../scripts/modules/postgreSQLConnector")
const fetch = require('node-fetch');
const gen = require("../scripts/modules/Generator");
let moment = require("moment");
let config = require('../config.json')
let CS = require("../scripts/modules/CS")//CacheStorage

const app_key = '1a524c6abfa1880c894a0b2512ee9c7dd15344b6acaf84f344b86df17fcd0981'
let cs = CS.Create(1000*60*10)


exports.registrate = async function(request, response){
    let obj = request.body;

    let loginField = obj.loginField;
    let firstPasswordField = obj.firstPasswordField;
    let secondPasswordField = obj.secondPasswordField;
    let emailField = obj.emailField;
    let phoneNumberField = obj.phoneNumberField;

    let salt = generateSalt();
    let hash = gen.generateHash(firstPasswordField, salt);

    try{
        let userObj = await pg.run(`INSERT INTO public.user(login) 
                                    values('${loginField}') RETURNING id`);
        let userId = userObj.getFirstObjFirstKeyValue();
    
        let res = await pg.run(`INSERT INTO public.access(hash, salt, userId) 
                                values('${hash}', '${salt}', ${userId}) RETURNING id`)
        
        await pg.run(`INSERT INTO public.email (value, confirmed, userId) 
                      values ('${emailField}', false, ${userId})`)
    } catch(ex) {
        // console.log(ex.name)
        let containError = ex.message.indexOf('user_login_key') >= 0
        if(containError){
            let mes = JSON.stringify({message: 'Логин занят'})
            return response.status(400).send(mes)
        } else {
            console.log(ex.message)
            //скрипт не выполнился из-за ошибки
            return response.sendStatus(400);
        }
    }

    response.sendStatus(201);
}


exports.sendEmailCode = async function(request, response){

    let email = request.body['email'];
    //console.log(email)

    //писать код в бд и сверять с тем, что приходит
    //подумать что отправлять
    //подумать что писать в бд
    let code = '12345';
    let hashCode = gen.generateHash(code);
    //console.log(hashCode)

    cs.Add(hashCode, email);

    //let v = cs.GetValue(hashCode)
    //console.log(cs)
    //console.log(v)

    let link = `<b>Ссылка активации учетной записи:</b><br>
                <a href="${config.prod.host}/registration/verifyEmail?code=${hashCode}">Подтвердить</a>`
    let objForSend = {
        smtp_auth_key: "feqphzylylcqpkum",
        mail_to: email,
        title: "Подтвердение адреса",
        message: link
    };

    let obj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': app_key,
        },
        body: JSON.stringify(objForSend)
    };

    let answer = await fetch(config.prod.mailer, obj);
    //console.log(answer)

    

    response.sendStatus(answer.status)
}

exports.verifyEmail = async function(request, response){
    let code = request.query.code

    let email = cs.GetValue(code);

    //если undefined, значит попытка входа со стороны
    if(email == undefined){
        response.sendStatus(400);
    }

    console.log(email)

    let t = await pg.run(`UPDATE public.email 
                SET confirmed = true
                WHERE value = '${email}'`)

    console.log(t)
    //setTimeout(()=>{
    //    col.Show()
    //}, 6000)


    response.sendStatus(200)
}

function generateSalt(){
    return moment().format();
}