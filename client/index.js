$(document).ready(()=>{
    console.log('hello world')

    checkLogin()
    
    $('#form-register').hide()
    $('#title-regis').hide()

    // regis
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
})


const checkLogin = () =>{
    if(localStorage.getItem('access_token')){
        $('#form-register').hide()
    }else{
        $('#navbar').hide()
        $('#containerHome').hide()
    }
}