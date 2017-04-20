var http = require('http');
var fs = require('fs');

//Crear una instancia del servidor HTTP
var server=http.createServer(atenderServidor);

console.log("Servidor iniciado");
//Iniciar la escucha del servidor en el puerto 8088
server.listen(process.env.PORT || 5000);
//server.listen( 8088 );

function atenderServidor(request,response){
  console.log("Peticion recibida : "+request.url);

  if(request.url != "/"){
    retornarArchivo(request,response);
  }
  else{
    response.end("Hola para ingresar a los archivos puedes cambiar la ruta con \n /cocktel/Index.html \n /ajedrez/ajedrez.html");
  }
}
function retornarArchivo(request,response){
  fs.readFile("./files"+request.url,archivolisto);

  function archivolisto(err,data){
    if(err == null){
      response.write(data);
      response.end();
    }else {
      console.log(err);
      response.end(err.toString());
    }
  }
}
