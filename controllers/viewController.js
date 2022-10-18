let pg = require("../scripts/modules/postgreSQLConnector")

exports.getView = async function(request, response){
    // console.log(request.query)
    let textId = request.query.textId;
    let query = `select count from public.view where textId=${textId}`;

    let resObj = await pg.run(query);
    let count = resObj.getFirstObjFirstKeyValue();

    response.send(`${count}`);
}

exports.postView = async function(request, response){
    let textId = request.body['textId'];
    
    let resObj = await pg.run(`select count from public.view where textId = ${textId}`)
    let count = resObj.getFirstObjFirstKeyValue();
    // console.log(prev)

    if(count == undefined){
        await pg.run(`insert into public.view (count, textId) values(${1}, ${textId})`);
    } else {
        await pg.run(`update public.view set count = ${count+1} where textId = ${textId}`);
    }
    
    response.sendStatus(200);
}