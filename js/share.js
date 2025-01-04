const apiShareMedia = "https://prod-14.uksouth.logic.azure.com:443/workflows/2fe681ef91344b8ca9fdf028e3511da2/triggers/When_a_Media_Upload_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_Media_Upload_HTTP_request_is_received%2Frun&sv=1.0&sig=PJ-iOv1KbJCAOI-SBt0T-mub_9XivUT05rhKD_r2Wmo";

const fileInput = document.getElementById("file");
const fileDetailsContainer = document.getElementById("file-details");

// Utility function to determine type from MIME
function getFileType(mimeType) {
    const type = mimeType.split("/")[0];
    switch (type) {
        case "text":
            return "text";
        case "audio":
            return "audio";
        case "video":
            return "video";
        case "application":
            return "compressed"; // Assume "application" type is compressed (e.g., .zip)
        default:
            return "unknown";
    }
}

// Display file details when a file is selected
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
        fileDetailsContainer.innerHTML = ""; // Clear details if no file is selected
        return;
    }

    const fileSize = file.size + " bytes"; // File size in bytes
    const mimeType = file.type || "Unknown type";
    const format = `.${file.name.split(".").pop()}`; // Extract file extension
    const type = getFileType(mimeType);

    fileDetailsContainer.innerHTML = `
        <p><strong>File Type:</strong> ${type}</p>
        <p><strong>File Format:</strong> ${format}</p>
        <p><strong>File Size:</strong> ${fileSize}</p>
    `;
});

// Share form submission
document.getElementById("share-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Retrieved User:", user);

    const file = fileInput.files[0];
    if (!file) {
        document.getElementById("response-message").innerText = "Please select a file.";
        return;
    }

    const fileSize = file.size; // File size in bytes
    const mimeType = file.type; // e.g., "video/mp4", "audio/mp3"
    const format = `.${file.name.split(".").pop()}`; // File extension (e.g., ".mp4")
    const type = getFileType(mimeType); // e.g., "video", "audio", "text"
    const expiryDate = document.getElementById("expiry-date").value || null;

    const base64File = await fileToBase64(file);

    const payload = {
        user_id: user.email_address,
        media_type: type,
        format: format,
        file_size: fileSize,
        expiry_date: expiryDate,
        file: base64File,
    };

    try {
        const response = await fetch(apiShareMedia, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.status === 200) {
            const accessCodeContainer = document.getElementById("access-code-container");
            accessCodeContainer.classList.remove("hidden");
            accessCodeContainer.innerHTML = `
                <p>Your access code: <strong>${data.access_code}</strong></p>
                <p>Share this code with your friends to give them access to the file.</p>
            `;
            document.getElementById("response-message").innerText = "File shared successfully!";
        } else {
            document.getElementById("response-message").innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
    }
});

// Helper function to convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
