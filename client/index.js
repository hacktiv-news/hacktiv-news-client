$(document).ready(()=>{
    console.log('hello world')

    checkLogin()
    
    $('#form-register').hide()
    $('#title-regis').hide()

    // form regis
    $('#btn-register').on('click', (e)=>{
        e.preventDefault()
        $('#title-login').hide()
        $('#form-login').hide()
        $('#title-regis').show()
        $('#form-register').show()
    })

    // cancel regis
    $('#button-cancel-regis').on('click', (e)=>{
        e.preventDefault()
        $('#form-login').show()
        $('#title-login').show()
        $('#form-register').hide()
        $('#title-regis').hide()
    })

    //regis
    $('#form-register').on('submit', (e)=>{
        e.preventDefault()
        registrasi()
    })

    //login
    $('#form-login').on('submit', (e)=>{
        e.preventDefault()
        login()
    })

    //logut
    $('#btn-logout').on('click', (e)=>{
        e.preventDefault()
        logout()
        signOut()
    })
})


// check Login
const checkLogin = () =>{
    if(localStorage.getItem('access_token')){
        $('#login-regis-page').hide()
        $('#containerHome').show()
        $('#navbar').show()
        getNews()
        getNewsSport()
        getNewsHealth()
    }else{
        $('#login-regis-page').show()
        $('#form-login').show()
        $('#form-register').hide()
        $('#containerHome').hide()
        $('#navbar').hide()
        $('#title-regis').hide()
        $('#title-login').show()
    }
}
// check Login end



// oauth google
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/googleLogin',
        data:{
            token: id_token
        }
    })
    .done((data)=>{
        const {access_token} = data
        localStorage.setItem('access_token', access_token)
    })
    .fail((err)=>{
        console.log(err)
    })
    .always(()=>{
        checkLogin()
    })
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}




// Registrasi
const registrasi = () =>{
    const email = $('#email-regis').val()
    const password = $('#password-regis').val()

    $.ajax({
        method: "POST",
        url: `http://localhost:3000/registrasi`,
        data:{
            email,
            password
        }
    })
    .done((data)=>{
        $('#email-regis').val('')
        $('#password-regis').val('')
        checkLogin()        
        console.log(data)
    })
    .fail((err)=>{
        console.log(err)
    })
}
// Registrasi End



// Login
const login = () =>{
    const email = $('#email').val()
    const password = $('#password').val()
    console.log(email,'===', password)

    $.ajax({
        method: "POST",
        url: `http://localhost:3000/login`,
        data:{
            email,
            password
        }
    })
    .done((data)=>{
        const {access_token} = data
        localStorage.setItem('access_token', access_token)
        sessionStorage.setItem('access_token', access_token)
        $('#email').val('')
        $('#password').val('')
        checkLogin()
        console.log(data)
    })
    .fail((err)=>{
        console.log(err)
    })
}
// Login End


// Logout
const logout = () =>{
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
    checkLogin()
}
// Logout end






//====================== 3rd Party API ===============

// 3rd Party API News
const getNews = () =>{
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/news`
    })
    .done((data)=>{
        console.log(data.data)
    })
    .fail((err)=>{
        console.log(err)
    })
}

const getNewsSport = () =>{
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/news/sport`
    })
    .done((data)=>{
        let news = data.data
        $('#card-news').empty()
        for(let i=0; i<news.length-17; i++){
            $('#card-news').append(`
            <div id="card-news">
                <div class="card mb-3" style="max-width: 700px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${news[i].urlToImage}" width="210" height="162">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${news[i].source.name}</h5>
                                <p class="card-text">${news[i].title}</p>
                                <a href="${news[i].url}" target="_blank" class="card-text" style="color:blue">buka berita</a>
                                <p class="card-text mt-3"><small class="text-muted">${news[i].publishedAt}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        }
    })
    .fail((err)=>{
        console.log(err)
    })
}

const getNewsHealth = () =>{
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/news/health`
    })
    .done((data)=>{
        console.log(data.data)
    })
    .fail((err)=>{
        console.log(err)
    })
}
// 3rd Party API News
