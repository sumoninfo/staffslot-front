import moment from 'moment-timezone'
import PackageExpirationMessages from './lib/PackageExpirationMessages';
import convertTimezones from './lib/TimeZone';

export default function (obj) {
    const timezone = (moment.defaultZone && moment.defaultZone.name) || obj.package.account.timezone;
    const objLocalTimeZone = convertTimezones(obj, timezone, ['created_at', 'expiration', 'purchase_date', 'updated_at'])
    const s = new PackageExpirationMessages(objLocalTimeZone)

    return {
        ...objLocalTimeZone,
        renewal_message: s.renewalMessage()
    }
}
