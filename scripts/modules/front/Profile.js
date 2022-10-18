export function openProfilePage(){
    
    let login = sessionStorage.getItem("Login");
    // console.log(login);

    if(login == null){
        alert('Вы не зарегистрированы');
    } else {
        window.location = `/user/profile?login=${login}`;
    }

    //перевод на страницу профиля
}