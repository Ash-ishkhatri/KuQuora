const allAnswers = document.querySelector('.all-answers');
const postAnswerForm = document.querySelector('.answersForm');
const AnswerImages = postAnswerForm.querySelector('input[type="file"]');
const answer = postAnswerForm.querySelector('textarea');
const post_id = postAnswerForm.querySelector('input.post_id').value;
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
    // for(const [key , value] of formData){
    //     console.log('key',key);
    //     console.log('value',value);
    // }
   

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
    })


})


{/* <div class="answer-container">  
                <div class="header">
                    <div class="profile">
                        <a href="{% url 'profile' answer.user.id %}"><img src="/media/{{answer.user.profile.profile_pic}}" alt="sdf"></a>
                    </div>
                    <div>
                        <span class="author">{{answer.user.username}}</span>
                        <span class="time-stamp">{{answer.time}}</span>
                    </div>
                </div>
                <div class="body">
                    {{answer.body}}
                </div>
                <div class="images">
                    {% for image in answerImages %}
                        {% if image.answer == answer %}
                            <a href="/media/{{image.image}}" target="_blank"><img src="/media/{{image.image}}" alt=""></a>
                        {% endif %}
                    {% endfor %}
            </div>

        </div> */}