function getRandomColor (){

    let colors = ['#DDE497','#DcE297'];
    let size = colors.length;
    let randomElement = Math.random()*(size-0)+0;
    let roundRandomNumber = Math.floor(randomElement)
    let color = roundRandomNumber
    return colors[color];
}



