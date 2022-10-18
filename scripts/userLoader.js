import {openProfilePage} from './modules/front/Profile.js' 

let authButton = document.getElementById('authorizationButton')
authButton.addEventListener('click', createAuthorizationDialog, false)

document.addEventListener('click', function(e){
    if(e.target && e.target.id == 'applyButtonDialog'){

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/user/authorization', true);

        let loginFromClient = document.getElementById('loginDialog');
        let passwordFromClient = document.getElementById('passwordDialog');

        let raw_body = {
            login: loginFromClient.value,
            password: passwordFromClient.value
        };

        let body = JSON.stringify(raw_body);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
        xhr.onreadystatechange = function() {

            if (xhr.readyState != 4) return;

            if (xhr.status != 202 && xhr.status != 204 && xhr.status != 401) {
                console.log("error: неопознанный статус");//
            }

            if(xhr.status == 202){
                let authHeader = xhr.getResponseHeader('SessionId');
                let login = xhr.getResponseHeader('Login');
                let userId = xhr.getResponseHeader('UserId');
                // console.log(userId);

                sessionStorage.setItem('SessionId', authHeader);

                sessionStorage.setItem('Login', login);
                sessionStorage.setItem('UserId', userId);
    
                // let parsed = JSON.parse(xhr.response);
                let img = document.createElement("img");
                img.src = '/girl.jpg';
                img.id = 'profileImage'
                img.addEventListener('click', openProfilePage, false);
                let userDiv = document.getElementById('userDiv')


                authButton.textContent = "Выход"
                userDiv.removeChild(authButton);
                userDiv.appendChild(img);
                userDiv.appendChild(authButton);
    

                let authorizationDialog = document.getElementById('authorizationDialog');
                authorizationDialog.remove();
            }

            if(xhr.status == 204){
                let dialogInfo = document.getElementById('dialogInfo');
                dialogInfo.innerHTML = 'Пользователь не зарегистрирован';
            }

            if(xhr.status == 401){
                let dialogInfo = document.getElementById('dialogInfo');
                dialogInfo.innerHTML = 'Неверный пароль';
                //добавить три попытки, после блокировать
            }
        };
    }
});


document.addEventListener('click', function(e){
    if(e.target && e.target.id == 'closeButton'){
        let authorizationDialog = document.getElementById('authorizationDialog');
        authorizationDialog.remove();
    }
});


function createAuthorizationDialog(){

    let userDiv = document.getElementById("userDiv");
    let img = document.getElementById("profileImage");
    

    if(authButton.textContent == "Выход"){
        authButton.textContent = "Войти"
        userDiv.removeChild(img)
        sessionStorage.clear();
        return;
    }

    let registrationDialog = document.getElementById('registrationDialog');
    if(registrationDialog != null){
        registrationDialog.remove();
    };

    let prevAuthorizationDialog = document.getElementById('authorizationDialog');
    if(prevAuthorizationDialog != null){
        return;
    }

    let authorizationDialog = document.createElement('div');
    authorizationDialog.id = 'authorizationDialog';
    authorizationDialog.style.position = 'absolute';
    authorizationDialog.style.width = '30%';
    authorizationDialog.style.height = '35%';
    authorizationDialog.style.top = '30%';
    authorizationDialog.style.left = '35%';
    authorizationDialog.style.borderStyle = 'none';
    authorizationDialog.style.backgroundColor = 'blue';

    let authorizationDialogDiv = document.createElement('div');
    authorizationDialogDiv.id = 'authorizationDialogDiv';
    authorizationDialogDiv.style.position = 'absolute';
    authorizationDialogDiv.style.height = '12vh';
    authorizationDialogDiv.style.width = '70%';
    authorizationDialogDiv.style.top = '20%';
    authorizationDialogDiv.style.left = '15%';

    authorizationDialogDiv.style.display = 'flex';
    authorizationDialogDiv.style.flexDirection = 'column';
    authorizationDialogDiv.style.justifyContent = 'space-between';
    authorizationDialogDiv.style.alignItems = 'center';

    let loginDialog = document.createElement('input');
    loginDialog.id = 'loginDialog';
    loginDialog.placeholder = 'Логин';
    loginDialog.style.width = '100%';
    loginDialog.style.flexGrow = '1';
    loginDialog.style.margin = '1vh';
    
    let passwordDialog = document.createElement('input');
    passwordDialog.id = 'passwordDialog';
    passwordDialog.placeholder = 'Пароль';
    passwordDialog.style.width = '100%';
    passwordDialog.type = 'password';
    passwordDialog.style.flexGrow = '1';
    passwordDialog.style.margin = '1vh';

    let dialogInfo = document.createElement('div');
    dialogInfo.id = 'dialogInfo';
    dialogInfo.style.position = 'absolute';
    dialogInfo.style.top = '55%';
    dialogInfo.style.left = '15%';
    dialogInfo.style.right = '15%';
    dialogInfo.style.height = '13%';
    dialogInfo.style.padding = '0%';
    dialogInfo.style.margin = '0%';
    dialogInfo.style.overflow = 'auto';
    dialogInfo.style.fontSize = '85%';

    let applyButtonDialog = document.createElement('button');
    applyButtonDialog.id = 'applyButtonDialog';
    applyButtonDialog.style.position = 'absolute';
    applyButtonDialog.style.top = '70%';
    applyButtonDialog.style.width = '100%';
    applyButtonDialog.style.height = '15%';
    applyButtonDialog.style.left = '0%';
    applyButtonDialog.textContent = 'Войти';

    let dialogRegistrationButton = document.createElement('button');
    dialogRegistrationButton.id = 'dialogRegistrationButton';
    dialogRegistrationButton.style.position = 'absolute';
    dialogRegistrationButton.style.top = '85%';
    dialogRegistrationButton.style.width = '100%';
    dialogRegistrationButton.style.height = '15%';
    dialogRegistrationButton.style.left = '0%';
    dialogRegistrationButton.textContent = 'Зарегистрироваться';

    let closeButton = document.createElement('div');
    closeButton.id = 'closeButton';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0%';
    closeButton.style.right = '0%';
    closeButton.style.height = '5vh';
    closeButton.style.width = '5vh';

    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';

    closeButton.style.backgroundColor = '#FF1493';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.fontFamily = 'helvetica,arial';
    closeButton.style.lineHeight = 1;
    closeButton.style.fontSize = '5vh';
    closeButton.innerHTML = '&times';

    
    authorizationDialogDiv.appendChild(loginDialog);
    authorizationDialogDiv.appendChild(passwordDialog);
    authorizationDialog.appendChild(authorizationDialogDiv);

    authorizationDialog.appendChild(dialogInfo);
    authorizationDialog.appendChild(applyButtonDialog);
    authorizationDialog.appendChild(dialogRegistrationButton);
    authorizationDialog.appendChild(closeButton);
    document.body.appendChild(authorizationDialog);
}
