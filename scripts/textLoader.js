import {Create} from './modules/front/Lenta.js';
import {Chat} from './modules/front/Chat.js';
import {authorized} from '../Authorization.js';


let textId = document.getElementById('textIdPreload').value;


let central = document.getElementById('central')
let width = central.offsetWidth
//console.log(width)

let links = document.getElementsByClassName('linksPreload')

let imageLinks = [];
for(let item of links){
    imageLinks.push(item.value)
}

//
let lenta = Create(imageLinks, width)

if(lenta != undefined){
    let title = document.getElementById('title')
    title.after(lenta)
}

/////////////////////////////////////
const ChatEnum = {"common": 1, "text": 2}//

let chat = new Chat(300, ChatEnum.text, true, textId).Element;
// console.log(chat)

let text = document.getElementById('text')
text.after(chat)   
////////////////////////////////////

//
let upArrow = document.getElementById('upArrow');
upArrow.addEventListener('click', upArrowFunc, false);

let like = document.getElementById('likeDiv');
like.addEventListener('click', likeFunc, false);

let dislike = document.getElementById('dislikeDiv');
dislike.addEventListener('click', dislikeFunc, false);

let home = document.getElementById('homeDiv')
home.addEventListener('click', homeFunc, false)
//

window.onload = async function(){


    //увеличить просмотры
    await PostViewCounter();
    GetViewCounter();
    GetLikesCounter();
    GetDislikesCounter();
}

async function likeFunc(){

    if(!authorized){
        alert('You need to authorize');
        return;
    }

    let login = sessionStorage.getItem("Login");

    let obj = {
        textId: textId,
        login: login
    }
    
    let result = await fetch(`/like/postLike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    });

    let count = document.getElementById('countLikeDiv');
    if(result.status == 200){
        count.innerText = parseInt(count.innerText) +1;
    } else {
        count.innerText = parseInt(count.innerText) -1;
    }
}

function homeFunc(){
    window.location = `/`;
}

async function dislikeFunc(){
    
    if(!authorized){
        alert('You need to authorize');
        return;
    }

    let login = sessionStorage.getItem("Login");

    let obj = {
        textId: textId,
        login: login
    }
    
    let result = await fetch(`/dislike/postDislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    });

    let count = document.getElementById('countDislikeDiv');
    if(result.status == 200){
        count.innerText = parseInt(count.innerText) +1;
    } else {
        count.innerText = parseInt(count.innerText) -1;
    }
}

function upArrowFunc(){
    scroll(0, 0);
}


async function GetDislikesCounter(){
    let res = await fetch(`/dislike/getDislikes?textId=${textId}`);
    let parsed = await res.json();
    
    let elem = document.getElementById('countDislikeDiv');
    elem.innerText = parsed;//0 не надо заменять
}

async function GetLikesCounter(){
    let res = await fetch(`/like/getLikes?textId=${textId}`);
    let parsed = await res.json();

    let elem = document.getElementById('countLikeDiv');
    elem.innerText = parsed;//0 не надо заменять
}


async function GetViewCounter(){
    let res = await fetch(`/view/getView?textId=${textId}`);
    let count = await res.json();

    // let value = array[0]['count'];
    // console.log(count)
    let elem = document.getElementById('countViewDiv');
    elem.innerText = count;
}

async function PostViewCounter(){

    let obj = {
        textId: textId,
    }
    
    await fetch(`/view/postView`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    });
}