//configuracion para variables de entorno
//lee el archivo con .env y guarda las variable con al configuracion
// VARIABLE_ALGO = dshfosbgosdbgbsfk
require('dotenv').config()

const { leerInput, inquireMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

//console.log(process.env.OPENWEATHER_KEY);


const main = async ()=>{

    let opt;
    const busquedas = new Busquedas();

    do {

        opt = await inquireMenu();
        switch (opt) {
            case 1:
             //mostrar mensaje que la persona escribe
             const termino  = await leerInput('Ciudad: ');
             
             
             // buscar los lugares
                                    //se envia el lugar ingresado al metodo en la clase busqueda
             const lugares = await busquedas.ciudad(termino);
             
             // seleccionar el lugar
             const idSelec = await listarLugares(lugares);

             // si no se seleciona ningun lugar
             if(idSelec === '0') continue;  

             //regresa el primer elemneto que cumpla la
             // la condicion especificado en el callback
             const lugarSelect = lugares.find( l => l.id === idSelec );
             
             
             // guardar en el historial DB o archivo de texto lugar selecionado
             // se envia el nombre del lugar seleccionado
             busquedas.agregarHistorial(lugarSelect.nombre);

             // datos del clima
            const clima = await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng);
            // console.log(clima);
             //se debe llamar otro API token de clima 
             //se crea cuenta en opewhatermap
             
             //mostrar resultados

             console.log('\nInformacion de la Ciudad\n');
             console.log('Ciudad:', lugarSelect.nombre );
             console.log('latitud:', lugarSelect.lat );
             console.log('Longitud:', lugarSelect.lng );
             console.log('Temperatura normal:',clima.temp_norm);
             console.log('Temperatura Minima:',clima.temp_min);
             console.log('Temperatura Maxima:', clima.temp_max);
             console.log('Como esta el clima:', clima.desc);

            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx } ${lugar}`);
                })
            break;
        
         
        }


        await pausa();
        
    } while (opt !== 0 )

}

 main();
