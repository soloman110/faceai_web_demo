(function($) {
    var options = {
        allowedFormats: [ "jpg", "jpeg", "png", "gif" ],
        maxFileSizeKb: 2048,
        onchange: function(el){

        },
        onremove: function(el) {

        }
    };

    $.fn.imgupload = function(givenOptions) {
        if (this.filter("div").hasClass("imgupload")) {
            options = $.extend(options, givenOptions);

            var $fileTab = this.find(".file-tab");
            $fileTab.find(".btn:eq(0)").change(function() {
                options.onchange($(this));
                $(this).blur();
                selectImageFile($(this));
            });
            //remove하는 버튼 클릭 시...
            $fileTab.find(".btn:eq(1)").click(function() {
                options.onremove($(this));
                $(this).blur();
                removeImageFile($(this));
            });
        }
        return this;
    };

    function getHtmlErrorMessage(message) {
        var html = [];
        html.push("<div class='alert alert-danger alert-dismissible'>");
        html.push("<button type='button' class='close' data-dismiss='alert'>");
        html.push("<span>&times;</span>");
        html.push("</button>" + message);
        html.push("</div>");
        return html.join("");
    }

    function getHtmlImage(src) {
        return "<img src='" + src + "' alt='Image preview' class='img-thumbnail'>";
    }

    function selectImageFile($button) {
        var $input = $button.find("input"); //<input type="file">
        var $fileTab = $button.closest(".file-tab");
        
        // Remove errors and previous image.
        $fileTab.find(".alert").remove();
        $fileTab.find("img").remove(); // image를 지운다..

        var hasFile = $input[0].files && $input[0].files[0];
        if (!hasFile) {
            return;
        }

        var file = $input[0].files[0];
        var fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        if ($.inArray(fileExtension, options.allowedFormats) > -1) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $fileTab.append(getHtmlImage(e.target.result));
            };
            reader.onerror = function(e) {
                $input.val("");
                $fileTab.append(getHtmlErrorMessage("Error loading image."));
            };
            reader.readAsDataURL(file);

            // Change submit button text to 'change' and show remove button.
            $button.find("span").text("Change");
            $fileTab.find(".btn:eq(1)").css("display", "inline-block");
        }
        else {
            $input.val("");
            $fileTab.append(getHtmlErrorMessage("Image format is not allowed."));
        }
    }

    function removeImageFile($button) {
        var $fileTab = $button.closest(".file-tab");
        $fileTab.find(".alert").remove();
        $fileTab.find(".btn span").text("Browse");
        $fileTab.find("input").val("");
        $fileTab.find("img").remove();
        $button.hide();
    }
}(jQuery));
