const apiGetSharedFiles = "https://prod-15.uksouth.logic.azure.com:443/workflows/0c459621d3c74092aef402c266245a03/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=GTgn4-ffi1BLO43zK73oiPBSK6S2utsITtSoHwSfEas";
const apiGetReceivedFiles = "https://prod-28.uksouth.logic.azure.com:443/workflows/530c6146674e496ca1900b78714f7e7c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=eUUtfE4r6RWaMHS90nPQIhKMtcL7t3mNxKLxhO3nfWw";
const apiGetSettings = "https://your-settings-api-endpoint";

// Function to fetch and display shared files
async function loadSharedFiles() {
    const sharedFilesContainer = document.getElementById("shared-files-container");
    sharedFilesContainer.innerHTML = "<p>Loading shared files...</p>";

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email_address) {
            throw new Error("User not logged in.");
        }

        const response = await fetch(`${apiGetSharedFiles}?user_id=${user.email_address}`);

        if (response.status === 200) {
            const files = await response.json();

            if (files.length === 0) {
                sharedFilesContainer.innerHTML = "<p>Nothing here yet :) get sharing!</p>";
                return;
            }

            const fileList = files
                .map((file) => `<li>${file.name} (${file.size} bytes)</li>`)
                .join("");
            sharedFilesContainer.innerHTML = `<ul>${fileList}</ul>`;
        } else {
            sharedFilesContainer.innerHTML = "<p>Nothing here yet :) get sharing!</p>";
        }
    } catch (error) {
        console.error("Error loading shared files:", error);
        sharedFilesContainer.innerHTML = "<p>Error loading shared files. Please try again later.</p>";
    }
}

// Function to fetch and display received files
async function loadReceivedFiles() {
    const receivedFilesContainer = document.getElementById("received-files-container");
    receivedFilesContainer.innerHTML = "<p>Loading received files...</p>";

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email_address) {
            throw new Error("User not logged in.");
        }

        const response = await fetch(`${apiGetReceivedFiles}?user_id=${user.email_address}`);

        if (response.status === 200) {
            const files = await response.json();

            if (files.length === 0) {
                receivedFilesContainer.innerHTML = "<p>Nothing here yet :) get sharing!</p>";
                return;
            }

            const fileList = files
                .map((file) => `<li>${file.name} (${file.size} bytes)</li>`)
                .join("");
            receivedFilesContainer.innerHTML = `<ul>${fileList}</ul>`;
        } else {
            receivedFilesContainer.innerHTML = "<p>Nothing here yet :) get sharing!</p>";
        }
    } catch (error) {
        console.error("Error loading received files:", error);
        receivedFilesContainer.innerHTML = "<p>Error loading received files. Please try again later.</p>";
    }
}

// Tab switching logic
document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");

        // Load files for shared or received tabs
        if (button.dataset.tab === "shared") loadSharedFiles();
        if (button.dataset.tab === "received") loadReceivedFiles();
    });
});

async function loadAccountSettings() {
    const accountInfoContainer = document.getElementById("account-info");
    accountInfoContainer.innerHTML = "<p>Loading account information...</p>";

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email_address) {
            throw new Error("User not logged in.");
        }

        const response = await fetch(`${apiGetSettings}?user_id=${user.email_address}`);
        if (response.status === 200) {
            const data = await response.json();

            accountInfoContainer.innerHTML = `
                <p><strong>Forename:</strong> ${data.forename}</p>
                <p><strong>Surname:</strong> ${data.surname}</p>
                <p><strong>Email:</strong> ${data.email_address}</p>
                <p><strong>Date of Birth:</strong> ${data.date_of_birth}</p>
                <p><strong>Notification Preferences:</strong> ${data.settings.notification_preferences}</p>
                <p><strong>Theme:</strong> ${data.settings.theme}</p>
            `;
        } else {
            accountInfoContainer.innerHTML = "<p>Error loading account information. Please try again later.</p>";
        }
    } catch (error) {
        console.error("Error loading account settings:", error);
        accountInfoContainer.innerHTML = "<p>Error loading account information. Please try again later.</p>";
    }
}

// Load My Account by default
document.addEventListener("DOMContentLoaded", () => {
    loadSharedFiles(); // Preload shared files for the shared tab
    loadReceivedFiles(); // Preload received files for the received tab
    loadAccountSettings();
});
