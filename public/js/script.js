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

// Change Number Product in Cart

const quantityInputs = document.querySelectorAll("input[name='quantity']");
if(quantityInputs.length > 0){
    quantityInputs.forEach(input => {
        input.addEventListener("change",(event)=>{
            const productId = input.getAttribute("product_id");
            const quantity = event.target.value;
            window.location.href = `/cart/update/${quantity}/${productId}`;
        });
    });
}
