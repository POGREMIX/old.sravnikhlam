let pg = require("../scripts/modules/postgreSQLConnector")
let moment = require("moment");

// let Parser = require("../scripts/modules/parser");
let countOnPage = 8;

exports.index = async function (request, response) {

    let result = await FillObject()

    // response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    // response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    // response.setHeader("Expires", "0"); // Proxies.
    response.render("home.hbs", result);    
};


async function FillObject(){

    let obj = {}
    
    let elems = await GetTextsDetails(0);


    obj.populars = elems;


    //общее кол-во статей
    let textCountQuery = `select count(*) from public.text`;
    let arrayResObj=[]
    try{
        arrayResObj = await pg.run(textCountQuery);
    }catch(ex){
        console.log(ex)
        return
    }
    

    let value = arrayResObj.getFirstObjFirstKeyValue();
    // console.log(value)

    let count = value/countOnPage;
    let int = Math.trunc(count)//целая
    let fract = value%countOnPage;//дробная

    obj.pageCount = fract != 0 ? int+1 : int;
    // console.log(obj)
    return obj;
}

exports.about = function (request, response) {
    response.send("О сайте");
};

exports.nextPageList = async function(request, response){
    let obj = request.query;

    // let lastId = obj['lastValue'];
    // let countOnPage = obj['countOnPage'];
    let pageNumber = obj['pageNumber'];

    let textCount = countOnPage*(pageNumber-1);

    let elems = await GetTextsDetails(textCount);

    response.send(elems) 
}

async function GetTextsDetails(textCount){
        //список статей
        // console.log(countOnPage)
        // console.log(textCount)
    let query = `SELECT * FROM public.text
                order by id desc
                limit ${countOnPage} offset ${textCount}`;

    let resultObj = await pg.run(query);
    let texts = resultObj.getAll()
    // console.log(result)


    let elems = [];
    for(let item of texts){
        // console.log(item.id)

        let rawObj = await pg.run(`select url from public.image where textId=${item.id}`);
        let firstImgObj = rawObj.getAll()[0];

        let textObj = {}

        let textInfoCount = 100;
        let textInfo = item.value.value.slice(0, textInfoCount);
        textObj.textInfo = textInfo;

        textObj.id = item.id;
        
        let titleCount = 30
        textObj.title = item.value.title.slice(0, titleCount)
        
        let date = item.date;
        textObj.date = moment(date).format('DD/MM/YYYY');

        let url;
        if(firstImgObj == undefined){
            url = 'nophotos.png'
        } else {
            url = firstImgObj.url
        }

        textObj.url = url

        elems.push(textObj);

    };
    // console.log(elems)
    return elems;
}