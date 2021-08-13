let friend_status
let this_user
let token = localStorage.getItem('token');
let userid = window.location.href.slice(35)
if (!token) document.location.href = "https://social.katelinlis.xyz/login.html"
axios.get('/api/auth/user/', { headers: { Authorization: `Bearer ${token}` } })
  .then(function (response) {
    console.log(response);
    this_user = response.data
    main(this_user)
  })
  .catch(function (error) {
    localStorage.removeItem('token');
    document.location.href = "https://social.katelinlis.xyz/login.html"
  });

async function request_friend() {
  if (friend_status.status === 0 && friend_status.forme === true) {
    axios.post('/api/user/request_accept/' + userid, null, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (response) {
        console.log(response);
        document.getElementById("ButtonSendRequestFriend").innerText = 'remove from Friends'
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  if (friend_status.status === 3)
    axios.post('/api/user/request/' + userid, null, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (response) {
        console.log(response);
        document.getElementById("ButtonSendRequestFriend").value = 'Cancel request'
      })
      .catch(function (error) {
        console.log(error);
      });
}
async function main(this_user) {
  if (userid > 0) {
    console.log(userid)
    axios.get('/api/user/get/' + userid, { headers: { Authorization: `Bearer ${token}` } })
      .then(function (response) {
        console.log(response);
        document.getElementById("username").innerText = response.data.user.username
        friend_status = response.data.friend_status
        let friends_count = response.data.user.friends
        document.getElementById("count_friends").innerText = friends_count ? friends_count : 0

        if (!response.data.user.me) {
          document.getElementById("friendRequestAndSendMessage").style.display = 'block'
          if (friend_status.status === 0 && friend_status.forme === false)
            document.getElementById("ButtonSendRequestFriend").innerText = 'Cancel request'
          else if (friend_status.status === 0 && friend_status.forme === true)
            document.getElementById("ButtonSendRequestFriend").innerText = 'Accept request'
          else if (friend_status.status == 1)
            document.getElementById("ButtonSendRequestFriend").innerText = 'remove from Friends'
          console.log("dd")
        }
        else document.getElementById("EditUser").style.display = 'block'
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    let friends_count = this_user.user.friends
    document.getElementById("username").innerText = this_user.user.username
    document.getElementById("count_friends").innerText = friends_count ? friends_count : 0
  }
}


function mouseover() {
  document.getElementById('changeAvatarButton').style.visibility = 'visible'
}
function mouseleave() {
  document.getElementById('changeAvatarButton').style.visibility = 'hidden'
}