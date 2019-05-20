let moment = require("moment");
import mockEvents from "./mockEvents";
let thisMonth = null;
let today = null;
let now = moment();

// 为给定的moment实例生成相应的 days 对象模型数组。
export function generateDaysOfMonth(momentInstance) {
  let result = [];
  let daysInMonth = momentInstance.daysInMonth();
  let year = Number(momentInstance.format("YYYY"));
  let month = momentInstance.month();
  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
    result.push(new Day(year, month, dayOfMonth));
  }
  return result;
}

export class Day {
  constructor(year, month, dayOfMonth) {
    let _moment = moment([year, month, dayOfMonth]);
    if (now.isSame(_moment, "D")) today = this;
    (this.moment = _moment), (this.dayOfWeek = _moment.day());
    this.dayOfMonth = dayOfMonth;
    this.date = _moment.toDate();
    (this.month = _moment.format("YYYY-M")),
      (this.events = mockEvents[_moment.format("YYYY-M-D")] || []);
  }
}

export function generateMonth(momentInstance) {
  let days = [];
  let daysInMonth = momentInstance.daysInMonth();
  let year = Number(momentInstance.format("YYYY"));
  let month = momentInstance.month();

  let result = {};
  if (month === now.month()) {
    if (thisMonth) {
      result = thisMonth; // 隐式引用
      return result;
    } else {
      thisMonth = result; // 副作用
    }
  }
  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
    days.push(new Day(year, month, dayOfMonth));
  }
  Object.assign(result, {
    days,
    No: month
  });

  return result;
}

export default function generateDays(startMoment, endMoment) {
  let amountOfMonths = endMoment.month() - startMoment.month() + 1;
  if (amountOfMonths < 0) {
    amountOfMonths = 12 + amountOfMonths;
  }
  let result = [];
  for (let index = 0; index < amountOfMonths; index++) {
    let days = generateDaysOfMonth(startMoment.clone().add(index, "months"));
    result.push(...days);
  }
  return result;
}
/**
 * 给定起始时间与结束时间，生成这段期间内的 months 对象模型数组。
 *
 * @export {Function} generateMonths
 * @param {*} startMoment
 * @param {*} endMoment
 * @returns {Array} months
 */
export function generateMonths(startMoment, endMoment) {
  let duration = moment.duration(endMoment.diff(startMoment));
  let amountOfMonths = duration.months();
  let result = [];
  for (let index = 0; index <= amountOfMonths; index++) {
    let month = generateMonth(startMoment.add(index, "months"));
    result.push(month);
  }
  return result;
}

export function getThisMonth() {
  if (thisMonth) {
    return thisMonth;
  } else {
    return generateMonth(now);
  }
}

export function getToday() {
  if (today) {
    return today;
  } else {
    return new Day(now.year(), now.month(), now.date());
  }
}
