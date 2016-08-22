function handleAuthenticateResponse() {
    location.href = CONFIG.idProviderUrl;
}

function formSubmitted() {
    var data = {
        action: 'update',
        token: CONFIG.token,
        password: $("#inputUsername").val()
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