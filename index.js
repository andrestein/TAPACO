var http = require( "http" );
var fs = require( "fs" );
var path = require("path");
var formidable = require("formidable");

var mimeTypes =
{
  'a'      : 'application/octet-stream',
  'ai'     : 'application/postscript',
  'aif'    : 'audio/x-aiff',
  'aifc'   : 'audio/x-aiff',
  'aiff'   : 'audio/x-aiff',
  'au'     : 'audio/basic',
  'avi'    : 'video/x-msvideo',
  'bat'    : 'text/plain',
  'bin'    : 'application/octet-stream',
  'bmp'    : 'image/x-ms-bmp',
  'c'      : 'text/plain',
  'cdf'    : 'application/x-cdf',
  'csh'    : 'application/x-csh',
  'css'    : 'text/css',
  'dll'    : 'application/octet-stream',
  'doc'    : 'application/msword',
  'dot'    : 'application/msword',
  'dvi'    : 'application/x-dvi',
  'eml'    : 'message/rfc822',
  'eps'    : 'application/postscript',
  'etx'    : 'text/x-setext',
  'exe'    : 'application/octet-stream',
  'gif'    : 'image/gif',
  'gtar'   : 'application/x-gtar',
  'h'      : 'text/plain',
  'hdf'    : 'application/x-hdf',
  'htm'    : 'text/html',
  'html'   : 'text/html',
  'jpe'    : 'image/jpeg',
  'jpeg'   : 'image/jpeg',
  'jpg'    : 'image/jpeg',
  'js'     : 'application/x-javascript',
  'ksh'    : 'text/plain',
  'latex'  : 'application/x-latex',
  'm1v'    : 'video/mpeg',
  'man'    : 'application/x-troff-man',
  'me'     : 'application/x-troff-me',
  'mht'    : 'message/rfc822',
  'mhtml'  : 'message/rfc822',
  'mif'    : 'application/x-mif',
  'mov'    : 'video/quicktime',
  'movie'  : 'video/x-sgi-movie',
  'mp2'    : 'audio/mpeg',
  'mp3'    : 'audio/mpeg',
  'mp4'    : 'video/mp4',
  'mpa'    : 'video/mpeg',
  'mpe'    : 'video/mpeg',
  'mpeg'   : 'video/mpeg',
  'mpg'    : 'video/mpeg',
  'ms'     : 'application/x-troff-ms',
  'nc'     : 'application/x-netcdf',
  'nws'    : 'message/rfc822',
  'o'      : 'application/octet-stream',
  'obj'    : 'application/octet-stream',
  'oda'    : 'application/oda',
  'pbm'    : 'image/x-portable-bitmap',
  'pdf'    : 'application/pdf',
  'pfx'    : 'application/x-pkcs12',
  'pgm'    : 'image/x-portable-graymap',
  'png'    : 'image/png',
  'pnm'    : 'image/x-portable-anymap',
  'pot'    : 'application/vnd.ms-powerpoint',
  'ppa'    : 'application/vnd.ms-powerpoint',
  'ppm'    : 'image/x-portable-pixmap',
  'pps'    : 'application/vnd.ms-powerpoint',
  'ppt'    : 'application/vnd.ms-powerpoint',
  'pptx'    : 'application/vnd.ms-powerpoint',
  'ps'     : 'application/postscript',
  'pwz'    : 'application/vnd.ms-powerpoint',
  'py'     : 'text/x-python',
  'pyc'    : 'application/x-python-code',
  'pyo'    : 'application/x-python-code',
  'qt'     : 'video/quicktime',
  'ra'     : 'audio/x-pn-realaudio',
  'ram'    : 'application/x-pn-realaudio',
  'ras'    : 'image/x-cmu-raster',
  'rdf'    : 'application/xml',
  'rgb'    : 'image/x-rgb',
  'roff'   : 'application/x-troff',
  'rtx'    : 'text/richtext',
  'sgm'    : 'text/x-sgml',
  'sgml'   : 'text/x-sgml',
  'sh'     : 'application/x-sh',
  'shar'   : 'application/x-shar',
  'snd'    : 'audio/basic',
  'so'     : 'application/octet-stream',
  'src'    : 'application/x-wais-source',
  'swf'    : 'application/x-shockwave-flash',
  't'      : 'application/x-troff',
  'tar'    : 'application/x-tar',
  'tcl'    : 'application/x-tcl',
  'tex'    : 'application/x-tex',
  'texi'   : 'application/x-texinfo',
  'texinfo': 'application/x-texinfo',
  'tif'    : 'image/tiff',
  'tiff'   : 'image/tiff',
  'tr'     : 'application/x-troff',
  'tsv'    : 'text/tab-separated-values',
  'txt'    : 'text/plain',
  'ustar'  : 'application/x-ustar',
  'vcf'    : 'text/x-vcard',
  'wav'    : 'audio/x-wav',
  'wiz'    : 'application/msword',
  'wsdl'   : 'application/xml',
  'xbm'    : 'image/x-xbitmap',
  'xlb'    : 'application/vnd.ms-excel',
  'xls'    : 'application/vnd.ms-excel',
  'xlsx'    : 'application/vnd.ms-excel',
  'xml'    : 'text/xml',
  'xpdl'   : 'application/xml',
  'xpm'    : 'image/x-xpixmap',
  'xsl'    : 'application/xml',
  'xwd'    : 'image/x-xwindowdump',
  'zip'    : 'application/zip'
}

