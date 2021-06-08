if(window.location.pathname == '/account/register/'){
    firstName = document.querySelector(' input[name="first_name"]');
    lastName = document.querySelector(' input[name="last_name"]');

    usernameField = document.querySelector(' input[name="username"]');
    usernameField = document.querySelector(' input[name="username"]');
    emailField = document.querySelector(' input[name="email"]');
    signupBtn = document.querySelector(' input[type="submit"]');
    password1 = document.querySelector(' input[name="password1"]');
    password2 = document.querySelector(' input[name="password2"]');
    let validForm = 0;
    let nameFormat = /^[a-z ,.'-]+$/i;
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

    signupBtn.classList.add('inactive');

    // function validateName(e){
    //     if(!nameFormat.test(e.value)){
    //         e.target.style.border = "2px solid red";
    //     }else{
    //         e.target.style.border = "2px solid green";
    //     }
    // }


    // firstName.addEventListener('keyup',validateName);
    // lastName.addEventListener('keyup',validateName);


    usernameField.addEventListener('keyup',()=>{
        field = event.target;
        if(field.value.length < 3){
            field.style.border = '2px solid red';
            field.parentNode.children[2].style.opacity = "1";
        }
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        const xhr = new XMLHttpRequest();
        xhr.open('POST',event.target.getAttribute('data-url'),true);
        xhr.setRequestHeader('X-CSRFToken',csrfToken);
        xhr.setResponseType = 'json';
        
        xhr.onload = function(){
            response = JSON.parse(this.response);
            if(response.taken == true){
                field.style.border = '2px solid red';
                field.parentNode.children[2].style.opacity = "1";
                validForm = 0;
            }else if(response.taken == false && field.value.length > 3){
                field.style.border = '2px solid rgb(82, 202, 13)';
                field.parentNode.children[2].style.opacity = "0";
                validForm = 1;
            }
        }

        data = {
            'username' : event.target.value
        }

        xhr.send(JSON.stringify(data));
        
        


    })

    emailField.addEventListener('keyup',()=>{
        field = event.target;
        
        const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!field.value.match(mailFormat)){
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
        }
        
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        const xhr = new XMLHttpRequest();
        xhr.open('POST',event.target.getAttribute('data-url'),true);
        xhr.setRequestHeader('X-CSRFToken',csrfToken);
        xhr.setResponseType = 'json';
        
        xhr.onload = function(){
            response = JSON.parse(this.response);
            if(response.taken == true){
                field.style.border = '2px solid red';
                field.parentNode.children[2].style.opacity = "1";
                validForm = 0;
            }else if(response.taken == false && field.value.match(mailFormat)){
                field.style.border = '2px solid rgb(82, 202, 13)';
                field.parentNode.children[2].style.opacity = "0";
                validForm = 1;
            }
        }

        data = {
            'email' : event.target.value
        }

        xhr.send(JSON.stringify(data));
        
        


    })


    password1.addEventListener('keyup',()=>{
        field = event.target;
        pwd = event.target.value;
        if(strongPassword.test(pwd)){
            field.style.border = "2px solid rgb(82,202,13)";
            field.parentNode.children[4].style.opacity = "1";
            field.parentNode.children[2].style.opacity = "0";
            field.parentNode.children[3].style.opacity = "0";
            console.log('strong')
        }else if(mediumPassword.test(pwd)){
            field.style.border = "2px solid rgb(233, 136, 26)";
            field.parentNode.children[3].style.opacity = "1";
            field.parentNode.children[2].style.opacity = "0";
            field.parentNode.children[4].style.opacity = "0";
            console.log('medium')
        }else{
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
            field.parentNode.children[3].style.opacity = "0";
            field.parentNode.children[4].style.opacity = "0";
            console.log('weak');

        }
    })

    password2.addEventListener('keyup',()=>{
        field = event.target;
        pwd = event.target.value;

        if(password1.value != pwd){
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
            validForm = 0;
        }else{
            field.style.border = "2px solid rgb(82,202,13)";
            field.parentNode.children[2].style.opacity = "0";
            validForm = 1;
        }
    })

    password2.addEventListener('focusout',()=>{
        if(!validForm){
            signupBtn.classList.add('inactive');
        }else{
            if(signupBtn.classList.contains('inactive'))
                signupBtn.classList.remove('inactive');
        }
    })
}