function checkAuthorization(){
    let login = sessionStorage.getItem("Login");
    return login == null ? false : true;
}

export function authorized(){
    return checkAuthorization()
}