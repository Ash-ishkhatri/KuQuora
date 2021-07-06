if(window.location.pathname == '/account/register/'){
    firstName = document.querySelector(' input[name="first_name"]');
    lastName = document.querySelector(' input[name="last_name"]');

    form = document.querySelector('form#signup')
    usernameField = document.querySelector(' input[name="username"]');
    emailField = document.querySelector(' input[name="email"]');
    signupBtn = document.querySelector(' input[type="submit"]');
    password1 = document.querySelector(' input[name="password1"]');
    password2 = document.querySelector(' input[name="password2"]');
    let validEmail = validUsername = validPassword1 =  validPassword2 = validFirstName = validLastName = 0;
    // let nameFormat = /^[a-z ,.'-]+$/i;

    let validName = /^[a-zA-Z]*$/;
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

    // signupBtn.classList.add('inactive');


    function validFields(){
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        let field = firstName
        if(field.value.match(validName)){
            validFirstName = 1;
        }
        else {
            validFirstName = 0;
            field.style.border = '2px solid red';
        }

        field = lastName
        if(field.value.match(validName)){ 
            validLastName = 1;
        }
        else {
            field.style.border = '2px solid red';
            validLastName = 0;
        }
        field = usernameField
        if(field.value.length < 3){
            field.style.border = '2px solid red';
            field.parentNode.children[2].style.opacity = "1";
        }
        data = {
            'username' : field.value
        }
        fetch(field.getAttribute("data-url"),{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken':csrfToken
                
            }
        })
        .then(res => res.json())
        .then(response => {
            if(response.taken == true){
                field.style.border = '2px solid red';
                field.parentNode.children[2].style.opacity = "1";
                validUsername = 0;
            }else if(response.taken == false && field.value.length > 3){
                field.style.border = '2px solid rgb(82, 202, 13)';
                field.parentNode.children[2].style.opacity = "0";
                validUsername = 1;
            }
        })

        field = emailField
        const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!field.value.match(mailFormat)){
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
        }
        data = {
            'email' : field.value
        }
        fetch(field.getAttribute('data-url'),{
            method : 'post',
            body : JSON.stringify(data),
            headers : {
                'Content-Type' : 'application/json',
                'X-CSRFToken':csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            if(response.taken == true){
                field.style.border = '2px solid red';
                field.parentNode.children[2].style.opacity = "1";
                validEmail = 0;
            }else if(response.taken == false && field.value.match(mailFormat)){
                field.style.border = '2px solid rgb(82, 202, 13)';
                field.parentNode.children[2].style.opacity = "0";
                validEmail = 1;
            }
        })


        field = password1;
        pwd = password1.value;
        if(strongPassword.test(pwd)){
            field.style.border = "2px solid rgb(82,202,13)";
            field.parentNode.children[4].style.opacity = "1";
            field.parentNode.children[2].style.opacity = "0";
            field.parentNode.children[3].style.opacity = "0";
            console.log('strong');
            validPassword1 = 1;
        }else if(mediumPassword.test(pwd)){
            field.style.border = "2px solid rgb(233, 136, 26)";
            field.parentNode.children[3].style.opacity = "1";
            field.parentNode.children[2].style.opacity = "0";
            field.parentNode.children[4].style.opacity = "0";
            console.log('medium');
            validPassword1 = 1;
        }else{
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
            field.parentNode.children[3].style.opacity = "0";
            field.parentNode.children[4].style.opacity = "0";
            console.log('weak');
            validPassword1 = 0;
        }

        field = password2;
        pwd = field.value;

        if(password1.value != pwd){
            field.style.border = "2px solid red";
            field.parentNode.children[2].style.opacity = "1";
            validPassword2 = 0;
        }else{
            validPassword2 = 1;
        }

        return validFirstName && validLastName && validEmail && validPassword1 && validPassword2 && validUsername;

    }


    form.addEventListener('submit',()=>{
        event.preventDefault();
        if(validFields()){
            // signupBtn.classList.remove('inactive');
            console.log('inside')
            event.target.submit();
        }
    })








}