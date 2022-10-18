let pg = require("../scripts/modules/postgreSQLConnector")

exports.getLikes = async function(request, response){
    let textId = request.query.textId;
    
    let query = `select count(userId) from public.like where textId=${textId}`;
    let resObj  = await pg.run(query);
    let res = resObj.getFirstObjFirstKeyValue();

    response.send(`${res}`);
}

exports.postLike = async function(request, response){
    let textId = request.body['textId'];
    let login = request.body['login'];
    // console.log(request.body)

    let resObj = await pg.run(`select id from public.user where login='${login}'`);
    let userId = resObj.getFirstObjFirstKeyValue();
    // console.log(userId)


    let resObj2 = await pg.run(`select id from public.like where textId = ${textId} and userId = ${userId}`);
    let res = resObj2.getFirstObj()
    // console.log(res)

    //заменить на update
    if(res == undefined){
        await pg.run(`insert into public.like (textId, userId) values (${textId}, ${userId})`);
        response.sendStatus(200);
    } else {
        await pg.run(`delete from public.like where textId = ${textId} and userId = ${userId}`);
        response.sendStatus(304);
    }
}

exports.deleteLike = function(request, response){
    response.sendStatus(200);
}