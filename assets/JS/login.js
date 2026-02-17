<<<<<<< HEAD
const loginform = document.getElementById("loginform");
const email = document.getElementById("email");
const password = document.getElementById("password");
const erremail = document.getElementById("erremail");
const errpassword = document.getElementById("errpassword");
const eyeIcon = document.getElementById("eyeIcon");
const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
// ------------------- Toast Helper -------------------
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('toastMsg');
    toastEl.querySelector('.toast-body').textContent = message;

    // Set color based on type
    toastEl.classList.remove('bg-cus-success', 'bg-cus-danger', 'bg-warning',);
    if (type === 'success') toastEl.classList.add('bg-cus-danger',);
    else if (type === 'error') toastEl.classList.add('bg-cus-success',);
    else if (type === 'warning') toastEl.classList.add('bg-warning');

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}
// ------------------- INPUT HELPERS -------------------
const showError = (input) => {
    input.classList.add("input-error");
    input.classList.remove("input-normal");
};

const clearError = (input) => {
    input.classList.remove("input-error");
    input.classList.add("input-normal");
};


loginform.addEventListener("submit", function (event) {
    event.preventDefault();

    fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (!data.result) {
                showToast("Invali email or password!");
                showError(email);
                showError(password);
            } else {
                showToast("Category created successfully!");
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("getImage", data.data.user.avatar);
                window.location.href = "assets/pages/homepage/home.html";
            }
        });
});
email.addEventListener("input", () => clearError(email, erremail));
password.addEventListener("input", () => clearError(password, errpassword));
function togglePassword() {
    if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bi-eye-slash", "bi-eye");
    } else {
        password.type = "password";
        eyeIcon.classList.replace("bi-eye", "bi-eye-slash");
    }
=======
const loginform = document.getElementById("loginform");
const email = document.getElementById("email");
const password = document.getElementById("password");
const erremail = document.getElementById("erremail");
const errpassword = document.getElementById("errpassword");
const eyeIcon = document.getElementById("eyeIcon");
const baseUrl = "https://blogs.csm.linkpc.net/api/v1";
// ------------------- Toast Helper -------------------
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('toastMsg');
    toastEl.querySelector('.toast-body').textContent = message;

    // Set color based on type
    toastEl.classList.remove('bg-cus-success', 'bg-cus-danger', 'bg-warning',);
    if (type === 'success') toastEl.classList.add('bg-cus-danger',);
    else if (type === 'error') toastEl.classList.add('bg-cus-success',);
    else if (type === 'warning') toastEl.classList.add('bg-warning');

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}
// ------------------- INPUT HELPERS -------------------a
const showError = (input) => {
    input.classList.add("input-error");
    input.classList.remove("input-normal");
};

const clearError = (input) => {
    input.classList.remove("input-error");
    input.classList.add("input-normal");
};


loginform.addEventListener("submit", function (event) {
    event.preventDefault();

    fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (!data.result) {
                showToast("Invali email or password!");
                showError(email);
                showError(password);
            } else {
                showToast("Category created successfully!");
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("getImage", data.data.user.avatar);
                window.location.href = "assets/pages/homepage/home.html";
            }
        });
});
email.addEventListener("input", () => clearError(email, erremail));
password.addEventListener("input", () => clearError(password, errpassword));
function togglePassword() {
    if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bi-eye-slash", "bi-eye");
    } else {
        password.type = "password";
        eyeIcon.classList.replace("bi-eye", "bi-eye-slash");
    }
>>>>>>> 412edea423607463a26f30d1630c484b4f06ae63
}