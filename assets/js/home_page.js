var hidden = document.getElementById("hidden").textContent.trim(); // this code, just refreshes the page once so that it goes to normal
if (hidden == 'logout') {
    setTimeout(() => {
        document.getElementById('logo').click();
    }, "1000")
}