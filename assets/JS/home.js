
 // ========== POST FUNCTIONS ==========
    function likePost(btn) {
      btn.classList.toggle("text-main");
      btn.innerHTML = btn.classList.contains("text-main")
        ? '<i class="bi bi-hand-thumbs-up-fill"></i> Liked'
        : '<i class="bi bi-hand-thumbs-up"></i> Like';
    }

    function toggleComment(btn) {
      const box = btn.closest(".post").querySelector(".comment-box");
      if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    }

    function sharePost() {
      alert("Post shared!");
    }

    function timeAgo(date) {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0'); // DD
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[d.getMonth()]; // MMM
        const year = d.getFullYear(); // YYYY

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0'); // MM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // hour '0' should be '12'

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
      }

//copy link
const copyUrl = (articleId) => {
  const url = `${window.location.origin}/assets/pages/homepage/detail.html?id=${articleId}`;
  console.log(url);

  // Try copying to clipboard
  navigator.clipboard.writeText(url)
    .then(() => {
      // Success toast
      showToast("Article link copied!", "success");
    })
    .catch(() => {
      // Fallback toast if copying fails
      showToast("Failed to copy link. Try manually.", "danger");
    })
    .finally(() => {
      // Always runs after success or fail
      console.log("Copy attempted"); // optional debug
    });
};




    // ========== LOAD POSTS ==========
    let currentPage = 1;
    let loading = false;
const loader = document.getElementById("loader");
const random = Math.floor(Math.random() * 90) + 1;
console.log(random);


    function loadMoreArticles() {
      if (loading) return;
      loading = true;
      loader.style.display = "block";

      fetch(`http://blogs.csm.linkpc.net/api/v1/articles?_page=${random}&_per_page=10`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          const container = document.querySelector(".card-insert");
          data.data.items.forEach(article => {
            //console.log(data);
            container.innerHTML += `
            <div class="post shadow-sm py-3 rounded-1 mt-10 bg-white">
              <div class="d-flex gap-2 mb-2">
                <a href="UserProfile.html?id=${article.creator.id}" class="d-flex align-items-center text-decoration-none text-dark">
                  <div style="border: 2px solid #9f28e3; border-radius: 50%; overflow: hidden; padding: 3px;">
                    <img src="${article.creator.avatar || 'assets/default-avatar.png'}" class="rounded-circle" width="45" height="45">
                  </div>
                  <div class="ms-2">
                    <h6 class="mb-0">${article.creator.firstName} ${article.creator.lastName}</h6>
                    <small class="text-muted">${timeAgo(article.createdAt)}</small>
                  </div>
                </a>
              </div>
              <a href="detail.html?id=${article.id}">
                <img src="${article.thumbnail}" class="w-100 post-img mb-2">
              </a>
              <h5>${article.title}</h5>
              <p>${article.description || ""}</p>
              <div class="post-actions d-flex justify-content-around border-top pt-2">
    <button class="btn btn-light" onclick="likePost(this)">
        <i class="bi bi-hand-thumbs-up"></i> Like
    </button>
    <button class="btn btn-light" onclick="toggleComment(this)">
        <i class="bi bi-chat"></i> Comment
    </button>
    <button class="btn btn-light"  onclick="copyUrl(${article.id})">
        <i class="bi bi-share"></i> Share
    </button>
</div>

              <div class="comment-box mt-2" style="display:none;">
                <input class="form-control" placeholder="Write a comment..." />
              </div>
            </div>`;
          });

          currentPage++;
          loading = false;
          loader.style.display = "none";
        })
        .catch(err => {
          console.error(err);
          loading = false;
          loader.style.display = "none";
        });
    }

    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMoreArticles();
      }
    });

loadMoreArticles();

    // ========== PROFILE IMAGE & LOGOUT ==========
const profileImage = document.querySelector('#profile-image');
const baseUrl = 'http://blogs.csm.linkpc.net/api/v1';
const token = localStorage.getItem("token");
if (!token) {
  // No token found → redirect to login
  window.location.href = "../../../index.html"; // adjust path if needed
}
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

    const btnLogout = document.querySelector('#btnLogout');
    btnLogout.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      fetch('http://blogs.csm.linkpc.net/api/v1/auth/logout', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(() => {
          localStorage.removeItem('token');
          location.href = '../../../index.html';
        });
    });
    
