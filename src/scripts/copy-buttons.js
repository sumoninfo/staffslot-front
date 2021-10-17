$(function () {

    const copySuccess = function (e) {
        $('.btn-clipboard .button-text').text('Copy Link');
        var wrapper = $(e.trigger).find('.button-text');
        var buttonText = wrapper.length ? wrapper :
            $(e.trigger);
        var btnText = buttonText.text();

        buttonText.text('Link Copied');
        setTimeout(()=>{
            buttonText.text(btnText);
        },1000);
    }

    $('.public-id').text($('[name="public_id"]').val());

    $('[name="public_id"]').on('keyup', function () {
        $('.public-id').text($(this).val());
    });

    const clipboard = new Clipboard('.btn-clipboard');

    clipboard.on('success', copySuccess);

    const clipboard2 = new Clipboard('.copy-clipboard');

    clipboard2.on('success', copySuccess);

});
