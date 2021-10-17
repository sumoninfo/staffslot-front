require('./check-session-expired');
require('./copy-buttons');
require('./delete-links');
import axios from 'axios'

// Exit impersonate mode when user pressing back to /manage page.
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted ||
        ( typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2 )
    if ( historyTraversal && this.window.location.pathname == '/manage') {
        axios.get('/api/manager/exit-impersonate')
    }
});