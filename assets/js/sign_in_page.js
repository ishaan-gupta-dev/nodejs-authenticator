
//------------ shows email not registered error ------------//
var emailInvalidDiv = document.getElementById("email-invalid");
var emailInvalid = document.getElementById("email-invalid").textContent.trim();
if (emailInvalid == "Email ID not registered!") {
  emailInvalidDiv.style.display = "block";
}


//------------ shows incorrect password error ------------//
var passwordInvalidDiv = document.getElementById("password-invalid");
var passwordInvalid = document.getElementById("password-invalid").textContent.trim();
if (passwordInvalid == "Incorrect Password!") {
  console.log("working!")
  passwordInvalidDiv.style.display = "block";
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