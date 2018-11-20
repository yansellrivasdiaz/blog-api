$(document).ready(function(){
    // Evento click del formulario registrarse
    $("body").on("submit","#form-registrarse",function(e){
        e.preventDefault();
        registrarse();
    });
    // Validar contraseñas
    $("body").on("keyup","#re-password",function(e){
        var password = $("#password").val();
        var repassword = $(this).val();
        if(password === repassword){
            $(this).addClass("valid").removeClass("invalid").attr('title','Contrañas coinciden');
        }else{
            $(this).addClass("invalid").removeClass("valid").attr("title","Contrañas no coinciden");
        }
    })
});
function registrarse(){
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#rpassword').val();
    var repassword = $('#re-password').val();
    if(name != '' && email != '' && password != '' && repassword != ''){
        if(password === repassword){
            var url = 'http://68.183.27.173:8080/register';
            var data = {
                "name":name,
                "email":email,
                "password":password
            };
            
            fetch(url, {
              method: 'POST', // or 'PUT'
              body: JSON.stringify(data), // data can be `string` or {object}!
              headers:{
                'Content-Type': 'application/json'
              }
            }).then((res) => {
                if(res.ok){
                    res.json()
                }
                throw new Error('La respuesta no es ok...');
            })
            .then(response => {
                if(response.error){
                    alertshow(response.message,'danger');
                    $("#email").focus();
                }else{
                    $("#form-registrarse")[0].reset();
                    alertshow("usuario: "+response.email+" <small>Creado</smal>",'success');
                }
            })
            .catch(error => alertshow('Error: '+error.message,'danger'));
        }else{
            alertshow("Contraseñas no coiciden!",'warning');
            $('#re-password').focus(); 
        }
    }else{
        alertshow("Campos obligatorios",'danger');
        $('#username').focus();
    }
}