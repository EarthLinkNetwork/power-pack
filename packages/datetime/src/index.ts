import { DateTime as LuxonDateTime, Interval } from "luxon";

export enum DateFormat {
  fullDateTimeWithHyphen = "yyyy-MM-dd HH:mm:ss",
  fullDateTimeWithDot = "yyyy.MM.dd HH:mm",
  fullDateTimeWithSlash = "yyyy/MM/dd HH:mm",
  fullDateTimeWithSlashUntilSeconds = "yyyy/MM/dd HH:mm:ss",
  fullDateTimeWithoutSeparator = "yyyyMMddHHmmss",
  fullDateTimeWithDay = "yyyy/MM/dd(ccc) HH:mm",
  fullDateWithSlash = "yyyy/MM/dd",
  fullDateWithSlashAndDay = "yyyy/MM/dd(ccc)",
  fullJpDate = "yyyy年MM月dd日",
  fullJpDateWithDay = "yyyy年MM月dd日(ccc)",
  fullDateWithHyphen = "yyyy-MM-dd",
  fullYearMonthWithHyphen = "yyyy-MM",
  fullYearDateWithHyphen = "yyyy-dd",
  fullYearMonthWithSlash = "yyyy/MM",
  fullYearHalfMonthWithSlash = "yyyy/M",
  fullJpYearMonthWithSlash = "yyyy年MM月",
  fullYear = "yyyy",
  fullJpYear = "yyyy年",
  fullMonthDateWithHyphen = "MM-dd",
  fullMonthDateWithSlashAndDay = "MM/dd(ccc)",
  fullJpMonthDateWithSlashAndDay = "MM月dd日(ccc)",
  fullMonth = "MM",
  fullDate = "dd",
  fullYearMonthTime = "yyyy-MM HH:mm:ss",
  fullYearDayTime = "yyyy-dd HH:mm:ss",
  fullYearTime = "yyyy HH:mm:ss",
  fullMonthDayTime = "MM-dd HH:mm:ss",
  fullMonthTime = "MM HH:mm:ss",
  fullDayTime = "dd HH:mm:ss",
  fullTime = "HH:mm:ss",
  timeWithoutSeconds = "HH:mm",
  halfTimeWithoutSeconds = "H:mm",
  dayInWeek = "ccc",
  durationYears = "Y years",
  durationMonths = "M months",
  durationYearMonth = "yYM",
  durationJpYear = "y年",
  durationJpMonth = "Mヶ月",
  durationJpYearMonth = "y年Mヶ月",
  fullDateWithSlashForMoment = "YYYY-MM-DD",
  fullJpYearMonthWithSlashForMoment = "YYYY年MM月",
  fullMonthDateWithSlash = "MM/dd",
}

export class DateTime {
  public static Holidays: DateTime[] = [];

  private readonly _luxonDateTime: LuxonDateTime;

  constructor(luxonDateTime: LuxonDateTime) {
    this._luxonDateTime = luxonDateTime;
  }

  public get DateTime(): LuxonDateTime {
    return this._luxonDateTime;
  }

