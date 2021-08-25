let friend_status;
let this_user;
let token = localStorage.getItem('token');
//if local 27, if social.katelinlis then 35
let userid = window.location.href.slice(27);
//let userid = window.location.href.slice(35);
let headers = {};
if (token) headers['Authorization'] = `Bearer ${token}`;
main();
console.log(123);
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
  if (friend_status.status === 3 && friend_status.forme === false)
    axios
      .post('https://social.katelinlis.xyz/api/user/request/' + userid, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        console.log(response);
        document.getElementById('ButtonSendRequestFriend').innerText =
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
        friend_status = response.data.friend_status;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
