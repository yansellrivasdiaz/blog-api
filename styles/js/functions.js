window.addEventListener('load',function(){
    // Evento click del formulario login
    var formlogin = document.getElementById('form-login');
    if(formlogin){
        formlogin.addEventListener('submit',function(e){
            e.preventDefault();
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            alert(username + '-' + password);
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
            alert(name + '-' + email);
        },false);
    }
});