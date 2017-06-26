
var ajax_mob = {
    login: function (key1, key2) {
        $.post(url + "logMovil", {
            key1: key1,
            key2: key2
        }, function (response) {
            if (response.indexOf("incorrecto") > -1) {
                var err = "ajax login error: " + response;
                console.log(err);
                $("#log").text(err);
                localStorage.removeItem("Gusuario");
                $.post(url + "logout");
                return;
            }

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
        });
    }
}
