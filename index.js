// const base_url = 'http://localhost:3000'
const base_url = 'https://hacktiv-news-server.herokuapp.com'

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
        $('#email-regis').val('')
        $('#password-regis').val('')
        $('#email').val('')
        $('#password').val('')
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
        $('#containerWeather').show()
        $('#card-weather').show()
        $('#navbar').show()
        // getNews()
        getNewsSport()
        // getNewsHealth()
        getWeather()
        getCollections()
    }else{
        $('#login-regis-page').show()
        $('#form-login').show()
        $('#form-register').hide()
        $('#containerHome').hide()
        $('#containerWeather').hide()
        $('#card-weather').hide()
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
        url: base_url + '/googleLogin',
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
        url: base_url +  `/registrasi`,
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
        console.log(err.responseJSON.errors)
        let errors = err.responseJSON.errors
        errors.forEach(err =>{
            Toastify({
                text: err,    //pesanya
                gravity: "top",    // top or bottom
                position: "right", // left, center or right
                backgroundColor: "linear-gradient(to right, #f75b5b, #fc1d1d)",  //warnanya
                duration: 3000
            }).showToast();
        })
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
        url: base_url + `/login`,
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
        let errors = err.responseJSON.errors
        errors.forEach(err =>{
            Toastify({
                text: err,    //pesanya
                gravity: "top",    // top or bottom
                position: "right", // left, center or right
                backgroundColor: "linear-gradient(to right, #f75b5b, #fc1d1d)",  //warnanya
                duration: 3000
            }).showToast();
        })
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
        url: base_url + `/apis/news`
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
        url: base_url + `/apis/news/sport`
    })
    .done((data)=>{
        console.log(data)
        let news = data.data
        $('#card-news').empty()
        for(let i=0; i<news.length-14; i++){
            $('#card-news').append(`
            <div id="card-news">
                <div class="card mt-4" style="max-width: 750px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${news[i].urlToImage}" alt="data API News" width="250" height="200">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${news[i].source.name}</h5>
                                <p class="card-text">${news[i].title}</p>
                                <a href="${news[i].url}" target="_blank" class="card-text" style="color:blue">baca berita</a>
                                <p class="card-text mt-1"><small class="text-muted">${new Date(Date.parse(news[i].publishedAt)).toISOString().split('T')[0]}</small></p>
                                <button type="button" data-id="${news[i].url}" data-title="${news[i].title}" class="btn btn-sm btn-success add-btn m-1">Tambah Favorite <i class="fas fa-plus fa-sm"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        }
        $('button.add-btn').on('click', (e) => {
            e.preventDefault();
            addToCollection(e.target.dataset.id, e.target.dataset.title);
        });
    })
    .fail((err)=>{
        console.log(err)
    })
}

const getNewsHealth = () =>{
    $.ajax({
        method: "GET",
        url: base_url + `/apis/news/health`
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
const getWeather = () =>{
    $.ajax({
        method: "GET",
        url: base_url + `/apis/weather/jakarta`
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
        $.ajax({
            method: "GET",
            url: base_url + `/apis/weather/bandung`
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

// Get collections
const getCollections = () => {
    $.ajax({
      method: 'GET',
      url: base_url + '/newscollection',
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
      .done((data) => {
        console.log(data);
        let rows = '';
        data.data.forEach((collection, i) => {
          let row = `<tr>
                <td>${i + 1}</td>
                <td> <a href="${collection.url}"  target="_blank">${collection.title.split('-')[0]}</a></td>   
                <td >
                    <button type="button" data-id="${
                      collection.id
                    }" class="btn btn-sm btn-danger delete-btn m-1"><i class="fas fa-trash fa-sm"></i></button>
                </td>
            </tr>`;
          rows += row;
        });
        clearCollection();
        $('tbody#collections').html(rows);
        $('button.delete-btn').on('click', (e) => {
          e.preventDefault();
          deleteCollection(e.target.dataset.id);
        });
      })
      .fail((err) => {
        const { errors } = err.responseJSON;
        alert(errors.join(', '));
      });
  };
// Get collections

// Clear Collection
const clearCollection = () => {
    $('#collections').empty();
};

// Delete collection
function deleteCollection(id) {
    $.ajax({
      url: base_url + '/newscollection/' + id,
      method: 'DELETE',
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
      .done(() => {
        checkLogin();
      })
      .fail((err) => {
        console.log(err);
      });
}

// Add collection
function addToCollection(url, title) {
    console.log(url, title)
    $.ajax({
      url: base_url + '/newscollection',
      method: 'POST',
      data: {
        title,
        url
      },
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
      .done(() => {
        Toastify({
          text: 'Success add collection',
          gravity: 'bottom', // `top` or `bottom`
          position: 'right', // `left`, `center` or `right`
          backgroundColor: 'green',
          duration: 3000
        }).showToast();
        checkLogin();
      })
      .fail((err) => {
        let msg = err.responseJSON.errors;
        msg.forEach((error) => {
          Toastify({
            text: error,
            gravity: 'bottom', // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            backgroundColor: 'linear-gradient(to right, #f75b5b, #fc1d1d)',
            duration: 3000
          }).showToast();
        });
      });
}


var $backToTop = $(".backTop");
    $backToTop.hide();
    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 100) {
        $backToTop.fadeIn();
      } else {
        $backToTop.fadeOut();
      }
    });

    $backToTop.on('click', function(e) {
      $("html, body").animate({scrollTop: 0}, 500);
    });