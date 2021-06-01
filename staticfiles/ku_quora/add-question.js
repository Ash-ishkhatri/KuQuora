try{
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

    
}catch(err){
    console.log(err)
}
