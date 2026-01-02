const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
const token = localStorage.getItem("token");

// DOM elements
const articleTableBody = document.getElementById("articleTableBody");
const titleInput = document.querySelector("#inpTitle");
const categorySelect = document.getElementById("category");
const contentError = document.getElementById("contentError");
const editModalEl = document.getElementById("editModal");
let quill;
let editArticleId;


//date
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
// ======================= FETCH ARTICLES =======================
function fetchMyArticles() {
    fetch(`${baseUrl}/articles/own?_page=1&_per_page=10`, {
        headers: { Authorization: "Bearer " + token },
    })
        .then((res) => res.json())
        .then((result) => {
            const articles = result.data.items;
            articleTableBody.innerHTML = "";

            articles.forEach((art) => {
                console.log(art);
                const thumb = art.thumbnail
                    ? art.thumbnail
                    : "https://via.placeholder.com/55x40?text=No+Img";
                const catName = art.category ? art.category.name : "Uncategorized";

                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td><img src="${thumb}" class="thumbnail-img shadow-sm"></td>
          <td class="fw-bold text-dark">${art.title}</td>
          <td><span class="badge badge-category">${catName}</span></td>
          <td class="text-muted small">${timeAgo(art.createdAt)}</td>
          <td class="text-center">
            <button class="btn btn-sm text-main" onclick='btnEditCate(${art.id})'>
              <i class="bi bi-pencil-square fs-5"></i>
            </button>
            <i class="bi bi-trash text-danger action-icon mx-2" onclick="deleteArticle(${art.id
                    })"></i>
          </td>
        `;
                articleTableBody.appendChild(tr);
            });
        })
        .catch((err) => console.error("Error fetching data:", err));
}

// ======================= DELETE ARTICLE =======================
let deleteId;
function deleteArticle(id) {
    deleteId = id;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", async () => {
        try {
            const res = await fetch(`${baseUrl}/articles/${deleteId}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            });
            if (res.ok) {
                bootstrap.Modal.getInstance(
                    document.getElementById("deleteModal")
                ).hide();
                fetchMyArticles();
            }
        } catch (err) {
            console.error(err);
        }
    });

// ======================= LOGOUT =======================
const profileImage = document.querySelector("#profile-image");
const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", () => {
    fetch(baseUrl + "/auth/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(() => {
            localStorage.removeItem("token");
            location.href = "../login/login.html";
        });
});

// Set profile image
fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
})
    .then((res) => res.json())
    .then((data) => {
        profileImage.src = data.data.avatar || "https://via.placeholder.com/40";
    });

// ======================= QUILL INIT =======================
const initQuill = () => {
    if (!quill) {
        quill = new Quill("#editor", {
            theme: "snow",
            placeholder: "Write your content here...",
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                ],
            },
        });
    }
};

// ======================= FETCH CATEGORIES =======================
function getCategories(selectedId = null) {
    fetch(`${baseUrl}/categories?_page=1&_per_page=50&sortBy=name&sortDir=ASC`)
        .then((res) => res.json())
        .then((resData) => {
            categorySelect.innerHTML =
                '<option value="" disabled>Select category</option>';
            resData.data.items.forEach((cat) => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                if (cat.id === selectedId) option.selected = true;
                categorySelect.appendChild(option);
            });
        })
        .catch((err) => console.error("Category error:", err));
}

/// ======================= EDIT ARTICLE =======================
const btnEditCate = (articleId) => {
    editArticleId = articleId;
    console.log("Editing article:", editArticleId);

    fetch(`${baseUrl}/articles/${articleId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(resData => {
            const article = resData.data;

            initQuill();

            // Set old data
            titleInput.value = article.title;
            quill.root.innerHTML = article.content || "";

            getCategories(article.category?.id);

            // Show modal
            new bootstrap.Modal(editModalEl).show();
            //paramter
            const saveBtn = document.querySelector('#btnSaveCate');
            saveBtn.onclick = () => btnSaveCate(editModalEl);
            // Attach save
            document.querySelector('#btnSaveCate').onclick = btnSaveCate;
        })
        .catch(err => console.error("Edit article error:", err));
};



// ======================= SAVE ARTICLE =======================
const btnSaveCate = (editModalEl) => {
    // const editModal = new bootstrap.Modal(editModalEl);
    if (!titleInput.value.trim()) {
        alert("Title is required");
        return;
    }

    if (!quill.getText().trim()) {
        alert("Content cannot be empty");
        return;
    }

    const bodyData = {
        title: titleInput.value.trim(),
        content: quill.root.innerHTML,
        categoryId: Number(categorySelect.value)
    };

    fetch(`${baseUrl}/articles/${editArticleId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
    })
        .then(res => {
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        })
        .then(saveData => {

            // Close modal
            bootstrap.Modal.getOrCreateInstance(document.querySelector('#editModal')).hide();

            console.log(saveData);
            // Refresh list
            fetchMyArticles();
                    
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
};



// ======================= INITIAL LOAD =======================
document.addEventListener("DOMContentLoaded", fetchMyArticles);
