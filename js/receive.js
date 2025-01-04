const apiAddRecipient = "https://prod-08.uksouth.logic.azure.com:443/workflows/0d5dc17400aa44d5892cf3020f4b7e2e/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=bnVuLvjNBpwVO_ET2s71fJwZ8pFPajG_Fd8vtRnjAj8";

document.getElementById("receive-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const accessCode = document.getElementById("access-code").value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    // Validate user is logged in
    if (!user || !user.email_address) {
        alert("You must be logged in to submit an access code.");
        window.location.href = "login_register.html";
        return;
    }

    // Validate access code
    if (!/^[A-Za-z0-9]{12}$/.test(accessCode)) {
        alert("Invalid access code. It must be 12 alphanumeric characters.");
        return;
    }

    const payload = {
        access_code: accessCode,
        user_id: user.email_address,
    };

    try {
        const response = await fetch(apiAddRecipient, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.status === 200) {
            document.getElementById("response-message").innerText = "Access code accepted. The file has been added to your received list.";
        } else {
            document.getElementById("response-message").innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
        console.error("Error:", error);
    }
});