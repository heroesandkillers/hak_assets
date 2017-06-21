
var ajax_mob = {
    login: function (key1, key2) {
        $.ajax({
            type: "POST",
            url: url + "logMovil",
            data: {
                key1: key1,
                key2: key2
            },
            success: function (response) {
                $("#log").text("ajax login success");
                loadLoginResponse(response, key1, key2);

                localStorage.setItem("Gusuario", key1);
                localStorage.setItem("Gpass", key2);

                if (window.Android) {
                    try {
                        $("#log").text("setting shared preferences");
                        Android.setPref("usuario", key1);
                        Android.setPref("pass", key2);
                    } catch (e) {
                        confirmacion("error: shared preferences are disabled");
                    }
                }
                load();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#log").text("ajax login error: " + thrownError);
            }
        });
    }
}