// usuarios y asesorees
var usuarios = [];
var asesores = [];
var producto = [];
var pedidos = [];
var idPedidos = 0;
var numFile = 0;

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
fs.readFile( "BD/productos.json", cargarProductos );
function cargarProductos( error, data ){

	if( error == null ){
		producto = JSON.parse( data ); // Des - stringify

		console.log( "Los productos han sido cargados correctamente " );

	} else {
		console.log( error );
		response.end( error.toString() );
	}
}
fs.readFile( "BD/pedidos.json", cargarPedidos );
function cargarPedidos(error, data){

	if( error == null ){
		pedidos = JSON.parse( data ); // Des - stringify
		idPedidos = pedidos.length;
		console.log(idPedidos);
		console.log( "Los pedidos han sido cargados correctamente " );

	} else {
		console.log( error );
		response.end( error.toString() );
	}
}

function darProductos(request, response){
			var resp = {};
			resp.estado = 'ok';
			resp.data= producto;
			console.log("respuesta enviada");
			response.end(JSON.stringify(resp));
}

function darAsesores(req, resp){
			var res = {};
			res.estado = 'ok';
			res.data= asesores;
			console.log("respuesta enviada");
			resp.end(JSON.stringify(res));
}

function darPedidos(req, resp){
			var res = {};
			res.estado = 'ok';
			res.data= pedidos;
			console.log("respuesta enviada");
			resp.end(JSON.stringify(res));
}

// Crear una instancia del servidor HTTP
var server = http.createServer( atenderServidor );

console.log( "Servidor iniciado" );



// Iniciar la escucha del servidor en el puero 8088
server.listen(process.env.PORT || 5000);



//--------------------------------------------------------------------------------------------
// AQUI SE ATIENDEN LAS PETICIONES QUE RECIBE EL SERVIDOR

//   CoffeeScript o TypeScript
function atenderServidor( request, response ){
	console.log( "Peticion recibida : " + request.url );
	if( request.url == "/Registro" ){
		guardarRegistro( request, response );
	}
	else if( request.url == "/iniciosesion" ){
		iniciarSesion( request, response );
	}
	else if (request.url == "/obtenerProductos"){
		darProductos(request, response);
	}
	else if (request.url =="/obtenerAsesores"){
		darAsesores(request, response);
	}
	else if (request.url =="/guardarPedido"){
		guardarPedido(request, response);
	}
	else if( request.url=="/obtenerPedido"){
		darPedidos(request, response);
	}
	else if( request.url == "/guardarPedidoModificado"){
		guardarPedidoModificado(request, response);
	}else if ( request.url =="/guardarArchivo"){
		guardarArchivo(request, response);
	}
	else{
		if(request.url =="/"){
			retornarArchivoInicio( request, response );
			cerrarSesion( request, response );
		}else{
		retornarArchivo( request, response );
		cerrarSesion( request, response );
		}
	}
}


