function mouseover() {
  document.getElementById('changeAvatarButton').style.visibility = 'visible';
}
function mouseleave() {
  document.getElementById('changeAvatarButton').style.visibility = 'hidden';
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
