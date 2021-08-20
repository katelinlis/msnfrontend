function register() {
  axios
    .post('https://social.katelinlis.xyz/api/auth/login', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    })
    .then(function (response) {
      if (response.data && response.data.token)
        window.localStorage.setItem('token', response.data.token);
      //document.location.href = 'https://social.katelinlis.xyz/user.html';
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
