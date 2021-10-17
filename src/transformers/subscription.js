import ExpirationMessages from './lib/ExpirationMessages';

export default function (obj) {
    const s = new ExpirationMessages(obj)

    return {
        ...obj,
        expiration_message: s.expirationMessage(),
        renewal_message: s.renewalMessage()
    }
}
