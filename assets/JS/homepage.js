function likePost(btn) {
    btn.classList.toggle("text-primary");
    btn.innerHTML = btn.classList.contains("text-primary")
        ? '<i class="fa-solid fa-thumbs-up"></i> Liked'
        : '<i class="fa-regular fa-thumbs-up"></i> Like';
}

function toggleComment(btn) {
    const commentBox = btn.closest(".row").querySelector(".comment-box");
    commentBox.style.display =
        commentBox.style.display === "none" ? "block" : "none";
}

function sharePost() {
    alert("Post shared!");
}
//Convert ISO date time
function timeAgo(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diff = Math.floor((now - postDate) / 1000);

    if (diff < 60) {
        return "just now";
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + "minutes ago";
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + "hour ago";
    } else if (diff < 604800) {
        return Math.floor(diff / 86400) + "days ago";
    } else {
        return postDate.toLocaleDateString();
    }
}

let currentPage = 1;
let loading = false;
const loader = document.getElementById("loader");

window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading
    ) {
        loadMoreArticles();
    }
});
function loadMoreArticles() {
    loading = true;
    currentPage++;
    loader.style.display = "block";
}
fetch(
    "http://blogs.csm.linkpc.net/api/v1/articles?search=&_page=1&_per_page=100"
)
    .then((res) => res.json())
    .then((resData) => {
        console.log(resData);
        const items = resData.data.items;
        let html = "";
        for (let i = 0; i < items.length; i++) {
            let article = items[i];

            html += `
        <div class="post-wrapper bg-white rounded-3 shadow-sm p-3 mb-4">
            <div class="row mb-4">

                    <div class="col-auto py-4">
                        <div style="border: 2px solid #7645bf; border-radius: 50%; ">
                            <img src="${article.creator.avatar}"
                                style="width: 50px; height: 50px;  padding: 3px"
                                class="rounded-circle object-fit-cover"
                                alt="avatar" />
                        </div>
                    </div>

                    <div class="col py-4">
                        <div class="content w-100 h-100">

                            <div class="title mb-2">
                                <h6 class="mb-0">
                                    ${article.creator.firstName} ${article.creator.lastName}
                                </h6>
                                <small class="text-muted">15 minutes ago</small>
                            </div>

                            <div class="card shadow-sm">
                                <div class="card-body p-0">

                                    <img src="${article.thumbnail}"
                                        class="card-img-top w-100 object-fit-cover"
                                        style="height: 300px"
                                        alt="thumbnail" />

                                    <h5 class="px-3 pt-3 clamp-1">
                                        ${article.title}
                                    </h5>

                                    <p class="px-3 pb-3 clamp-3">
                                        ${article.content}
                                    </p>
                                </div>

                                <div class="card-footer bg-white">
                                    <div class="post-actions d-flex justify-content-around">

                                        <button class="btn btn-light action-btn"
                                            onclick="likePost(this)">
                                            <i class="fa-regular fa-thumbs-up"></i> Like
                                        </button>

                                        <button class="btn btn-light action-btn"
                                            onclick="toggleComment(this)">
                                            <i class="fa-regular fa-comment"></i> Comment
                                        </button>

                                        <button class="btn btn-light action-btn"
                                            onclick="sharePost()">
                                            <i class="fa-solid fa-share"></i> Share
                                        </button>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                                </div>
    `;
        }

        document.querySelector(".card-insert").innerHTML += html;
        loader.style.display = "none";
        loading = false;
    });
/*.catch((err) => {
    console.error(err);
    loader.style.display = "none";
    loading = false;
});*/
