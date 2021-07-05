if(window.location.pathname.match(/post/)){
   
    const allAnswers = document.querySelector('.all-answers');
    const postAnswerForm = document.querySelector('.answersForm');
    const AnswerImages = postAnswerForm.querySelector('input[type="file"]');
    const answer = postAnswerForm.querySelector('textarea');
    const post_id = postAnswerForm.querySelector('input.post_id').value;
    let previewImageContainer = postAnswerForm.querySelector('.previewImageContainer');

    function previewImage(){    
        console.log('inside')
        let files = postAnswerForm.querySelector("input[type='file']").files;
        function readAndPreview(file){

            let reader = new FileReader();

            reader.addEventListener('load',function(){
                let image = new Image()
                image.src = this.result;
                previewImageContainer.appendChild(image);
            })
            reader.readAsDataURL(file);
        }

        previewImageContainer.innerHTML = '';

        [].forEach.call(files,readAndPreview);

      }

        const answers = document.querySelectorAll('.answer-container');
        answers.forEach(answer=>{
            // const expandBtn = answer.querySelector('.expand span');
            try{
                const options = answer.querySelector('.options');
                const optionsBtn = answer.querySelector('.options > div');
                
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
            }catch(err) {
                console.log(err)
            }
            // like in answer
            const upVoteBtn = answer.querySelector('div.upVote');
            const upVoteIcon = upVoteBtn.querySelector('i');
            const answerId = upVoteBtn.getAttribute("data-answerId");
            const csrfToken = upVoteBtn.querySelector('input[name = "csrfmiddlewaretoken" ').value;
            const upVoteCount = upVoteBtn.querySelector('span.count');
            console.log('answerId = ',answerId);
            upVoteBtn.addEventListener('click',() => {
                let data = {
                    'answerId' : answerId
                }
                let endpoint = '/post/upVote';
                fetch(endpoint,{
                    method : "post",
                    body : JSON.stringify(data),
                    headers : {
                        'Content-Type' : 'application/json',
                        'X-CSRFToken' : csrfToken
                    }
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    let newUpVoteCount = data.upVoteCount;
                    upVoteCount.innerHTML = " ";
                    upVoteCount.innerHTML = newUpVoteCount;
                    if(data.upVoted){
                        // if(!upVoteIcon.classList.contains('upVoted')){
                            upVoteIcon.classList.add('upVoted')
                        // }
                    }else{
                        upVoteIcon.classList.remove('upVoted')
                    }
                } )


            })

        })
        





    postAnswerForm.addEventListener('submit',()=>{
        event.preventDefault();
        
        const endpoint = "/addAnswer/";
        const csrf = postAnswerForm.querySelector('input[name = "csrfmiddlewaretoken"').value;
    
        const formData = new FormData();
        let i = 0;
        for(const file of AnswerImages.files){
            formData.append(`image${++i}`,file);
        }
        formData.append('post_id',post_id);
        formData.append('answer',answer.value);
        fetch(endpoint , {
            method : 'post',
            body : formData,
            headers:{
                'X-CSRFToken':csrf
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            const answerContainer = document.createElement('div');
            answerContainer.classList.add('answer-container')
            const images = document.createElement('div');
            images.classList.add('images');
            const imgs = data.images;
            console.log(data.images)
            for(let i=0;i<data.images.length ;i++){
                const img = document.createElement('img');
                img.setAttribute('src',`/media/${imgs[i]}`);
                images.append(img);
            }
            answerContainer.innerHTML = `
                    <div class="header">
                            <div class="profile">
                                <a href="${data.profile_pic}"><img src="${data.profile_pic}" alt="sdf"></a>
                            </div>
                            <div>
                                <span class="author">${data.author}</span>
                                <span class="time-stamp">${data.time}</span>
                            </div>
                        </div>
                        <div class="body">
                            ${data.body}
                        </div>
                    </div>`;
            answerContainer.append(images);
            allAnswers.prepend(answerContainer);
            if(allAnswers.querySelector('.noAnswer')){
                allAnswers.querySelector('.noAnswer').style.display = "none";
            }
            postAnswerForm.querySelector('form').reset();
            previewImageContainer.innerHTML = "";
            location.reload();
        })

     
    })




}