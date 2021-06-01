try{
    // cancelOverlay = document.querySelector('.add-question .overlay button')
    // askQuestionTriggerer = document.querySelector('.add-question .visible-part')
    // askQuestionTriggerer.addEventListener('click',()=>{
    //     overlay = document.querySelector('.add-question .overlay')
    //     overlay.classList.toggle('block')
    // })
    // cancelOverlay.addEventListener('click',()=>{
    //     event.preventDefault()
    //     overlay = document.querySelector('.add-question .overlay')
    //     overlay.classList.toggle('block')
    // })

    addQuestion = document.querySelector('.add-question');
    addQuestionForm = document.querySelector('.add-question-form');
    form = document.querySelector('.add-question-form form');
    
    addQuestion.addEventListener('click',()=>{
        if(addQuestionForm.dataset.status == 'collapsed'){
            addQuestionForm.dataset.status = 'expanded';
            addQuestionForm.style.height = addQuestionForm.scrollHeight + 'px';
            addQuestionForm.style.transform = 'scaleY(1)';

                form.style.opacity = '1';

            }
            else{
                addQuestionForm.dataset.status = 'collapsed';
                addQuestionForm.style.height = '0px';
                addQuestionForm.style.transform = 'scaleY(0)';

                    form.style.opacity = '0';

            }
        })

    console.log(addQuestionForm.scrollHeight)
    
}catch(err){
    console.log(err)
}
