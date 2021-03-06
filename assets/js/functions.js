const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"
];
const monthShortNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];
$(document).ready(function () {    
    $("body").on("click",".btn-open",function(e){
        e.preventDefault();
        if($(this).find(".fas").hasClass("fa-chevron-left")){
            $(this).find(".fas").removeClass("fa-chevron-left").addClass("fa-chevron-right");
        }else{
            $(this).find(".fas").removeClass("fa-chevron-right").addClass("fa-chevron-left");
        }
        $("#userbox").toggleClass("open");
        $(this).toggleClass("open");
    })
    $(".content-center .nav-item").click(function () {
        $("#form-registrarse")[0].reset();
        $("#form-login")[0].reset();
    });
    $("body").on("click", ".showprofile", function (e) {
        e.preventDefault();
        var userid = $(this).data("ownerid");
        getuserprofile(userid);
    })
    /* Esta funsion es para cuando el scroll baja aparezca el boton de subir */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            if (!$("#posts-container .btn-subir").length) $("#posts-container").append(`<a href="javascript:void(0);" class="btn btn-link btn-lg btn-subir animated" onclick="upToTop()"><i class="fa fa-arrow-up fa-lg"></i></a>`);
            $('#posts-container .btn-subir').show().addClass("slideInRight").removeClass("slideOutRight");
            $(".page-footer").slideUp("slow");
        } else {
            if (!$("#posts-container .btn-subir").length) $("#posts-container").append(`<a href="javascript:void(0);" class="btn btn-link btn-lg btn-subir animated" onclick="upToTop()"><i class="fa fa-arrow-up fa-lg"></i></a>`);
            $('#posts-container .btn-subir').show().addClass("slideOutRight").removeClass("slideInRight");
            $(".page-footer").slideDown("slow");
        }
    });
});
/*
	funcion para subir hacia arriba en la pantalla
*/
function upToTop() {
    $('body, html').animate({
        scrollTop: '0px'
    }, 300);
}
function dateFormatMonthNames(d) {
    var t = new Date(d);
    return t.getDate() + ' de ' + monthNames[t.getMonth()] + ', ' + t.getFullYear();
}
function dateFormatmonthShortNames(d) {
    var t = new Date(d);
    return t.getDate() + ' de ' + monthShortNames[t.getMonth()] + ', ' + t.getFullYear();
}
function getuserprofile(userid) {
    if (localStorage.getItem("blogapi")) {
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/users/' + userid;
        if (userdata.id > 0 && userdata.token.length == 36) {
            var cabecera = new Headers();
            cabecera.append("Authorization", 'Bearer ' + userdata.token);
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method: 'GET',
                headers: cabecera
            };
            var myrequest = new Request(url, init);
            fetch(myrequest).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function (data) {
                $("#user-profile .txt-post").data("userid", 0);
                if (data.id > 0) {
                    $("#user-profile .txt-post").html(data.posts).data("userid", userid);
                    $("#user-profile .txt-name").html(data.name);
                    $("#user-profile .txt-email").html(data.email);
                    $("#user-profile .txt-createDate").html((new Date(data.createdAt).toLocaleDateString()));
                    $("#user-profile").modal({ show: true, backdrop: 'static' });
                }
            }).catch(function (error) {
                alertshow("Hubo problema con la peticion fetch" + error.message, "danger");
            });
        } else {
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function alertshow(message, type) {
    var alert_icon = `<i class="fas text-${type} fa-exclamation-triangle"></i>`;
    var alert = `<div id="alert-message" style="display:none; position: absolute; bottom:47px; right:0; z-index:2000; width:29em;" class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${alert_icon} ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
    if ($("#content #alert-message").length > 0) {
        $("#alert-message").remove();
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    } else {
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    }
}
function alertconnecteduser(message, type) {
    var alert_icon = `<i class="fas text-${type} fa-user"></i>`;
    var alert = `<div id="alert-message" style="display:none; position: fixed; bottom:0px; right:0; z-index:2000; width:29em;" class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${alert_icon} ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
    if ($("#content #alert-message").length > 0) {
        $("#alert-message").remove();
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    } else {
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    }
}
function session(message) {
    var alert_icon = `<i class="fas fa-spinner fa-spin fa-lg mr-2"></i>`;
    var alert = `<div id="alert-message" style="display:none; position: absolute; bottom:47px; right:0; z-index:2000; width:29em;" class="alert alert-success alert-dismissible fade show" role="alert">
    ${alert_icon} ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
    if ($("#content #alert-message").length > 0) {
        $("#alert-message").remove();
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    } else {
        $("#content").append(alert);
        $("#content #alert-message").show('slow').delay(5000).hide('slow');
    }
}
function verificarlogin() {
    if (localStorage.getItem("blogapi")) {
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        $("body #usernamedisplay").html(userdata.name);
        $("body .showprofile").attr("data-ownerid", userdata.id);
    } else {
        window.location.href = "login.html";
    }
}

function wsConnect(token) {
    // console.log("WS- connect ", token);
    var websocket = new WebSocket(`ws://68.183.27.173:8080/?token=${token}`);
    websocket.onopen = function (evt) {
        // console.log(evt)
    };
    websocket.onclose = function (evt) {

    };
    websocket.onerror = function (evt) {
        console.log(evt)
    };

    websocket.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        switch (data.type) {
            case "likes":
                $('#articulo-like-' + data.postId).text(data.likes);
                break;
            case "view-post":
                // TODO: cambias likes por views
                $('#articulo-view-' + data.postId).text(data.views);
                break;
            case "new-comment":
                // TODO: cambias likes por views
                $("#articulo-comment-" + data.postId).html(data.comments);
                loadcomments(data.postId);
                break;
            case "user-connected":
                alertconnecteduser(data.userEmail+"<br/>Se ha conectado...","success");
                $(".userstatus-" + data.userId).addClass("active").attr("title", "Activo");
                var user = `<div class="alert alert-info my-1 users text-truncate alertuser-${data.userId}"  title="${data.userEmail}" role="alert">
                                <i class="fas fa-user-circle fa-lg"></i> ${data.userEmail}
                            </div>`;
                if($("#container-user .alertuser-"+data.userId).length == 0){
                    $("body #container-user").prepend(user);
                }
                break;

            case "logged":
                $(".userstatus").removeClass("active").attr("title","Desconectado");
                $("body #container-user").html("");
                data.users.forEach(userdata => {
                    $(".userstatus-" + userdata.userId).addClass("active").attr("title", "Activo");
                    var user = `<div class="alert alert-info users my-1 text-truncate alertuser-${userdata.userId}" title="${userdata.userEmail}" role="alert">
                                <i class="fas fa-user-circle fa-lg"></i> ${userdata.userEmail}
                            </div>`;
                    if($("#container-user .alertuser-"+userdata.userId).length == 0){
                        $("body #container-user").append(user);
                    }
                });
                break;
            case "disconnected":
                if($("#container-user .alertuser-"+data.userId).length > 0){
                    $("#container-user .alertuser-" + data.userId).remove();
                }
                $(".userstatus-" + data.userId).removeClass("active").attr("title", "Desconectado");
                break;

        }
    };
}
function getstatus(){    
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        wsConnect(userdata.token);
    }else{
        localStorage.removeItem("blogapi");
        window.location.href = 'login.html';
    }
}