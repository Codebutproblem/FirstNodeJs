// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    const closeAlertButton = showAlert.querySelector("[close-alert]");
    closeAlertButton.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
