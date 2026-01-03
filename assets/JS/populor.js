const popularContainer = document.getElementById("popularCategories");
const nums = 4;
const fetchPopularCategories = () => {
    fetch(`${baseUrl}/categories?_page=1&_per_page=${nums}&sortBy=name&sortDir=ASC`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(resData => {
            renderPopularCategories(resData.data.items);
        })
        .catch(err => console.error(err));
};
const renderPopularCategories = (categories) => {
    popularContainer.innerHTML = "";

    categories.forEach(cat => {
        popularContainer.innerHTML += `
            <a href="../category/cate.html" class="btn btn-outline-main rounded-pill m-1">
                #${cat.name}
            </a>
        `;
    });
};
fetchPopularCategories();
