 document.addEventListener("DOMContentLoaded", () => {
      const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      const avatarEl = document.getElementById("profileAvatar");
      const nameEl = document.getElementById("profileName");
      const datetimeEl = document.getElementById("profileDatetime");
      const articlesEl = document.getElementById("profileArticles");

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
          console.log(res);
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
    console.log(userId);
    fetch(`http://blogs.csm.linkpc.net/api/v1/articles?search=&_page=1&_per_page=100`)
    .then(res => res.json())
    .then(getProfile =>{
      console.log(getProfile);
      console.log(getProfile.data.creator.avatar);
      const gets = getProfile.data.items;
      console.log(gets[0]);
      getProfile.forEach(getPro =>{
        console.log(getPro);
      })
      cardPro.innerHTML = `
        <div class="card-body d-flex align-items-center gap-3">
                <div style="border: 2px solid #7645bf; border-radius: 50%; padding: 3px;">
                  <img id="profileAvatar" src="${getProfile.data.creator.avatar}" class="rounded-circle object-fit-cover" width="80" height="80">
                </div>

                <div class="flex-grow-1">
                  <h5 id="profileName" class="mb-1 fw-semibold">${getProfile.data.creator.firstName} ${getProfile.data.creator.lastName}</h5>
                  <small id="profileDatetime" class="text-muted"></small>
                </div>
              </div>
      `
    })


    const token = localStorage.getItem('token');
  const baseUrl = 'http://blogs.csm.linkpc.net/api/v1';
  const imageLink = localStorage.getItem('getImage');
  const getImage = document.querySelector('#profile-image');
  const btnLogout = document.querySelector('#btnLogout');
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
  //getImage.setAttribute('src', imageLink);
  getImage.src = imageLink;