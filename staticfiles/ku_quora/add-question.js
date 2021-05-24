try{
    cancelOverlay = document.querySelector('.add-question .overlay button')
    askQuestionTriggerer = document.querySelector('.add-question .visible-part')
    askQuestionTriggerer.addEventListener('click',()=>{
        overlay = document.querySelector('.add-question .overlay')
        overlay.classList.toggle('block')
    })
    cancelOverlay.addEventListener('click',()=>{
        event.preventDefault()
        overlay = document.querySelector('.add-question .overlay')
        overlay.classList.toggle('block')
    })
    
}catch(err){
    console.log(err)
}
