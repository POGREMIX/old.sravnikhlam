import {Chat} from './modules/front/Chat.js';
import {openProfilePage} from './modules/front/Profile.js' 

let pageCount;

let textImgs = document.getElementsByClassName('textImg')
for(let img of textImgs){
    img.addEventListener('click', (e)=>{

        let textId = e.target.getAttribute('value');
        window.location = `/text/getById/${textId}`;
    }, false)
}

/////////////////////////////////////
const ChatEnum = {"common": 1, "text": 2}//

let right = document.getElementById('rightDiv')
let chat = new Chat(right.offsetWidth-10, ChatEnum.common, false).Element;
// console.log(chat)

right.appendChild(chat)
    
////////////////////////////////////

SetLogin()
    .then(() => {
        return SetPageListAndGenerateAndSaveCoords()
    })
    .then(() => {
        return SetCoordListeners()
    })
    // .then(() => {
        // ScrollToY();        
    // });

    // SetChat()


function SetPageListAndGenerateAndSaveCoords(){

    return new Promise((res, rej) => {
        //перемотка статей
        let elem = document.getElementById('anotherPageList');
        let value = elem.innerText;
        // console.log(value);
        pageCount = parseInt(value);
        // console.log(value);
    
        elem.innerHTML = '';
        let i = 1;
        while(i <= pageCount){
            let page = document.createElement('div');
            page.className = 'pageNumber';
            page.textContent = `${i}`;
            elem.appendChild(page)
            i++
        }
    
        let pages = document.getElementsByClassName('pageNumber');
        [...pages].forEach(page => {
            // console.log(page);
            let pageNum = parseInt(page.innerText);
            page.addEventListener('click', () => {
                SetPageCoords(pageNum, true);
                pageFunc(pageNum)
                scroll(0,0)//отмотать вверх после сброса координат и генерации страниц
            }, false);
        });
        res()
    });

}

function SetLogin(){
    return new Promise((res, rej)=>{
        let login = sessionStorage.getItem("Login");

        let authorizationButton = document.getElementById('authorizationButton');

        //при загрузке страницы
        if(login != null){
            // authorizationButton.innerText = login;

            let img = document.createElement("img");
            img.src = '/girl.jpg';
            img.id = 'profileImage'
            img.addEventListener('click', openProfilePage, false);
            let userDiv = document.getElementById('userDiv')
            let but = document.getElementById('authorizationButton');
            but.id = 'authorizationButton';
            but.textContent = "Выход"
            userDiv.removeChild(but);
            userDiv.appendChild(img);
            userDiv.appendChild(but);
        }

        // if(authorizationButton.textContent == 'Выход'){
        //     console.log('Выход')
        // }

        res()
    })

}

async function ScrollToY(){

    let pageCoords = sessionStorage.getItem("PageCoords");
    
    if(pageCoords == null){
        return;
    }

    let obj = JSON.parse(pageCoords);
    let page = obj.pageNumber;
    let y = obj.y;

    SetPageCoords(page, false);
    await pageFunc(page);

    //отрубаем скролл хрома по умолчанию, чтобы не сбивал промотку при обновлении страницы
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

    //добавлен небольшой отступ step, чтобы верхняя статья не в самом верху была
    let step = -50;
    scrollTo(0, y+step);
}

function SetCoordListeners(){
    return new Promise((res, rej) => {
        // console.log('SetCoordListeners')
        let links = document.getElementsByClassName('textHeader');
        // console.log(temp);

        [...links].forEach((item) => {
            item.addEventListener('click', coordFunc, false)
        })

        res();
    })
}

function coordFunc(e){
    let y = e.pageY;
    // console.log(y);

    let first = {
        y: y,
        pageNumber: 1//если pageCoords пустой, то страница 1
    }

    let pageCoords = sessionStorage.getItem("PageCoords");

    if(pageCoords == null){
        sessionStorage.setItem('PageCoords', JSON.stringify(first));
    } else {
        let obj = JSON.parse(pageCoords);
        obj.y = y;
        let updated = JSON.stringify(obj);
        sessionStorage.setItem('PageCoords', updated);
    }
}

function SetPageCoords(pageNumber, isNeedToDrop){

    let pageCoords = sessionStorage.getItem("PageCoords");

    let first = {
        pageNumber: pageNumber
    }

    if(pageCoords == null){
        sessionStorage.setItem('PageCoords', JSON.stringify(first));
    } else {
        let obj = JSON.parse(pageCoords);
        obj.pageNumber = pageNumber;
        if(isNeedToDrop){
            obj.y = 0;
        }
        
        let updated = JSON.stringify(obj);
        sessionStorage.setItem('PageCoords', updated);
    }
}


async function pageFunc(pageNumber){

    let url = `/nextPageList?pageNumber=${pageNumber}`;
    let response = await fetch(url);

    let res = await response.json()

    let texts = document.getElementById('popular');
    texts.innerHTML = '';

    res.forEach((item) => {
        // console.log(item)

        // if(item.url == undefined){
        //     item.url = 'nophotos.png'//заглушка, иначе 404
        // }

        let textDiv = document.createElement('div')
        textDiv.className = 'textDiv'

        let textBorder = document.createElement('div')
        textBorder.className = 'textBorder'
        textDiv.appendChild(textBorder)

        let textImg = document.createElement('img');
        textImg.className = 'textImg'
        textImg.src = `${item.url}`
        textImg.setAttribute('value', item.id)
        textImg.onclick = (e) => {
            let textId = e.target.getAttribute('value');
            window.location = `/text/getById/${textId}`;
        };/*передача */

        let textCommonDiv = document.createElement('div')
        textCommonDiv.className = 'textCommonDiv';

        textBorder.appendChild(textImg)
        textBorder.appendChild(textCommonDiv)

        let textHeader = document.createElement('a')
        textHeader.href = `/text/getById/${item.id}`
        textHeader.className = 'textHeader'
        textHeader.textContent = item.title


        let textInfo = document.createElement('div')
        textInfo.className = 'textInfo'
        textInfo.textContent = item.textInfo

        textCommonDiv.appendChild(textHeader)
        textCommonDiv.appendChild(textInfo)

        texts.appendChild(textDiv)
    })

        //добавляет обработчики к новым элементам
    SetCoordListeners();
}