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