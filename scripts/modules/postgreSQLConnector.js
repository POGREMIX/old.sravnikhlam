//асинхронное считывание конфига
const fs = require('fs');
const {promisify} = require('util')
const ReadFileAsync = promisify(fs.readFile);

//если пул не приживется, перевести на Client
//добавить mySQL коннектор
const { Pool, Client } = require('pg');

const NODE_ENV = process.argv[2];//или чз переменную среды//вынести отсюда


module.exports = {

    run: async (query) => {

        let config;
        if(NODE_ENV === 'development'){
            let raw_config = await ReadFileAsync(`./config.json`, {encoding: 'utf8'});
            let parsedConfig = JSON.parse(raw_config);   
            config = parsedConfig.postgres;
        } else {
            config = {
                user: "nwxfwqnkchawoo",
                password: "03511d04abda2e7b6d99d052959141b1f2625fe8cc58df38c20e401873f0fd11",
                database: "d5e4jd3n04nlpm",
                port: 5432,
                host: "ec2-54-246-90-10.eu-west-1.compute.amazonaws.com",
                ssl: {
                    rejectUnauthorized: false, // разрешаем самозаверенный сертификат
                    // ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
                    // key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
                    // cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString()
                },
                // connectionTimeoutMillis: 60000,
                // idleTimeoutMillis: 15000,
            }
        }

        
        let pool;
        let result;
        try{
            pool = new Pool(config);
            // console.log(pool);
            result = await pool.query(query);
        }catch(ex){
            // console.log(ex.message);
            throw Error(ex.message);
        }

        // console.log(result);
        let resultRows = result.rows;
        let answer = new PgAnswer(resultRows);
        // console.log(resultRows);        
        await pool.end();
        return answer;
    }
}

class PgAnswer{
    constructor(value) {
        this.value = value;
    }

    //undefined
    getFirstObj(){
        return this.value[0];
    }
    
    //undefined
    getFirstObjFirstKeyValue(){
        let firstObj = this.getFirstObj();

        if(firstObj == undefined){
            return undefined;
        }

        let firstKey = Object.keys(firstObj)[0];
        return firstObj[firstKey];
    }

    //undefined
    getFirstObjKeyValue(key){
        let firstObj = this.getFirstObj();

        if(firstObj == undefined){
            return undefined;
        }

        return firstObj[key];
    }

    getAll(){
        return this.value;
    }
}