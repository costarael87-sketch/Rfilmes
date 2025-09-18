
document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const homePage = document.getElementById('home-page');
  const adminPanel = document.getElementById('admin-panel');
  const userLoginForm = document.getElementById('user-login-form');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminContent = document.getElementById('admin-content');
  const logoutBtn = document.getElementById('logout-btn');
  const addUserForm = document.getElementById('add-user-form');
  const createTrialForm = document.getElementById('create-trial-form');
  const userList = document.getElementById('user-list');
  const videoPlayerOverlay = document.getElementById('video-player-overlay');
  const videoPlayer = document.getElementById('video-player');

  let users = [];
  let isAdmin = false;

  function showPage(page) {
    loginScreen.classList.remove('active');
    homePage.classList.remove('active');
    adminPanel.classList.remove('active');
    if (page === 'login') loginScreen.classList.add('active');
    if (page === 'home') homePage.classList.add('active');
    if (page === 'admin') adminPanel.classList.add('active');
  }

  // Login usuário
  userLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password && u.status === 'liberado');
    if (user) {
      alert('Login de usuário bem-sucedido!');
      showPage('home');
    } else {
      alert('Usuário inválido ou bloqueado.');
    }
  });

  // Login admin
  adminLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    if (email === 'costarael87@gmail.com' && password === '1206israel') {
      alert('Login de administrador bem-sucedido!');
      isAdmin = true;
      showPage('admin');
      renderUserList();
    } else {
      alert('Credenciais inválidas.');
    }
  });

  logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    showPage('login');
  });

  addUserForm.addEventListener('submit', e => {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    if (users.some(u => u.username === newUsername)) {
      alert('Usuário já existe.');
      return;
    }
    users.push({ id: Date.now(), username: newUsername, password: newPassword, status: 'liberado' });
    alert('Usuário adicionado!');
    renderUserList();
    addUserForm.reset();
  });

  createTrialForm.addEventListener('submit', e => {
    e.preventDefault();
    const trialUsername = document.getElementById('trial-username').value;
    const user = users.find(u => u.username === trialUsername);
    if (user) {
      const expiresAt = Date.now() + 3600000;
      user.accessExpires = expiresAt;
      user.status = 'liberado';
      alert('Teste de 1h criado para ' + user.username);
    } else {
      alert('Usuário não encontrado.');
    }
    renderUserList();
  });

  function renderUserList() {
    userList.innerHTML = '';
    users.forEach(user => {
      let status = user.status;
      if (user.accessExpires) {
        const diff = user.accessExpires - Date.now();
        if (diff <= 0) {
          user.status = 'bloqueado';
          status = 'expirado';
        } else {
          status += ' (' + Math.floor(diff/60000) + ' min restantes)';
        }
      }
      const li = document.createElement('li');
      li.textContent = user.username + ' - ' + status;
      userList.appendChild(li);
    });
  }

  window.openPlayer = el => {
    const url = el.getAttribute('data-url');
    videoPlayer.src = url;
    videoPlayerOverlay.classList.add('visible');
  };

  window.closePlayer = () => {
    videoPlayer.src = '';
    videoPlayerOverlay.classList.remove('visible');
  };

  showPage('login');
});
