var http = require( "http" );
var fs = require( "fs" );

var usuarios = {};
var asesores = {};
var pedidos = {};

function cargarVariables(url){

	var vector = {};

	fs.readFile( url , cargarDatos );
	function cargarDatos( error, data ){
		if( error == null ){
			vector = JSON.parse( data ); // Des - stringify
			console.log("elementos del archivo " + url + " cargados Correctamente" );

		} else {
			console.log( error );
			response.end( error.toString() );
		}
	}

	return vector
}

usuarios = cargarVariables("BD/usuarios.json");
asesores = cargarVariables("BD/asesores.json");
pedidos = cargarVariables("BD/pedidos.json");

// Guarda el registro de un usuario
function guardarRegistro( datos , clase ){
		if( clase == "usuario"){
		// si no hay otro usuario con el mismo email lo registra.
			if(verificarPesonas( datos , usuarios )){
				usuarios.push( datos );
		
				fs.writeFile('usuarios.json', JSON.stringify( usuarios ), null );
				console.log( "Ya recibimos el usuario" );
			}
			else{
				console.log("No se pudo recibir el usuario");
			}
		}

		else if( clase == "asesor" ) {
			if(verificarPesonas( datos , asesores)){
				asesores.push( datos );
		
				fs.writeFile('usuarios.json', JSON.stringify( asesores ), null );
				console.log( "Ya recibimos el asesor" );
			}
			else{
				console.log("No se pudo recibir el asesor");
			}
		}

		else if( clase == "pedido" ) {
			if(verificarPedidos( datos , pedidos )){
				pedidos.push( datos );
		
				fs.writeFile('usuarios.json', JSON.stringify( pedidos ), null );
				console.log( "Ya recibimos el pedido" );
			}
			else{
				console.log("No se pudo recibir el pedido");
			}
		}

		// verifica que no exista otro usuario y/o asesor con el mismo correo (email)
		function verificarPesonas( usr , vector ){
			for(var i = 0; i < vector.length; i++){		
				if(vector[i].email == usr.email){	
					console.log('\n Ya existe un usuario con ese email');					
					return false;
				}
			}
			return true;	
		}

		// verifica que no exista otro pedido con el mismo correo (email) de asesores y clientes con la misma fecha.
		function verificarPedidos( usr , vector ){
			for(var i = 0; i < vector.length; i++){		
				if(vector[i].emailUsr == usr.emailUsr && vector[i].emailAsr == usr.emailAsr && vector[i].fecha == usr.fecha){	
					console.log('\n Ya existe pedido con igual');					
					return false;
				}
			}
			return true;	
		}
	}
}


// verifica los datos para inciar sesion de un usuario sean correctos
function verificarDatosDeInicio( request , response ){
	request.on("data", datosInicio);
	
	function datosInicio( data ){
		var datos = JSON.parse( data.toString() );

		if(verificarDatos(datos)){
			console.log('\n usuario accedio correctamente');
			response.end("usuario accedio correctamente");
		}
		else{
			console.log('\n Usuario o Contraseña incorrectos!!');
			response.end("Usuario o Contraseña incorrectos");
		}
	}

	// verifica que el email y clave si correspondan
	function verificarDatos(datos){
		for(var i = 0; i < usuarios.length; i++){
			if(usuarios[i].email == datos.email && usuarios[i].clave == datos.clave){			
				return true;
			}
		}
		return false;
	}

	
}
