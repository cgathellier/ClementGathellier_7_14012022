import moment from 'moment';

const getMomentDiff = (date) => {
    moment.locale('fr', {
        months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split(
            '_',
        ),
        monthsParseExact: true,
        weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split(
            '_',
        ),
        weekdaysParseExact: true,
        ordinal: function (number) {
            return number + (number === 1 && 'er');
        },
    });
    const momentNow = moment();
    const momentDate = moment(date);

    const durations = [
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years',
    ];

    let diff,
        diffText = null,
        formattedDate = momentDate.format('dddd Do MMMM YYYY [à] HH:mm');

    for (let i = 0; i < durations.length; i++) {
        diff = momentNow.diff(momentDate, durations[i]);

        switch (durations[i]) {
            case 'seconds':
                if (diff < 60)
                    diffText = `il y a ${diff} seconde${diff === 1 ? '' : 's'}`;
                break;
            case 'minutes':
                if (diff < 60)
                    diffText = `il y a ${diff} minute${diff === 1 ? '' : 's'}`;
                break;
            case 'hours':
                if (diff < 24)
                    diffText = `il y a ${diff} heure${diff === 1 ? '' : 's'}`;
                break;
            case 'days':
                if (diff < 7)
                    diffText = `il y a ${diff} jour${diff === 1 ? '' : 's'}`;
                break;
            case 'weeks':
                if (diff < 60)
                    diffText = `il y a ${diff} semaine${diff === 1 ? '' : 's'}`;
                break;
            case 'months':
                if (diff < 60) diffText = `il y a ${diff} mois`;
                break;
            case 'years':
                if (diff < 60)
                    diffText = `il y a ${diff} année${diff === 1 ? '' : 's'}`;
                break;
            default:
                break;
        }

        if (diffText) break;
    }

    return { diffText, formattedDate };
};

export default getMomentDiff;
