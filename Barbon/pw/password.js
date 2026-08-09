document.addEventListener("DOMContentLoaded", function () {

    const password = "roxfort";

    const input = document.getElementById("pw-input");
    const button = document.getElementById("pw-button");
    const message = document.getElementById("pw-message");
    const error = document.getElementById("pw-error");

    function checkPassword() {
        if (input.value.toLowerCase().trim() === password) {
            message.style.display = "block";
            error.style.display = "none";
            input.style.display = "none";
            button.style.display = "none";
        } else {
            message.style.display = "none";
            error.style.display = "block";
        }
    }

    button.addEventListener("click", checkPassword);

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkPassword();
        }
    });

});