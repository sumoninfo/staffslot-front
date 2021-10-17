export default {
    beforeCreate () {
        this.$store.watch( (state)=> { return this.$store.state.user }, (newValue, oldValue) => {
            const role = (this.$store.state.user.account.role || {}).name ||
                this.$store.state.user.account.pro && 'pro-starter';
            const allowedRoles = this.$route.meta.roles;

            if (allowedRoles.indexOf(role) === -1) {
                this.emitter.emit('isLoading', false);
                this.$router.push('/dashboard');
            }
        });
    }
}