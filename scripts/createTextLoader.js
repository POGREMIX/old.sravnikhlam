let base64Images = [];

let dropArea = document.getElementById("dropArea");

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener('drop', handleDrop, false);

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}


addImage.onclick = function addImage(){
    let list = document.getElementById("list");
    let li = document.createElement("li");
    list.appendChild(li);
    let input = document.createElement("input");
    input.type = "text";
    input.name = "input";
    li.appendChild(input);
}

async function SendText(base64Images){
    let textTitle = document.getElementById('textTitle');
    let textArea = document.getElementById('textArea');
    let inputList = document.getElementsByName("input");
    let userLogin = sessionStorage.getItem("Login");

    let titleForSend = textTitle.value;
    let textForSend = textArea.value;
    
    let array = [];//для ингредиентов
    inputList.forEach((item) => {
        array.push(item.value);
    });


    let objForSend = {
        title: titleForSend,
        value: textForSend,
        author: userLogin,
        images: base64Images
    };


    let obj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(objForSend)
    };

    let answer = await fetch('createText', obj);
    return answer;
}


async function saveText(){
    let answer = await SendText(base64Images);
    base64Images = []

    let answerArea = document.getElementById('answerArea');
    answerArea.innerText = answer.statusText;
}


function preventDefaults (e){
    e.preventDefault();//чтобы не открывать картинку в окне
    e.stopPropagation();//Прекращает дальнейшую передачу текущего события
}


async function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}

async function handleFiles(files){
    let promises = [...files].map(BlobConvert)
    //console.log(promises)
    let array = await Promise.all(promises);
    //console.log(array)

    for(let item of array){
        base64Images.push(item)
    }
    //console.log(base64Images)
}


async function BlobConvert(file){
    let rawBase64 = await ReadBlob(file)
    let base64 = rawBase64.replace(/^data:.+;base64,/, '')
    return base64;
}


function ReadBlob(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}



//добавить отображение мини картинок при загрузке
//https://medium.com/devschacht/https-medium-com-kasimoka-joseph-zimmerman-drag-drop-file-uploader-vanilla-js-de850d74aa2f
