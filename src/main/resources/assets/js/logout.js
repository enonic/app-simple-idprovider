function formSubmitted() {
    $.get(CONFIG.logoutServiceUrl, function () {
        location.reload();
    });
}

$(".form-login").submit(function (event) {
    formSubmitted();
    event.preventDefault();
});