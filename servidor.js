var http = require( "http" );
var fs = require( "fs" );

// usuarios y asesorees
var usuarios = [];
var asesores = [];

fs.readFile( "BD/usuarios.json", cargarUsuarios );
function cargarUsuarios( error, data ){

	if( error == null ){
		usuarios = JSON.parse( data ); // Des - stringify
		console.log( "Los usuarios han sido cargados correctamente " );

	} else {
		console.log( error );
		response.end( error.toString() );
	}
}

fs.readFile( "BD/asesores.json", cargarAsesores );
function cargarAsesores( error, data ){

	if( error == null ){
		asesores = JSON.parse( data ); // Des - stringify
		console.log( "Los asesores han sido cargados correctamente " );

	} else {
		console.log( error );
		response.end( error.toString() );
	}
}



//var pedidos = [];

/* function cargarVariables(url){

	var vector = [];

	fs.readFile( url , cargarDatos );
	function cargarDatos( error, data ){

		if( error == null ){
			vector = JSON.parse( data ); // Des - stringify
			console.log("\n elementos del archivo " + url + " cargados Correctamente" );
			console.log("\n " + vector.toString() );

		} else {
			console.log( error );
			response.end( error.toString() );
		}
	}

	return vector


}

usuarios = cargarVariables("BD/usuarios.json");
asesores = cargarVariables("BD/asesores.json");
//pedidos = cargarVariables("BD/pedidos.json");

*/

// Crear una instancia del servidor HTTP
var server = http.createServer( atenderServidor );

console.log( "Servidor iniciado" );



// Iniciar la escucha del servidor en el puero 8088
server.listen( 8088 );



//--------------------------------------------------------------------------------------------
// AQUI SE ATIENDEN LAS PETICIONES QUE RECIBE EL SERVIDOR

//   CoffeeScript o TypeScript
function atenderServidor( request, response ){
	console.log( "Peticion recibida : " + request.url );
	
	if( request.url == "/registro2" ){
		guardarRegistro( request, response );	
	}
	else if( request.url == "/inicio" ){
		iniciarSesion( request, response );
	}
	else {
		retornarArchivo( request, response );
		cerrarSesion( request, response );
	}
}



//--------------------------------------------------------------------------------------------
// AQUI SE MANEJAN LOS DATOS RECIVIDOS DEL NAVEGADOR, AL REGISTRARSE UN NUEVO USUARIO

// Guarda el registro de un usuario
function guardarRegistro( request, response ){
	// Programa el Callback
	request.on( "data", recibir );
	
	// Callback que recibe el cuerpo del POST
	function recibir( data ){

		//console.log( "\n este fue el usuario que recibio: \n" + data.toString() );
		var usr = JSON.parse( data.toString() );
	
		// Agregar al vector
		// si no hay otro usuario con el mismo email lo registra.
		if(verificarUsuario(usr)){
			usuarios.push( usr );
		
			fs.writeFile('BD/usuarios.json', JSON.stringify( usuarios ), null );
			console.log("\n el usuario fue agregado");

			var resp = {} ;
			resp.status = "ok";
			resp.url = "inicio.html";

			response.end( JSON.stringify(resp) );
		}
		else{

			var resp = {} ;
			resp.status = "fail";

			response.end( JSON.stringify(resp) );
		}

		// verifica que no exista otro usuario con el mismo correo (email)
		function verificarUsuario( usr ){
			for(var i = 0; i < asesores.length; i++){
					if(usuarios[i].correo == usr.correo){	
					console.log('\n No se puede usar ese correo');					
					return false;
				}
			}

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



//--------------------------------------------------------------------------------------------
// AQUI SE VALIDAN LOS DATOS QUE LLEGAN DE INICIAR SESION CON LOS GUARDADOS EN LOS .JSON

// verifica los datos para inciar sesion de un usuario sean correctos
function iniciarSesion( request , response ){
	request.on("data", datosInicio);
	
	function datosInicio( data ){
		var datos = JSON.parse( data.toString() );

		if (verificarDatosAsr(datos)){
			console.log('\n asesor accedio correctamente');			

			// para cargar una pagina con la respuesta ok 
			var resp = {};
			resp.status = 'ok';
			resp.url = 'index.html';
			resp.level = 2;

			response.writeHead( 200 , {
				'Set-Cookie' : ['asesor=' + datos.correo + ';',' usuario=null']
			});
			

			response.end(JSON.stringify(resp));

		}		

		else if(verificarDatosUsr(datos)){
			console.log('\n usuario accedio correctamente');			

			// para cargar una pagina con la respuesta ok 
			var resp = {};
			resp.status = 'ok';
			resp.url = 'index.html';
			resp.level = 1;

			response.writeHead( 200 , {
				'Set-Cookie' : ['usuario=' + datos.correo + ';','asesor=null']
			});			
			response.end(JSON.stringify(resp));

		}

		else {
			console.log('\n Usuario o Contraseña incorrectos!!');

			var resp = {};
			resp.status = 'fail';

			response.end(JSON.stringify(resp));
		}
	}

	// verifica que el email y clave si correspondan al asesor
	function verificarDatosAsr(datos){
		for(var i = 0; i < asesores.length; i++){
			if(asesores[i].correo == datos.correo && asesores[i].contraseña == datos.contraseña) {			
				return true;
			}
		}
		return false;
	}

	// verifica que el email y clave si correspondan al usuario
	function verificarDatosUsr(datos){
		for(var i = 0; i < usuarios.length; i++){
			if(usuarios[i].correo == datos.correo && usuarios[i].contraseña == datos.contraseña) {			
				return true;
			}
		}
		return false;
	}

	
}
//--------------------------------------------------------------------------------------------
// CODIGO PARA CERRAR LA SESION DE UN USUARIO Y/O ASESOR
function cerrarSesion( request, response ){

	request.on("data", cerrar);

	function cerrar( data ){
		var cer = JSON.parse( data.toString() );
		if(cer.status == "close"){

			var resp = {};
			resp.status = "sesionClosed";
			response.writeHead(200, {
				'Set-Cookie' : ['usuario=null','asesor=null']
			});

			console.log("\n sesion cerrada exitosamente");
			response.end( JSON.stringify( resp ) );
		}
	}
}



//--------------------------------------------------------------------------------------------
// AQUI SE CARGAN LOS ARCHIVOS QUE REQUIERE CADA PETICION

function retornarArchivo( request, response ){
	/* var a = "./public" + request.url;
	var url = "";
	for(var i = 0; i < a.length; i++){
		if(a.charAt(i) != '?'){
			url += a.charAt(i);
		}
	}
	*/ 
	fs.readFile( "./public" + request.url, archivoListo );
	//fs.readFile( url, archivoListo );

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








