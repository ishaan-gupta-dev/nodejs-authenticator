//------------ shows email id does not exist error ------------//
var emailInvalidDiv = document.getElementById("email-invalid");
var emailInvalid = document.getElementById("email-invalid").textContent.trim();
if (emailInvalid == "Email ID does not exist") {
    emailInvalidDiv.style.display = "block";
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