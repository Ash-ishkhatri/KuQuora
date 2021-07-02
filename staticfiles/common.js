try{
    homeIcon = document.querySelector('nav li i.fa-home');
    FollowersIcon = document.querySelector('nav li i.fa-list');
    NotificationIcon = document.querySelector('nav li i.fa-bell');    
    savedIcon = document.querySelector('nav li i.fa-save');    

    let indicate = (icon) => {
        console.log(icon)
        icon.style.color = 'white';
        icon.style.webkitTextStroke = '0px';
        icon.parentNode.style.backgroundColor = 'var(--blue)';
    }

    if(window.location.pathname == '/'){
        indicate(homeIcon);
    }
    if(window.location.pathname == '/notification/'){
        indicate(NotificationIcon);
    }
    if(window.location.pathname == '/saved/'){
        indicate(savedIcon);
    }

}
catch(error){
    console.log(error)
}

window.addEventListener('load',()=>{
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post=>{
        const expandBtn = post.querySelector('.expand span');
        const options = post.querySelector('.options');
        const optionsBtn = post.querySelector('.options > div');
        const ul = options.querySelector('ul');
        optionsBtn.addEventListener('click',()=>{
            if(ul.dataset.status == 'expanded'){
                ul.dataset.status = 'collapsed';
                ul.style.visibility = 'hidden';         
            }else{
                ul.dataset.status = 'expanded';
               ul.style.visibility = 'visible';         
            }
        })

       
      

    })
})

function getBlogPost(node){
    if(node.classList.contains('blog-post')){
        return node;
    }
    return getBlogPost(node.parentNode);
}


// deleting post through fetch api
const deletePostBtn = document.querySelectorAll('li.deletePostBtn');
console.log(deletePostBtn)
deletePostBtn.forEach(btn => {
    csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    btn.addEventListener('click',()=>{
        let data = {
            'post_id' : event.target.dataset.postId
        }
        let blogPost = getBlogPost(event.target);
        let options = blogPost.querySelector('.options');
        
        fetch('/delete/',{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
                if(data.deleted == true){
                    options.dataset.status = 'collapsed';
                    options.style.visibility = 'hidden';  
                    let msg = document.querySelector('.overlay-message');
                    msg.innerHTML = "deleted successfully";
                    msg.style.display = 'block'; 
                    setTimeout(()=>{
                        msg.style.display = "none";
                    },3000)
                    if(/post/.test(window.location.pathname)){
                        window.location = '/';
                    }
                    blogPost.classList.add('deleted');
                }
        })

    })
})
console.log(window.location)

// saving post through fetch api
const saveBtn = document.querySelectorAll('li.savePostBtn');
console.log(saveBtn)
saveBtn.forEach(btn => {
    
    csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    btn.addEventListener('click',()=>{
        console.log(event.target)
        let data = {
            'post_id' : event.target.dataset.postId
        }
        let blogPost = getBlogPost(event.target);
        let options = blogPost.querySelector('.options ul');
        let location = window.location.pathname; 
        let post = getBlogPost(event.target); 
        fetch('/saved/save_post/',{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
                if(data.status === 'saved'){
                    let msg = document.querySelector('.overlay-message');
                    let btnText = btn.querySelector('span');
                    btnText.innerText = 'unsave'; 
                    msg.innerHTML = "post saved successfully";
                    msg.style.display = 'block'; 
                    setTimeout(()=>{
                        msg.style.display = "none";
                    },3000)
                }
                if(data.status === 'unsaved'){
                    if(location == '/saved/'){
                        console.log('deltet')
                        post.style.display = "none";
                    } 
                    let msg = document.querySelector('.overlay-message');
                    let btnText = btn.querySelector('span');
                    btnText.innerText = 'save';
                    msg.innerHTML = "post unsaved successfully";
                    msg.style.display = 'block'; 
                    setTimeout(()=>{
                        msg.style.display = "none";
                    },3000)
                }
                options.dataset.status = 'collapsed';
                options.style.visibility = 'hidden'; 
        })

    })
})



notificationAudio = document.querySelector('audio#notification');
notificationAudio.volume=0.6;


try{
    followBtn = document.querySelector('.button button')
    followBtn.addEventListener('click',()=>{
        event.target.classList.toggle('followed')
        if(event.target.classList.contains('followed')){
            event.target.innerHTML='Following';
        }else{
            event.target.innerHTML='Follow';
        }
        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    
        data = {
            'followingId':event.target.value,
        }

        fetch(event.target.dataset.url,{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }
        })
        .then(res =>  res.json())
        .then(data => {
            following = document.querySelector('.following span.count')
            follower = document.querySelector('.follower span.count')
            following.innerHTML = data.followings
            follower.innerHTML = data.followers
        })

    })
}catch(err){
    console.log(err)
}



notifications = document.querySelectorAll('.notification');

notifications.forEach(notification=>{
    notification.addEventListener('click',()=>{
        destinationUrl = event.target.dataset.url.trim();
        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        data = {
            'id':event.target.dataset.notification_id
        }
        fetch('/notification/notification_seen_status',{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }
        })
        .then(res =>  res())
        .then(data => {
            window.location.pathname = destinationUrl;
        })
    })

})

// let pageCount = 1;
//    // infinite scroll posts
//    if(window.location.pathname == ('/')){
//     document.querySelector('button.getPosts').onclick =  () => {
//         pageCount++;
//         fetch(`/get_post?page=${pageCount}`,{
//             method : 'get',
//             headers : {
//                 'Content-Type':'application/json'
//             }
//         })
//         .then(res => res.json())
//         .then(data => {
//             posts = JSON.parse(data.posts);
//             console.log(posts)
//         })
//     }

//     }




setInterval(()=>{
    csrfToken = document.querySelectorAll('input[name="csrfmiddlewaretoken"]')[0].value;
    notificationsCount = parseInt(document.querySelector('.notification-count').innerHTML);
    data = {
        'currentNotificationCount':notificationsCount
    }
    fetch('/notification/getLatestNotification',{
        method : 'post',
        body : JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json',
            'X-CSRFToken' : csrfToken
        }
    })
    .then(res =>  res.json())
    .then(data => {
        document.querySelector('.notification-count').innerHTML = data.currentNotificationCount;
        if(notificationsCount < data.currentNotificationCount){
                notificationAudio.play();
        } 
    })
},1000);


