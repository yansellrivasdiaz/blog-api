var posts = ``;
var comments = ``;
$(document).ready(function(){
    
    // aqui se cargan los post una vez la pagina cargue
    getposts();
    // Aqui es donde se lee el like de los post
    $("body").on("click",".btn-likepost",function(){
        var postId = $.trim($(this).data("postid"));
        if(postId > 0){
            if($(this).find("i").hasClass("far")){
                like(postId,$(this));
            }else if($(this).find("i").hasClass("fas")){
                dislike(postId,$(this));
            }
        }else{
            alertshow("Problema al dar like...","warning");
        }
    })
    /* cuando se le das click a leer mas o al titulo de los posts */
    $("body").on("click",".readmore",function(e){
        e.preventDefault();
        var postid = $(this).data("postid");
        if(postid > 0){
            loadcomments(postid);
            $(this).siblings(".post-dimiss").removeClass("text-line-3").slideDown("slow");
            $(this).siblings(".post-comment").slideDown("slow");
            $(this).hide("fast").siblings(".readless").show("fast");
            $(this).siblings(".card-title").find(".post-title-a").addClass("open");
        }else{
            alertshow("Posts desconocido...","danger");
        }
    })
    /* cuando se le das click a leer menos */
    $("body").on("click",".readless",function(e){
        e.preventDefault();
        $(this).siblings(".post-dimiss").addClass("text-line-3");
        $(this).siblings(".post-comment").slideUp("slow");
        $(this).hide("fast").siblings(".readmore").show("fast");
        $(this).siblings(".card-title").find(".post-title-a").removeClass("open");
    })
    /* Cuando se le da click al titulo del post */
    $("body").on("click",".post-title-a",function(e){
        e.preventDefault();
        if($(this).hasClass("open")){
            $(this).parent().siblings(".readless").click();
        }else{
            $(this).parent().siblings(".readmore").click();
        }
    })
    /* Se ejecuta cuando se guarda un comentario */
    $("body").on("click",".btn-send",function(e){
        e.preventDefault();
        var postid = $(this).data("postid");
        var commentcontent = $(this).siblings(".comment-content");
        if(postid > 0){
            var textarea = $(this).siblings(".form-group").find(".text-comment");
            var comment = $.trim(textarea.val());
            if(comment != ''){                
                textarea.removeClass("is_invalid");   
                var data = {'body':comment};
                if(localStorage.getItem("blogapi")){
                    var userdata = JSON.parse(localStorage.getItem("blogapi"));
                    var url = 'http://68.183.27.173:8080/post/'+postid+'/comment';
                    if(userdata.id > 0 && userdata.token.length == 36){
                        var cabecera = new Headers();
                        cabecera.append("Authorization",'Bearer '+ userdata.token);                    
                        cabecera.append('Content-Type', 'application/json');
                        var init = {
                            method:'POST',
                            headers:cabecera,
                            body:JSON.stringify(data)
                        };
                        var myrequest = new Request(url,init);
                        fetch(myrequest).then(function(response){
                            if(response.ok){
                                return response.json();
                            }
                            throw new Error('La respuesta no es ok...');
                        }).then(function(data){
                            if(data.id > 0){
                                textarea.val("");
                                loadcomments(postid)       
                                alertshow("Comentario publicado...","success");
                            }else{                                
                                alertshow("Problemas al publicar comentario...","warning");
                            }
                        }).catch(function(error){
                            alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
                        });
                    }else{
                        localStorage.removeItem("blogapi");
                        window.location.href = 'login.html';
                    }
                }
            }else{    
                textarea.addClass("is_invalid").focus();            
                alertshow("Campo obligatorio...","danger");
            }
        }else{
            alertshow("Problema al realizar acción...","danger");
        }
    })
    /* Cuando se le da click a los comentarios */
    $("body").on("click",".comments",function(e){
        e.preventDefault();
        if($(this).siblings(".card-title").find(".post-title-a").hasClass("open")){
            $(this).siblings(".readless").click();
        }else{
            $(this).siblings(".readmore").click();
        }
    })
    /* Cuando se le da click abrir menu en mobiles */
    $("body").on("click",".btn-openmenu",function(e){
        e.preventDefault();
        if($(this).find("i").hasClass("fa-chevron-right")){
            $(this).find("i").removeClass("fa-chevron-right").addClass("fa-times");
            $("body #posts-menu").addClass("open");
        }else{            
            $(this).find("i").removeClass("fa-times").addClass("fa-chevron-right");
            $("body #posts-menu").removeClass("open");
        }
    })
    /* Aqui se ejecuta la busqueda de post */
    $("body").on("click",".btn-search",function(e){
        e.preventDefault();
        var search = $.trim($(".txt-search").val());
        filtrarpost(search);
    })
    /* Aqui se ejecuta la busqueda de mis post */
    $("body").on("click",".my_post",function(e){
        e.preventDefault();
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        getpostbyuser(userdata.id);
    })
    /* Aqui se ejecuta crear un nuevo post */
    $("body").on("click",".new_post",function(e){
        e.preventDefault();
        $("body #post-form").modal({show:true,backdrop:'static'});
    })
    /* Aqui se ejecuta cuando se le da a guardar al formulario */
    $("body").on("submit","#new-post-form",function(e){
        e.preventDefault();
        savepost();
    })
    /* Aqui es cuando se le da click a la cantidad de post */
    $("body").on("click",".txt-post",function(e){
        e.preventDefault();
        var userid = $(this).data("userid");
        getpostbyuser(userid);
    })
    /* Trae todos los post cuando se le da click a todos */
    $("body").on("click",".nav-all",function(e){
        e.preventDefault();
        getposts();
    })
})
function filtrarpost(search){
    $("body .txt-search").val(search);
    $.each($("#posts-container .cardpost"),function(index,value){
        if(String($(this).data("keys")).toLowerCase().search(search.toLowerCase()) >= 0 || String($(this).data("title")).toLowerCase().search(search.toLowerCase()) >= 0 || String($(this).data("body")).toLowerCase().search(search.toLowerCase()) >= 0){
            $(this).show();
        }else{
            $(this).hide();
        }
    })
}
function getpostbyuser(userid){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post?userId='+userid;
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){
                $("#posts-container").html("");
                posts = ``;
                if(data.length == 0)$("#posts-container").html(`<div class="h3 w-100 text-center text-primary">No tiene post publicado</div>`);
                for(var i=0; i<data.length; i++){
                    let{id,body,comments,views, likes,createdAt,userId,userName,userEmail,tags,title,liked}=data[i];
                    posts = `<div class="card cardpost mb-2" style="width: 100%; display:none;" data-keys='${JSON.stringify(tags)}'>
                    <div class="card-body posts py-4">
                            <h5 class="card-title text-truncate"><a class="post-title-a" href="javascript:void(0)"><b class="post-title">${title}</b> <i class="fas fa-external-link-alt ml-2"></i></a><small class="text-tags text-truncate float-right"><em>${getTags(tags)}</em></small></h5>
                            <div class="like py-0">
                                <a class="btn btn-link text-info py-0 my-0 btn-likepost" href="javascript:void(0);" data-postid="${id}">${(liked)?'<i class="fas fa-star fa-lg"></i>':'<i class="far fa-star fa-lg"></i>'}</a> 
                                <p><span class="badge badge-pill badge-info count-like" id="articulo-like-${id}">${likes}</span> Like</p>
                            </div> 
                            <hr class="mb-0 mt-1">
                            <div class="text-line-3 post-dimiss mb-2">
                                <p class="card-text text-justify post-body">
                                    ${body}
                                </p>
                            </div>
                            <div class="post-comment py-2">
                                <hr class="my-1">
                                <div class="comment-form  text-right">
                                    <div class="form-group mb-1">
                                        <textarea class="form-control text-comment" placeholder="Comentar aqui..." rows="3"></textarea>
                                    </div>
                                    <button class="btn btn-success btn-sm btn-send" data-postid="${id}"><i class="fa fa-paper-plane fa-lg"></i> Comentar</button>
                                    <p class="w-100 text-left m-0"><b>comentarios</b></p>
                                    <div class="comment-content" id="articulo-comments-content-${id}">
                                        <!-- Aqui van los comentarios cargados  -->
                                    </div>
                                </div>
                            </div>
                            <hr class="my-1">
                            <blockquote class="blockquote-title my-0 py-0 text-truncate">                                        
                                <blockquote class="blockquote-footer my-0 text-truncate" style="position:relative;">
                                    <a class="text-success my-0 showprofile" href="javascript:void(0);" data-ownerid="${userId}">
                                    <i class="fa fa-user"></i> 
                                    <b>By:</b> 
                                    <b class="post-owner">${userName} (${userEmail}) <span class="status userstatus userstatus-${userId}"></span></b>
                                    </a> 
                                    <em class="postdate">${moment(createdAt).locale((navigator.language || navigator.userLanguage)).calendar()}</em>
                                </blockquote>
                            </blockquote>  
                            <a class="btn btn-link text-info float-left views" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-views" id="articulo-view-${id}">${views}</span> Vistas</a> 
                            <a class="btn btn-link text-info float-left comments" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-comments" id="articulo-comment-${id}">${comments}</span> Comentarios</a> 
                            <a class="btn btn-link text-info float-left readmore" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye"></i> Leer más...</a>
                            <a class="btn btn-link text-info float-left readless" style="display:none;" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye-slash"></i> Leer menos...</a>  
                        </div>
                    </div>`; 
                        $("#posts-container").prepend($(posts).slideDown("fast"));
                    }
                    getstatus();
                    $(".modal").modal("hide");
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function savepost(){
    var title = $.trim($("#title").val());
    var tags = $.trim($("#tags").val());
    var text = $.trim($("#text").val());
    if(title != '' && text != ''){
        var postdata = {
            title:title,
            body:text,
            tags:tags.split(',').map(Function.prototype.call, String.prototype.trim)
        };
        if(localStorage.getItem("blogapi")){
            var userdata = JSON.parse(localStorage.getItem("blogapi"));
            var url = 'http://68.183.27.173:8080/post';
            if(userdata.id > 0 && userdata.token.length == 36){
                var cabecera = new Headers();
                cabecera.append("Authorization",'Bearer '+ userdata.token);                    
                cabecera.append('Content-Type', 'application/json');
                var init = {
                    method:'POST',
                    headers:cabecera,
                    body:JSON.stringify(postdata)
                };
                var myrequest = new Request(url,init);
                fetch(myrequest).then(function(response){
                    if(response.ok){
                        return response.json();
                    }
                    throw new Error('La respuesta no es ok...');
                }).then(function(data){
                    if(data.id > 0){
                        putNewPost(data.id);     
                        alertshow("Post publicado...","success");
                        $("#new-post-form")[0].reset();
                    }else{                                
                        alertshow("Problemas al publicar comentario...","warning");
                    }
                }).catch(function(error){
                    alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
                });
            }else{
                localStorage.removeItem("blogapi");
                window.location.href = 'login.html';
            }
        }
    }else{
        alertshow("Campos requeridos no completado");
    }
}
function loadcomments(postId){
    if(localStorage.getItem("blogapi")){    
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post/'+postId+'/comment';
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){         
                if(data.length > 0){
                    comments = ``;
                    $("#articulo-comments-content-"+postId).html("");
                    data.forEach(comment => {                    
                        comments = `<div class="card comments mb-1 comment-item" style="width: 98%;">
                        <div class="card-body posts py-2">
                            <div class="card-title blockquote-footer text-truncate">
                                <i class="fa fa-user"></i> 
                                <b>By:</b>
                                <a class="showprofile" href="javascript:void(0);" data-ownerid="${comment.userId}" href="javacript:void(0)"> 
                                    <b class="post-owner">${comment.userName} (${comment.userEmail})</b>
                                </a>
                                <em class="commentdate">${dateFormatmonthShortNames(new Date(comment.createdAt))}</em>
                            </div>
                            ${comment.body} 
                        </div>
                        </div>`;
                        $("#articulo-comments-content-"+postId).prepend(comments);
                        
                    });   
                }else{
                    $("#articulo-comments-content-"+postId).html(`<p class="h6 w-100 text-center py-4 px-2"> No hay comentarios...</p>`);
                }                
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
// function updatepost(postId,postcontent){
//     if(localStorage.getItem("blogapi")){
//         var userdata = JSON.parse(localStorage.getItem("blogapi"));
//         var url = 'http://68.183.27.173:8080/post/'+postId;
//         if(userdata.id > 0 && userdata.token.length == 36){
//             var cabecera = new Headers();
//             cabecera.append("Authorization",'Bearer '+ userdata.token);                    
//             cabecera.append('Content-Type', 'application/json');
//             var init = {
//                 method:'GET',
//                 headers:cabecera
//             };
//             var myrequest = new Request(url,init);
//             fetch(myrequest).then(function(response){
//                 if(response.ok){
//                     return response.json();
//                 }
//                 throw new Error('La respuesta no es ok...');
//             }).then(function(data){       

//                 postcontent.parent().siblings().find(".count-views").html(data.views);
//             }).catch(function(error){
//                 alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
//             });
//         }else{
//             localStorage.removeItem("blogapi");
//             window.location.href = 'login.html';
//         }
//     }
// }
function like(postId,postcontent){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post/'+postId+"/like";
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'PUT',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.status == 200){
                    return response.status;
                }else{
                    throw new Error('La respuesta no es ok...');
                }
            }).then(function(data){
                if(data == 200){
                    postcontent.find("i").removeClass("far").addClass("fas");
                }else{
                    alertshow("Error "+data+" al generar like..","warning");
                }
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function dislike(postId,postcontent){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post/'+postId+"/like";
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'DELETE',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.status == 200){
                    return response.status;
                }else{
                    throw new Error('La respuesta no es ok...');
                }
            }).then(function(data){
                if(data == 200){
                    postcontent.find("i").removeClass("fas").addClass("far");
                }else{
                    alertshow("Error "+data+" al generar like..","warning");
                }
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function putNewPost(postid){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post/'+postid;
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){
                if(typeof data.error === 'undefined'){
                    posts = ``;
                    let{id,body,comments,views, likes,createdAt,userId,userName,userEmail,tags,title,liked} = data;
                    posts = `<div class="card cardpost mb-2" style="width: 100%; display:none;" data-keys='${JSON.stringify(tags)}'>
                    <div class="card-body posts py-4">
                            <h5 class="card-title text-truncate"><a class="post-title-a" href="javascript:void(0)"><b class="post-title">${title}</b> <i class="fas fa-external-link-alt ml-2"></i></a><small class="text-tags text-truncate float-right"><em>${getTags(tags)}</em></small></h5>
                            <div class="like py-0">
                                <a class="btn btn-link text-info py-0 my-0 btn-likepost" href="javascript:void(0);" data-postid="${id}">${(liked)?'<i class="fas fa-star fa-lg"></i>':'<i class="far fa-star fa-lg"></i>'}</a> 
                                <p><span class="badge badge-pill badge-info count-like" id="articulo-like-${id}">${likes}</span> Like</p>
                            </div> 
                            <hr class="mb-0 mt-1">
                            <div class="text-line-3 post-dimiss mb-2">
                                <p class="card-text text-justify post-body">
                                    ${body}
                                </p>
                            </div>
                            <div class="post-comment py-2">
                                <hr class="my-1">
                                <div class="comment-form  text-right">
                                    <div class="form-group mb-1">
                                        <textarea class="form-control text-comment" placeholder="Comentar aqui..." rows="3"></textarea>
                                    </div>
                                    <button class="btn btn-success btn-sm btn-send" data-postid="${id}"><i class="fa fa-paper-plane fa-lg"></i> Comentar</button>
                                    <p class="w-100 text-left m-0"><b>comentarios</b></p>
                                    <div class="comment-content" id="articulo-comments-content-${id}">
                                        <!-- Aqui van los comentarios cargados  -->
                                    </div>
                                </div>
                            </div>
                            <hr class="my-1">
                            <blockquote class="blockquote-title my-0 py-0 text-truncate">                                        
                                <blockquote class="blockquote-footer my-0 text-truncate" style="position:relative;">
                                    <a class="text-success my-0 showprofile" href="javascript:void(0);" data-ownerid="${userId}">
                                    <i class="fa fa-user"></i> 
                                    <b>By:</b> 
                                    <b class="post-owner">${userName} (${userEmail}) <span class="status userstatus userstatus-${userId}"></span></b>
                                    </a> 
                                    <em class="postdate">${moment(createdAt).locale((navigator.language || navigator.userLanguage)).calendar()}</em>
                                </blockquote>
                            </blockquote>  
                            <a class="btn btn-link text-info float-left views" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-views" id="articulo-view-${id}">${views}</span> Vistas</a> 
                            <a class="btn btn-link text-info float-left comments" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-comments" id="articulo-comment-${id}">${comments}</span> Comentarios</a> 
                            <a class="btn btn-link text-info float-left readmore" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye"></i> Leer más...</a>
                            <a class="btn btn-link text-info float-left readless" style="display:none;" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye-slash"></i> Leer menos...</a>  
                        </div>
                    </div>`; 
                    $("#posts-container").prepend($(posts).slideDown("fast"));
                }else{
                    alertshow("No encontrado...","warning");
                }
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function getposts(){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post';
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){
                $("#posts-container").html("");
                posts = ``;
                for(var i=0; i<data.length; i++){
                    let{id,body,comments,views, likes,createdAt,userId,userName,userEmail,tags,title,liked}=data[i];
                    posts = `<div class="card cardpost mb-2" style="width: 100%; display:none;" data-keys='${JSON.stringify(tags)}'>
                    <div class="card-body posts py-4">
                            <h5 class="card-title text-truncate"><a class="post-title-a" href="javascript:void(0)"><b class="post-title">${title}</b> <i class="fas fa-external-link-alt ml-2"></i></a><small class="text-tags text-truncate float-right"><em>${getTags(tags)}</em></small></h5>
                            <div class="like py-0">
                                <a class="btn btn-link text-info py-0 my-0 btn-likepost" href="javascript:void(0);" data-postid="${id}">${(liked)?'<i class="fas fa-star fa-lg"></i>':'<i class="far fa-star fa-lg"></i>'}</a> 
                                <p><span class="badge badge-pill badge-info count-like" id="articulo-like-${id}">${likes}</span> Like</p>
                            </div> 
                            <hr class="mb-0 mt-1">
                            <div class="text-line-3 post-dimiss mb-2">
                                <p class="card-text text-justify post-body">
                                    ${body}
                                </p>
                            </div>
                            <div class="post-comment py-2">
                                <hr class="my-1">
                                <div class="comment-form  text-right">
                                    <div class="form-group mb-1">
                                        <textarea class="form-control text-comment" placeholder="Comentar aqui..." rows="3"></textarea>
                                    </div>
                                    <button class="btn btn-success btn-sm btn-send" data-postid="${id}"><i class="fa fa-paper-plane fa-lg"></i> Comentar</button>
                                    <p class="w-100 text-left m-0"><b>comentarios</b></p>
                                    <div class="comment-content" id="articulo-comments-content-${id}">
                                        <!-- Aqui van los comentarios cargados  -->
                                    </div>
                                </div>
                            </div>
                            <hr class="my-1">
                            <blockquote class="blockquote-title my-0 py-0 text-truncate">                                        
                                <blockquote class="blockquote-footer my-0 text-truncate" style="position:relative;">
                                    <a class="text-success my-0 showprofile" href="javascript:void(0);" data-ownerid="${userId}">
                                    <i class="fa fa-user"></i> 
                                    <b>By:</b> 
                                    <b class="post-owner">${userName} (${userEmail}) <span class="status userstatus userstatus-${userId}"></span></b>
                                    </a> 
                                    <em class="postdate">${moment(createdAt).locale((navigator.language || navigator.userLanguage)).calendar()}</em>
                                </blockquote>
                            </blockquote>  
                            <a class="btn btn-link text-info float-left views" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-views" id="articulo-view-${id}">${views}</span> Vistas</a> 
                            <a class="btn btn-link text-info float-left comments" href="javascript:void(0);" data-postid="${id}"><span class="badge badge-pill badge-dark count-comments" id="articulo-comment-${id}">${comments}</span> Comentarios</a> 
                            <a class="btn btn-link text-info float-left readmore" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye"></i> Leer más...</a>
                            <a class="btn btn-link text-info float-left readless" style="display:none;" href="javascript:void(0);" data-postid="${id}"><i class="far fa-eye-slash"></i> Leer menos...</a>  
                        </div>
                    </div>`; 
                        $("#posts-container").prepend($(posts).slideDown("fast"));
                        
                    }
                    getstatus();
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });

           
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function getuserdata(userid,callback){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/users/'+userid;
        if(userdata.id > 0 && userdata.token.length == 36){
            var cabecera = new Headers();
            cabecera.append("Authorization",'Bearer '+ userdata.token);                    
            cabecera.append('Content-Type', 'application/json');
            var init = {
                method:'GET',
                headers:cabecera
            };
            var myrequest = new Request(url,init);
            fetch(myrequest).then(function(response){
                if(response.ok){
                    return response.json();
                }
                throw new Error('La respuesta no es ok...');
            }).then(function(data){
                if(typeof data.error === 'undefined'){
                    callback(data);
                }else{
                    alertshow("No encontrado...","warning");
                }
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
function getTags(data){
    var html = ``;
    $(data).each(function(index,value){
        html+=`<a href="javascript:void(0)" class="btn btn-link mx-0 px-0" onclick="filtrarpost('${String($.trim(value))}')">${$.trim(value)}</a>, `;
    })
    html = html.slice(0,-2);
    return html;
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