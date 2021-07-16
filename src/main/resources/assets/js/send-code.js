function handleAuthenticateResponse(loginResult) {
    if (loginResult.authenticated) {
        handleRedirect();
    } else {
        $("#formMessage").removeClass("hidden form-message-info");
        $("#formMessage").addClass("form-message-error");
        $("#message").text("Login Failed!");
        $("#inputPassword").focus();
    }
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
    const code = $("#inputCode");
    const storrageData = window.sessionStorage;
    const data = {
        action: "code",
        user: storrageData.getItem("simple-id-user"),
        userToken: storrageData.getItem("simple-id-token"),
        code: code.val()
    };
    $.ajax({
        url: CONFIG.loginServiceUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: handleAuthenticateResponse,
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
