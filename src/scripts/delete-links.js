$(document).ready(function() {
    var SweetAlert = function () {
    }

    SweetAlert.prototype.init = function () {
        $("body").on('click','.delete-link', function () {
            var url

            if( $(this).data("event") )
                url = '/event/delete/' + $(this).data("event")

            if( $(this).data("slot") )
                url = '/slot/cancel/' + $(this).data("slot")

            if( $(this).data("location") )
                url = '/location/delete/' + $(this).data("location")

            if(url) {
                swal({
                    title: Lang.get('js.are-you-sure'),
                    text: Lang.get('js.no-revert-possible'),
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: Lang.get('js.yes'),
                    cancelButtonText: Lang.get('js.cancel'),
                }, function () {
                    window.location.href = url
                });
            }
        });
    }

    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
});