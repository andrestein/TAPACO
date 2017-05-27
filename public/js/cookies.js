    

    var user;
    var fullCookies = [];
    var cookies = [];

    var url = window.location.pathname.split(".");

    fullCookies = document.cookie.split(';');

    for(var i = 0; i < fullCookies.length; i++){
      var temp = fullCookies[i].split("=");
      cookies.push( temp[0] );
      cookies.push( temp[1] );
    }

    function loadOptions(){

    if(verificarAutenticidad()){

      for(var i = 0; i < cookies.length - 1 ; i +=2){
        if(cookies[i] == 'usuario' && cookies[i+1] != 'null'){

            user = cookies[i+1];

            document.getElementById("prueba").innerHTML = "<li><a href='productos.html'> Hacer pedido </a></li>"
            + "<li><a onclick=''> Ver Pedidos</a></li>"
            + "<li><a onclick='cerrarSesion()'> Cerrar sesion </a></li>"
            + "<li class='dropdown-header'Nav header</li>"
            + "<li role='separator' class='divider'></li>"
            + "<li><a href='Terms.html'>Terminos y Condiciones</a></li>"; 

        }
        else if(cookies[i] == 'asesor' && cookies[i+1] != 'null'){

          user = cookies[i+1];

          document.getElementById("prueba").innerHTML = "<li><a href='verCotizaciones.html'> Ver Pedidos </a></li>"
          + " <li><a onclick='cerrarSesion()'> Cerrar sesion </a></li>"
          + "<li class='dropdown-header'Nav header</li>"
          + "<li role='separator' class='divider'></li>"
          + "<li><a href='Terms.html'>Terminos y Condiciones</a></li>"; ; 

        }
      }
    }
    else{
      window.alert("Ud no puede estar en esta pagina sin iniciar sesion");
      window.location.href = "index.html";
    }
  }

    function verificarAutenticidad(){
      
      if(url[0] == "/verCotizaciones" || url[0] == "/productos" || url[0] == "/Envio"){
        for(var i = 0; i < cookies.length - 3 ; i +=2){
          if(cookies[i+1] == 'null' && cookies[i+3] == 'null'){
            //no hay ningun usuario o asesor regitrado con sesion activa
            return false;
          }
        }
      }
      return true;
    }

    function cerrarSesion(){

      var cerrar = {};

      cerrar.status = "close";
      
      var serializado = JSON.stringify( cerrar );

      // Crear un objeto para hacer peticiones HTTP
      var request = new XMLHttpRequest();

      // Abrir una peticion HTTP POST a la url deseado y no asincronico
      request.open( "POST", url[0] , false );
    
      // Ejecuta la peticion HTTP
      request.send( serializado );

      var resp;

      resp = JSON.parse( request.responseText );
      console.log(resp.status);

      if(resp.status == "sesionClosed"){
        window.location.href="index.html";
        document.getElementById("prueba").innerHTML = "<li><a href='iniciarsesion.html'>Iniciar Sesion</a></li>"
                    + "<li><a href='Registro.html'>Registrarse</a></li>"
                    + "<li role='separator' class='divider'></li>"
                    + "<li class='dropdown-header'>Nav header</li>"
                    + "<li><a href='#'>Preguntas Frecuentes</a></li>"
                    + "<li><a href='#'>Terminos y Condiciones</a></li>"; 
                  }
    }