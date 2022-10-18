const pg = require("../scripts/modules/postgreSQLConnector")
const gen = require("../scripts/modules/Generator");
const moment = require("moment");
const fs = require('fs');

const fetch = require('node-fetch');
const uuidv4 = require('uuid/v4');


let _response;


exports.create = function (request, response){
    response.render("createText.hbs");
};

const FormData = require('form-data');

async function PostImage(blob, name){
    const appKey = 'eeafe84f3c3529a167b9f1b9b78b9d70';

    let form = new FormData();
    form.append('image', blob);
    form.append('name', name);

    let options = {
        method: 'POST',
        headers: form.getHeaders(),
        body: form
    }


    let result = await fetch(`https://api.imgbb.com/1/upload?key=${appKey}`, options)
    return result;
}

async function SaveImagesToDB(textId, imageHash, url){
    await pg.run(`INSERT INTO public.image (textid, hash, url) 
                 values (${textId}, '${imageHash}', '${url}')`)
}

async function SaveTextToDB(str_text, textDate, userId){
    let query = `INSERT INTO text (value, date, userId) VALUES ('${str_text}', '${textDate}', ${userId}) RETURNING id`;

    let resObj = await pg.run(query);
    let textId = resObj.getFirstObjFirstKeyValue();
    return textId;
}

exports.addImage = async function (request, response){
    response.status(200).send();
};

async function GetLastId(){
    
    return new Promise(async (resolve, reject) => {
        let resultObj = await pg.run('select max(id) FROM public.text')
        let maxId = resultObj.getFirstObjFirstKeyValue()

        resolve(maxId)
    })
}

exports.getById = async function(request, response, next){

    _response = response;

    if(!request.body) {
        return response.sendStatus(405);
    }

    let textId = request.params.id;//пытается число передать в модель. Найти другое решение

    let query = `SELECT t.value, t.date, u.login 
                 FROM public.text t 
                 join public.user u on t.userId=u.id 
                 WHERE t.id = ${textId}`;
    let query2 = `SELECT url FROM public.image WHERE textId = ${textId}`;

    let rawText;
    let rawImages;
    try{
        rawText = await pg.run(query);
        rawImages = await pg.run(query2)
    } catch(ex){
        // response.sendStatus(500);
        // return;

        next(new Error(ex.message))
        return
    }

    let text = rawText.getFirstObj().value;
    let images = rawImages.getAll();


    if(text.length == 0){
        _response.sendStatus(404);
        return;
    }

    let imageLinks = []
    for(let image of images){
        // console.log(image.url)
        imageLinks.push(image.url)
    }

    _response.render("text.hbs", {
        text: {
            header: text.title,
            value: text.value,
            textId: textId,
            links: imageLinks
        }
    });
};

exports.createText = async function(request, response, next){
    _response = response;

    if(!request.body) {
        return response.sendStatus(400);
    }

    let parsed = request.body;
    // console.log(parsed)

    let author = parsed.author;

    if(author==undefined){
        let mes = 'Требуется авторизация'
        console.log(mes)
        
        next(new Error(mes))
        return
    }

    let result = await pg.run(`SELECT id FROM public.user where login = '${author}'`);
    let userId = result.getFirstObjFirstKeyValue();

    let text = {//отбрасываем author
        title: parsed.title,
        value: parsed.value
    }

    let imagesBlobs = parsed.images;
    ////
    //console.log(imagesBlobs)


    let str_text = JSON.stringify(text);
    let textDate = moment().format();

    let textId = await SaveTextToDB(str_text, textDate, userId)
      
    if(imagesBlobs != undefined){
        await SaveHash(imagesBlobs, textId)
    }    
    

    response.sendStatus(200);
};

async function SendImage(imagesBlob){

    let answer = await PostImage(imagesBlob, uuidv4())
    let json = await answer.json()
    // console.log(json.data.url)

    if(json.status == 200){
        return json.data.url
    } else {
        //обработать ошибку
        throw new Error()
    }
}

async function SaveHash(imagesBlobs, textId){
    for(let item of [...imagesBlobs]){
        let imageHash = gen.generateHash(item);
        let rawObj = await pg.run(`SELECT url FROM PUBLIC.IMAGE WHERE HASH='${imageHash}'`)
        let urlFromDB = rawObj.getFirstObjFirstKeyValue();
        //console.log(item);

        //выполнить отправку в хост и получить юрл
        if(urlFromDB == undefined){
            let url = await SendImage(item);

            await SaveImagesToDB(textId, imageHash, url)
            //console.log("ссылка добавлена в бд")

        } else {
            await SaveImagesToDB(textId, imageHash, urlFromDB)
            //console.log("ссылка скопирована в бд")
        }
    }
}

function GetImages(){

}

function getByIdAnswer(result){


}


sortFunction = function(a, b){
    return a.sortOrder - b.sortOrder;
}


Array.prototype.erase = function(value) {
    if(this.indexOf(value) != -1) {
        this.splice(this.indexOf(value), 1);
    }   
}

Array.prototype.remove = function(index) {
    this.splice(index, 1);
}

Array.prototype.min = function(){
    let min = this[0];

    this.forEach(item => {
        if(item < min){
            min = item;
        }
    });

    return min;
};

Array.prototype.max = function(){
    let max = this[0];

    this.forEach(item => {
        if(item > max){
            max = item;
        }
    });
    return max;
};