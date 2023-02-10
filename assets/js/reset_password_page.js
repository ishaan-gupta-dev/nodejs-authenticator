var passwordInput = document.getElementById('password-input');
var confirmPasswordInput = document.getElementById('confirm-password-input');
function validatePassword() { // validates password and shows error accordingly
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;
    console.log("password = ", password);
    console.log("confirm password = ", confirmPassword);
    if (password.length > 0 && password.length < 8) { // if password length < 8
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        document.getElementById("password-empty").style.display = "none";
        document.getElementById("confirm-password-empty").style.display = "none";
        document.getElementById("password-mismatch").style.display = "none";
        document.getElementById("password-length-invalid").style.display = "block";
        passwordInput.setAttribute("aria-describedby", "password-length-invalid");
        passwordInput.classList.add("is-invalid");
        confirmPasswordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        confirmPasswordInput.classList.remove("is-valid");
        return false;
    }
    if (password !== confirmPassword) { // if password and confirm password dont match
        confirmPasswordInput.value = "";
        document.getElementById("password-empty").style.display = "none";
        document.getElementById("confirm-password-empty").style.display = "none";
        document.getElementById("password-length-invalid").style.display = "none";
        document.getElementById("password-mismatch").style.display = "block";
        passwordInput.setAttribute("aria-describedby", "password-mismatch");
        passwordInput.classList.add("is-invalid");
        confirmPasswordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        confirmPasswordInput.classList.remove("is-valid");
        return false;
    } else if (password == confirmPassword) {
        document.getElementById("password-mismatch").style.display = "none";
        passwordInput.classList.add("is-valid");
        confirmPasswordInput.classList.add("is-valid");
        passwordInput.classList.remove("is-invalid");
        confirmPasswordInput.classList.remove("is-invalid");
        return true;
    }

}

//------------ form validation ------------//
(() => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity() || !validatePassword()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})();