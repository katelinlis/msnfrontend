let friend_status;
let this_user;
let token = localStorage.getItem('token');
//if local 27, if social.katelinlis then 35
let userid = window.location.href.slice(35);
//let userid = window.location.href.slice(35);
let headers = {};
if (token) headers['Authorization'] = `Bearer ${token}`;
axios
  .get('https://social.katelinlis.xyz/api/auth/user/', { headers })
  .then(function (response) {
    console.log(response);
    this_user = response.data;
    document
      .getElementById('linktomypage')
      .setAttribute('href', `/user/${this_user.user.id}/`);
    main(this_user);
  })
  .catch((err) => {
    main();
  });

async function request_friend() {
  if (friend_status.status === 0 && friend_status.forme === true) {
    axios
      .post(
        'https://social.katelinlis.xyz/api/user/request_accept/' + userid,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(function (response) {
        console.log(response);
        document.getElementById('ButtonSendRequestFriend').innerText =
          'remove from Friends';
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  if (friend_status.status === 3)
    axios
      .post('https://social.katelinlis.xyz/api/user/request/' + userid, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        console.log(response);
        document.getElementById('ButtonSendRequestFriend').value =
          'Cancel request';
      })
      .catch(function (error) {
        console.log(error);
      });
}
async function main() {
  if (userid > 0) {
    console.log(userid);
    axios
      .get('https://social.katelinlis.xyz/api/user/get/' + userid, { headers })
      .then(function (response) {
        console.log(response);

        friend_status = response.data.friend_status;

        if (!response.data.user.me) {
          document.getElementById('friendRequestAndSendMessage').style.display =
            'block';
          if (friend_status.status === 0 && friend_status.forme === false)
            document.getElementById('ButtonSendRequestFriend').innerText =
              'Cancel request';
          else if (friend_status.status === 0 && friend_status.forme === true)
            document.getElementById('ButtonSendRequestFriend').innerText =
              'Accept request';
          else if (friend_status.status == 1)
            document.getElementById('ButtonSendRequestFriend').innerText =
              'remove from Friends';
          console.log('dd');
        } else document.getElementById('EditUser').style.display = 'block';
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function Upload() {
  let photo = document.getElementById('avatarUpload').files[0];
  let formData = new FormData();

  formData.append('photo', photo);
  fetch('https://social.katelinlis.xyz/api/user/upload_avatar', {
    method: 'POST',
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });
}

function mouseover() {
  document.getElementById('changeAvatarButton').style.visibility = 'visible';
}
function mouseleave() {
  document.getElementById('changeAvatarButton').style.visibility = 'hidden';
}
