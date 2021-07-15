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

console.log("Code page render");

function formSubmitted() {
    enableFormSubmit(false);
    const code = $("#inputCode");
    const storrageData = window.sessionStorage.get("simple-id");
    const data = {
        action: "code",
        user: storrageData.user,
        userToken: storrageData.userToken,
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
