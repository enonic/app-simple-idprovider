function handleAuthenticateResponse(loginResult) {
    location.href = CONFIG.redirectUrl;
}

function formSubmitted() {
    var data = {
        action: 'send',
        email: $("#inputUsername").val()
    };
    $.ajax({
        url: CONFIG.sendTokenUrl,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: handleAuthenticateResponse,
        data: JSON.stringify(data)
    });
}