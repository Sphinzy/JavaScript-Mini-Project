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
    const diff = Math.floor((now - postDate) / 1000)

    if (diff < 60) {
        return "just now";
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + "minutes ago";
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + "hour ago";
    } else if (diff < 604800) {
        return Math.floor(diff / 86400) + "days ago"
    } else {
        return postDate.toLocaleDateString();
    }
}

let currentPage = 1;
let loading = false;
const loader = document.getElementById("loader");

window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
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
fetch('http://blogs.csm.linkpc.net/api/v1/articles?search=&_page=1&_per_page=100')
    .then((res) => res.json())
    .then((resData) => {
        console.log(resData);
        const items = resData.data.items;
        let html = "";
        items.forEach((article) => {
            html += `
                            <div class="col-1 py-3">
                                <img src="https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"
                                    style="width: 50px" class="rounded-circle" alt="" />
                            </div>
                            <div class="col-11 py-3">
                                <div class="content w-100 h-100">
                                    <div class="title">
                                        <h5 class="ps-3">Chum Satsya</h5>
                                        <p class="ps-3" style="font-size: 12px">15 minutes ago</p>
                                    </div>
                                    <div class="card shadow-sm">
                                        <div class="card-body p-0">
                                            <img src="https://i.pinimg.com/1200x/d1/35/56/d13556ec053cffc2410a682ee33436d6.jpg"
                                                class="card-img-top w-100 object-fit-cover"
                                                style="height: 300px" alt="" />
                                            <h4 class="ps-2 py-2 clamp-1">Title</h4>
                                            <p class="p-2 clamp-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati magni qui quisquam dolores exercitationem error libero, vitae quos ea! Earum illum pariatur deserunt esse dignissimos repudiandae porro rem recusandae harum.</p>
                                        </div>
                                        <div class="card-footer">
                                            <div class="post-actions d-flex justify-content-around">
                                                <button class="btn btn-light action-btn" onclick="likePost(this)">
                                                    <i class="fa-regular fa-thumbs-up"></i> Like
                                                </button>

                                                <button class="btn btn-light action-btn" onclick="toggleComment(this)">
                                                    <i class="fa-regular fa-comment"></i> Comment
                                                </button>

                                                <button class="btn btn-light action-btn" onclick="sharePost()">
                                                    <i class="fa-solid fa-share"></i> Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                `;
        });

        /*document.querySelector(".card-insert").innerHTML += html;
        loader.style.display = "none";
        loading = false;*/
    })
/*.catch((err) => {
    console.error(err);
    loader.style.display = "none";
    loading = false;
});*/