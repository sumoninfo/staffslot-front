// Get time when session will expire
const oldXHROpen = window.XMLHttpRequest.prototype.open;
const TSP = window.TSP || {}

window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('load', function() {
        const host = new URL(this.responseURL).host;
        if (host === document.location.host) {
            const sessionExpires = this.getResponseHeader('session-expires')
            if (sessionExpires) {
                TSP.sessionExpires = sessionExpires;
            }
        }
    })

    return oldXHROpen.apply(this, arguments)
}

// Logout if it greather than now
setInterval(() => {
    if (TSP.sessionExpires) {
        const sessionExpires = moment.unix(TSP.sessionExpires);
        const diff = sessionExpires.diff(moment());

        if (diff <= 0) {
            window.location = '/auth/login';
        }
    }
}, 1000);
