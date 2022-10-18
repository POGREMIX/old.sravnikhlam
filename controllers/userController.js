let pg = require("../scripts/modules/postgreSQLConnector")
let gen = require("../scripts/modules/Generator");
let moment = require("moment");


exports.getUsers = async function(request, response){

    let query = 'SELECT * FROM public.user';

    let resultObj =  await pg.run(query);
    let result = resultObj.getAll();
    // console.log(result)

    response.render("users.hbs", {
        users: result
    });
};


exports.authorization = async function(request, response){

    let login = request.body.login;
    let password = request.body.password;

    let usersArray = await pg.run(`select id, login from public.user where login='${login}'`)
                            .catch((ex) => {
                                console.log(ex.message)
                                return response.sendStatus(500);//
                            })

    // console.log(res.getFirstObj())
    // console.log(res.getFirstObjFirstKeyValue())
    // console.log(res.getFirstObjKeyValue('login'))
    // console.log('------')
    let userObj = usersArray.getFirstObj();

    if(userObj == undefined){
        return response.sendStatus(204);//нет пользователя
    }

    let userId = userObj.id;
    let userLogin = userObj.login;
    // console.log(userId)
    // console.log(userLogin)

    //получить соль из бд
    let accessObj = await pg.run(`SELECT salt, hash
                                FROM public.access 
                                WHERE USERID = ${userId}`)
                            .then((res) => {
                                return res.getFirstObj()
                            })

    // console.log(accessObj);
    let accessSalt = accessObj.salt;
    let accessHash = accessObj.hash;
    let generatedHash = gen.generateHash(password, accessSalt);

    let hashFromDb = accessHash;

    if(generatedHash != hashFromDb){
        // console.log('Хеши не совпадают');
        return response.sendStatus(401);
    }
    
    let created = moment().format();

    let insertResult = await pg.run(`INSERT INTO public.session(userid, created)
                                     VALUES (${userId}, '${created}') RETURNING id`);

    let sessionId = insertResult.getFirstObjKeyValue('id');

    //добавить ролевую модель
    // response.setHeader('Authorization', 'сюда впилить ролевую');

    response.setHeader('SessionId', sessionId);
    response.setHeader('Login', userLogin);
    response.setHeader('UserId', userId);

    let obj = {
        message: `You are welcome, ${userLogin}`
    };

    let json = JSON.stringify(obj);
    response.status(202).send(json);
};

exports.profile = function(request, response){
    //если логин admin, то спрятать
    let login = request.query.login;

    let isNotHidden = false;

    //заменить, так как чз строку запроса можно руками логин вдолбить. 
    //если пользователь узнает логин, то сможет зайти в закрытый раздел
    if(login == 'admin'){
        isNotHidden = true;
    }

    response.render("profile.hbs", {
        // users: result
        isNotHidden: isNotHidden
    });
}