
const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    signupBtn.disabled = true;
    message.style.color = "#555";
    message.textContent = "Creating your account...";

    try {
        const { data, error } =
            await window.supabaseClient.auth.signUp({
                email,
                password
            });

        if (error) throw error;

        if (data.session) {
            window.location.replace("index.html");
        } else {
            message.style.color = "green";
            message.textContent =
                "Account created! Please check your email to confirm your account, then sign in.";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    } finally {
        signupBtn.disabled = false;
    }
});