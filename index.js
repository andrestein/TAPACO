var http = require('http');
var fs = require('fs');

//Crear una instancia del servidor HTTP
var server=http.createServer(atenderServidor);

console.log("Servidor iniciado");
//Iniciar la escucha del servidor en el puerto 8088
server.listen(process.env.PORT || 5000);
//server.listen( 8088 );

function atenderServidor(request,response){
  var date = new Date();
  request.url = request.url+"topaco/index.html";
  console.log("Peticion recibida : "+request.url);
  retornarArchivo(request,response);
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