//--------------------------------------------------------------------------------------------
// AQUI SE MANEJAN LOS DATOS RECIVIDOS DEL NAVEGADOR, AL REGISTRARSE UN NUEVO USUARIO

function guardarPedido(req, res){
	req.on( "data" , recibir);

	function recibir(data){
		var pedi = JSON.parse(data.toString() );
		pedi.id = idPedidos;
		pedi.estado = "sinRevisar";
		pedidos.push(pedi);

		fs.writeFile('BD/pedidos.json', JSON.stringify(pedidos), null);
		console.log("el pedido fue añadido");

		var resp= {};
		resp.status= "ok";
		res.end(JSON.stringify(resp) );
	}
}


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
			resp.url = "iniciosesion.html";

			response.end( JSON.stringify(resp) );
		}
		else{

			var resp = {} ;
			resp.status = "fail";

			response.end( JSON.stringify(resp) );
		}

		// verifica que no exista otro usuario con el mismo correo (email)
		function verificarUsuario( usr ){
			for(var i = 0; i < usuarios.length; i++){
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

	fs.readFile( "./public" + request.url, archivoListo );
	//fs.readFile( url, archivoListo );

  	function archivoListo( error, data ){
		if( error == null ){

			if(request.url == "/css/Style.css" || request.url == "/css/bootstrap.min.css" || request.url == "/css/app.css"){
				console.log("es un estilo");
				response.writeHead(200, {'content-type': 'text/css'})
			}
			else {
			response.writeHead(200, { 'content-type': 'text/html' });
			}
			response.write( data );
			response.end();
		} else {
			//console.log( error );
			response.end( error.toString() );
		}
  	}
}

function retornarArchivoInicio( request, response ){

	fs.readFile( "./public" + "/index.html", archivoListo );

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


//RECIBE EL ARCHIVO MODIFICADO POR EL CLIENTE, ACTUALIZA EL ANTERIOR Y LO GUARDA EN LA BD

function guardarPedidoModificado( request, response){
		request.on( "data" , recibir);

	function recibir(data){
		var pedi = JSON.parse(data.toString() );
		modificarPedido(pedi);

		fs.writeFile('BD/pedidos.json', JSON.stringify(pedidos), null);
		console.log("el pedido modificado por el asesor fue añadido");

		var resp= {};
		resp.status= "ok";
		response.end(JSON.stringify(resp,null,2) );
	}
}

// verifica el pedido que va a modificar
	function modificarPedido( pedido ){
		for(var i = 0; i < pedidos.length; i++){
			if(pedidos[i].id == pedido.id){
				pedidos[i] = pedido;
				break;
			}
		}
	}


function verificarNumArchivo(){
	console.log("verificando cuantos archivos hay");
	fs.readdir('./public/files/',function (error,archivos){
      var contador=0;
      for(var x=0;x<archivos.length;x++) {
          contador= contador+1;
      }
      numFile= contador;
      console.log("adjuntos: "+contador); 
  });    
}

//GUARDAR ARCHIVO ENVIADO EN FORMULARIO
function guardarArchivo(request, response){
var entrada=new formidable.IncomingForm();
var name ="";

    entrada.uploadDir='upload';
    entrada.parse(request);
    
    entrada.on('fileBegin', function(field, file){
    	var ext = path.extname( file.name );
    	verificarNumArchivo();
    	file.name="adjunto#"+(numFile+1)+""+ext;
    	name = file.name;
        file.path = "./public/files/"+file.name;
    });    
    entrada.on('end', function(){
        var resp= {};
		resp.status= "ok";
		resp.nameFile=name;
		response.end(JSON.stringify(resp));		
    });    

}