  public static fromString(
    dateString: string,
    isAPI: boolean = false
  ): DateTime {
    const convertedDateString = dateString.replace(
      /^([0-9]{4})\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])(.*)/,
      "$1-$2-$3$4"
    );
    let dateTime = LuxonDateTime.fromISO(convertedDateString);
    if (isAPI) {
      dateTime = dateTime.plus({ hours: -9 });
    }
    return DateTime.fromLuxonDateTime(dateTime);
  }

  public static fromLuxonDateTime(luxonDateTime: LuxonDateTime): DateTime {
    return new DateTime(luxonDateTime);
  }

  public getFormattedStringWithHyphen(): string {
    return this._luxonDateTime.toFormat(DateFormat.fullDateTimeWithHyphen);
  }

  public getFormattedStringWithSlash(): string {
    return this._luxonDateTime.toFormat(DateFormat.fullDateTimeWithSlash);
  }

  public getDateOnlyWithHyphen(): string {
    return this._luxonDateTime.toFormat(DateFormat.fullDateWithHyphen);
  }

  public getDateOnlyWithSlash(): string {
    return this._luxonDateTime.toFormat(DateFormat.fullDateWithSlash);
  }

  public getTimeOnly(): string {
    return this._luxonDateTime.toFormat(DateFormat.timeWithoutSeconds);
  }

  public toStringFormat(opt: string): string {
    return this._luxonDateTime.toFormat(opt);
  }

  public toUTCString(): string {
    return this._luxonDateTime.toUTC().toString();
  }

  public isValid(): boolean {
    return this._luxonDateTime.isValid;
  }

  public static now(): DateTime {
    return DateTime.fromLuxonDateTime(LuxonDateTime.local());
  }

  public getTomorrow(): DateTime {
    return this.addDays(1);
  }

  public addMinutes(minutes: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ minutes }));
  }

  public static fromUTCString(dateString: string): DateTime {
    return DateTime.fromString(dateString);
  }

  public equals(date: string | DateTime): boolean | null {
    if (typeof date === "string") {
      const dateObject = LuxonDateTime.fromISO(date);
      if (!dateObject.isValid) return null;

      return this._luxonDateTime.equals(dateObject);
    } else {
      return this._luxonDateTime.equals(date.DateTime);
    }
  }

  public static isEqual(
    date1: string | DateTime,
    date2: string | DateTime
  ): boolean | null {
    if (typeof date1 === "string" && typeof date2 === "string") {
      const dateObject1 = LuxonDateTime.fromISO(date1);
      const dateObject2 = LuxonDateTime.fromISO(date2);
      if (!dateObject1.isValid || !dateObject2.isValid) return null;

      return dateObject1.equals(dateObject2);
    } else if (date1 instanceof DateTime && date2 instanceof DateTime) {
      return date1.DateTime.equals(date2.DateTime);
    }
    return null;
  }

  public compare(date: string | DateTime): boolean | null {
    if (typeof date === "string") {
      const dateObject = LuxonDateTime.fromISO(date);
      if (!dateObject.isValid) return null;

      return this._luxonDateTime < dateObject;
    } else {
      return this._luxonDateTime < date.DateTime;
    }
  }

  public static compareDates(
    date1: string | DateTime,
    date2: string | DateTime
  ): boolean | null {
    if (typeof date1 === "string" && typeof date2 === "string") {
      const dateObject1 = LuxonDateTime.fromISO(date1);
      const dateObject2 = LuxonDateTime.fromISO(date2);
      if (!dateObject1.isValid || !dateObject2.isValid) return null;

      return dateObject1 < dateObject2;
    } else if (date1 instanceof DateTime && date2 instanceof DateTime) {
      return date1.DateTime < date2.DateTime;
    }
    return null;
  }

  public static hasValidDates(dates: PartialDatePair): dates is DatePair {
    return dates.start !== undefined && dates.end !== undefined;
  }

  public isOverlapping(datePair: DatePair[]): boolean {
    return datePair.every(
      (pair) =>
        !Interval.fromDateTimes(
          pair.start.DateTime,
          pair.end.DateTime
        ).contains(this._luxonDateTime)
    );
  }

  public static isOverlapping(
    datePair: DatePair[],
    selectedDatePair: DatePair
  ): boolean | null {
    const selectedInterval = Interval.fromDateTimes(
      selectedDatePair.start.DateTime,
      selectedDatePair.end.DateTime
    );
    return datePair.every(
      (pair) =>
        !Interval.fromDateTimes(
          pair.start.DateTime,
          pair.end.DateTime
        ).overlaps(selectedInterval)
    );
  }

  // public static toDatePairs(intervals: Interval[]): DatePair[] {
  //   return intervals.map((pair) => ({
  //     start: DateTime.fromLuxonDateTime(pair.start),
  //     end: DateTime.fromLuxonDateTime(pair.end),
  //   }));
  // }

  public static toIntervals(datePair: DatePair[]): Interval[] {
    return datePair.map((pair) =>
      Interval.fromDateTimes(pair.start.DateTime, pair.end.DateTime)
    );
  }

  public getUserAge(): string | null {
    const birthdayDate = this._luxonDateTime;
    if (!birthdayDate.isValid) return null;
    const todayDate = DateTime.now().DateTime;
    const age = Interval.fromDateTimes(birthdayDate, todayDate).length("years");
    return String(Math.floor(age));
  }

  public static getUserAgeFromNow(
    dateString: string,
    now: DateTime
  ): string | null {
    const birthdayDate = DateTime.fromString(dateString).DateTime;
    if (!birthdayDate.isValid) return null;
    const age = Interval.fromDateTimes(birthdayDate, now.DateTime).length(
      "years"
    );
    return String(Math.floor(age));
  }

  public static getUserAge(dateString: string): string | null {
    return DateTime.getUserAgeFromNow(dateString, DateTime.now());
  }

  public addMonths(months: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ months }));
  }

  public addDays(days: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ days }));
  }

  public addHours(hours: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ hours }));
  }

  public getDateWithZeroTime(): DateTime {
    return DateTime.fromLuxonDateTime(
      LuxonDateTime.local(
        this._luxonDateTime.year,
        this._luxonDateTime.month,
        this._luxonDateTime.day
      )
    );
  }

  public clone(): DateTime {
    return DateTime.fromString(this.toUTCString());
  }

  public static isValidISODateTimeString(dateString: string): boolean {
    const result = LuxonDateTime.fromISO(dateString);
    return result.isValid;
  }

  // ===== New Arithmetic Methods =====

  addSeconds(seconds: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ seconds }));
  }

  addYears(years: number): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.plus({ years }));
  }

  // ===== New Diff Methods =====

  diffInDays(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "days").days;
  }

  diffInHours(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "hours").hours;
  }

  diffInMinutes(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "minutes").minutes;
  }

  diffInSeconds(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "seconds").seconds;
  }

  diffInMonths(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "months").months;
  }

  diffInYears(other: DateTime | string): number {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.diff(otherDt.DateTime, "years").years;
  }

  // ===== New Calendar Properties =====

  daysInMonth(): number {
    return this._luxonDateTime.daysInMonth!;
  }

  isLeapYear(): boolean {
    return this._luxonDateTime.isInLeapYear;
  }

  static daysInMonthOf(year: number, month: number): number {
    return LuxonDateTime.local(year, month).daysInMonth!;
  }

  static isLeapYearOf(year: number): boolean {
    return LuxonDateTime.local(year).isInLeapYear;
  }

  // ===== New Boundary Methods =====

  startOfDay(): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.startOf("day"));
  }

  endOfDay(): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.endOf("day"));
  }

  startOfMonth(): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.startOf("month"));
  }

  endOfMonth(): DateTime {
    return DateTime.fromLuxonDateTime(this._luxonDateTime.endOf("month"));
  }

  // ===== New Comparison Methods =====

  isBefore(other: DateTime | string): boolean {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime < otherDt.DateTime;
  }

  isAfter(other: DateTime | string): boolean {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime > otherDt.DateTime;
  }

  isSameDay(other: DateTime | string): boolean {
    const otherDt =
      typeof other === "string" ? DateTime.fromString(other) : other;
    return this._luxonDateTime.hasSame(otherDt.DateTime, "day");
  }

  // ===== New Static Factory =====

  static tryParse(dateString: string): DateTime | null {
    const dt = DateTime.fromString(dateString);
    return dt.isValid() ? dt : null;
  }

  // ===== New Component Getters =====

  get year(): number {
    return this._luxonDateTime.year;
  }

  get month(): number {
    return this._luxonDateTime.month;
  }

  get day(): number {
    return this._luxonDateTime.day;
  }

  get hour(): number {
    return this._luxonDateTime.hour;
  }

  get minute(): number {
    return this._luxonDateTime.minute;
  }

  get second(): number {
    return this._luxonDateTime.second;
  }

  get dayOfWeek(): number {
    return this._luxonDateTime.weekday;
  }
}

declare global {
  interface String {
    toCustomDateTime(): DateTime;
  }
}

String.prototype.toCustomDateTime = function (): DateTime {
  return DateTime.fromUTCString(this.toString());
};

export type DatePair = {
  start: DateTime;
  end: DateTime;
};
export type PartialDatePair = Partial<DatePair>;

export default DateTime;
