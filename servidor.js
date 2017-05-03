var http = require( "http" );
var fs = require( "fs" );

// usuarios
var usuarios = [];

fs.readFile( "BD/usuarios.json", cargarUsuarios );
function cargarUsuarios( error, data ){
	if( error == null ){
		usuarios = JSON.parse( data ); // Des - stringify
		console.log("Usuarios cargados correctamente \n");
	} else {
		console.log("Error al cargar los usuarios \n");
		console.log( error );
		response.end( error.toString() );
	}
}

// Crear una instancia del servidor HTTP
var server = http.createServer( atenderServidor );

console.log( "Servidor iniciado" );



// Iniciar la escucha del servidor en el puero 8088
server.listen( 8088 );

//   CoffeeScript o TypeScript
function atenderServidor( request, response ){
	console.log( "Peticion recibida : " + request.url );
	
	if( request.url == "/registro" ){
		guardarRegistro( request, response );
	}
	else {
		retornarArchivo( request, response );
	}
}


// Guarda el registro de un usuario
function guardarRegistro( request, response ){
	// Programa el Callback
	request.on( "data", recibir );
	
	// Callback que recibe el cuerpo del POST
	function recibir( data ){

		console.log( "\n este fue el usuario que recibio: \n" + data.toString() );
		var usr = JSON.parse( data.toString() );
	
		// Agregar al vector
		// si no hay otro usuario con el mismo email lo registra.
		if(verificarUsuario(usr)){
			usuarios.push( usr );
		
			fs.writeFile('BD/usuarios.json', JSON.stringify( usuarios ), null );
			console.log("\n el usuario fue agregado");

			response.end( "Ya recibimos el usuario" );
		}
		else{
			response.end("No se pudo recibir el usuario")
		}

		// verifica que no exista otro usuario con el mismo correo (email)
		function verificarUsuario( usr ){
			for(var i = 0; i < usuarios.length; i++){		
				if(usuarios[i].correo == usr.correo){	
					console.log('\n Ya existe un usuario con ese email');					
					return false;
				}
			}
			return true;	
		}
	}
}



function retornarArchivo( request, response ){
	var a = "./public" + request.url;
	var url = "";
	for(var i = 0; i < a.length; i++){
		if(a.charAt(i) != '?'){
			url += a.charAt(i);
		}
	}

	//fs.readFile( "./public" + request.url, archivoListo );
	fs.readFile( url, archivoListo );

  	function archivoListo( error, data ){
		if( error == null ){
			response.writeHead(200, { 'content-type': 'text/html' });
			response.write( data );
			response.end();
		} else {
			//console.log( error );
			response.end( error.toString() );
		}
  	}
}








