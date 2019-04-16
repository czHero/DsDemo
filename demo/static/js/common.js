/**
 * Created by cc on 2017/3/28.
 */

function ajax(settings) {
    var defaultSetting = {
        type: "POST",
        dataType: "json",
        success: function (data) {
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader('X-CSRFtoken', $.cookie("csrftoken"))
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    };

    $.extend(defaultSetting, settings);

    $.ajax({
        type: defaultSetting.type,
        url: defaultSetting.url,
        data: defaultSetting.data,
        success: function (data) {
            if (data.error != null) {
                defaultSetting.error(data);
            } else {
                defaultSetting.success(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (defaultSetting.error) {
                defaultSetting.error(XMLHttpRequest, textStatus, errorThrown);
            } else {
                console.log(XMLHttpRequest);
                alert('系统调用出错，错误编号:' + XMLHttpRequest.status);
            }
        },
        beforeSend: function (XMLHttpRequest) {
            defaultSetting.beforeSend(XMLHttpRequest);
        },
        complete: function (XMLHttpRequest, textStatus) {
            defaultSetting.complete(XMLHttpRequest, textStatus);
        },
        dataType: defaultSetting.dataType
    });
}


function getColumns(datatableId, settings) {
    var settingId = [];
    if (settings) {
        $.each(settings, function (index, val) {
            settingId.push(val.target)
        });
    }
    var columns = new Array();

    $(datatableId + " thead th").each(function (idx, val) {
        if ($.inArray(idx, settingId) === -1) {
            if ($(val).attr("data"))
                columns[idx] = {"title": $(val).attr("title"), "data": $(val).attr("data")};
            else
                columns[idx] = {"title": $(val).attr("title"), "data": null};
        } else {
            $.each(settingId, function (index, defsVal) {
                if (idx === defsVal) {
                    columns[idx] = settings[index];
                }
            })
        }


    });

    return columns;
}

function getColumnDefs(datatableId, settings) {
    var settingId = [];
    if (settings) {
        $.each(settings, function (index, val) {
            settingId.push(val.targets)
        });
    }

    var defs = new Array();

    $(datatableId + " thead th").each(function (idx, val) {
        if ($.inArray(idx, settingId) === -1) {
            var def = {};
            //visible
            if ($(val).attr("visible") === "false")
                def["visible"] = false;

            //target
            def["targets"] = idx;

            //render
            if ($(val).html() !== "") {
                var str = $(val).html();
                str = str.replace(/\"/g, "\'");
                str = str.replace(/data/g, "\" + data + \"");
                str = str.replace(/\n/g, "");
                var code = 'def["render"] = function(data, type, row){return "' + str + '";}';
                eval(code);
            }

            //class
            if ($(val).attr("class"))
                def["className"] = $(val).attr("class");

            //width
            if ($(val).attr("width"))
                def["width"] = $(val).attr("width");

            //orderable
            if ($(val).attr("orderable") === "false")
                def["orderable"] = false;

            defs[idx] = def;
        } else {
            $.each(settingId, function (index, defsVal) {
                if (idx === defsVal) {
                    defs[idx] = settings[index];
                }
            })
        }
    });
    return defs;
}

/*初始化dataTable控件*/
function initDataTable(id, settings) {
    var defSettings = {
        "dom": 'tr<"bottom"lpi><"clear">',
        "bRetrieve": true,
        "processing": true,
        "order": [],
        "type": "POST",
        columns: getColumns(id, settings.columns),
        columnDefs: getColumnDefs(id, settings.columnDefs),
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        language: {
            "lengthMenu": "每页 _MENU_ 条记录 ",
            "zeroRecords": "没有找到记录",
            "info": "&nbsp;&nbsp;第 _PAGE_ 页 ( 总共 _PAGES_ 页, 共 _TOTAL_ 项)",
            "infoEmpty": "无记录",
            "loadingRecords": "正在加载数据...",
            "processing": "请等待...",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "search": "搜索:",
            paginate: {
                first: '首页',
                previous: '上一页',
                next: '下一页',
                last: '尾页'
            },
            aria: {
                paginate: {
                    first: 'First',
                    previous: 'Previous',
                    next: 'Next',
                    last: 'Last'
                }
            }
        }
    };

    if (settings.fontAllSelect) {
        dataTableSelectAll(settings.dataTableName, id)
    }

    delete settings.columnDefs;
    delete settings.columns;
    delete settings.fontAllSelect;
    delete settings.dataTableName;
    $.extend(defSettings, settings);

    var table = $(id).DataTable(defSettings);


    return table;
}

function dataTableSelectAll(dataTableName, id) {
    $(id + ' thead .select-checkbox').on('click', function (e) {
        var dataTable = eval(dataTableName);
        var checked = $(id).find('thead .select-checkbox').hasClass('select-checkbox-all');
        if (checked) {
            $(id).find('thead .select-checkbox').removeClass('select-checkbox-all');
            dataTable.rows().deselect()
        } else {
            $(id).find('thead .select-checkbox').addClass('select-checkbox-all');
            dataTable.rows().select()
        }
    })
}


function initLoading() {
    $("body").append("<!-- loading -->" +
        "<div class='modal fade' id='loading' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' data-backdrop='static'>" +
        "<div class='modal-dialog' role='document'>" +
        "<div class='modal-content'>" +
        "<div class='modal-header'>" +
        "<h4 class='modal-title' id='myModalLabel'>提示</h4>" +
        "</div>" +
        "<div id='loadingText' class='modal-body'>" +
        "<span class='glyphicon glyphicon-refresh' aria-hidden='true'>1</span>" +
        "处理中，请稍候。。。" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
}

var autoTextarea = function (elem, extra, maxHeight) {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function (type, callback) {
            elem.addEventListener ?
                elem.addEventListener(type, callback, false) :
                elem.attachEvent('on' + type, callback);
        },
        getStyle = elem.currentStyle ? function (name) {
            var val = elem.currentStyle[name];
            if (name === 'height' && val.search(/px/i) !== 1) {
                var rect = elem.getBoundingClientRect();
                return rect.bottom - rect.top -
                    parseFloat(getStyle('paddingTop')) -
                    parseFloat(getStyle('paddingBottom')) + 'px';
            }
            return val;
        } : function (name) {
            return getComputedStyle(elem, null)[name];
        },
        minHeight = parseFloat(getStyle('height'));

    elem.style.resize = 'none';

    var change = function () {
        var scrollTop, height,
            padding = 0,
            style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;

        if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        }
        ;
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
                height = maxHeight;
                style.overflowY = 'auto';
            } else {
                height = elem.scrollHeight;
                style.overflowY = 'hidden';
            }
            ;
            style.height = height + extra + 'px';
            elem.currHeight = parseInt(style.height);
        }
        ;
    };

    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();
};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if (r != null) {
        return unescape(r[2]);
    } else if (q != null) {
        return unescape(q[2]);
    } else {
        return null;
    }
}
