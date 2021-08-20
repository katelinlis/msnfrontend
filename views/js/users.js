let token = localStorage.getItem('token');
let headers = {};
if (token) headers['Authorization'] = `Bearer ${token}`;
/*axios
  .get('https://social.katelinlis.xyz/api/user/get/', { headers })
  .then(function (response) {
    let usersElementRow = document.createElement('div');
    response.data.users.forEach((user, index) => {
      if (
        usersElementRow.childNodes.length == 8 ||
        (usersElementRow.childNodes.length < 8 &&
          index + 1 == response.data.users.length)
      ) {
        document.getElementById('users').append(usersElementRow);
        usersElementRow = document.createElement('div');
      }
      var element = document.createElement('span');
      element.style.marginLeft = '5px';
      element.style.marginBottom = '5px';
      element.innerHTML = `<a href="/user/${user.id}">${
        user.avatar
          ? `<img height="40px" width="40px" src="https://social.katelinlis.xyz/api/static/${user.id}/${user.avatar}"/>`
          : '<img height="40px" width="40px" src="https://social.katelinlis.xyz/UserProfileImage.svg">'
      }${user.username}</a>`;
      usersElementRow.appendChild(element);
    });
  });
*/
