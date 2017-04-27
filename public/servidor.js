var http = require( "http" );
var fs = require( "fs" );

// vector que va  al macenar los usuarios registrados
var usuarios = [];

// variable para confirmar un nuevo usuario


// Cargar el archivo de usuarios del disco a memoria
fs.readFile( "usuarios.json", cargarUsuarios );

function cargarUsuarios( error, data ){
	if( error == null ){
		console.log( data);
		usuarios = JSON.parse( data ); // Des - stringify
	
		console.log( "Los usuarios registrados son: " );
		console.log( usuarios );
	} else {

		console.log( error );
		response.end( error.toString() );
	}
}


// Crear una instancia del servidor HTTP
var server = http.createServer( atenderServidor );

console.log( "Servidor iniciado" );



// Iniciar la escucha del servidor en el puero 8088
server.listen( 8088 );

// CoffeeScript o TypeScript
function atenderServidor( request, response ){
	console.log( "Peticion recibida : " + request.url );

	if( request.url == "/registrar" ){
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
		console.log( data.toString() );
		var usr = JSON.parse( data.toString() );

		// Agregar al vector
		if (validarRegistro(usr) == true){
			usuarios.push( usr );
			console.log( usuarios );
		
			fs.writeFile('usuarios.json', JSON.stringify( usuarios ), null );
		
			response.end( "Ya recibimos el usuario" );
		}
	}
}


// Datos inicio de sesion
function iniciarSesion( request , response ){
	request.on("data" , recibir );

	function recibir(data){
		var dt = JSON.parse( data.toString() );
		validarInicioSesion(dt);
	}
}

function retornarArchivo( request, response ){
  fs.readFile( "/public" + request.url, archivoListo );
  
  function archivoListo( error, data ){
	if( error == null ){
		response.writeHead(200, { 'content-type': 'text/html' });
		response.write( data );
		response.end();
	} else {
		console.log( error );
		response.end( error.toString() );
	}
  }
}


//valida que no exista otro usuario con el mismo correo
function validarRegistro( usr ){
	for (var i = 0; i < usuarios.length; i++) {
		if( usuarios[i].correo == usr.correo){
			window.alert("ya existe un usuario con ese correo");
			return false;			
		}
	}
	return true;
}


//validar datos para el inicio de sesion
function validarInicioSesion( dt ){
	for(var i = 0; i < usuarios.length; i++){
		if(dt.correo == usuarios.correo && dt.contraseña == usuarios.contraseña){
			return true;
		}	
	}
	return false;
}






