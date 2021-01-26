/*! bootstrap-FileUpload - v0.7.0 */ 
;(function(i, e, g, o) {
    "use strict";
    var v = {}, // element 속성
    t = {}, //파일 타입
    s = {
        init: function(e) {
            return v[i(this).attr("id")] = { //속성 초기화
                options: i.extend({}, i.fn.bootstrapFileUpload.defaults, e || {}),
                wrapper: null,
                form: null,
                btnBar: null,
                btnWrapper: null,
                btnAdd: null,
                btnStart: null,
                btnCancel: null,
                btnReset: null,
                overallProgressBar: null,
                overallStatus: null,
                filePreviewTable: null,
                formData: null,
                arrayFiles: {},
                arrayLength: 0
            },
             this.each(function() {
                console.log(this,"EEEEE");
                ! function(e) { //e === id
                    v[e].wrapper = i("#" + e),
                    t.archives = ["zip", "7z", "gz", "gzip", "rar", "tar"],
                    t.audio = ["mp3", "wav", "wma", "wpl", "aac", "flac", "m4a", "m4b", "m4p", "midi", "ogg"],
                    t.files = ["doc", "docx", "dotx", "docm", "ods", "odt", "ott", "ods", "pdf", "ppt", "pptm", "pptx", "pub", "rtf", "csv", "log", "txt", "xls", "xlsm", "xlsx"],
                    t.images = ["bmp", "tif", "tiff", "gif", "jpeg", "jpg", "png", "svg", "ico", "raw"],
                    t.video = ["avi", "flv", "swf", "m4v", "mkv", "mov", "mp4", "ogv", "wmv"],
                    a = e,
                    i.each(v[a].options.fileTypes, function(e, o) {
                        i.isNumeric(e) ? v[a].options.fileTypes[o] = t[o] : !i.isNumeric(e) && i.isEmptyObject(o) && (v[a].options.fileTypes[e] = t[e])
                    }),
                    !0 !== v[e].options.debug && !1 !== v[e].options.debug && (v[e].options.debug = !1);

                    var a;
                    if ("function" != typeof i().emulateTransitionEnd)
                        return l(e, "bootstrap");
                    //FontAwesome를 사용하는 경우
                    if (!0 === v[e].options.showThumb && !0 === v[e].options.useFontAwesome) {
                        if (!i("link[href*='fontawesome']").length && !i("link[href*='font-awesome']").length)
                            return l(e, "fontAwesome");
                        if (!1 === function(e) {
                            var o, a;
                            if (o = i('<span class="fa" style="display:none"></span>').appendTo("body"), a = o.css("fontFamily"), o.remove(), "FontAwesome" === a)
                                v[e].options.fontAwesomeVer = 4;
                            else {
                                if (-1 === a.indexOf("Font Awesome 5")) return !1;
                                v[e].options.fontAwesomeVer = 5
                            }
                            return !0
                        }(e)) return l(e, "fontAwesomeVersion")
                    }
                    //form 생성======================================
                    v[o = e].formData = new FormData,
                    v[o].form = i('<form action="' + v[o].options.url + '" method="' + v[o].options.formMethod + '" enctype="multipart/form-data"></form>'),
                    v[o].btnBar = i('<div class="row fileupload-buttonbar"></div>'),

                    //Buttons====================================start
                    //v[o].btnWrapper = i('<div class="col-lg-7"></div>'), //container that contains btnAdd, btnReset, btnStart, btnCancel
                     // col-lg-7를 삭제했음. skm
                     v[o].btnWrapper = i('<div></div>'), //container that contains btnAdd, btnReset, btnStart, btnCancel
                     v[o].btnAdd = i(
                        '<div class="btn btn-success fileupload-add">'+
                            '<input type="file" ' + (!0 === v[o].options.multiFile ? 'multiple="multiple"' : void 0) + 'multiple />'+
                            '<i class="glyphicon glyphicon-plus"></i>&nbsp;Add&hellip;'+
                        '</div>'
                    ),
                    v[o].btnReset = i(
                        '<button type="reset" class="btn btn-primary fileupload-reset">'+
                            '<i class="glyphicon glyphicon-repeat"></i>&nbsp;Add More&hellip;'+
                        '</button>'
                    ),
                    v[o].btnStart = i('<button class="btn btn-warning fileupload-start"><i class="glyphicon glyphicon-upload"></i>&nbsp;<span>Upload</span></button>'),
                    v[o].btnCancel = i('<button type="reset" class="btn btn-danger fileupload-cancel"><i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Cancel</span></button>'),
                    //Buttons======================================end

                    v[o].overallProgressBar = i(
                        '<div class="col-lg-5 fileupload-overall-progress">'+
                            '<div class="progress">'+
                                '<div class="progress-bar progress-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>'+
                            '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>'+
                            '<div class="progress-extended">&nbsp;</div>'+
                        '</div></div>'
                    ),
                    //업로드 성공여부를 표시하는 overallStatus
                    v[o].overallStatus = i(
                        '<div class="row fileupload-overall-status">'+
                            '<div class="col-lg-12">'+
                                '<div class="alert alert-success"><strong>Uploaded Successfully!</strong></div>'+
                                '<div class="alert alert-danger"></div>'+
                            '</div>'+
                        '</div>'
                    ),
                    //files preview
                    v[o].filePreviewTable = i(
                        '<table role="presentation" class="table table-striped fileupload-preview">'+
                            '<tbody class="files"></tbody>'+
                        '</table>'
                    ),
                    //btnWrapper에 add, reset, start, cancel버튼을 추가한다.
                    v[o].btnWrapper.append(v[o].btnAdd, v[o].btnReset, v[o].btnStart, v[o].btnCancel),
                    //btnBar에 btnWrapper에 및 overallProgressBar 를 추가한다.
                    v[o].btnBar.append(v[o].btnWrapper, v[o].overallProgressBar),
                    ////업로드 성공여부를 표시하는 overallStatus 및 buttons, progress-bar를 form에 추가


                    //skm이 다음코드를 주석처리함
                    //v[o].form.append(v[o].btnBar, v[o].overallStatus),
                    v[o].form.append(v[o].btnBar),
                    v[o].wrapper.append(v[o].form, v[o].filePreviewTable),

                    //button event 등록
                    v[o].btnAdd.on("change", "input", function(e) {
                        s.addFile(o, e)
                    }),
                    v[o].btnReset.on("click", function(e) {
                        e.preventDefault(), s.resetUpload(o)
                    }),
                    v[o].btnStart.on("click", function(e) {
                        e.preventDefault(), s.uploadStart(o)
                    }),
                    v[o].btnCancel.on("click", function() {
                        s.resetUpload(o)
                    }),
                    v[o].filePreviewTable.on("click", ".fileupload-remove", function() {
                        s.removeFile(o, i(this).val())
                    })
                    //form 생성====================================== end
                    var o;
                    "function" == typeof v[e].options.onInit && v[e].options.onInit.call(this,e)
                }(i(this).attr("id"))
            })
        },
        addFile: function(e, o) {
            var a, t, 
            s = o.target.files, 
            l = s.length; //업로드할 파일 갯수
            //maxFiles를 초화하면, maxFiles만큼 처리할 것
            !0 === v[e].options.multiFile && v[e].options.maxFiles && l > v[e].options.maxFiles && 
            (
                g.alert("You're trying to upload " + l + " files and only " + v[e].options.maxFiles + " files is currently supported! The system will only upload what is supported and you will have to upload again."), 
                l = v[e].options.maxFiles
            ), 
            v[e].filePreviewTable.detach();

            for (var i = 0; i < l; i++) {
                var n, r, p, d, c, f, u;
                if (n = "file-" + i, 
                    c = (d = s[i]).size / 1024 / 1024, 
                    a = d.size, 
                    void 0, 
                    t = 0 === a ? 0 : Math.floor(Math.log(a) / Math.log(1024)), 
                    //file size 포맷
                    f = 1 * (a / Math.pow(1024, t)).toFixed(2) + " " + ["B", "KB", "MB", "GB", "TB"][t], 
                    !1 !== h(e, r = d.name.split(".").pop().toLowerCase())
                )//if start=======================================================  
                    //파일 사이즈 체크 maxSize
                    if (p = w(e, r), c.toFixed(2) > v[e].options.maxSize) 
                        g.alert('The file size for "' + d.name + '" is too large! Maximum supported file size is ' + v[e].options.maxSize + "MB and the size of the file is " + f);
                    else if (v[e].arrayFiles && 0 <= y(e, d)) 
                        g.alert('The file "' + d.name + '" is already in queue!');
                    else {
                        v[e].arrayFiles[n] = d, v[e].arrayLength = ++v[e].arrayLength, 
                        v[e].btnStart.fadeIn("slow", "linear"), 
                        v[e].btnCancel.fadeIn("slow", "linear");
                        
                        var b = 
                        '<div class="progress fileupload-progress">'+
                            '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>'+
                            '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>'+
                            '<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>'+
                        '</div>'+
                        '<div class="alert alert-success"><strong>Uploaded Successfully!</strong></div>'+
                        '<div class="alert alert-danger"></div>';
                        if (!0 === v[e].options.showThumb) {
                            var m = F(e, d, p, r);
                            u = !1 === v[e].options.multiUpload //multiUpload == false
                                ? 
                                '<tr class="fileupload-previewrow thumb row" id="' + n + '">' + 
                                    '<td class="col-lg-1">' + m + '</td>'+
                                    '<td class="col-lg-4">' + d.name + '</td>'+
                                    '<td class="col-lg-1">' + f + '</td>'+
                                    '<td class="col-lg-5">' + b + '</td>'+
                                    '<td class="col-lg-1">'+
                                        '<button class="btn btn-danger fileupload-remove" value="' + n + '">'+
                                            '<i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove</span>'+
                                        '</button>'+
                                    '</td>'+
                                '</tr>'
                                : 
                                '<tr class="fileupload-previewrow thumb row" id="' + n + '">' + 
                                    '<td class="col-lg-1">' + m + '</td>'+
                                    '<td class="col-lg-8">' + d.name + '</td>'+
                                    '<td class="col-lg-1">' + f + '</td>'+
                                    '<td class="col-lg-2">'+
                                        '<button class="btn btn-danger fileupload-remove" value="' + n + '">'+
                                            '<i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove</span>'+
                                        '</button>'+
                                    '</td>'+
                                '</tr>'
                        } else 
                            u = !1 === v[e].options.multiUpload 
                                ? 
                                    '<tr class="fileupload-previewrow no-thumb row" id="' + n + '">' + 
                                    '<td class="col-lg-5">' + d.name + '</td>' + 
                                    '<td class="col-lg-1">' + f + '</td>'+
                                        '<td class="col-lg-5">' + b + '</td>' + 
                                        '<td class="col-lg-1">'+
                                            '<button class="btn btn-danger fileupload-remove" value="' + n + '"> ' + 
                                                '<i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove</span>'+
                                            '</button>' + 
                                        '</td>'+
                                    '</tr>' 
                                : 
                                    '<tr class="fileupload-previewrow no-thumb row" id="' + n + '">'+
                                        '<td class="col-lg-9">' + d.name + '</td>'+
                                        '<td class="col-lg-1">' + f + '</td>'+
                                        '<td class="col-lg-2">'+
                                            '<button class="btn btn-danger fileupload-remove" value="' + n + '">'+
                                                '<i class="glyphicon glyphicon-ban-circle"></i>&nbsp;<span>Remove</span>'+
                                            '</button>' + 
                                        '</td>'+
                                    '</tr>';
                        
                        v[e].filePreviewTable.append(u)
                    }
                //if end======================================================= 
                else 
                    g.alert('The file "' + d.name + '" is not a supported filetype!')
            }
            v[e].wrapper.append(v[e].filePreviewTable), 
            v[e].filePreviewTable.fadeIn("slow", "linear"), 
            "function" == typeof v[e].options.onFileAdded && v[e].options.onFileAdded.call(this,e)
        },
        uploadStart: function(a) {
            console.log("aaa: ", a),
            i(".fileupload-add, .fileupload-start, .fileupload-cancel, .fileupload-remove").attr("disabled", "disabled"), 
            v[a].options.hiddenInput && i.each(v[a].options.hiddenInput, function(e, o) {
                v[a].formData.append(e, o)
            }),
            !1 === v[a].options.multiUpload 
            
            ?
            i.each(v[a].arrayFiles, function(e, o) {
                    v[a].formData.append(v[a].options.inputName, o), 
                    i("#" + e + " .fileupload-progress .progress-bar-striped").fadeIn("slow", "linear"), 
                    r(a, e), 
                    "function" == typeof v[a].options.onUploadProgress && v[a].options.onUploadProgress.call(this)
            })
            :
            (
                console.log("arrayFiles: ", v[a].arrayFiles),
                v[a].overallProgressBar.fadeIn("slow", "linear"), 
                i.each(v[a].arrayFiles, function(e, o) {
                    v[a].formData.append(v[a].options.inputName + "[]", o);
                }),
                console.log("v[a].formData: ", v[a].formData.getAll(v[a].options.inputName + "[]"), "v[a].options.inputName: ", v[a].options.inputName),
                 r(a, "")
            ), 
            v[a].btnAdd.fadeOut("slow", "linear"),
            v[a].btnStart.fadeOut("slow", "linear"),
            v[a].btnCancel.fadeOut("slow", "linear"), 
            v[a].btnReset.delay(600).fadeIn("slow", "linear"), 
            "function" == typeof v[a].options.onUploadComplete && v[a].options.onUploadComplete.call(this)
        },
        removeFile: function(e, o) {
            v[e].arrayLength <= 1 ? s.resetUpload(e) : (i("#" + o).fadeOut("slow", "linear"), i("#" + o + " .alert").fadeOut("slow", "linear"), i("#" + o).remove(), delete v[e].arrayFiles[o], v[e].arrayLength = --v[e].arrayLength), "function" == typeof v[e].options.onFileRemoved && v[e].options.onFileRemoved.call(this)
        },
        resetUpload: function(e) {
            v[e].filePreviewTable.find("tbody").empty(), v[e].form[0].reset(), v[e].arrayFiles = {}, v[e].arrayLength = 0, v[e].filePreviewTable.fadeOut("slow", "linear"), v[e].btnStart.fadeOut("slow", "linear"), v[e].btnCancel.fadeOut("slow", "linear"), i(".fileupload-previewrow .alert").fadeOut("slow", "linear"), i(".fileupload-add, .fileupload-start, .fileupload-cancel").removeAttr("disabled"), i(".fileupload-add").delay(800).fadeIn("slow", "linear"), v[e].overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 0).css("width", "0%"), v[e].overallProgressBar.fadeOut("slow", "linear"), v[e].btnReset.fadeOut("slow", "linear"), "function" == typeof v[e].options.onUploadReset && v[e].options.onUploadReset.call(this)
        }
    };

    function l(e, o) {
        var a, t = i('<div class="alert alert-danger" role="alert"></div>');
        switch (o) {
            case "method":
                a = "The passed method " + name + " is not a valid method. Please check the configuration.";
                break;
            case "fontAwesome":
                a = "The Font Awesome CSS is not available within the head of the website and is a required unless the option showThumb is set to false.";
                break;
            case "fontAwesomeVersion":
                a = "The Font Awesome version could not be detected. Please set manually with the fontAwesomeVer option.";
                break;
            case "url":
                a = "The URL provided in the configuration is not a valid URL.";
                break;
            case "fallbackUrl":
                a = "The Fallback URL provided in the configuration is not a valid URL.";
                break;
            case "formMethod":
                a = "The Form Method provided in the configuration is not a valid, please choose either get or post in the configuration.";
                break;
            case "bootstrap":
                a = "The Twitter Bootstrap API is not available on the current page. Please check to make sure all the dependencies are in place.";
                break;
            default:
                a = "An unknown error occured."
        }
        !1 === v[e].options.debug && g.console && g.console.error ? g.console.error(a) : !0 === v[e].options.debug && (t.append(a), v[e].wrapper.append(t))
    }

    function n(e) {
        return /((http(s)?|ftp(s)?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(e)
    }

    function h(e, a) {
        var t = !1;
        return i.each(v[e].options.fileTypes, function(e, o) {
            if (0 <= i.inArray(a, o)) 
                return !(t = !0)
        }), t
    }

    function w(e, a) {
        var t;
        return i.each(v[e].options.fileTypes, function(e, o) {
            if (0 <= i.inArray(a, o)) 
                return t = e, !1
        }), t
    }

    function y(e, o) {
        var a = [];
        return i.each(v[e].arrayFiles, function(e, o) {
            a.push(o.name)
        }), i.inArray(o.name, a)
    }

    function F(e, o, a, t) {
        var s;
        switch (a) {
            case "archives":
                s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "far fa-file-archive" : "fa fa-file-archive-o") + ' fa-5x"></i>' : "";
                break;
            case "audio":
                s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "far fa-file-audio" : "fa fa-file-audio-o") + ' fa-5x"></i>' : "";
                break;
            case "files":
                switch (t) {
                    case "doc":
                    case "docx":
                    case "dotx":
                    case "docm":
                        s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file-word" : "fa fa-file-word-o") + ' fa-5x"></i>' : "";
                        break;
                    case "ppt":
                    case "pptm":
                    case "pptx":
                        s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file-powerpoint" : "fa fa-file-powerpoint-o") + ' fa-5x"></i>' : "";
                        break;
                    case "pdf":
                        s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file-pdf" : "fa fa-file-pdf-o") + ' fa-5x"></i>' : "";
                        break;
                    case "xls":
                    case "csv":
                    case "xlsm":
                    case "xlsx":
                        s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file-excel" : "fa fa-file-excel-o") + ' fa-5x"></i>' : "";
                        break;
                    default:
                        s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file" : "fa fa-file-o") + ' fa-5x"></i>' : ""
                }
                break;
            case "images":
                s = '<img src="' + URL.createObjectURL(o) + '" alt="' + o.name + '" width="' + v[e].options.thumbWidth + 'px" height="' + v[e].options.thumbHeight + 'px" class="fileupload-previewimg" />';
                break;
            case "video":
                s = !0 === v[e].options.useFontAwesome && !1 !== v[e].options.fontAwesomeVer ? '<i class="' + (5 <= v[e].options.fontAwesomeVer ? "fas fa-file-video" : "fa fa-file-video-o") + ' fa-5x"></i>' : ""
        }
        return s
    }
    //remote by ajax
    function r(s, l) {
        console.log("fffffff: ", v[s].formData.getAll(v[s].options.inputName + "[]"), "v[s].options.inputName: ", v[s].options.inputName),
        i.ajax({
            url: v[s].options.url,
            type: 'POST',
            //data: JSON.stringify({content: v[s].formData}),
            data: v[s].formData,
            dataType: 'JSON',
            cache: !1,
            contentType: false,
            processData: false,
            accepts: "json",
            success: function(e, o, a) {
                var t = e.match("{.*:{.*:.*}}") ? JSON.parse(e) : "";
                t.error || !e.match("{.*:{.*:.*}}") ? 
                    (
                        !1 === v[s].options.multiUpload 
                        ? 
                        (
                            i("#" + l + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                            i("#" + l + " .fileupload-progress .progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%"), 
                            i("#" + l + " .alert-danger").fadeIn("slow", "linear").html("<strong>Error:</strong><br />" + t.error)
                        ) 
                        : 
                        (
                            v[s].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                            v[s].overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%"), 
                            v[s].overallStatus.fadeIn("slow", "linear"), 
                            v[s].overallStatus.find(".alert-danger").fadeIn("slow", "linear").html("<strong>Error:</strong><br />" + t.error)
                        ), 
                        "function" == typeof v[s].options.onUploadError && v[s].options.onUploadError.call(this)
                    ) 
                    : 
                    (
                        !1 === v[s].options.multiUpload 
                        ? 
                        (
                            i("#" + l + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                            i("#" + l + " .fileupload-progress .progress-bar-success").attr("aria-valuenow", 100).css("width", "100%"), 
                            i("#" + l + " .alert-success").fadeIn("slow", "linear")
                        )
                        : 
                            (v[s].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                            v[s].overallProgressBar.find(".progress-bar-success").attr("aria-valuenow", 100).css("width", "100%"), 
                            v[s].overallStatus.fadeIn("slow", "linear"), 
                            v[s].overallStatus.find(".alert-success").fadeIn("slow", "linear")
                        ), 
                        "function" == typeof v[s].options.onUploadSuccess && v[s].options.onUploadSuccess.call(this)
                    )
            },
            error: function(e, o, a) {
                alert('error');
                !1 === v[s].options.multiUpload 
                    ? 
                    (
                        i("#" + l + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                        i("#" + l + " .fileupload-progress .progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%"), 
                        i("#" + l + " .alert-danger").fadeIn("slow", "linear").html(o + ": " + a.message)
                    ) 
                    : 
                    (
                        v[s].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", 0).css("width", "0%"), 
                        v[s].overallProgressBar.find(".progress-bar-danger").attr("aria-valuenow", 100).css("width", "100%"), 
                        v[s].overallStatus.fadeIn("slow", "linear"), 
                        v[s].overallStatus.find(".alert-danger").fadeIn("slow", "linear").html(o + ": " + a.message)
                    ), 
                    "function" == typeof v[s].options.onUploadError && v[s].options.onUploadError.call(this)
            },
            xhr: function() {
                var e = i.ajaxSettings.xhr();
                return e.upload && e.upload.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        var o = e.loaded / e.total;
                        !1 === v[s].options.multiUpload 
                        ? 
                            i("#" + l + " .fileupload-progress .progress-bar-striped").attr("aria-valuenow", Math.round(100 * o)).css("width", Math.round(100 * o) + "%") 
                        : 
                            v[s].overallProgressBar.find(".progress-bar-striped").attr("aria-valuenow", Math.round(100 * o)).css("width", Math.round(100 * o) + "%"), 
                            "function" == typeof v[s].options.onUploadProgress && v[s].options.onUploadProgress.call(this)
                    }
                }), e
            }
        })
    }
    //e는 options다.
    i.bootstrapFileUpload = i.fn.bootstrapFileUpload = function(e) {
        if (s[e]) 
            return s[e].apply(this, Array.prototype.slice.call(arguments, 1));
        "object" != typeof e && e 
            ? g.console.error("The passed method " + e + " is not a valid method. Please check the configuration.") 
            : s.init.apply(this, arguments)
    }, i.fn.bootstrapFileUpload.defaults = {
        url: null,
        fallbackUrl: null,
        formMethod: "post",
        multiFile: !0,
        multiUpload: !1,
        inputName: "files",
        hiddenInput: null,
        forceFallback: !1,  // to check
        maxSize: 5,         //초대 사이즈 5M
        maxFiles: null,     //업로드 갯수
        showThumb: !0,      //이미지 미리 보기여부
        useFontAwesome: !1,
        fontAwesomeVer: !1,
        thumbWidth: 80,
        thumbHeight: 80,
        fileTypes: {
            archives: [],
            audio: [],
            files: [],
            images: [],
            video: []
        },
        debug: !1,
        onInit: function() {},
        onFileAdded: function() {},
        onFileRemoved: function() {},
        onFileCancel: function() {},
        onFileProcessing: function() {},
        onUploadProgress: function() {},
        onUploadError: function() {},
        onUploadSuccess: function() {},
        onUploadComplete: function() {},
        onUploadReset: function() {},
        onfilePreview: function() {}
    }
}(jQuery, document, window));