
const baseUrl = 'http://blogs.csm.linkpc.net/api/v1';
let pageNumUrl = 1;
let searchValue = '';
let selectedCateId = null;
const token = localStorage.getItem('token');

const pageSearch = document.querySelector('#pageSearch');

// ------------------- Fetch Data -------------------
const getData = () => {
    const searchParam = encodeURIComponent(searchValue);
    fetch(`${baseUrl}/categories?_page=${pageNumUrl}&_per_page=10&sortBy=name&sortDir=ASC&search=${searchParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(resData => {
            renderTable(resData.data.items);
            renderPagination(resData.data.meta.totalPages, resData.data.meta.currentPage);
        })
        .catch(err => console.error(err));
};

// ------------------- Render Table -------------------
const renderTable = (items) => {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';
    if (!items || items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" class="text-center">No categories found</td></tr>`;
        return;
    }

    for (let i = 0; i < items.length; i++) {
        tbody.innerHTML += `
            <tr>
                <td>${items[i].name}</td>
                <td class="iconTable">
                    <button class="btn" data-bs-toggle="modal" data-bs-target="#editModal">
                        <i class="bi bi-pencil-square text-main pe-1 fs-5" onclick="btnEditCate(${items[i].id})"></i>
                    </button>
                    <button class="btn" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <i class="bi bi-trash text-danger ps-1 fs-5" onclick="setDeleteCate(${items[i].id})"></i>
                    </button>
                </td>
            </tr>
        `;
    }
};

// ------------------- Pagination -------------------
const renderPagination = (totalPages, currentPage) => {
    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';

    // Prev button
    pagination.innerHTML += `
        <button 
            class="btn btn-main mx-1"
            ${currentPage === 1 ? 'disabled' : ''}
            onclick="changePage(${currentPage - 1})">
            Prev
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;

        pagination.innerHTML += `
            <button 
                class="btn btn-main mx-1 ${isActive ? 'active' : ''}"
                ${isActive ? 'disabled' : ''}
                ${!isActive ? `onclick="changePage(${i})"` : ''}>
                ${i}
            </button>
        `;
    }

    // Next button
    pagination.innerHTML += `
        <button 
            class="btn btn-main mx-1"
            ${currentPage === totalPages ? 'disabled' : ''}
            onclick="changePage(${currentPage + 1})">
            Next
        </button>
    `;
};


function changePage(page) {
    if (page < 1) page = 1;
    pageNumUrl = page;
    getData();
}

// ------------------- Search -------------------
pageSearch.addEventListener('input', () => {
    searchValue = pageSearch.value.trim();
    pageNumUrl = 1;
    getData();
});

// ------------------- Create -------------------
const btnCreateCate = () => {
    const cateInp = document.querySelector('#cateInp');
    if (!cateInp.value.trim()) return alert("Category name is required");

    fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: cateInp.value.trim() })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.result) return alert(data.message);
            cateInp.value = '';
            bootstrap.Modal.getOrCreateInstance(document.querySelector('#exampleModal')).hide();
            getData();
        });
};

// ------------------- Delete -------------------
const setDeleteCate = (cateId) => selectedCateId = cateId;

const btnDeleteCate = () => {
    if (!selectedCateId) return;

    fetch(`${baseUrl}/categories/${selectedCateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(() => {
            bootstrap.Modal.getOrCreateInstance(document.querySelector('#deleteModal')).hide();
            selectedCateId = null;
            getData();
        });
};

// ------------------- Edit & Save -------------------
const btnEditCate = (cateId) => {
    const editInp = document.querySelector('#editInp');
    fetch(`${baseUrl}/categories/${cateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            editInp.value = data.data.name;
            const saveBtn = document.querySelector('#btnSaveCate');
            saveBtn.onclick = () => btnSaveCate(cateId);
        });
};

const btnSaveCate = (cateId) => {
    const editInp = document.querySelector('#editInp');
    if (!editInp.value.trim()) return alert("Category name is required");

    fetch(`${baseUrl}/categories/${cateId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: editInp.value.trim() })
    })
        .then(res => res.json())
        .then(() => {
            bootstrap.Modal.getOrCreateInstance(document.querySelector('#editModal')).hide();
            getData();
        });
};

// ------------------- Logout & Profile -------------------
const btnLogout = document.querySelector('#btnLogout');
const profileImage = document.querySelector('#profile-image');
const imageLink = localStorage.getItem('getImage');
if (profileImage && imageLink) profileImage.src = imageLink;

btnLogout.addEventListener('click', () => {
    fetch(`${baseUrl}/auth/logout`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(() => {
            localStorage.removeItem('token');
            location.href = '../login/login.html';
        });
});

// ------------------- Initial Load -------------------
getData();