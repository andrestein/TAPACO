    

    var user;
    var fullCookies = [];
    var cookies = [];

    fullCookies = document.cookie.split(';');

    for(var i = 0; i < fullCookies.length; i++){
      var temp = fullCookies[i].split("=");
      cookies.push( temp[0] );
      cookies.push( temp[1] );
    }

    function loadOptions(){

    for(var i = 0; i < cookies.length - 1 ; i +=2){
      if(cookies[i] == 'usuario' && cookies[i+1] != 'null'){

          user = cookies[i+1];

          document.getElementById("prueba").innerHTML = "<li><a href='formulario.html'> Hacer cotizacion </a></li>"
          + "<li><a onclick='cerrarSesion()'> Cerrar sesion </a></li>"
          + "<li class='dropdown-header'Nav header</li>"
          + "<li role='separator' class='divider'></li>"
          + "<li><a href='#'>Preguntas Frecuentes</a></li>"
          + "<li><a href='#'>Terminos y Condiciones</a></li>"; 

      }
      else if(cookies[i] == 'asesor' && cookies[i+1] != 'null'){

          user = cookies[i+1];

          document.getElementById("prueba").innerHTML = "<li><a href='verPedidos.html'> Ver cotizaciones </a></li>"
          + " <li><a onclick='cerrarSesion()'> Cerrar sesion </a></li>"
          + "<li class='dropdown-header'Nav header</li>"
          + "<li role='separator' class='divider'></li>"
          + "<li><a href='#'>Preguntas Frecuentes</a></li>"
          + "<li><a href='#'>Terminos y Condiciones</a></li>"; ; 

        }
      }
    }

    function cerrarSesion(){

      var cerrar = {};

      cerrar.status = "close";
      
      var serializado = JSON.stringify( cerrar );

      // Crear un objeto para hacer peticiones HTTP
      var request = new XMLHttpRequest();
      var url = window.location.pathname.split(".");
      // Abrir una peticion HTTP POST a la url deseado y no asincronico
      request.open( "POST", url[0] , false );
    
      // Ejecuta la peticion HTTP
      request.send( serializado );

      var resp;

      resp = JSON.parse( request.responseText );
      console.log(resp.status);

      if(resp.status == "sesionClosed"){
        document.getElementById("prueba").innerHTML = "<li><a href='inicio.html'>Iniciar Sesion</a></li>"
                    + "<li><a href='registro2.html'>Registrarse</a></li>"
                    + "<li role='separator' class='divider'></li>"
                    + "<li class='dropdown-header'>Nav header</li>"
                    + "<li><a href='#'>Preguntas Frecuentes</a></li>"
                    + "<li><a href='#'>Terminos y Condiciones</a></li>"; 
                  }
    }