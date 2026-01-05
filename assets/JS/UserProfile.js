 document.addEventListener("DOMContentLoaded", () => {
      const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      const avatarEl = document.getElementById("profileAvatar");
      const nameEl = document.getElementById("profileName");
      const datetimeEl = document.getElementById("profileDatetime");
      const articlesEl = document.getElementById("profileArticles");
      if (!token) {
        // No token found → redirect to login
        window.location.href = "../../../index.html"; // adjust path if needed
      }
      const storedUser = localStorage.getItem("profileUser");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      avatarEl.src = user.avatar || "assets/default-avatar.png";
      nameEl.innerText = user.firstName + " " + user.lastName;
      datetimeEl.innerText = new Date(user.createdAt).toLocaleString();

      fetch(`${baseUrl}/articles/by/${userId}?_page=1&_per_page=10`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(res => {
          articlesEl.innerHTML = "";
          res.data.items.forEach(article => {
            articlesEl.innerHTML += `
              <div class="col-md-4 mb-4">
                <a href="./detail.html?id=${article.id}"
                   class="text-decoration-none text-dark">
                  <div class="card h-100 shadow-sm article-card">
                    <img src="${article.thumbnail}"
                         class="card-img-top"
                         style="height:180px; object-fit:cover">
                    <div class="card-body">
                      <h6 class="fw-semibold">${article.title}</h6>
                      <p class="small text-muted mb-0">
                        ${article.description || ""}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            `;
          });
        });
    }); 

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const cardPro = document.querySelector('.card-profile');
const articleList = document.querySelector('.article-list');

fetch(`http://blogs.csm.linkpc.net/api/v1/articles?_page=1&_per_page=100`)
  .then(res => res.json())
  .then(res => {
    const items = res.data.items;

    //  Filter articles by userId
    const userArticles = items.filter(
      item => item.creator && item.creator.id == userId
    );

    if (!userArticles.length) {
      cardPro.innerHTML = `<p class="text-danger">User not found</p>`;
      return;
    }

    //  Get creator info from first article
    const creator = userArticles[0].creator;

    // Render profile
    cardPro.innerHTML = `
      <div class="card-body d-flex align-items-center gap-3">
        <div style="border: 2px solid #9f28e3; border-radius: 50%; padding: 3px;">
          <img src="${creator.avatar}"
               class="rounded-circle object-fit-cover"
               width="80" height="80">
        </div>

        <div class="flex-grow-1">
          <h5 class="mb-1 fw-semibold">
            ${creator.firstName} ${creator.lastName}
          </h5>
          <small class="text-muted">
            Articles: ${userArticles.length}
          </small>
        </div>
      </div>
    `;

    console.log(userArticles);
    //  Render articles
    articleList.innerHTML = '';
    userArticles.forEach(article => {
      articleList.innerHTML += `
        <div class="card mb-3">
          <img src="${article.thumbnail}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text text-truncate">
              ${article.content.replace(/<[^>]*>/g, '')}
            </p>
            <small class="text-muted">
              ${new Date(article.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));



const baseUrl = 'http://blogs.csm.linkpc.net/api/v1'
const token = localStorage.getItem('token');
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

btnLogout.addEventListener('click', () => {
  fetch(`${baseUrl}/auth/logout`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(() => {
      localStorage.removeItem('token');
      location.href = '../../../index.html';
    });
});