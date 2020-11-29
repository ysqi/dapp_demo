var logger = {

    _html: function (msg, args) {
        var t = "<span class='time'>" + new Date().toLocaleTimeString() + "</span>";
        var txt = (typeof args != "undefined" ? args.toString() : "");
        if (txt == "[object Object]") {
            txt = JSON.stringify(args, "", 2);
        }
        return $("<div>" + t + msg + "\t" + txt + "</div>");
    },
    _append: function (cls, msg, args) {
        $(".infoPanel").prepend(logger._html(msg, args).addClass(cls));
    },
    error: function (msg, args) {
        this._append("error", msg, args);
    },
    info: function (msg, args) {
        this._append("", msg, args);
    },
    html: function (msg, args) {
        return logger._html(msg, args);
    }
}


export default logger;