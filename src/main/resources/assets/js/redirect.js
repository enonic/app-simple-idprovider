function formSubmitted() {
    location.href = CONFIG.redirectUrl;
}

$(".form-login").submit(function (event) {
    formSubmitted();
    event.preventDefault();
});