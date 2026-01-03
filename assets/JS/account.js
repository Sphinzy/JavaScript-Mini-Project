
      const token = localStorage.getItem("token");
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwNTYsImlhdCI6MTc2Njc0MTk1NywiZXhwIjoxNzY3MzQ2NzU3fQ.GwlNwexQg-wj5H0WoWoYkRK6OwSROGudP46e2u3eEcE";
    if (!token) {
      // No token found → redirect to login
      window.location.href = "../../../index.html"; // adjust path if needed
    }
      const API_URL = "http://blogs.csm.linkpc.net/api/v1/auth/profile";

      async function fetchUserData() {
        if (!token) {
          document.getElementById("display-name").innerText = "Not Logged In";
          return;
        }

        // Optional: load from cache while fetching
        const cachedUser = localStorage.getItem("user_info");
        if (cachedUser) updateUI(JSON.parse(cachedUser));

        try {
          const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const result = await response.json();
            const user = result.data || result;
            updateUI(user);
            localStorage.setItem("user_info", JSON.stringify(user));
          }
        } catch (error) {
          console.error("Network Error:", error);
        }
      }

      function updateUI(user) {
        if (!user) return;
        const fName = user.firstName || user.first_name || "N/A";
        const lName = user.lastName || user.last_name || "N/A";

        document.getElementById("first-name").innerText = fName;
        document.getElementById("last-name").innerText = lName;
        document.getElementById("email-address").innerText =
          user.email || "N/A";
        document.getElementById("display-name").innerText = `${fName} ${lName}`;

        if (user.avatar || user.profile_image) {
          document.getElementById("profile-img").src =
            user.avatar || user.profile_image;
        }
      }

      function editProfile() {
        window.location.href = "upload_avata.html";
      }

      window.onload = fetchUserData;

      //const token = localStorage.getItem('token');
      const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
const profileImage = document.querySelector('#profile-image');
fetch(`${baseUrl}/auth/profile`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(getImage => {
    console.log(getImage);
    profileImage.src = getImage.data.avatar
  })
      const btnLogout = document.querySelector("#btnLogout");
      btnLogout.addEventListener("click", () => {
        fetch(baseUrl + "/auth/logout", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((resData) => {
            localStorage.removeItem("token");
            return (location.href = "../login/login.html");
            console.log(resData);
          });
      });
      //getImage.setAttribute('src', imageLink);