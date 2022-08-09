const inquirer = require('inquirer');
require('colors');

//PREGUNTAS U OPCIONES A SELECIONAR
const preguntas =[
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que deseas hacer.....?',
        //aqui van preguntas u opciones a seleccionar 
        choices:[
            {
                value: 1,//valor del objet
                name: `${ '1.'.green } Buscar ciudad`//lo que se quiere mostar
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green } Salir`
            },
            
        ]

    }
];



const inquireMenu = async () =>{

        console.clear();
        console.log(' _______________________________'.green);
        console.log('|                               |'.green);
        console.log(`|     ${'SELECCIONE UNA OPCION'.bgWhite}     |`.green);
        console.log('|_______________________________|\n'.green);

        // el prompt es para hacer una pregunta y se almacena en opt
        // se desestructura el objeto selecionado el cual tiene como opcion el valor
        const { opcion } = await inquirer.prompt(preguntas);

        return opcion;

}
// pausa la consola para presionar Enter
 const pausa = async () => {

    const question = [
        {
            //para dar Enter 
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'Enter'.green } para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}


//se crea funsion la cual permite escribir  
const leerInput = async(message)=>{
    const question =[
        {
            //ingresar algo en consola
            type: 'input',
            name: 'desc',
            message,
            //valida que se haya ingresado algo 
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor'
                }
                return true;
            }
        }
    ];
    //hace la pregunta y se muestra en la consola
    const {desc} = await inquirer.prompt(question);
    return desc;
}


//metodo para listado de tareas a borrar
const listarLugares = async(lugares = [] )=>{

    //se recorre el arreglo con map, retorna un nuevo arreglo
    const choices = lugares.map((lugar, i) =>{

        const idx = `${i + 1}`.green;
        //restorna el mismo valor en todas la tareas
        return{
            value: lugar.id,
            name: `${idx}. ${lugar.nombre }`

        }
    });

    //se añade nueva pregunta al inicio del arreglo choises
    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar Operacion'
    });
    
    

    //se crean la preguntas
    const preguntas = [
        {
            //muesta lista
            type:'list',
            name: 'id',
            message: ' selecione lugar ',
            choices
        }
    ]
    //pregunta en consola las choises
    //se optiene el id
    const { id } = await inquirer.prompt(preguntas);
    return id;


}

const mostrarListadoCheckList = async(tareas = [] )=>{

    const choices = tareas.map((tarea, i) =>{

        const idx = `${i + 1}`.green;
      
        return{
            value: tarea.id,
            name: `${idx}. ${tarea.desc }`,
            //para poner el chulo a las que solo estan con fecha en completasEn
            checked: (tarea.completadoEn)
                        ? true 
                        : false,
                        
        }
    });


    //se crean la preguntas
    const pregunta = [
        {
            //selecionar
            type:'checkbox',
            name: 'ids',
            message: 'Que Opciones deseas seleccionar',
            choices
        }
    ]
    //pregunta en consola las choises
    //se optiene el ids en la variable name
    const { ids } = await inquirer.prompt(pregunta);
    return ids;


}


//funsion para confirmar el borrar 
const confirmar = async (message) => {

    const question = [
        {
            type: 'confirm',
            name: 'Ok',
            message
        }
    ];
    //se muestra la pregunta
    //en la desestruturacion va el name de la question
    const { Ok } = await inquirer.prompt(question);
    return Ok;
}


//se exporta el archivo inquires.js
module.exports ={
    inquireMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}