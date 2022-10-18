import {authorized} from '../Authorization.js';
let host = 'ws://localhost:3000'//'wss://сравнихлам.рф'//
const ws_url_common = `${host}/chat/common`
const ws_url_text = `${host}/chat/text`


const ChatEnum = {"common": 1, "text": 2}

let chat = document.createElement('div')
let window = document.createElement('div')
let input = document.createElement('input')
let button = document.createElement('button')
let inputDiv = document.createElement('div')

inputDiv.appendChild(input)
inputDiv.appendChild(button)
chat.appendChild(inputDiv)

chat.id = 'chat'
chat.style.height = '200px'
// chat.style.width = 'calc(100% - 2px)'
chat.style.border = '1px solid black'
button.textContent = 'Жмяк'

window.id = 'window'
window.style.height = '180px'
window.style.overflow = 'auto'
window.style.overflowX = 'hidden'

inputDiv.style.height = '20px'
inputDiv.id = 'inputDiv'
inputDiv.style.display = 'flex'

input.style.width ='70%'
button.style.width = '30%'


export class Chat{
    constructor(width, type, reverse, textId){
        let size = width - 2;
        chat.style.width = size+'px'//'calc(100% - 2px)'

        this.textId = textId

        if(reverse){
            chat.appendChild(window)
        } else {
            chat.insertBefore(window, chat.children[0])
        }

        if(type == ChatEnum.text){
            this.StartTextChat(ws_url_text, reverse);
        } else {
            this.StartCommonChat(ws_url_common, reverse);
        }
    }

    get Element(){
        return this.chat
    }

    StartCommonChat(url, reverse){
        let socket = new WebSocket(url);
        
        socket.onmessage = function(event) {
            // console.log(event)
            var incomingMessage = event.data;
            showMessage(incomingMessage, reverse);
        };

        this.SetListeners(socket)

        this.chat = chat
    }

    StartTextChat(url, reverse){
        let socket = new WebSocket(url);

        socket.onopen = () => {

            socket.send(JSON.stringify({
                textId: this.textId,/////
                type: 'initial',
                // login: login
            }))
        }
        
        socket.onmessage = function(event) {
            // console.log(event)
            var incomingMessage = event.data;
            showMessage(incomingMessage, reverse);
        };

        this.SetListeners(socket)

        this.chat = chat
    }

    SetListeners(socket){
        button.onclick = () => this.Send(socket)
        input.onkeypress = (e) => {
            if(e.key == 'Enter'){
                this.Send(socket)
            }
        }
    }

    Send(socket) {
        var outgoingMessage = input.value
        input.value = ''
    
        if(!authorized()){
            alert('You need to authorize!!')
            return
        }

        let login = sessionStorage.getItem("Login");//TODO: связать с моментом входа пользователя
    
        let mes = JSON.stringify({
            value: outgoingMessage,
            login: login
        })
        
        socket.send(mes);
        return false;
    };
}

function showMessage(message, reverse) {
    // console.log(message)
    let item = JSON.parse(message)//TODO: перевести на blob для скорости
    // console.log(item)

    var messageElem = document.createElement('div');
    messageElem.textContent = `[${item.date}] ${item.login}: ${item.value}`;

    if(reverse){
        // inputDiv.after(messageElem)
        window.insertBefore(messageElem, window.children[0])
        window.scrollTo(0, 0)
    } else {
        // inputDiv.before(messageElem)
        window.appendChild(messageElem)
        let height = chat.offsetHeight
        window.scrollTo(0, height)
    }
}