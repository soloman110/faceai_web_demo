String.prototype.format = function(args)
{
    if (arguments.length > 0)
    {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object")
        {
            for (var key in args)
            {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else
        {
            for (var i = 0; i < arguments.length; i++)
            {
                if (arguments[i] == undefined)
                {
                    return "";
                }
                else
                {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else
    {
        return this;
    }
}

function ajaxProxy(config) {
    $.ajax({
     url: config.url,
     type: config.method ? config.method : 'GET',
     data: config.data,
     dataType: config.dataType ? config.dataType : 'JSON',
     success: function (data) {
        config.successcb ? config.successcb(data) : (function(data, textStatus) {
            alert("success: " + JSON.stringify(data) + "textStatus: " + textStatus);
        }(data))
     },
     error: function (xhr, textStatus, errorThrown) {
         config.errorcb ? config.errorcb(xhr, textStatus, errorThrown) : (function() {
             alert("Error: " + JSON.stringify(xhr));
         }());
     }
 });
}