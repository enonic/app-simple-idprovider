function handleAuthenticateResponse() {
    location.href = CONFIG.idProviderUrl;
}

function formSubmitted() {
    var data = {
        password: $("#inputPassword").val(),
        token: CONFIG.token
    };
    $.ajax({
        url: CONFIG.idProviderUrl,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: handleAuthenticateResponse,
        data: JSON.stringify(data)
    });
}

$(".form-login").submit(function (event) {
    formSubmitted();
    event.preventDefault();
});