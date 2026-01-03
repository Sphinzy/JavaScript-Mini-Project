const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
const token = localStorage.getItem("token");
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMTgsImlhdCI6MTc2NzA4MDI5OSwiZXhwIjoxNzY3Njg1MDk5fQ.Ir6f1psgdgXRQ2X2In6Z39JPAuplZnka4nIEAieEjxk";
if (!token) {
  // No token found → redirect to login
  window.location.href = "../../../index.html"; // adjust path if needed
}

function fetchMyArticles() {
  fetch(baseUrl + "/articles/own?_page=1&_per_page=10", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((result) => {
      let articles = result.data.items;
      let list = "";

      articles.forEach((art) => {
        let thumb = art.thumbnail
          ? art.thumbnail
          : "https://via.placeholder.com/55x40?text=No+Img";

        let catName = art.category ? art.category.name : "Uncategorized";

        list += `
            <tr>
                <td><img src="${thumb}" class="thumbnail-img shadow-sm"></td>
                <td class="fw-bold text-dark">${art.title}</td>
                <td><span class="badge badge-category">${catName}</span></td>
                <td class="text-muted small">${new Date(
                  art.createdAt
                ).toLocaleDateString()}</td>
                <td class="text-center">
                    <i class="bi bi-pencil-square text-main action-icon icon-edit mx-2" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                    <i class="bi bi-trash text-danger action-icon icon-delete mx-2" onclick="deleteArticle(${
                      art.id
                    })"></i>
                </td>
            </tr>
          `;
      });
      document.getElementById("articleTableBody").innerHTML = list;
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
}
//delete
function deleteArticle(id) {
  deleteId = id;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  fetch(baseUrl + "/articles/" + deleteId, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  }).then((res) => {
    if (res.ok) {
      bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
      ).hide();
      fetchMyArticles();
    }
  });
});

fetchMyArticles();

//const token = localStorage.getItem('token');
const imageLink = localStorage.getItem("getImage");
const getImage = document.querySelector("#profile-image");
const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", () => {
  fetch(baseUrl + "/auth/logout", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((resData) => {
      localStorage.removeItem("token");
      return (location.href = "../login/login.html");
      console.log(resData);
    });
});
//getImage.setAttribute('src', imageLink);
const profileImage = document.querySelector('#profile-image');
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
