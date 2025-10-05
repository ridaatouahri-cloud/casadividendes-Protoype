export function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

export function firstWeekday(y, m) {
  return new Date(y, m, 1).getDay();
}

export function mondayOffsetFromSundayFirstDay(d) {
  return d === 0 ? 6 : d - 1;
}
