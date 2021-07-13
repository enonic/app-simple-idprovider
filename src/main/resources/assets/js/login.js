

$("#inputUsername, #inputPassword").keyup(function (event) {
    if (event.which !== 13) {
        $("#formMessage").removeClass("form-message-info form-message-error");
        $("#formMessage").addClass("hidden");
    }
});

function handleRedirect() {
    if (CONFIG.redirectUrl) {
        location.href = CONFIG.redirectUrl;
    } else {
        location.reload();
    }
}

function handleAuthenticateResponse(body) {
    if (body.login.authenticated) {
        if (body.twoStep) {
            // ask for two step authentication
        } else {
            if (CONFIG.redirectUrl) {
                location.href = CONFIG.redirectUrl;
            } else {
                location.reload();
            }
        }
    } else {
        $("#formMessage").removeClass("hidden form-message-info");
        $("#formMessage").addClass("form-message-error");
        $("#message").text("Login Failed!");
        $("#inputPassword").focus();
    }
}

function showTwoStepAuth() {
    $("#login").remove();
    $("#twoStepAuth").removeClass("hidden");
}

function formSubmitted(action) {
    enableFormSubmit(false);
    var data = {
        action: action ? action : 'login',
        user: $("#inputUsername").val(),
        password: $("#inputPassword").val()
    };
    $.ajax({
        url: CONFIG.loginServiceUrl,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: handleAuthenticateResponse,
        data: JSON.stringify(data)
    }).always(function () {
        enableFormSubmit(true);
    });
}