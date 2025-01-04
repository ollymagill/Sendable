const apiRegisterUser = "https://prod-03.uksouth.logic.azure.com:443/workflows/099bcb30df3d48c284df818ebe074af7/triggers/When_a_Register_User_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_Register_User_HTTP_request_is_received%2Frun&sv=1.0&sig=TKjzRIu2VEbLMENmZ0QDaqI-QeMKIM4cLaznmdbsnFo";
const apiLoginUser = "https://prod-13.uksouth.logic.azure.com:443/workflows/b760430639084779ab24989835dc4660/triggers/When_a_Login_User_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_Login_User_HTTP_request_is_received%2Frun&sv=1.0&sig=_wcGye87TWR6S9nUdubjxuP1dCKqcTqF2BvzW_sUfNM";

// Save token in localStorage
function saveToken(token) {
    localStorage.setItem("authToken", token);
}

// Clear token from localStorage
function clearToken() {
    localStorage.removeItem("authToken");
}

// Check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

// Login handler
async function login(emailAddress, password) {
    const response = await fetch(apiLoginUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: emailAddress, password }),
    });

    if (response.status === 200) {
        const data = await response.json();
        console.log("Login successful, user data:", data.user);

        // Save login state and user data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));

        return "Login successful!";
    } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        throw new Error(errorData.message || "Login failed");
    }
}

// Registration handler
async function register(forename, surname, dateOfBirth, emailAddress, password) {
    const response = await fetch(apiRegisterUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            forename,
            surname,
            date_of_birth: dateOfBirth,
            email_address: emailAddress,
            password,
        }),
    });

    const data = await response.json();
    console.log("Registration response:", data);

    if (response.status === 200 && data.success) {
        return data.message || "Registration successful!";
    } else {
        console.error("Registration failed:", data);
        throw new Error(data.message || "Registration failed");
    }
}

// Logout handler
function logout() {
    console.log("Logging out...");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    alert("You have been logged out.");
    window.location.href = "login_register.html"; // Redirect to login/register page
}

// Update UI based on login state
function updateAuthUI() {
    const loginRegisterButton = document.getElementById("login-register-button");
    const logoutButton = document.getElementById("logout-button");
    const myAccountLink = document.getElementById("my-account-link");
    const shareLink = document.getElementById("share-link");
    const receiveLink = document.getElementById("receive-link");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Auth State: ", { isLoggedIn, user });

    if (isLoggedIn && user) {
        if (loginRegisterButton) loginRegisterButton.classList.add("hidden");
        if (logoutButton) logoutButton.classList.remove("hidden");
        if (myAccountLink) myAccountLink.classList.remove("hidden");
        if (shareLink) shareLink.classList.remove("hidden");
        if (receiveLink) receiveLink.classList.remove("hidden");
        console.log(`Welcome back, ${user.forename || "User"}!`);
    } else {
        if (loginRegisterButton) loginRegisterButton.classList.remove("hidden");
        if (logoutButton) logoutButton.classList.add("hidden");
        if (myAccountLink) myAccountLink.classList.add("hidden");
        if (shareLink) shareLink.classList.add("hidden");
        if (receiveLink) receiveLink.classList.add("hidden");
    }
}

// Protect pages that require login
function protectPage() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("Protect Page Check - Is Logged In:", isLoggedIn);

    if (!isLoggedIn) {
        alert("You must be logged in to access this page.");
        window.location.href = "login_register.html";
    }
}

// Initialize event listeners for login, registration, and logout
function initAuthHandlers() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const logoutButton = document.getElementById("logout-button");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const emailAddress = document.getElementById("email-address").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const responseMessage = await login(emailAddress, password);
                alert(responseMessage);
                window.location.href = "my_account.html"; // Redirect to My Account page
            } catch (error) {
                console.error("Login Error:", error);
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const forename = document.getElementById("forename").value.trim();
            const surname = document.getElementById("surname").value.trim();
            const dateOfBirth = document.getElementById("date-of-birth").value.trim();
            const emailAddress = document.getElementById("reg-email-address").value.trim();
            const password = document.getElementById("reg-password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return;
            }

            try {
                const responseMessage = await register(forename, surname, dateOfBirth, emailAddress, password);
                alert(responseMessage);
                window.location.href = "login_register.html"; // Redirect to login page
            } catch (error) {
                console.error("Registration Error:", error);
                alert(error.message);
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
}

// Initialize auth logic on page load
document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    initAuthHandlers();
});
