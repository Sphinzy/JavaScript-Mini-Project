const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
    const token = localStorage.getItem("token");

      const params = new URLSearchParams(window.location.search);
      const articleId = params.get("id");

      const articleDiv = document.getElementById("article-detail");

      if (!articleId) {
        articleDiv.innerHTML = `
    <div class="card-body">
      <p>Article not found.</p>
    </div>`;
      } else {
        fetch(`${baseUrl}/articles/${articleId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        })
          .then(res => res.json())
          .then(resData => {
            console.log(resData);
            console.log(resData);
            const article = resData.data;
            const creator = {
              id: article.creator?.id || "",
              firstName: article.creator?.firstName || "",
              lastName: article.creator?.lastName || "",
              avatar: article.creator?.avatar || "assets/default-avatar.png"
            };
            console.log(creator.id);

            localStorage.setItem("profileUser", JSON.stringify(creator));

            document.querySelector("#article-detail").innerHTML = `
        <div class="card-body">
          <div class="row g-4">

            <div class="col-12 col-lg-6">
              <img src="${article.thumbnail}"
                   class="img-fluid rounded w-100"
                   style="height:450px; object-fit:cover;">
            </div>

            <div class="col-12 col-lg-6">

              <a href="UserProfile.html?id=${creator.id}"
                 class="d-flex align-items-center text-decoration-none text-dark mb-2">

                <div style="border:2px solid #7645bf; border-radius:50%; padding:3px;">
                  <img src="${creator.avatar}"
                       class="rounded-circle object-fit-cover"
                       width="50" height="50">
                </div>

                <div class="ms-2">
                  <strong>${creator.firstName} ${creator.lastName}</strong><br>
                  <small class="text-muted">
                    ${new Date(article.createdAt).toLocaleString()}
                  </small>
                </div>
              </a>

              <span class="badge bg-main mb-2">
                ${article.category?.name || "Uncategorized"}
              </span>

              <h3 class="mt-2 clamp-2">${article.title}</h3>

              <p class="mt-3 fs-5 clamp-7">
                ${article.content || article.description || ""}
              </p>

            </div>
          </div>
        </div>`;
          })
          .catch(err => {
            console.error(err);
            articleDiv.innerHTML = `
        <div class="card-body">
          <p class="text-danger">Failed to load article.</p>
        </div>`;
          });
      }

      //const token = localStorage.getItem('token');
const btnLogout = document.querySelector('#btnLogout');
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
    fetch(baseUrl + "/auth/logout", {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(resData => {
        localStorage.removeItem('token');
        return location.href = '../login/login.html'
        console.log(resData);

      })
  })
  //getImage.setAttribute('src', imageLink