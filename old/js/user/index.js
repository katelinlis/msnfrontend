let friend_status
let this_user
let token = localStorage.getItem('token');
let userid = window.location.href.slice(35)
let headers = {}
if (token) headers['Authorization'] = `Bearer ${token}`
axios.get('/api/auth/user/', { headers })
  .then(function (response) {
    console.log(response);
    this_user = response.data
    document.getElementById('linktomypage').setAttribute('href', `/user/${this_user.user.id}/`)
    main(this_user)
  }).catch(err => {
    main()
  })


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
    axios.get('/api/user/get/' + userid, { headers })
      .then(function (response) {
        console.log(response);
        document.getElementById("username").innerText = response.data.user.username
        if (response.data.user.avatar)
          document.getElementById("avatarPhoto").setAttribute('src', `/api/static/${response.data.user.id}/${response.data.user.avatar}`)
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
    if (this_user.user.avatar)
      document.getElementById("avatarPhoto").setAttribute('src', `/api/static/${this_user.user.id}/${this_user.user.avatar}`)
  }
}

function Upload() {
  let photo = document.getElementById("avatarUpload").files[0];
  let formData = new FormData();

  formData.append("photo", photo);
  fetch('/api/user/upload_avatar', { method: "POST", body: formData, headers: { Authorization: `Bearer ${token}` } });
}

function mouseover() {
  document.getElementById('changeAvatarButton').style.visibility = 'visible'
}
function mouseleave() {
  document.getElementById('changeAvatarButton').style.visibility = 'hidden'
}