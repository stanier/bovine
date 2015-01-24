var bovine = angular.module('bovine', []).service('sharedTarget', function() {
    var target;
    return {
        get: function()   { return target },
        set: function(id) { target = id   }
    }
});
toastr.options = {
    closeButton: true,
    positionClass: 'toast-bottom-left'
};

function clone(o) {
    if (null == o || "object" != typeof o) return o;
    var c = o.constructor();
    for (var a in o) { if (o.hasOwnProperty(a)) c[a] = o[a] }
    return c;
}

function objectHasValue(object, val) {
    for(var prop in object) { if(object.hasOwnProperty(prop) && object[prop] === val) return true }
    return false;
};

function showSuccess(data) { toastr.success(data) }
function showError(data)   { toastr.error(data)   }
function showInfo(data)    { toastr.info(data)    }

$('.widthToHeight').css({'height':$('.widthToHeight').width()+'px'});