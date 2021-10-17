export default class PackageExpirationMessages {
    constructor(obj) {
        Object.keys(obj).map(key => this[key] = obj[key]);
    }

    renewalMessage() {
        if (!this.recurring) return null;

        if (this.recurring > 1) {
            return `This package will renew after every ${this.expiry}, for ${this.recurring} times`;
        } else if(this.recurring == 1) {
            return `This package will renew once after ${this.expiry}`;
        } else if(this.recurring == -1) {
            return `This package will renew after every ${this.expiry}`;
        }

        return 'This package will renew after every 1 hour';
    }
}
