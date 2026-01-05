// ------------------- Toast Helper -------------------
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('toastMsg');
    toastEl.querySelector('.toast-body').textContent = message;

    // Set color based on type
    toastEl.classList.remove('bg-cus-success', 'bg-cus-danger', 'bg-warning',);
    if (type === 'success') toastEl.classList.add('bg-cus-success',);
    else if (type === 'error') toastEl.classList.add('bg-cus-danger',);
    else if (type === 'warning') toastEl.classList.add('bg-warning');

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}
// Create light mode favicon
const lightFavicon = document.createElement("link");
lightFavicon.rel = "icon";
lightFavicon.type = "image/png";
lightFavicon.href = "../../img/logo-team.png";
lightFavicon.media = "(prefers-color-scheme: light)";
document.head.appendChild(lightFavicon);