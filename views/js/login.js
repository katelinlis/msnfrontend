function register() {
  axios
    .post('https://social.katelinlis.xyz/api/auth/login', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    })
    .then(function (response) {
      if (response.data && response.data.token)
        window.localStorage.setItem('token', response.data.token);
      setCookie('token', response.data.token);
      //document.location.href = 'https://social.katelinlis.xyz/user.html';
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
