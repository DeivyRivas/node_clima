const fs = require('fs');

const axios = require('axios');

class Busquedas{

    historial = [];

    // se crea el path de la db 
    dbpath = './db/datos.json'

    constructor(){
        //TODO:leer base de datos si existe
        this.leeDB();
    }

 //poner la primera letra en mayusculas
    get historialCapitalizado(){
        return this.historial.map(lugar=>{
            //se borran espacios con el Split
            let palabras = lugar.split(' ');
            //retorna la primera letra en mayusculas
            palabras = palabras.map( p => p[0].toUpperCase()+ p.substring(1));
            // se unen la palabra poniendo el espacio borrado
            return palabras.join(' ')
        });
    }

    //se crea get params con la informacion que siempre se va urilizar
    get paramsMapbox(){
        return{
                            // se saca la variable de entorno la cuel tiene el Api key token
            'access_token': process.env.MAPBOX_KEY,//variable de entorno MAPBOX_KEY
            'language':'es',
            'limit': 5
        };
    }

    get paramsOpenweather(){
        return{
                            // se saca la variable de entorno la cuel tiene el Api key token
            'appid': process.env.OPENWEATHER_KEY,//variable de entorno OPENWEATHER_KEY
            'lang':'es',
            'units': 'metric'
        };
    }



    // metodo para buscar ciudad
    async ciudad (lugar = ''){

        try {

            //se crea instancias de axios
            const instance = axios.create({
                //escribe todo lo que necesitas
                // se pega API de busqueda de maxpbox
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            
            });  

            //se hace peticion usando instance
            const resp = await instance.get();  

            // se estrae la data que es un objeto y los feacture que son otro object(resp.data);
            // se recorre el arreglo con el map que retorna un nuevo object
            return resp.data.features.map(lugar =>({
                //se retorna el nuevo objeto de forma implicita 
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));



            return [] // regresa el objeto
            
        } catch (error) {
            return [];
        }
        
    }


    async climaLugar(lat, lon){
        try {

            //se crea instancias de axios
            const instance = axios.create({
                //escribe todo lo que necesitas
                // se pega API de busqueda de openweather
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenweather, lat, lon}
            
            });
            //se hace peticion usando instance
            const respClima = await instance.get(); 
            //se estrae objetos a necesitar
            const {weather, main} = respClima.data;

            // return[]
            return {
                //se retorna el nuevo objeto de forma implicita 
                desc: weather[0].description,
                temp_norm: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max
            };
            
        } catch (error) {
            console.log(error);
        }
    }

    //metodo de grabar historial
    //recibe lugar y lo guarda como un string
    agregarHistorial(lugar = ''){
        //prevenir lugares duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase() ) ){
            return;
        }// si existe el lugar no haga nada

        //limete de guardado
        this.historial = this.historial.splice(0,6);

        // .push lo añade al final del objeto
        // .unshift lo añade al inicio del objeto
        this.historial.unshift(lugar.toLocaleLowerCase() ); // si no existe lo añade al inicio

        //guardar info en DB o archivo de texto

        this.guardarDB()
    }
    // grabar archivo de texto
    guardarDB(){

        const payload = {
            historial : this.historial
        };
        fs.writeFileSync(this.dbpath, JSON.stringify(payload));
    }

    leeDB(){
        if(!fs.existsSync(this.dbpath)){
            return null;
        }
        // info es objeto string
        const info = fs.readFileSync(this.dbpath, {encoding: 'utf-8'});
        //info se pasa a json con el parse
        const data = JSON.parse(info);
                            //se le pasa la instancia histrial del json al arreglo
        this.historial = data.historial;
   
    }



}


module.exports = Busquedas;