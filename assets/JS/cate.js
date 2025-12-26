const baseUrl = 'http://blogs.csm.linkpc.net/api/v1';
let pageNumUrl = 1;
const pageSearch = document.querySelector('#pageSearch');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5OSwiaWF0IjoxNzY2NTk3OTE1LCJleHAiOjE3NjcyMDI3MTV9.6YAyFCIpmIttS1WTp18ljpLdZoRFqLdELJEBn9poG8s';
let searchValue = '';
let selectedCateId = null;

// ------------------- Pagination -------------------
function changePage(page) {
    pageNumUrl = page;
    getData();
}
function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Previous button
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    pagination.innerHTML += `
        <button class="btn btn-sub-main mx-1 ${prevDisabled}" onclick="changePage(${currentPage - 1})">Prev</button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button 
                class="btn btn-sub-main mx-1 ${i === currentPage ? 'active' : ''}" 
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    pagination.innerHTML += `
        <button class="btn btn-sub-main mx-1 ${nextDisabled}" onclick="changePage(${currentPage + 1})">Next</button>
    `;
}

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

// ------------------- Fetch & Render -------------------
const getData = () => {
    const searchParam = encodeURIComponent(searchValue);

    fetch(`${baseUrl}/categories?_page=${pageNumUrl}&_per_page=10&sortBy=name&sortDir=ASC&search=${searchParam}`)
        .then(res => res.json())
        .then(resData => {
            // console.log(resData.data.items[0].id);
            renderTable(resData.data.items);

            const totalPages = resData.data.meta.totalPages;
            const currentPage = resData.data.meta.currentPage;

            renderPagination(totalPages, currentPage);
        })
        .catch(err => console.error("Error fetching categories:", err));
};

const renderTable = (items) => {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (!items || items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center">No categories found</td></tr>`;
        return;
    }
    for (i = 0; i < items.length; i++){
        tbody.innerHTML += `
            <tr>
                <td>${items[i].name}</td>
                <td class="iconTable">
                    
                    <button class="btn"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil-square text-main pe-1 fs-5" onclick="btnEditCate(${items[i].id})"></i></button>
                    <button class="btn"  data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bi bi-trash text-danger ps-1 fs-5" onclick="setDeleteCate(${items[i].id})"></i></button>
                </td>
            </tr>
            
        `;
        
    }
};

// ------------------- Create Category -------------------
const btnCreateCate = () => {
    const cateInp = document.querySelector('#cateInp');

    if (!cateInp.value.trim()) {
        alert("Category name is required");
        return;
    }

    fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: cateInp.value.trim() })
    })
        .then(res => res.json())
        .then(data => {
            if (data.result === false) {
                alert(data.message);
                return;
            }
            console.log(data);
            cateInp.value = "";

            // close modal
            const modalEl = document.getElementById("exampleModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // reload categories
            getData();
        })
        .catch(err => console.error("Error creating category:", err));
};

const setDeleteCate = (cateId) => {
    selectedCateId = cateId;
};

// ------------------- Delete -------------------

const btnDeleteCate = () => {
    if (!selectedCateId) return;

    fetch(`${baseUrl}/categories/${selectedCateId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(() => {
            // close modal
            const modalEl = document.getElementById("deleteModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            selectedCateId = null;
            getData();
        })
        .catch(err => console.error(err));
};

// ------------------- Edit category -------------------

const btnEditCate = (cateId) => {
    let editInp = document.querySelector('#editInp');
    fetch(`${baseUrl}/categories/${cateId}`)
    .then(res => res.json())
        .then(resEditCate => {
            console.log(resEditCate);
            editInp.value = resEditCate.data.name;
            const saveBtn = document.querySelector('#btnSaveCate');
            saveBtn.onclick = () => btnSaveCate(cateId);
    })
}
// ------------------- Save category -------------------

const btnSaveCate = (cateId) => {
    let editInp = document.querySelector('#editInp');
    if (!editInp.value.trim()) {
        alert("Category name is required");
        return;
    }

    fetch(`${baseUrl}/categories/${cateId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: editInp.value.trim() })
    })
        .then(res => res.json())
        .then(resSaveCate => {
            console.log(resSaveCate);
            // close modal
            const modalEl = document.getElementById("editModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            // reload categories
            getData();
        })
}


// ------------------- Initial Load -------------------
getData();
