1. скачать репозиторий
2. выкачать зависимости npm install
3. скачать heroku cli
4. запустить heroku git:remote -a sravnikhlam, чтобы появилась возможность пушить существующий репозиторий в хероку
5. сайт работает через прокси сервер https://dash.cloudflare.com/9d7c9e15a4ac756265a1d8605fa1fee3, на котором осуществляется привязка доп. доменов
6. получаем db_name существующей бд heroku pg:info
7. получаем строку для подключения к бд чз pgAdmin heroku pg:credentials:url db_name



РЕГУЛЯРНО ИСПОЛЬЗУЕМЫЕ КОМАНДЫ:
1.1. скачать бд heroku 
pg:pull HEROKU_POSTGRESQL_MAGENTA mylocaldb --app sushi PGUSER=postgres PGPASSWORD=password heroku 
1.2. залить бд 
heroku pg:push main postgresql-concave-08952 --app sravnikhlam PGUSER=pogremix PGPASSWORD=pogremix


DOCKER:
1. Развернуть контейнер для локальной среды docker run -d -e POSTGRES_USER=pogremix -e POSTGRES_PASSWORD=pogremix -e POSTGRES_DB=main --name local_postgres -p 5432:5432 -v C:/dev/sravnikhlam/db:/var/lib/postgresql/data --restart=always postgres



-----------------------------------------------------------------------------------
