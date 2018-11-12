window.addEventListener('load',function(){
    // Evento click del formulario login
    var formlogin = document.getElementById('form-login');
    if(formlogin){
        formlogin.addEventListener('submit',function(e){
            e.preventDefault();
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            if(username != '' && password != ''){
                alert(username + '-' + password);
            }else{
                alert('Campos obligatorios');
                document.getElementById('username').focus();
            }
        },false);
    }
    // Evento click del formulario registrarse
    var formregistrarse = document.getElementById('form-registrarse');
    if(formregistrarse){
        formregistrarse.addEventListener('submit',function(e){
            e.preventDefault();
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var re_password = document.getElementById('re-password').value;
            if(name != '' && email != '' && password != '' && re_password != ''){
                if(password === re_password){
                    alert('datos validados');
                }else{
                    alert('Contraseñas no coinciden');
                    document.getElementById('re-password').focus();
                }
            }else{
                alert('Todos los campos con requeridos');                
                document.getElementById('name').focus();
            }
        },false);
    }
});