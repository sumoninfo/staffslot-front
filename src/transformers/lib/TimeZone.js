import moment from 'moment-timezone'

export default function (obj, timezone, fields) {
    const result = { ...obj }

    fields.map(field => {
        const m = moment.utc(obj[field]);
        result[field] = m.date() ?
            m.tz(timezone).format('MM-DD-YYYY') :
            null;
    });

    return result;
}