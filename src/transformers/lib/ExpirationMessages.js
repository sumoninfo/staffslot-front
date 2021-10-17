export default class ExpirationMessages {
    constructor(obj) {
        Object.keys(obj).map(key => this[key] = obj[key]);
        this.validityRepr = obj.validity && `${obj.validity} ${obj.validity === 1 ? obj.validity_period.replace('s', '') : obj.validity_period}`;
    }

    accessEnds() {
        if (this.validity && this.renewal_limit) {
            return this.expiration;
        }
    }

    expirationMessage() {
        let expirationMessage = this.expiration ? this.expiration :
            this.validityRepr ? this.validityRepr : null;

        if (this.expiration)
            expirationMessage = `At ${expirationMessage}`;

        else if (this.validityRepr)
            expirationMessage = `In ${expirationMessage} after purchase`;

        return expirationMessage;
    }

    renewalMessage() {
        if (this.renewal && this.validityRepr) {
            switch (this.renewal_limit) {
                case 0 || null:
                    return `This subscription will renew after every ${this.validityRepr}`;
                case 1:
                    return `This subscription will renew once after ${this.validityRepr}`;
                default:
                    return `This subscription will renew every ${this.validityRepr}, for ${this.renewal_limit} times`;
            }
        }
    }
}
