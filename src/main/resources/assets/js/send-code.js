function handleAuthenticateResponse(loginResult) {
    if (loginResult.authenticated) {
        handleRedirect();
    } else {
        showError();
    }
}

function showError(error) {
    $("#formMessage").removeClass("hidden form-message-info");
    $("#formMessage").addClass("form-message-error");
    $("#message").text("Login Failed!");
    $("#inputPassword").focus();
    console.log(error);
}

function handleRedirect() {
    if (CONFIG.redirectUrl) {
        location.href = CONFIG.redirectUrl;
    } else {
        location.reload();
    }
}

function formSubmitted() {
    enableFormSubmit(false);
    const data = {
        action: "code",
        user: sessionStorage.getItem("simple-id-user"),
        userToken: sessionStorage.getItem("simple-id-token"),
        code: $("#inputCode").val()
    };
    $.ajax({
        url: CONFIG.loginServiceUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: handleAuthenticateResponse,
        error: showError,
        data: JSON.stringify(data),
    }).always(function () {
        enableFormSubmit(true);
    });
}

$("#inputUsername, #inputPassword").keyup(function (event) {
    if (event.which !== 13) {
        $("#formMessage").removeClass("form-message-info form-message-error");
        $("#formMessage").addClass("hidden");
    }
});
