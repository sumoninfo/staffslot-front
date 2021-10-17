import $ from 'jquery'

window.fallbackCopyTextToClipboard = function (text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  // textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
window.copyToClipboard = function (text) {
    if (!navigator.clipboard) {
	    window.fallbackCopyTextToClipboard(text);
	    return;
	  }
	  navigator.clipboard.writeText(text).then(function() {
	    console.log('Async: Copying to clipboard was successful!');
	  }, function(err) {
	    console.error('Async: Could not copy text: ', err);
	  });
}
window.base_url = function (segment){
   return window.location.origin+"/";
}

window.nestedSort = (prop, arr, type=1) => {
    prop = prop.split('.');
    var len = prop.length;

    arr.sort(function (a, b) {
        var i = 0;
        while( i < len ) { a = a && a[prop[i]]; b = b && b[prop[i]]; i++; }
        if (a < b) {
            return -1 * type;
        } else if (a > b) {
            return 1 *type;
        } else {
            return 0;
        }
    });
    return arr;
};

window.weekDay = (day)=>{
    var weekDays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];
    return weekDays[day];
};

$(document).ready(function(){
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');


        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
            $('.dropdown-submenu .show').removeClass("show");
        });


        return false;
    });

});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    const scrollButton = document.getElementById("scrollTopButton");
    if (scrollButton) {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            document.getElementById("scrollTopButton").style.display = "block";
        } else {
            document.getElementById("scrollTopButton").style.display = "none";
        }
    }
}

// When the user clicks on the button, scroll to the top of the document
window.scrollToTop = function () {
    $("html,body").animate({scrollTop: $(".page-top").offset().top}, "1000");
}