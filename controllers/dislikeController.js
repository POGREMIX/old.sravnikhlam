let pg = require("../scripts/modules/postgreSQLConnector");

exports.getDislikes = async function(request, response){

    let textId = request.query.textId;

    let query = `select count(userId) from public.dislike where textId=${textId}`;
    let resObj  = await pg.run(query);
    let res = resObj.getFirstObjFirstKeyValue()
    // console.log(res)

    response.send(`${res}`);
}

exports.postDislike = async function(request, response){
    let textId = request.body['textId'];
    let login = request.body['login'];
    // console.log(request.body)

    let rowUserId = await pg.run(`select id from public.user where login='${login}'`);
    let userId = rowUserId.getFirstObjFirstKeyValue();
    // console.log(userId)

    let rawId = await pg.run(`select id from public.dislike where textId = ${textId} and userId = ${userId}`);
    let res = rawId.getFirstObjFirstKeyValue();
    // console.log(res)

    //заменить на update
    if(res == undefined){
        await pg.run(`insert into public.dislike (textId, userId) values (${textId}, ${userId})`);
        response.sendStatus(200);
    } else {
        await pg.run(`delete from public.dislike where textId = ${textId} and userId = ${userId}`);
        response.sendStatus(304);
    }
}

exports.deleteDislike = function(request, response){
    response.sendStatus(200);
}