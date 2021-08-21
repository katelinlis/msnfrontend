    function logout() {
      localStorage.removeItem('token');
      document.location.href = "https://social.katelinlis.xyz/login.html"
    }
