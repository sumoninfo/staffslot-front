import ExpirationMessages from './lib/ExpirationMessages';
import moment from 'moment-timezone';

export default function (obj) {
    const s = new ExpirationMessages(obj)
    
    moment.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);
    return {
        ...obj,
        access_ends: s.accessEnds(),
        created_at: moment.tz(obj.created_at, 'UTC').tz(moment.defaultZone.name).format('ddd MM/DD/YYYY h:mma'),
        expiration_message: s.expirationMessage(),
        renewal_message: s.renewalMessage()
    }
}
