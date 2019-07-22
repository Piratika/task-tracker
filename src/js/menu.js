

//Exelent little functions to use any time when class modification is needed
/*
function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
*/

var isClosed = true;

//The actual fuction
function toggleMenu() {
    var trigger = $('#hamburger');
    if (isClosed == true) {
        $('body').addClass('open');
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = false;
    } else {
        $('body').removeClass('open');
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = true;
    }
}

//Add event from js the keep the marup clean
function init() {
    $('#hamburger')[0].onclick = toggleMenu;
}

$(document).ready(init);

$('[data-toggle="offcanvas"]').click(function () {
    $('#wrapper').toggleClass('toggled');
});
