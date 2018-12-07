'use strict'

function encrypt() {
    let phrase = document.querySelector('#frase').value.toLowerCase();

    let plane = document.querySelector('#llano').value;; 
    let planeDesign = document.querySelector('#filtro_llano').value;

    let crypt = document.querySelector('#cripto').value;; 
    let cryptDesign = document.querySelector('#filtro_cripto').value;

    let input = transformAlphabet(plane,planeDesign);
    let output = transformAlphabet(crypt,cryptDesign);
    let pre = encryptPhrase(phrase,input,output);
    let result = document.querySelector('.area-text');
    result.innerText = pre;
}

function decrypt() {
    let phrase = document.querySelector('#frase').value.toLowerCase();

    let plane = document.querySelector('#llano').value;; 
    let planeDesign = document.querySelector('#filtro_llano').value;

    let crypt = document.querySelector('#cripto').value;; 
    let cryptDesign = document.querySelector('#filtro_cripto').value;

    let input = transformAlphabet(plane,planeDesign);
    let output = transformAlphabet(crypt,cryptDesign);
    let pre = encryptPhrase(phrase,output,input);
    let result = document.querySelector('.area-text');
    result.innerText = pre;
}

function transformAlphabet(alphabet,design) {
    let instructions = design.split('/');
    for(let i in instructions) {
        console.log(instructions[i]);
        switch(instructions[i].substr(0,2)) {
            case 'sucesivos':
                console.log(alphabet);
                alphabet = succesiveJumps(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'idi':
                console.log(alphabet);
                alphabet = directionJumps(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'transposicion':
                console.log(alphabet);
                alphabet = trasposition(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'trama':
                console.log(alphabet);
                alphabet = frames(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            default:
                console.log(instructions[i].substr(0,2),instructions[i].substr(2));
                throw('Something went wrong here');
        }
    }
    return alphabet;
}

function encryptPhrase(phrase,input,output) {
    console.log(input);
    console.log(output);
    let inputAlphabet = input.split('');
    let outputAlphabet = output.split('');
    let check = phrase.split('').map((item)=>{
        if(item==' ') {
            return item;
        } else {
            return outputAlphabet[inputAlphabet.indexOf(item)];
        }
    });
    return check.join('');
}

function succesiveJumps(alphabet,key,start=false) {
    let output = '';
    let counter = 0;
    let input = alphabet.split('');
    let keys = key.split('').map(Number); 
    let starterInputSize = input.length;
    let mutableInputSize = input.length;
    let keySize = keys.length;
    for(let i=0;i<starterInputSize;i++) {
        if(start) {
            start=false;
        } else {
            counter=(counter+keys[i%keySize])%mutableInputSize;          
        }
        output+=input[counter];  
        input.splice(counter,1);
        counter--;
        mutableInputSize = input.length;
    }
    return output;
}

function directionJumps(alphabet,key,start=false) {
    let output = '';
    let currentLetter = '';
    let counter = 0;
    let input = alphabet.split('');
    let starterInputSize = input.length;
    let mutableInputSize = input.length;
    let numbers=[],letters=[];
    key.split('').map((item)=>{
        if(isNaN(item)) letters.push(item);
        else numbers.push(Number(item));
    });
    let letterSize = letters.length;
    let numSize = numbers.length;
    //console.log(numbers,letters);
    for(let i=0;i<starterInputSize;i++) {
        let direction=0;
        currentLetter = letters[i%letterSize];
        if(start) {
            start=false;
        } else if(currentLetter==='I') {
            direction=-1;
        } else if(currentLetter==='D') {
            direction=1;
        } else {
            throw('Letter not expected');
        }
        counter=((counter+numbers[i%numSize]*direction)%mutableInputSize);
        if(counter<0) counter+=mutableInputSize;
        output+=input[counter];
        input.splice(counter,1);
        counter=counter+direction;
        mutableInputSize = input.length;
        //console.log(input,output,counter,numbers[i%numSize],direction);
    }
    return output;
}

function trasposition(alphabet,key) {
    let output='';
    let keySize = key.length;
    let alphabetParts = parseInt(alphabet.length/keySize);
    for(let i=0;i<alphabetParts;i++) {
        output+=orderGroupOfNumbers(alphabet.substr(i*keySize,keySize),key);
    }
    if(output.length<alphabet.length) {
        output+=alphabet.substr(output.length);
    }
    return output;
}

function frames(alphabet,key) {
    let output='';
    let keySize = key.length;
    let alphabetParts = parseInt(alphabet.length/keySize);
    let x = [];
    for(let i=0;i<keySize;i++) {
        x.push(alphabet.substr(i*alphabetParts,alphabetParts));
    }
    output=orderArray(x,key);
    if(output.length<alphabet.length) {
        output+=alphabet.substr(output.length);
    }
    return output;
}

function orderArray(array,key) {
    let keys1 = key.split('');
    let keys2 = key.split('');
    let array2 = new Array();
    keys2.sort((a,b)=>{
        return a-b;
    });
    for(let i in array) {
        array2.push(array[keys1.indexOf(keys2[i])]);
    }
    return array2.join('');
}

function orderGroupOfNumbers(group,key) {
    let units = group.split('');
    let units2 = group.split('');
    let keys = key.split('');
    let keys2 = key.split('');
    keys2.sort((a,b)=>{
        return a-b;
    });
    //console.log(keys,keys2);
    for(let i in units) {
        let j = keys2.indexOf(keys[i]);
        units2[j]=units[i];
    }
    //console.log(units,units2);
    return units2.join('');
}

function inversion(alphabet,letter) {
    console.log('on backlog');
}


function insert_sucesivos() {
    let step = document.querySelector('#saltos_sucesivos').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText + 'sucesivos' + step + '/';
}

function insert_idi() {
    let step = document.querySelector('#saltos_idi').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'idi'  + step + '/';
}

function insert_transpo() {
    let step = document.querySelector('#clave_transpo').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'transpo'  + step + '/';
}

function insert_trama() {
    let step = document.querySelector('#clave_trama').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'trama'  + step + '/';
    frames('abcdefghijklmnopqrstuvwxyz',step);
}


/*function limpiar(){
    document.getElementById('#saltos_sucesivos').reset();
    document.getElementById('#saltos_idi').reset();
    document.getElementById('#clave_transpo').reset();
    document.getElementById('#clave_trama').reset();
    document.getElementById('#cadena_filtros').innerHTML="";
}

    /*let output = directionJumps(
        document.querySelector('#alphabet').value.toLowerCase(),
        document.querySelector('#jumps').value,
        document.querySelector('#start').checked);*/