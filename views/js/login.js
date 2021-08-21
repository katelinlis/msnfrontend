function register() {
  axios
    .post('https://social.katelinlis.xyz/api/auth/login', {
      username: document.getElementById('InputUsername').value,
      password: document.getElementById('InputPassword').value,
    })
    .then(function (response) {
      if (response.data && response.data.token)
        window.localStorage.setItem('token', response.data.token);
      setCookie('token', response.data.token);
      document.location.href =
        'https://social.katelinlis.xyz/user/' + response.data.userid;
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
