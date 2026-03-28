import DateTime, { DatePair } from "../src/index";
import { DateTime as LuxonDateTime } from "luxon";

describe("DateTime Class", () => {
  const testDate1_String = "2021-04-07T16:31:15.177Z";
  const testDate2_String = "2021-04-08T02:21:15.677Z";
  const testDate1 = DateTime.fromString(testDate1_String).DateTime.toUTC(); // Convert to UTC
  const testDate2 = DateTime.fromString(testDate2_String).DateTime.toUTC(); // Convert to UTC

  test("should create DateTime instance from ISO string", () => {
    expect(testDate1.toISO()).toBe("2021-04-07T16:31:15.177Z");
    expect(testDate2.toISO()).toBe("2021-04-08T02:21:15.677Z");
  });

  test("should return null for invalid date string", () => {
    const invalidDate = DateTime.fromString("invalid-date");
    expect(invalidDate.isValid()).toBe(false);
  });

  test("should format DateTime with different formats", () => {
    expect(
      DateTime.fromLuxonDateTime(testDate1).getFormattedStringWithHyphen()
    ).toBe("2021-04-07 16:31:15");
    expect(
      DateTime.fromLuxonDateTime(testDate1).getFormattedStringWithSlash()
    ).toBe("2021/04/07 16:31");
    expect(DateTime.fromLuxonDateTime(testDate1).getDateOnlyWithHyphen()).toBe(
      "2021-04-07"
    );
    expect(DateTime.fromLuxonDateTime(testDate1).getDateOnlyWithSlash()).toBe(
      "2021/04/07"
    );
    expect(DateTime.fromLuxonDateTime(testDate1).getTimeOnly()).toBe("16:31");
  });

  test("should add minutes to DateTime", () => {
    const newDate = DateTime.fromLuxonDateTime(testDate1)
      .addMinutes(10)
      .DateTime.toUTC();
    expect(newDate.toISO()).toBe("2021-04-07T16:41:15.177Z");
  });

  test("should compare two DateTime objects", () => {
    const isoDate1 = testDate1.toISO();
    const isoDate2 = testDate2.toISO();

    if (isoDate1 && isoDate2) {
      expect(DateTime.isEqual(isoDate1, isoDate2)).toBe(false);
      expect(DateTime.isEqual(isoDate1, isoDate1)).toBe(true);
    }
  });

  test("should compare two DateTime strings", () => {
    expect(DateTime.isEqual(testDate1_String, testDate2_String)).toBe(false);
    expect(DateTime.isEqual(testDate1_String, testDate1_String)).toBe(true);
  });

  test("should calculate age based on birth date", () => {
    const birthDateString = "2000-04-07T16:31:15.177Z";
    const now = DateTime.fromString("2024-04-07T16:31:15.177Z");
    expect(DateTime.getUserAgeFromNow(birthDateString, now)).toBe("24");
  });

  test("should handle DatePair operations", () => {
    const datePair: DatePair[] = [
      {
        start: DateTime.fromString("2021-04-07T12:21:15.577Z"),
        end: DateTime.fromString("2021-04-07T13:21:15.677Z"),
      },
      {
        start: DateTime.fromString("2021-04-07T14:21:15.577Z"),
        end: DateTime.fromString("2021-04-07T15:21:15.677Z"),
      },
    ];

    const selectDatePair: DatePair = {
      start: DateTime.fromString("2021-04-07T16:21:15.477Z"),
      end: DateTime.fromString("2021-04-07T17:21:15.477Z"),
    };

    expect(DateTime.isOverlapping(datePair, selectDatePair)).toBe(true);
  });

  test("should correctly handle addMonths, addDays, and clone methods", () => {
    const originalDate = DateTime.fromString(
      "2021-04-07T16:31:15.177Z"
    ).DateTime.toUTC();
    const addedMonths = DateTime.fromLuxonDateTime(originalDate)
      .addMonths(1)
      .DateTime.toUTC();
    const addedDays = DateTime.fromLuxonDateTime(originalDate)
      .addDays(1)
      .DateTime.toUTC();
    const clonedDate = DateTime.fromLuxonDateTime(originalDate)
      .clone()
      .DateTime.toUTC();

    expect(addedMonths.toISO()).toBe("2021-05-07T16:31:15.177Z");
    expect(addedDays.toISO()).toBe("2021-04-08T16:31:15.177Z");
    expect(clonedDate.toISO()).toBe("2021-04-07T16:31:15.177Z");
  });

  test("should return tomorrow's date", () => {
    const tomorrow = DateTime.fromLuxonDateTime(testDate1)
      .getTomorrow()
      .DateTime.toUTC();
    expect(tomorrow.toISO()).toBe("2021-04-08T16:31:15.177Z");
  });

  test("should correctly validate ISO date strings", () => {
    expect(DateTime.isValidISODateTimeString("2021-04-07T16:31:15.177Z")).toBe(
      true
    );
    expect(DateTime.isValidISODateTimeString("invalid-date-string")).toBe(
      false
    );
  });

  test("should convert to UTC string", () => {
    expect(DateTime.fromLuxonDateTime(testDate1).toUTCString()).toBe(
      "2021-04-07T16:31:15.177Z"
    );
  });

  // ===== Coverage for existing methods =====

  describe("fromString with isAPI", () => {
    test("should subtract 9 hours when isAPI is true", () => {
      const dt = DateTime.fromString("2024-03-15T18:00:00Z", true);
      const utc = dt.DateTime.toUTC();
      expect(utc.toISO()).toBe("2024-03-15T09:00:00.000Z");
    });

    test("should not subtract hours when isAPI is false", () => {
      const dt = DateTime.fromString("2024-03-15T18:00:00Z", false);
      const utc = dt.DateTime.toUTC();
      expect(utc.toISO()).toBe("2024-03-15T18:00:00.000Z");
    });

    test("should convert slash format dates", () => {
      const dt = DateTime.fromString("2024/03/15");
      expect(dt.isValid()).toBe(true);
    });
  });

  describe("fromUTCString", () => {
    test("should create DateTime from UTC string", () => {
      const dt = DateTime.fromUTCString("2024-03-15T10:00:00Z");
      expect(dt.isValid()).toBe(true);
    });
  });

  describe("toStringFormat", () => {
    test("should format with custom format string", () => {
      const luxonDt = LuxonDateTime.fromISO("2024-03-15T10:30:45Z", { zone: "utc" });
      const dt = DateTime.fromLuxonDateTime(luxonDt);
      expect(dt.toStringFormat("yyyy/MM/dd")).toBe("2024/03/15");
      expect(dt.toStringFormat("HH:mm")).toBe("10:30");
    });
  });

  describe("now", () => {
    test("should return a valid DateTime", () => {
      const dt = DateTime.now();
      expect(dt.isValid()).toBe(true);
    });
  });

  describe("equals", () => {
    test("should return true for equal string date", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt.equals("2024-03-15T10:00:00.000Z")).toBe(true);
    });

    test("should return false for different string date", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt.equals("2024-03-16T10:00:00Z")).toBe(false);
    });

    test("should return null for invalid string date", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt.equals("invalid")).toBeNull();
    });

    test("should return true for equal DateTime", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.equals(dt2)).toBe(true);
    });

    test("should return false for different DateTime", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-16T10:00:00Z");
      expect(dt1.equals(dt2)).toBe(false);
    });
  });

  describe("isEqual static", () => {
    test("should compare two DateTime instances", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(DateTime.isEqual(dt1, dt2)).toBe(true);
    });

    test("should return false for different DateTime instances", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-16T10:00:00Z");
      expect(DateTime.isEqual(dt1, dt2)).toBe(false);
    });

    test("should return null for invalid string inputs", () => {
      expect(DateTime.isEqual("invalid", "2024-03-15")).toBeNull();
      expect(DateTime.isEqual("2024-03-15", "invalid")).toBeNull();
    });

    test("should return null for mixed types", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(DateTime.isEqual(dt, "2024-03-15T10:00:00Z")).toBeNull();
      expect(DateTime.isEqual("2024-03-15T10:00:00Z", dt)).toBeNull();
    });
  });

  describe("compare", () => {
    test("should return true when this is before string date", () => {
      const dt = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt.compare("2024-03-15T10:00:00Z")).toBe(true);
    });

    test("should return false when this is after string date", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt.compare("2024-03-10T10:00:00Z")).toBe(false);
    });

    test("should return null for invalid string date", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt.compare("invalid")).toBeNull();
    });

    test("should return true when this is before DateTime", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.compare(dt2)).toBe(true);
    });
  });

  describe("compareDates static", () => {
    test("should compare two string dates", () => {
      expect(DateTime.compareDates("2024-03-10T10:00:00Z", "2024-03-15T10:00:00Z")).toBe(true);
      expect(DateTime.compareDates("2024-03-15T10:00:00Z", "2024-03-10T10:00:00Z")).toBe(false);
    });

    test("should return null for invalid string dates", () => {
      expect(DateTime.compareDates("invalid", "2024-03-15")).toBeNull();
      expect(DateTime.compareDates("2024-03-15", "invalid")).toBeNull();
    });

    test("should compare two DateTime instances", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(DateTime.compareDates(dt1, dt2)).toBe(true);
    });

    test("should return null for mixed types", () => {
      const dt = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(DateTime.compareDates(dt, "2024-03-15T10:00:00Z")).toBeNull();
    });
  });

  describe("hasValidDates", () => {
    test("should return true when both dates present", () => {
      const pair = {
        start: DateTime.fromString("2024-03-10T10:00:00Z"),
        end: DateTime.fromString("2024-03-15T10:00:00Z"),
      };
      expect(DateTime.hasValidDates(pair)).toBe(true);
    });

    test("should return false when start is undefined", () => {
      expect(DateTime.hasValidDates({ end: DateTime.fromString("2024-03-15T10:00:00Z") })).toBe(false);
    });

    test("should return false when end is undefined", () => {
      expect(DateTime.hasValidDates({ start: DateTime.fromString("2024-03-10T10:00:00Z") })).toBe(false);
    });
  });

  describe("isOverlapping instance", () => {
    test("should return true when date is not in any range", () => {
      const dt = DateTime.fromString("2024-03-20T10:00:00Z");
      const pairs: DatePair[] = [
        { start: DateTime.fromString("2024-03-10T10:00:00Z"), end: DateTime.fromString("2024-03-12T10:00:00Z") },
        { start: DateTime.fromString("2024-03-14T10:00:00Z"), end: DateTime.fromString("2024-03-16T10:00:00Z") },
      ];
      expect(dt.isOverlapping(pairs)).toBe(true);
    });

    test("should return false when date is in a range", () => {
      const dt = DateTime.fromString("2024-03-11T10:00:00Z");
      const pairs: DatePair[] = [
        { start: DateTime.fromString("2024-03-10T10:00:00Z"), end: DateTime.fromString("2024-03-12T10:00:00Z") },
      ];
      expect(dt.isOverlapping(pairs)).toBe(false);
    });
  });

  describe("toIntervals", () => {
    test("should convert DatePairs to Intervals", () => {
      const pairs: DatePair[] = [
        { start: DateTime.fromString("2024-03-10T10:00:00Z"), end: DateTime.fromString("2024-03-12T10:00:00Z") },
      ];
      const intervals = DateTime.toIntervals(pairs);
      expect(intervals).toHaveLength(1);
      expect(intervals[0].isValid).toBe(true);
    });
  });

  describe("getUserAge", () => {
    test("should return age as string", () => {
      const birthDate = DateTime.fromString("2000-01-01T00:00:00Z");
      const age = birthDate.getUserAge();
      expect(age).not.toBeNull();
      expect(parseInt(age!)).toBeGreaterThanOrEqual(24);
    });

    test("should return null for invalid date", () => {
      const invalid = DateTime.fromString("invalid");
      expect(invalid.getUserAge()).toBeNull();
    });
  });

  describe("static getUserAge", () => {
    test("should calculate age from date string", () => {
      const age = DateTime.getUserAge("2000-01-01T00:00:00Z");
      expect(age).not.toBeNull();
      expect(parseInt(age!)).toBeGreaterThanOrEqual(24);
    });
  });

  describe("getUserAgeFromNow with invalid date", () => {
    test("should return null for invalid date string", () => {
      const now = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(DateTime.getUserAgeFromNow("invalid-date", now)).toBeNull();
    });
  });

  describe("getDateWithZeroTime", () => {
    test("should return date with time set to zero", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.getDateWithZeroTime();
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });
  });

  describe("String.prototype.toCustomDateTime", () => {
    test("should convert string to DateTime", () => {
      const dt = "2024-03-15T10:00:00Z".toCustomDateTime();
      expect(dt.isValid()).toBe(true);
      expect(dt.year).toBe(2024);
    });
  });

  // ===== New Tests =====

  describe("addSeconds", () => {
    test("should add 30 seconds", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addSeconds(30);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-15T10:31:15.000Z");
    });

    test("should add negative seconds (-60)", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addSeconds(-60);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-15T10:29:45.000Z");
    });

    test("should add 0 seconds (no change)", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addSeconds(0);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-15T10:30:45.000Z");
    });
  });

  describe("addYears", () => {
    test("should add 1 year", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addYears(1);
      expect(result.DateTime.toUTC().toISO()).toBe("2025-03-15T10:30:45.000Z");
    });

    test("should add negative year", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addYears(-1);
      expect(result.DateTime.toUTC().toISO()).toBe("2023-03-15T10:30:45.000Z");
    });

    test("should handle leap year edge case (Feb 29 + 1 year)", () => {
      const dt = DateTime.fromString("2024-02-29T10:00:00Z");
      const result = dt.addYears(1);
      // Feb 29 + 1 year => Feb 28 in non-leap year
      expect(result.DateTime.toUTC().toISO()).toBe("2025-02-28T10:00:00.000Z");
    });
  });

  describe("addHours", () => {
    test("should add 2 hours", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addHours(2);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-15T12:30:45.000Z");
    });

    test("should add negative hours", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.addHours(-3);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-15T07:30:45.000Z");
    });

    test("should cross day boundary (23:00 + 2h)", () => {
      const dt = DateTime.fromString("2024-03-15T23:00:00Z");
      const result = dt.addHours(2);
      expect(result.DateTime.toUTC().toISO()).toBe("2024-03-16T01:00:00.000Z");
    });
  });

  describe("diff methods", () => {
    test("diffInDays between two known dates", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt1.diffInDays(dt2)).toBe(5);
    });

    test("diffInDays negative (earlier - later)", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInDays(dt2)).toBe(-5);
    });

    test("diffInHours", () => {
      const dt1 = DateTime.fromString("2024-03-15T14:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInHours(dt2)).toBe(4);
    });

    test("diffInHours with string input", () => {
      const dt1 = DateTime.fromString("2024-03-15T14:00:00Z");
      expect(dt1.diffInHours("2024-03-15T10:00:00Z")).toBe(4);
    });

    test("diffInMinutes", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:45:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInMinutes(dt2)).toBe(45);
    });

    test("diffInMinutes with string input", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:45:00Z");
      expect(dt1.diffInMinutes("2024-03-15T10:00:00Z")).toBe(45);
    });

    test("diffInSeconds", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:01:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInSeconds(dt2)).toBe(60);
    });

    test("diffInSeconds with string input", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:01:00Z");
      expect(dt1.diffInSeconds("2024-03-15T10:00:00Z")).toBe(60);
    });

    test("diffInMonths", () => {
      const dt1 = DateTime.fromString("2024-06-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInMonths(dt2)).toBe(3);
    });

    test("diffInMonths with string input", () => {
      const dt1 = DateTime.fromString("2024-06-15T10:00:00Z");
      expect(dt1.diffInMonths("2024-03-15T10:00:00Z")).toBe(3);
    });

    test("diffInYears", () => {
      const dt1 = DateTime.fromString("2026-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInYears(dt2)).toBe(2);
    });

    test("diffInYears with string input", () => {
      const dt1 = DateTime.fromString("2026-03-15T10:00:00Z");
      expect(dt1.diffInYears("2024-03-15T10:00:00Z")).toBe(2);
    });

    test("diff with string input", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.diffInDays("2024-03-10T10:00:00Z")).toBe(5);
    });

    test("diff with DateTime input", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt1.diffInDays(dt2)).toBe(5);
    });
  });

  describe("calendar properties", () => {
    test("daysInMonth for January (31)", () => {
      const dt = DateTime.fromString("2024-01-15T10:00:00Z");
      expect(dt.daysInMonth()).toBe(31);
    });

    test("daysInMonth for February non-leap (28)", () => {
      const dt = DateTime.fromString("2023-02-15T10:00:00Z");
      expect(dt.daysInMonth()).toBe(28);
    });

    test("daysInMonth for February leap year (29)", () => {
      const dt = DateTime.fromString("2024-02-15T10:00:00Z");
      expect(dt.daysInMonth()).toBe(29);
    });

    test("daysInMonth for April (30)", () => {
      const dt = DateTime.fromString("2024-04-15T10:00:00Z");
      expect(dt.daysInMonth()).toBe(30);
    });

    test("isLeapYear for 2024 (true)", () => {
      const dt = DateTime.fromString("2024-06-15T10:00:00Z");
      expect(dt.isLeapYear()).toBe(true);
    });

    test("isLeapYear for 2023 (false)", () => {
      const dt = DateTime.fromString("2023-06-15T10:00:00Z");
      expect(dt.isLeapYear()).toBe(false);
    });

    test("isLeapYear for 2000 (true)", () => {
      const dt = DateTime.fromString("2000-06-15T10:00:00Z");
      expect(dt.isLeapYear()).toBe(true);
    });

    test("isLeapYear for 1900 (false)", () => {
      const dt = DateTime.fromString("1900-06-15T10:00:00Z");
      expect(dt.isLeapYear()).toBe(false);
    });

    test("static daysInMonthOf(2024, 2) => 29", () => {
      expect(DateTime.daysInMonthOf(2024, 2)).toBe(29);
    });

    test("static isLeapYearOf(2024) => true", () => {
      expect(DateTime.isLeapYearOf(2024)).toBe(true);
    });
  });

  describe("boundary methods", () => {
    test("startOfDay: time should be 00:00:00", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.startOfDay();
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    test("endOfDay: time should be 23:59:59.999", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.endOfDay();
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
      expect(result.second).toBe(59);
    });

    test("startOfMonth: day should be 1", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.startOfMonth();
      expect(result.day).toBe(1);
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
    });

    test("endOfMonth: day should be last day of month", () => {
      const dt = DateTime.fromString("2024-03-15T10:30:45Z");
      const result = dt.endOfMonth();
      expect(result.day).toBe(31);
      expect(result.hour).toBe(23);
      expect(result.minute).toBe(59);
    });
  });

  describe("comparison methods", () => {
    test("isBefore: earlier date returns true", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.isBefore(dt2)).toBe(true);
    });

    test("isBefore: later date returns false", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt1.isBefore(dt2)).toBe(false);
    });

    test("isBefore: same date returns false", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.isBefore(dt2)).toBe(false);
    });

    test("isAfter: later date returns true", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt1.isAfter(dt2)).toBe(true);
    });

    test("isAfter: earlier date returns false", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.isAfter(dt2)).toBe(false);
    });

    test("isSameDay: same day returns true", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.isSameDay(dt2)).toBe(true);
    });

    test("isSameDay: different day returns false", () => {
      const dt1 = DateTime.fromString("2024-03-15T10:00:00Z");
      const dt2 = DateTime.fromString("2024-03-16T10:00:00Z");
      expect(dt1.isSameDay(dt2)).toBe(false);
    });

    test("isSameDay: same day different time returns true", () => {
      const dt1 = DateTime.fromString("2024-03-15T02:00:00Z");
      const dt2 = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(dt1.isSameDay(dt2)).toBe(true);
    });

    test("comparison with string input", () => {
      const dt1 = DateTime.fromString("2024-03-10T10:00:00Z");
      expect(dt1.isBefore("2024-03-15T10:00:00Z")).toBe(true);
      expect(dt1.isAfter("2024-03-15T10:00:00Z")).toBe(false);
      expect(dt1.isSameDay("2024-03-10T12:00:00Z")).toBe(true);
    });
  });

  describe("tryParse", () => {
    test("valid ISO string returns DateTime", () => {
      const result = DateTime.tryParse("2024-03-15T10:30:45Z");
      expect(result).not.toBeNull();
      expect(result!.isValid()).toBe(true);
    });

    test("invalid string returns null", () => {
      const result = DateTime.tryParse("not-a-date");
      expect(result).toBeNull();
    });

    test("empty string returns null", () => {
      const result = DateTime.tryParse("");
      expect(result).toBeNull();
    });
  });

  describe("component getters", () => {
    test("year, month, day, hour, minute, second, dayOfWeek on a known date", () => {
      // Use fromLuxonDateTime with UTC to ensure predictable values
      const luxonDt = LuxonDateTime.fromISO("2024-03-15T10:30:45Z", {
        zone: "utc",
      });
      const dt = DateTime.fromLuxonDateTime(luxonDt);
      expect(dt.year).toBe(2024);
      expect(dt.month).toBe(3);
      expect(dt.day).toBe(15);
      expect(dt.hour).toBe(10);
      expect(dt.minute).toBe(30);
      expect(dt.second).toBe(45);
    });

    test("verify dayOfWeek (1=Mon ... 7=Sun)", () => {
      // 2024-03-11 is a Monday
      const monday = DateTime.fromString("2024-03-11T10:00:00Z");
      expect(monday.dayOfWeek).toBe(1);

      // 2024-03-15 is a Friday
      const friday = DateTime.fromString("2024-03-15T10:00:00Z");
      expect(friday.dayOfWeek).toBe(5);

      // 2024-03-17 is a Sunday
      const sunday = DateTime.fromString("2024-03-17T10:00:00Z");
      expect(sunday.dayOfWeek).toBe(7);
    });
  });
});
