$(document).ready(()=>{
    console.log('hello world')

    checkLogin()
    getNews()
    getNewsSport()
    getNewsHealth()
    getWeatherJakarta()
    getWeatherBandung()
    
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
    })
})


// check Login
const checkLogin = () =>{
    if(localStorage.getItem('access_token')){
        $('#login-regis-page').hide()
        $('#containerHome').show()
        $('#navbar').show()
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
        for(let i=0; i<news.length-15; i++){
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
                                <p class="card-text mt-3"><small class="text-muted">${new Date(Date.parse(news[i].publishedAt)).toISOString().split('T')[0]}</small></p>
                                <button onClick="addToCollection(${news[i].url}) class="btn btn-sm btn-secondary" id="btn-${news[i].url}" type="submit">Add to Collection</button>
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

// 3rd Party API Weather
const getWeatherJakarta = () =>{
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/weather/jakarta`
    })
    .done((data)=>{
        $('#card-weather').empty()
        $('#card-weather').append(`
            <div class="col-md-5">
                <div class="card" id="cardweather1">
                    <div class="title"><p>Jakarta</p></div>
                    <div class="temp mt-5">${data.data.current.temperature}<sup>&deg;</sup></div>
                </div>
            </div>
        `)
    })
    .fail((err)=>{
        console.log(err)
    })
}

const getWeatherBandung = () =>{
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/weather/bandung`
    })
    .done((data)=>{
        $('#card-weather').append(`
            <div class="col-md-5">
                <div class="card" id="cardweather2">
                    <div class="title"><p>Bandung</p></div>
                    <div class="temp mt-5">${data.data.current.temperature}<sup>&deg;</sup></div>
                </div>
            </div>
        `)
    })
    .fail((err)=>{
        console.log(err)
    })
}
// 3rd Party API Weather

// Lihat Password
function lihatRegisPassword() {
    var x = document.getElementById("password-regis");
    if (x.type === "password") {
        document.getElementById("show-regis-password").checked = true;
        x.type = "text";
    } else {
        x.type = "password";
        document.getElementById("show-regis-password").checked = false;
    }
}

function lihatLoginPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        document.getElementById("show-login-password").checked = true;
        x.type = "text";
    } else {
        document.getElementById("show-login-password").checked = false;
        x.type = "password";
    }
}
// Lihat Password
