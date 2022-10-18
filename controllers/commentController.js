let pg = require("../scripts/modules/postgreSQLConnector")
let moment = require("moment");


exports.getTextComments = async function (request, response){
    let lastId = request.query.lastId;
    let textId = request.query.textId;

    let query = `SELECT u.login, c.textId, c.id, c.date, c.value
                 FROM public.comment c join public.user u 
                 on c.userId=u.id
                 where c.id>${lastId} and c.textId=${textId} order by c.id asc;`

                
    let resObj = await pg.run(query);
    let res = resObj.getAll();
    // console.log(res)

    res.forEach((elem) => {
        elem.date = moment(elem.date).format('DD/MM/YYYY HH:mm:ss');
    })

    response.send(res);
}

exports.postComment = async function (request, response){
    let answer = request.body;

    let value = answer['value'];
    let textId = answer['textId'];
    let author = answer['author'];
    let date = moment().format();

  
    let resObj = await pg.run(`select id from public.user where login = '${author}'`);
    let userId = resObj.getFirstObjFirstKeyValue();

    let query = `INSERT INTO public.comment (value, date, textId, userId) values ('${value}', '${date}', ${textId}, ${userId})`;

    await pg.run(query);
    response.sendStatus(200);
}