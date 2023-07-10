export function transformDateRangeToDateFormat(date) {

    const originalDate = `${date}`;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const format = (m) => (m < 10 ? '0' : '') + m;

    const [day, m, d, yyyy, ...time] = originalDate.split(' ');

    const mm = format(months.indexOf(m) + 1);

    return `${yyyy}-${mm}-${d}`;
}