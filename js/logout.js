

document.getElementById('btn-logout').addEventListener('click', logout)

function logout() {
   
    localStorage.removeItem('AcessoUsuario')
    
    window.location.href = 'index.html'
}