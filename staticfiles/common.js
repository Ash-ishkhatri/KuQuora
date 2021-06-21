try{
    homeIcon = document.querySelector('nav li i.fa-home');
    FollowersIcon = document.querySelector('nav li i.fa-list');
    NotificationIcon = document.querySelector('nav li i.fa-bell');    

    if(window.location.pathname == '/'){
        homeIcon.style.color = 'white';
        homeIcon.style.webkitTextStroke = '0px';
        homeIcon.parentNode.style.backgroundColor = 'var(--blue)';
    }
    if(window.location.pathname == '/notification/'){
        NotificationIcon.style.color = 'white';
        NotificationIcon.style.webkitTextStroke = '0px';
        NotificationIcon.parentNode.style.backgroundColor = 'var(--blue)';
    
    }

    const searchBox = document.querySelector('nav div.search-box i');
    searchBox.addEventListener('click',()=>{
        const input = event.target.previousElementSibling;
        input.style.transform = 'scaleX(1)';
    })
    
}
catch(error){
    console.log(error)
}

window.addEventListener('load',()=>{
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post=>{
        const expandBtn = post.querySelector('.expand span');

        if(post.clientHeight > 500){
            expandBtn.style.visibility = "visible";
            post.style.height = '500px';
            post.style.overflow = 'hidden';
        }
        expandBtn.addEventListener('click',()=>{
            console.log(expandBtn.parentNode.dataset.status)
            if(expandBtn.parentNode.dataset.status == 'collapsed'){
                expandBtn.querySelector('.text').innerHTML = 'collapse';
                expandBtn.parentNode.setAttribute('data-status','expanded');
                expandBtn.querySelector('i').style.transform = 'rotate(180deg)';
                post.style.height = post.scrollHeight + "px";
                
            }else{
                expandBtn.querySelector('.text').innerHTML = 'expand';
                expandBtn.querySelector('i').style.transform = 'rotate(0deg)';
                expandBtn.parentNode.setAttribute('data-status','collapsed');

                post.style.height = '510px';

            }
        })
        const optionsBtn = post.querySelector('.options');
        const ul = optionsBtn.querySelector('ul');
        optionsBtn.addEventListener('click',()=>{
            if(ul.dataset.status == 'expanded'){
                ul.dataset.status = 'collapsed';
                ul.style.clipPath = 'circle(0% at 100% 100%)';         
            }else{
                ul.dataset.status = 'expanded';
               ul.style.clipPath = 'circle(150% at 100% 100%)';         
            }
        })

    })
})


likeDislikeAudio = document.querySelector('audio#likeDislike');
likeDislikeAudio.volume=0.6;
notificationAudio = document.querySelector('audio#notification');
notificationAudio.volume=0.6;




likeBtns = document.querySelectorAll('.blog-post .footer .buttons .like')

likeBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
       likeDislikeAudio.play()

        likeDisplayArea = event.target.children[2];
        dislikeDisplayArea = event.target.nextElementSibling.children[1];

        event.target.classList.toggle('liked');
        
        dislikeBtn = event.target.nextElementSibling;
        if(dislikeBtn.classList.contains('disliked')){
            dislikeBtn.classList.remove('disliked');
        }
        xhr = new XMLHttpRequest()
        
        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        

        xhr.open('POST',event.target.getAttribute('data-url'),true)
        xhr.setRequestHeader('X-CSRFToken',csrfToken);
        xhr.setResponseType = 'json';

        xhr.onload = function(){
            console.log(this.response)
            if(this.response){
                data = JSON.parse(this.response)
                console.log(data)
                likeDisplayArea.innerHTML = data.current_likes;
                dislikeDisplayArea.innerHTML = data.current_dislikes;
            }
            
        }

        data = {
            'post_id':event.target.dataset.post_id
        }
        xhr.send(JSON.stringify(data))
    })
})










disLikeBtns = document.querySelectorAll('.blog-post .footer .buttons .dislike')

disLikeBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
        likeDislikeAudio.play()
        dislikeDisplayArea = event.target.children[1];
        likeDisplayArea = event.target.previousElementSibling.children[2];

        event.target.classList.toggle('disliked');
        
        dislikeBtn = event.target.previousElementSibling;
        if(dislikeBtn.classList.contains('liked')){
            dislikeBtn.classList.remove('liked');
        }
        xhr = new XMLHttpRequest()
        
        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        

        xhr.open('POST',event.target.getAttribute('data-url'),true)
        xhr.setRequestHeader('X-CSRFToken',csrfToken);
        xhr.setResponseType = 'json';

        xhr.onload = function(){
            console.log(this.response)
            data = JSON.parse(this.response)
            console.log(data)
            likeDisplayArea.innerHTML = data.current_likes;
            dislikeDisplayArea.innerHTML = data.current_dislikes;
        }

        data = {
            'post_id':event.target.dataset.post_id
        }
        xhr.send(JSON.stringify(data))
    })
})












try{
    followBtn = document.querySelector('.button button')
    followBtn.addEventListener('click',()=>{
        console.log(event.target.value);
        event.target.classList.toggle('followed')
        if(event.target.classList.contains('followed')){
            event.target.innerHTML='Following';
        }else{
            event.target.innerHTML='Follow';
        }
        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST',event.target.dataset.url,true);
        xhr.setRequestHeader('X-CSRFToken',csrfToken)
        xhr.onload = function(){
            data = JSON.parse(this.response)
            following = document.querySelector('.following span.count')
            follower = document.querySelector('.follower span.count')
            following.innerHTML = data.followings
            follower.innerHTML = data.followers
            console.log(this.response)
        }
        
        data = {
            'followingId':event.target.value,
        }

        xhr.send(JSON.stringify(data));

    })
}catch(err){
    console.log(err)
}


notifications = document.querySelectorAll('.notification');

notifications.forEach(notification=>{
    notification.addEventListener('click',()=>{
        destinationUrl = event.target.dataset.url.trim();

        csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST','/notification/notification_seen_status',true);
        xhr.setRequestHeader('X-CSRFToken',csrfToken)
        xhr.onload = function(e){
            data = JSON.parse(this.response)
        }

        data = {
            'id':event.target.dataset.notification_id
        }

        xhr.send(JSON.stringify(data));

        window.location.pathname = destinationUrl;
        console.log(event.target.dataset.notification_id);
        
    })

})



setInterval(()=>{
    csrfToken = document.querySelectorAll('input[name="csrfmiddlewaretoken"]')[0].value;
    
    
    notificationsCount = parseInt(document.querySelector('.notification-count').innerHTML);

    const xhr = new XMLHttpRequest();
    xhr.open('POST','/notification/getLatestNotification',true);
    xhr.setRequestHeader('X-CSRFToken',csrfToken)
    xhr.onload = function(e){
        data = JSON.parse(this.response)
        document.querySelector('.notification-count').innerHTML = data.currentNotificationCount;
        // currentNotification = data.currentNotificationCount;
        if(notificationsCount < data.currentNotificationCount){
            notificationAudio.play();
        } 
    }

   
    // console.log(notificationsCount)
    data = {
        'currentNotificationCount':notificationsCount
    }

    xhr.send(JSON.stringify(data));
},1000);


