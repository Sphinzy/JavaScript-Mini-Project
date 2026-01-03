/* ================= CONFIG ================= */
const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
const token = localStorage.getItem("token");
if (!token) {
    // No token found → redirect to login
    window.location.href = "../../../index.html"; // adjust path if needed
}

/* ================= BACK LINK ================= */
const backLink = document.querySelector("a.text-decoration-none");
if (backLink) backLink.href = "getown.html";

/* ================= QUILL ================= */
const quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write Content here ..."
});

/* ================= FILE INPUT ================= */
const fileInput = document.getElementById("thumbnail");
const fileNameDisplay = document.getElementById("fileName");

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
        fileNameDisplay.classList.remove("text-muted");
    }
});

/* ================= FETCH CATEGORIES ================= */
const categorySelect = document.getElementById("category");

function getCategories() {
    fetch(`${baseUrl}/categories?_page=1&_per_page=50&sortBy=name&sortDir=ASC`)
        .then(res => res.json())
        .then(resData => {
            categorySelect.innerHTML =
                `<option value="" disabled selected>Select category</option>`;

            resData.data.items.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(err => console.error("Category error:", err));
}

document.addEventListener("DOMContentLoaded", getCategories);

/* ================= FORM SUBMIT ================= */
const form = document.getElementById("articleForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.querySelector("[name='title']").value.trim();
    const categoryId = categorySelect.value;
    const content = quill.root.innerHTML;

    if (!title || !categoryId || quill.getLength() <= 1 || fileInput.files.length === 0) {
        alert("Please fill all fields");
        return;
    }

    try {
        /* ========== 1️ CREATE ARTICLE (JSON) ========== */
        const createRes = await fetch(`${baseUrl}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title,
                content,
                categoryId: Number(categoryId)
            })
        });

        const createData = await createRes.json();
        console.log("Create article:", createData);

        if (!createData.result) {
            alert(createData.message || "Create article failed");
            return;
        }

        const articleId = createData.data.id;

        /* ==========  UPLOAD THUMBNAIL (FORMDATA) ========== */
        const formData = new FormData();
        formData.append("thumbnail", fileInput.files[0]);

        const uploadRes = await fetch(`${baseUrl}/articles/${articleId}/thumbnail`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        const uploadData = await uploadRes.json();
        console.log("Upload thumbnail:", uploadData);

        if (!uploadData.result) {
            alert(uploadData.message || "Thumbnail upload failed");
            return;
        }

        /* ========== SUCCESS ========== */
        location.href = "getown.html";

    } catch (err) {
        console.error("Publish error:", err);
        alert("Something went wrong");
    }
});

/* ================= PROFILE IMAGE ================= */
const imageLink = localStorage.getItem("getImage");
const profileImage = document.querySelector("#profile-image");

if (profileImage && imageLink) {
    profileImage.src = imageLink;
}

/* ================= LOGOUT ================= */
const btnLogout = document.querySelector("#btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        fetch(`${baseUrl}/auth/logout`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).finally(() => {
            localStorage.removeItem("token");
            location.href = "../login/login.html";
        });
    });
}