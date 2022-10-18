document.addEventListener('click', async (e) => {
    if(e.target && e.target.id == 'registrationDialogApplyButton'){

        let loginField = document.getElementById('loginField').value;
        let firstPasswordField = document.getElementById('firstPasswordField').value;
        let secondPasswordField = document.getElementById('secondPasswordField').value;
        let emailField = document.getElementById('emailField').value;
        let phoneNumberField = document.getElementById('phoneNumberField').value;

    
        let user = {
            loginField : loginField,
            firstPasswordField : firstPasswordField,
            secondPasswordField : secondPasswordField,
            emailField : emailField,
            phoneNumberField : phoneNumberField
        }
        // console.log(loginField.value);
        // console.log(firstPasswordField.value);
    
    
        let obj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        };
    
        let res = await fetch('/registration/registrate', obj);
    
        if(res.ok){
            //console.log('Пользователь зарегистрирован: '+ res.status);
            let regForm = document.getElementById('registrationDialog');
            regForm.remove();

            //
            fetch('registration/sendEmailCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    email: emailField
                })
            })
            .then(res => {
                alert('На почту отправлен код подтверждения регистрации')
            })

            
        } else {
            let json = await res.json();
            // console.log(json.message)
            let label = document.getElementById('label')
            label.textContent = json.message
        }
    }
});


document.addEventListener('click', function(e){
    if(e.target && e.target.id == 'closeRegistrationDialog'){
        let registrationDialog = document.getElementById('registrationDialog');
        registrationDialog.remove();
    }
});

document.addEventListener('click', function(e){
    if(e.target && e.target.id == 'dialogRegistrationButton'){

        let authorizationDialog = document.getElementById('authorizationDialog');                        
        authorizationDialog.remove();

        let registrationDialog = document.createElement('div');
        registrationDialog.id = 'registrationDialog';
        registrationDialog.style.backgroundColor = '#0000CD';
        registrationDialog.style.position = 'absolute';        
        registrationDialog.style.width = '30%';
        registrationDialog.style.height = '55%';
        registrationDialog.style.top = '30%';
        registrationDialog.style.left = '35%';

        let registrationDialogDiv = document.createElement('div');
        registrationDialogDiv.id = 'registrationDialogDiv';
        registrationDialogDiv.name = 'registrationDialogDiv';

        registrationDialogDiv.style.display = 'flex';
        registrationDialogDiv.style.flexDirection = 'column';
        registrationDialogDiv.style.justifyContent = 'space-between';
        registrationDialogDiv.style.alignItems = 'center';
        registrationDialogDiv.style.position = 'absolute';
        registrationDialogDiv.style.height = '35vh';
        registrationDialogDiv.style.width = '70%';
        registrationDialogDiv.style.top = '15%';
        registrationDialogDiv.style.left = '15%';

        let loginField = document.createElement('input');
        loginField.id = 'loginField';
        loginField.name = 'loginField';
        loginField.placeholder = 'Логин';
        loginField.style.width = '100%';
        loginField.style.flexGrow = '1';
        loginField.style.margin = '1vh';

        let firstPasswordField = document.createElement('input');
        firstPasswordField.id = 'firstPasswordField';
        firstPasswordField.name = 'firstPasswordField';
        firstPasswordField.placeholder = 'Пароль';
        firstPasswordField.style.width = '100%';
        firstPasswordField.style.flexGrow = '1';
        firstPasswordField.style.margin = '1vh';

        let secondPasswordField = document.createElement('input');
        secondPasswordField.id = 'secondPasswordField';
        secondPasswordField.name = 'secondPasswordField';
        secondPasswordField.placeholder = 'Подтверждение пароля';
        secondPasswordField.style.width = '100%';
        secondPasswordField.style.flexGrow = '1';
        secondPasswordField.style.margin = '1vh';

        let emailField = document.createElement('input');
        emailField.id = 'emailField';
        emailField.name = 'emailField';
        emailField.placeholder = 'Email';
        emailField.style.width = '100%';
        emailField.style.flexGrow = '1';
        emailField.style.margin = '1vh';

        let phoneNumberField = document.createElement('input');
        phoneNumberField.id = 'phoneNumberField';
        phoneNumberField.name = 'phoneNumberField';
        phoneNumberField.placeholder = 'Номер телефона';
        phoneNumberField.style.width = '100%';
        phoneNumberField.style.flexGrow = '1';
        phoneNumberField.style.margin = '1vh';

        let label = document.createElement('div')
        label.id = 'label'
        label.style.width = '100%'
        label.style.flexGrow = '1';
        label.style.margin = '1vh';
        label.style.color = 'red'


        let registrationDialogApplyButton = document.createElement('button');
        registrationDialogApplyButton.id = 'registrationDialogApplyButton';
        phoneNumberField.name = 'phoneNumberField';
        // registrationDialogApplyButton.type = 'button';
        registrationDialogApplyButton.innerText = 'Подтвердить';
        registrationDialogApplyButton.style.position = 'absolute';
        registrationDialogApplyButton.style.bottom = '0%';
        registrationDialogApplyButton.style.left = '0%';
        registrationDialogApplyButton.style.width = '100%';
        registrationDialogApplyButton.style.height = '15%';



        let closeRegistrationDialog = document.createElement('div');
        closeRegistrationDialog.id = 'closeRegistrationDialog';
        closeRegistrationDialog.style.position = 'absolute';
        closeRegistrationDialog.style.backgroundColor = '#FF1493';
        closeRegistrationDialog.style.width = '5vh';
        closeRegistrationDialog.style.height = '5vh';
        closeRegistrationDialog.style.top = '0%';
        closeRegistrationDialog.style.right = '0%';

        closeRegistrationDialog.style.display = 'flex';
        closeRegistrationDialog.style.alignItems = 'center';
        closeRegistrationDialog.style.justifyContent = 'center';

        closeRegistrationDialog.innerHTML = '&times';
        closeRegistrationDialog.style.fontWeight = 'bold';
        closeRegistrationDialog.style.fontFamily = 'helvetica,arial';
        closeRegistrationDialog.style.lineHeight = 1;
        closeRegistrationDialog.style.fontSize = '5vh';

        registrationDialogDiv.appendChild(loginField);
        registrationDialogDiv.appendChild(firstPasswordField);
        registrationDialogDiv.appendChild(secondPasswordField);
        registrationDialogDiv.appendChild(emailField);
        registrationDialogDiv.appendChild(phoneNumberField);
        registrationDialogDiv.appendChild(label);
        registrationDialog.appendChild(registrationDialogApplyButton);

        registrationDialog.appendChild(registrationDialogDiv);
        
        registrationDialog.appendChild(closeRegistrationDialog);
        document.body.appendChild(registrationDialog);
    }
});