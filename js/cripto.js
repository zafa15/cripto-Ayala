
function limpiar(){
    document.querySelector('#saltos_sucesivos').value="";
    document.querySelector('#saltos_idi').value="";
    document.querySelector('#clave_transpo').value="";
    document.querySelector('#clave_trama').value="";
    document.querySelector('#cadena_filtros').innerHTML="";
}


function convertir_abc(alphabet,design) {
    let instructions = design.split('/');
    for(let i in instructions) {
        console.log(instructions[i]);
        switch(instructions[i].substr(0,2)) {
            case 'su':
                console.log(alphabet);
                alphabet = saltos_sucesivos(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'di':
                console.log(alphabet);
                alphabet = saltos_idi(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'tp':
                console.log(alphabet);
                alphabet = transposicion(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            case 'tr':
                console.log(alphabet);
                alphabet = tramas(alphabet,instructions[i].substr(2));
                console.log(alphabet);
                break;
            default:
                console.log(instructions[i].substr(0,2),instructions[i].substr(2));
                throw('Something went wrong here');
        }
    }
    return alphabet;
}

function encriptar_frase(phrase,input,output) {
    //console.log(input);
    //console.log(output);
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

function saltos_sucesivos(alphabet,key,start=false) {
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

function saltos_idi(alphabet,key,start=false) {
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

function transposicion(alphabet,key) {
    let output='';
    let keySize = key.length;
    let alphabetParts = parseInt(alphabet.length/keySize);
    for(let i=0;i<alphabetParts;i++) {
        output+=ordenar_grupos(alphabet.substr(i*keySize,keySize),key);
    }
    if(output.length<alphabet.length) {
        output+=alphabet.substr(output.length);
    }
    return output;
}

function tramas(alphabet,key) {
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
    let array2 = [];
    keys2.sort((a,b)=>{
        return a-b;
    });
    for(let i in array) {
        array2.push(array[keys1.indexOf(keys2[i])]);
    }
    console.log(array2.join(''));
    return array2.join('');
}

function ordenar_grupos(group,key) {
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
    chain.innerText = chain.innerText + 'su' + step + '/';
}

function insert_idi() {
    let step = document.querySelector('#saltos_idi').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'di'  + step + '/';
}

function insert_transpo() {
    let step = document.querySelector('#clave_transpo').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'tp'  + step + '/';
}

function insert_trama() {
    let step = document.querySelector('#clave_trama').value;
    let chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'tr'  + step + '/';
    tramas('abcdefghijklmnopqrstuvwxyz',step);
}

function encriptar() {
    let frase = document.querySelector('#frase').value.toLowerCase();

    let llano = document.querySelector('#llano').value; 
    let filtro_llano = document.querySelector('#filtro_llano').value;

    let cripto = document.querySelector('#cripto').value;; 
    let filtro_cripto = document.querySelector('#filtro_cripto').value;

    let input = convertir_abc(llano,filtro_llano);
    let output = convertir_abc(cripto,filtro_cripto);
    let pre = encriptar_frase(frase,input,output);
    let result = document.querySelector('#area1');
    result.innerText = pre;
}

function desencriptar() {
    let frase2 = document.querySelector('#frase2').value.toLowerCase();

    let llano = document.querySelector('#llano').value; 
    let filtro_llano = document.querySelector('#filtro_llano').value;

    let cripto = document.querySelector('#cripto').value; 
    let filtro_cripto = document.querySelector('#filtro_cripto').value;

    let input = convertir_abc(llano,filtro_llano);
    let output = convertir_abc(cripto,filtro_cripto);
    let pre = encriptar_frase(frase2,output,input);
    let result = document.querySelector('#area2');
    result.innerText = pre;
}


