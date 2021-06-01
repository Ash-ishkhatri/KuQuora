try{
    homeIcon = document.querySelector('nav li i.fa-home');
    FollowersIcon = document.querySelector('nav li i.fa-list');
    NotificationIcon = document.querySelector('nav li i.fa-bell');    

}
catch(error){
    console.log(error)
}



if(window.location.pathname == '/'){
    homeIcon.style.color = 'white';
    homeIcon.style.webkitTextStroke = '0px';
}
if(window.location.pathname == '/notification/'){
    NotificationIcon.style.color = 'white';
    NotificationIcon.style.webkitTextStroke = '0px';

}

likeDislikeAudio = document.querySelector('audio#likeDislike');
likeDislikeAudio.volume=0.2;



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
        // console.log(destinationUrl)
        window.location.pathname = destinationUrl;
        

    })

})

