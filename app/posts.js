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
            loadcomments(postid,$(this).parent().siblings(".post-comment").find(".comment-content"));
            $(this).parent().siblings(".post-dimiss").removeClass("text-line-3").slideDown("slow");
            $(this).parent().siblings(".post-comment").slideDown("slow");
            $(this).hide("fast").siblings(".readless").show("fast");
            $(this).parent().siblings(".card-title").find(".post-title-a").addClass("open");
        }else{
            alertshow("Posts desconocido...","danger");
        }
    })
    /* cuando se le das click a leer menos */
    $("body").on("click",".readless",function(e){
        e.preventDefault();
        $(this).parent().siblings(".post-dimiss").addClass("text-line-3");
        $(this).parent().siblings(".post-comment").slideUp("slow");
        $(this).hide("fast").siblings(".readmore").show("fast");
        $(this).parent().siblings(".card-title").find(".post-title-a").removeClass("open");
    })
    /* Cuando se le da click al titulo del post */
    $("body").on("click",".post-title-a",function(e){
        e.preventDefault();
        if($(this).hasClass("open")){
            $(".readless").click();
        }else{
            $(".readmore").click();
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
                                loadcomments(postid,commentcontent)       
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
                alertshow("Campo obligatorio...","danger");
            }
        }else{
            alertshow("Problema al realizar acción...","danger");
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
})
function loadcomments(postId,commentcontent){
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
                    for(let i=0; i < data.length; i++){
                        comments += `<div class="card comments mb-1 comment-item" style="width: 98%;">
                            <div class="card-body posts py-2">
                                <div class="card-title blockquote-footer text-truncate">
                                    <i class="fa fa-user"></i> 
                                    <b>By:</b>
                                    <a class="showprofile" href="javascript:void(0);" data-ownerid="${data[i].userId}" href="javacript:void(0)"> 
                                        <b class="post-owner">Yansell Rivas (yrd@gmail.com)</b>
                                    </a>
                                    <em class="commentdate">${new Date(data[i].createdAt).toLocaleString()}</em>
                                </div>
                                ${data[i].body} 
                            </div>
                            </div>`;
                        }
                        commentcontent.html(comments);
                }else{
                    commentcontent.html(`<p class="h6 w-100 text-center py-4 px-2"> No hay comentarios...</p>`);
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
function updatepost(postId,postcontent){
    if(localStorage.getItem("blogapi")){
        var userdata = JSON.parse(localStorage.getItem("blogapi"));
        var url = 'http://68.183.27.173:8080/post/'+postId;
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
                postcontent.siblings().find(".count-like").html(data.likes);
                postcontent.parent().find(".count-views").html(data.views);
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}
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
                    updatepost(postId,postcontent);
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
                    updatepost(postId,postcontent);
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
                    posts += `<div class="card mb-2" style="width: 100%; display:none;">
                        <div class="card-body posts py-4">
                                <h5 class="card-title text-truncate"><a class="post-title-a" href="javascript:void(0)"><b class="post-title">${data[i].title}</b> <i class="fas fa-share-square ml-2"></i></a></h5>
                                <div class="like py-0">
                                    <a class="btn btn-link text-info py-0 my-0 btn-likepost" href="javascript:void(0);" data-postid="${data[i].id}">${(data[i].liked)?'<i class="fas fa-star fa-lg"></i>':'<i class="far fa-star fa-lg"></i>'}</a> 
                                    <p><span class="badge badge-pill badge-info count-like">${data[i].likes}</span> Like</p>
                                </div> 
                                <hr class="mb-0 mt-1">
                                <div class="text-line-3 post-dimiss mb-2">
                                    <p class="card-text text-justify post-body">
                                        ${data[i].body}
                                    </p>
                                </div>
                                <div class="post-comment py-2">
                                    <hr class="my-1">
                                    <div class="comment-form  text-right">
                                        <div class="form-group mb-1">
                                            <textarea class="form-control text-comment" placeholder="Comentar aqui..." rows="3"></textarea>
                                        </div>
                                        <button class="btn btn-success btn-sm btn-send" data-postid="${data[i].id}"><i class="fa fa-paper-plane fa-lg"></i> Comentar</button>
                                        <p class="w-100 text-left m-0"><b>comentarios</b></p>
                                        <div class="comment-content">
                                            <!-- Aqui van los comentarios cargados  -->
                                        </div>
                                    </div>
                                </div>
                                <hr class="my-1">
                                <blockquote class="blockquote-title my-0 text-truncate">                                        
                                    <a class="btn btn-link text-info float-right readmore" href="javascript:void(0);" data-postid="${data[i].id}"><i class="far fa-eye"></i> Leer más...</a>
                                    <a class="btn btn-link text-info float-right readless" style="display:none;" href="javascript:void(0);" data-postid="${data[i].id}"><i class="far fa-eye-slash"></i> Leer menos...</a>  
                                    <a class="btn btn-link text-info float-right views" href="javascript:void(0);" data-postid="${data[i].id}"><span class="badge badge-pill badge-dark count-views">${data[i].views}</span> Vistas</a> 
                                    <blockquote class="blockquote-footer">
                                        <a class="text-success mb-2 showprofile" href="javascript:void(0);" data-ownerid="${data[i].userId}">
                                            <i class="fa fa-user"></i> 
                                            <b>By:</b> 
                                            <b class="post-owner">${data[i].userName} (${data[i].userEmail})</b>
                                        </a> 
                                        <em class="postdate">${new Date(data[i].createdAt).toLocaleString()}</em>
                                    </blockquote>
                                </blockquote>  
                            </div>
                        </div>`; 
                    }
                    $("#posts-container").append($(posts).slideDown("fast"));
            }).catch(function(error){
                alertshow("Hubo problema con la peticion fetch"+error.message,"danger");
            });
        }else{
            localStorage.removeItem("blogapi");
            window.location.href = 'login.html';
        }
    }
}