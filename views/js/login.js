function register() {
  let username = document.getElementById('InputUsername').value;
  let password = document.getElementById('InputPassword').value;
  let savePassword = document.getElementById('SavePassword').value;
  console.log(savePassword);
  if (username && password)
    axios
      .post('https://social.katelinlis.xyz/api/auth/login', {
        username,
        password,
      })
      .then(function (response) {
        if (response.data && response.data.token) {
          window.localStorage.setItem('InputUsername', username);
          if (savePassword === 'on') {
            window.localStorage.setItem('InputPassword', password);
          }
          window.localStorage.setItem('token', response.data.token);
          setCookie('token', response.data.token);
          document.location.href =
            'https://social.katelinlis.xyz/user/' + response.data.userid;
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}
setTimeout(() => {
  console.log('ddd');
  document.getElementById('InputUsername').value =
    window.localStorage.getItem('InputUsername');
  document.getElementById('InputPassword').value =
    window.localStorage.getItem('InputPassword');
}, 200);
