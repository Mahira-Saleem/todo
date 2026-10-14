
const signinForm = document.getElementById("signinForm");
const signinBtn = document.getElementById("signinBtn");
const message = document.getElementById("message");

signinForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    signinBtn.disabled = true;
    message.style.color = "#555";
    message.textContent = "Signing in...";

    try {
        const { data, error } =
            await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) throw error;

        if (data.session) {
            window.location.replace("index.html");
        } else {
            message.style.color = "red";
            message.textContent = "Login failed. Please try again.";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    } finally {
        signinBtn.disabled = false;
    }
});