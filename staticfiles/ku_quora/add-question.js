
try{
    addQuestion = document.querySelector('.add-question');
    triggerArrow = document.querySelector('.addQuestion-container i.fa-angle-double-down');

    addQuestionForm = document.querySelector('.add-question-form');
    form = document.querySelector('.add-question-form form');
    
    triggerArrow.addEventListener('click',formApperance)
    addQuestion.addEventListener('click',formApperance)


    function formApperance(){
        if(addQuestionForm.dataset.status == 'collapsed'){
            addQuestionForm.dataset.status = 'expanded';
            addQuestionForm.style.height = addQuestionForm.scrollHeight + 'px';
            // addQuestionForm.style.transform = 'scaleY(1)';
            triggerArrow.classList.remove('animate-direction-down');
            triggerArrow.classList.add('animate-direction-up');
            console.log('clicked')
                // form.style.opacity = '1';
            
            }
            else{
                addQuestionForm.dataset.status = 'collapsed';
                addQuestionForm.style.height = '0px';
                // triggerArrow.style.transform = 'rotate(0deg)';
                triggerArrow.classList.remove('animate-direction-up');
                triggerArrow.classList.add('animate-direction-down');

            }
    }


    
}catch(err){
    console.log(err)
}
