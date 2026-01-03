const BASE_URL = "http://blogs.csm.linkpc.net/api/v1";
const token = localStorage.getItem("token");
if (!token) {
  // No token found → redirect to login
  window.location.href = "../../../index.html"; // adjust path if needed
}
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const actionMenu = document.getElementById("actionMenu");

function toggleMenu(e) {
  e.stopPropagation();
  actionMenu.classList.toggle("show");
}
window.onclick = () => actionMenu.classList.remove("show");

function chooseAvatar() {
  avatarInput.click();
  actionMenu.classList.remove("show");
}

avatarInput.addEventListener("change", function () {
  const file = avatarInput.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

function loadProfile() {
  if (!token) {
    window.location.href = "../login/login.html";
    return;
  }
  fetch(`${BASE_URL}/auth/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data) {
        const user = data.data;
        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("displayName").innerText = `${
          user.firstName || "My"
        } ${user.lastName || "Profile"}`;
        if (user.avatar) {
          avatarPreview.src = user.avatar;
          document.getElementById("profile-image-nav").src = user.avatar;
        }
      }
    })
    .catch((err) => console.error("Load Error:", err));
}

async function saveChanges() {
  const fName = document.getElementById("firstName").value.trim();
  const lName = document.getElementById("lastName").value.trim();
  const emailAddr = document.getElementById("email").value.trim();
  const file = avatarInput.files[0];

  if (!fName || !lName || !emailAddr) {
    Swal.fire({
      icon: "warning",
      title: "Missing Info",
      text: "Please fill fields.",
    });
    return;
  }

  Swal.fire({
    title: "Updating...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const profileRes = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: fName,
        lastName: lName,
        email: emailAddr,
      }),
    });

    if (!profileRes.ok) throw new Error("Profile update failed");

    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      const avatarRes = await fetch(`${BASE_URL}/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!avatarRes.ok) throw new Error("Image upload failed");
    }

    await Swal.fire({
      icon: "success",
      title: "Success!",
      timer: 1500,
      showConfirmButton: false,
    });
    location.reload();
  } catch (err) {
    Swal.fire({ icon: "error", title: "Error", text: err.message });
  }
}

function deleteAvatar() {
  Swal.fire({
    title: "Delete photo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f43f5e",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${BASE_URL}/profile/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        Swal.fire("Deleted!", "", "success").then(() => location.reload());
      });
    }
  });
}

document.getElementById("btnLogout").addEventListener("click", () => {
  fetch(`${BASE_URL}/auth/logout`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).finally(() => {
    localStorage.removeItem("token");
    location.href = "../login/login.html";
  });
});

loadProfile();

const profileImage = document.querySelector('#profile-image');
const baseUrl = 'http://blogs.csm.linkpc.net/api/v1';
fetch(`${baseUrl}/auth/profile`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(getImage => {
    console.log(getImage);
    profileImage.src = getImage.data.avatar
  })