
 window.onload = function() {
    const  loginUsuario = localStorage.getItem('AcessoUsuario')
    if (! loginUsuario) {
        window.location.href = 'index.html'
    }
}