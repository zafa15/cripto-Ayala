
function limpiar(){
    document.querySelector('#saltos_sucesivos').value="";
    document.querySelector('#saltos_idi').value="";
    document.querySelector('#clave_transpo').value="";
    document.querySelector('#clave_trama').value="";
    document.querySelector('#cadena_filtros').innerHTML="";
}


function convertir_abc(abc_alph,cuerpo) {
    var inst_cripto = cuerpo.split('-');
    for(var i in inst_cripto) {
        console.log(inst_cripto[i]);
        switch(inst_cripto[i].substr(0,2)) {
            case 'su':
                //console.log(alphabet);
                abc_alph = saltos_sucesivos(abc_alph,inst_cripto[i].substr(2));
                //console.log(alphabet);
                break;
            case 'di':
                //console.log(alphabet);
                abc_alph = saltos_idi(abc_alph,inst_cripto[i].substr(2));
                //console.log(alphabet);
                break;
            case 'tp':
                //console.log(alphabet);
                abc_alph = transposicion(abc_alph,inst_cripto[i].substr(2));
                //console.log(alphabet);
                break;
            case 'tr':
                //console.log(alphabet);
                abc_alph = tramas(abc_alph,inst_cripto[i].substr(2));
                //console.log(alphabet);
                break;
            default:
                //console.log(instructions[i].substr(0,2),instructions[i].substr(2));
                throw('Something went wrong here');
        }
    }
    return abc_alph;
}

function encriptar_frase(frase,input,output) {
    //console.log(input);
    //console.log(output);
    var ingreso_abc = input.split('');
    var salida_abc = output.split('');
    var check = frase.split('').map((item)=>{
        if(item==' ') {
            return item;
        } else {
            return salida_abc[ingreso_abc.indexOf(item)];
        }
    });
    return check.join('');
}

function saltos_sucesivos(alphabet,llave,start=false) {
    var output = '';
    var counter = 0;
    var input = alphabet.split('');
    var llave = llave.split('').map(Number); 
    var starterInputSize = input.length;
    var mutableInputSize = input.length;
    var keySize = llave.length;
    for(var i=0;i<starterInputSize;i++) {
        if(start) {
            start=false;
        } else {
            counter=(counter+llave[i%keySize])%mutableInputSize;          
        }
        output+=input[counter];  
        input.splice(counter,1);
        counter--;
        mutableInputSize = input.length;
    }
    return output;
}

function saltos_idi(alphabet,key,start=false) {
    var output = '';
    var currentvarter = '';
    var counter = 0;
    var input = alphabet.split('');
    var starterInputSize = input.length;
    var mutableInputSize = input.length;
    var numbers=[],varters=[];
    key.split('').map((item)=>{
        if(isNaN(item)) varters.push(item);
        else numbers.push(Number(item));
    });
    var varterSize = varters.length;
    var numSize = numbers.length;
    //console.log(numbers,varters);
    for(var i=0;i<starterInputSize;i++) {
        var direction=0;
        currentvarter = varters[i%varterSize];
        if(start) {
            start=false;
        } else if(currentvarter==='I') {
            direction=-1;
        } else if(currentvarter==='D') {
            direction=1;
        } else {
            throw('varter not expected');
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
    var output='';
    var keySize = key.length;
    var alphabetParts = parseInt(alphabet.length/keySize);
    for(var i=0;i<alphabetParts;i++) {
        output+=ordenar_grupos(alphabet.substr(i*keySize,keySize),key);
    }
    if(output.length<alphabet.length) {
        output+=alphabet.substr(output.length);
    }
    return output;
}

function tramas(alphabet,key) {
    var output='';
    var keySize = key.length;
    var alphabetParts = parseInt(alphabet.length/keySize);
    var x = [];
    for(var i=0;i<keySize;i++) {
        x.push(alphabet.substr(i*alphabetParts,alphabetParts));
    }
    output=orderArray(x,key);
    if(output.length<alphabet.length) {
        output+=alphabet.substr(output.length);
    }
    return output;
}

function orderArray(array,key) {
    var keys1 = key.split('');
    var keys2 = key.split('');
    var array2 = [];
    keys2.sort((a,b)=>{
        return a-b;
    });
    for(var i in array) {
        array2.push(array[keys1.indexOf(keys2[i])]);
    }
    console.log(array2.join(''));
    return array2.join('');
}

function ordenar_grupos(group,key) {
    var units = group.split('');
    var units2 = group.split('');
    var keys = key.split('');
    var keys2 = key.split('');
    keys2.sort((a,b)=>{
        return a-b;
    });
    //console.log(keys,keys2);
    for(var i in units) {
        var j = keys2.indexOf(keys[i]);
        units2[j]=units[i];
    }
    //console.log(units,units2);
    return units2.join('');
}

function inversion(alphabet,varter) {
    console.log('on backlog');
}


function insert_sucesivos() {
    var step = document.querySelector('#saltos_sucesivos').value;
    var chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText + 'su' + step + '-';
}

function insert_idi() {
    var step = document.querySelector('#saltos_idi').value;
    var chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'di'  + step + '-';
}

function insert_transpo() {
    var step = document.querySelector('#clave_transpo').value;
    var chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'tp'  + step + '-';
}

function insert_trama() {
    var step = document.querySelector('#clave_trama').value;
    var chain = document.querySelector('#cadena_filtros');
    chain.innerText = chain.innerText+ 'tr'  + step + '-';
    tramas('abcdefghijklmnopqrstuvwxyz',step);
}

function encriptar() {
    var frase = document.querySelector('#frase').value.toLowerCase();

    var llano = document.querySelector('#llano').value; 
    var filtro_llano = document.querySelector('#filtro_llano').value;

    var cripto = document.querySelector('#cripto').value;; 
    var filtro_cripto = document.querySelector('#filtro_cripto').value;

    var input = convertir_abc(llano,filtro_llano);
    var output = convertir_abc(cripto,filtro_cripto);
    var pre = encriptar_frase(frase,input,output);
    var result = document.querySelector('#area1');
    result.innerText = pre;
}

function desencriptar() {
    var frase2 = document.querySelector('#frase2').value.toLowerCase();

    var llano = document.querySelector('#llano').value; 
    var filtro_llano = document.querySelector('#filtro_llano').value;

    var cripto = document.querySelector('#cripto').value; 
    var filtro_cripto = document.querySelector('#filtro_cripto').value;

    var input = convertir_abc(llano,filtro_llano);
    var output = convertir_abc(cripto,filtro_cripto);
    var pre = encriptar_frase(frase2,output,input);
    var result = document.querySelector('#area2');
    result.innerText = pre;
}


