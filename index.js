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
  console.log("Peticion recibida : "+request.url);
  fs.readFile("./files"+request.url+"topaco/index.html/",archivolisto);

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
