import moment from 'moment'

export default {
  methods: {
    formatTime(value) {
      if (!value) return '00:00';

      const hours = parseInt(Math.floor(value / 360));
      const minutes = parseInt(Math.floor((value - (hours * 360)) / 60));
      const seconds = parseInt((value - ((hours * 360) + (minutes * 60))) % 60);

      const dHours = (hours > 9 ? hours : '0' + hours);
      const dMins = (minutes > 9 ? minutes : '0' + minutes);
      const dSecs = (seconds > 9 ? seconds : '0' + seconds);

      return (dHours !== '00' ? dHours + ':' : '') + dMins + ':' + dSecs;
    },

    formatSize(size) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    },

    formatTime(value) {
      if (!value) return '00:00';

      const hours = parseInt(Math.floor(value / 360));
      const minutes = parseInt(Math.floor((value - (hours * 360)) / 60));
      const seconds = parseInt((value - ((hours * 360) + (minutes * 60))) % 60);

      const dHours = (hours > 9 ? hours : '0' + hours);
      const dMins = (minutes > 9 ? minutes : '0' + minutes);
      const dSecs = (seconds > 9 ? seconds : '0' + seconds);

      return (dHours !== '00' ? dHours + ':' : '') + dMins + ':' + dSecs;
    },

    fromNow(date) {
      const d = moment.duration({ from: date });
      const hours = d.hours();

      if (d.days() < 1 && hours) {
        const minutes = d.minutes();
        const hStr = hours == 1 ? 'hour' : 'hours';
        const mStr = minutes == 1 ? 'minute' : 'minutes';
        if (minutes)
          return `${hours} ${hStr} ${minutes} ${mStr} ago`;
        else
          return `${hours} ${hStr} ago`;
      }

      return d.humanize() + ' ago';
    },

    formatCurrency(value) {
      return '$' + (value / 1).toFixed(2);
    }
  }
}
