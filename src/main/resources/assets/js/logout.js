function formSubmitted() {
    $.get(CONFIG.logoutServiceUrl, function () {
        location.href = CONFIG.redirectUrl;
    });
}

$(".form-login").submit(function (event) {
    formSubmitted();
    event.preventDefault();
});