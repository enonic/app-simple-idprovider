function handleAuthenticateResponse(loginResult) {
    if (loginResult.authenticated) {
        if (loginResult.additionalCode) {
            handleAdditionStep();
        } else {
            handleRedirect();
        }
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

function handleAdditionStep() {
    const codeFormField = $("#inputCode").parent();
    codeFormField.removeClass("hidden");
    codeFormField.remove();
    $("#formSubmit").before(codeFormField);
    $("#inputConfirmation, #inputPassword").parent().remove();
    $(".g-recaptcha, .form-forgot-pwd-link").remove();
    $("#inputUsername").parent().addClass("hidden");
}

function formSubmitted() {
    enableFormSubmit(false);
    const pass = $('#inputPassword');
    const code = $('#inputCode');
    const data = {
        action: 'login',
        user: $("#inputUsername").val(),
    };
    if (pass) {
        data.password = pass.val();
    }
    if (code && code.parent().hasClass('hidden') == false) {
        data.code = code.val();
    }
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

$("#inputUsername, #inputPassword").keyup(function (event) {
    if (event.which !== 13) {
        $("#formMessage").removeClass("form-message-info form-message-error");
        $("#formMessage").addClass("hidden");
    }
});