import { Favorites, ProgramType } from "@/types/program.type";
import { NOTIFICATION_TYPE } from "./constants/notifications";
import { NotificationInterval } from "@/types/notification.type";
import { months } from "./constants/common";
import { AGE_COHORT } from "./constants/user";
import { PROGRAM_CATEGORY } from "./constants/programs";

export function formatDate(date: Date) {
  const options: any = { weekday: "long", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  const [weekday, month, day] = formattedDate.split(" ");
  return `${weekday.toUpperCase()} ${month.toUpperCase()}. ${day}`;
}

export function formatDateWithDivider(date: Date | string, divider: string = "/") {
  if (typeof date === "string") date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return day + divider + month + divider + year;
}

export function formatDateShort(date: Date): string {
  const day: number = date.getDate();
  const month: string = months[date.getMonth()];
  const year: string = date.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
}

export function formatNotificationsDate(date: Date | string | number): string {
  if (typeof date === "string" || typeof date === "number") date = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return "Today";
  }

  if (isYesterday) {
    return "Yesterday";
  }
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds <= 0) {
    return "00:00";
  }
  seconds = Math.round(seconds);
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatSeconds(sec: number) {
  const mm = Math.floor(sec / 60);
  const ss = Math.floor(sec % 60);
  return { mm, ss };
}

export function validateEmailFormat(text: string) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,40}$/;
  return emailRegex.test(text);
}

export function calculateAge(birthDate: string | Date) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  const dayDifference = today.getDate() - birth.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

export function getDataFromPrograms(programs: ProgramType[]) {
  const favorites: Favorites = { programs: [], workouts: [] };

  for (let program of programs) {
    let duration = 0;

    for (let workout of program.workouts) {
      duration += workout.duration;
      if (workout.isFavorite) {
        favorites.workouts.push({ programGuid: program.guid, ...workout });
      }
    }
    if (program.isFavorite) {
      favorites.programs.push({
        guid: program.guid,
        title: program.title,
        duration,
        isFavorite: program.isFavorite,
        energy: program.energy,
        isNewItem: program.isNewItem,
        previewSmall: program.previewSmall,
        level: program.level,
        progress: program.progress,
        isAvailableForGuest: program.isAvailableForGuest,
        isHack: program.isHack,
      });
    }
  }
  return { favorites };
}

export function getDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? 1 : minutes;
}

export function getDateDayFormat(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getNotificationRefTime(type: NOTIFICATION_TYPE) {
  const date = new Date();
  if (type === NOTIFICATION_TYPE.DAILY) {
    date.setHours(10, 0, 0, 0);
    return date;
  } else {
    const dayOfWeek = date.getDay();
    const diffToSunday = dayOfWeek === 0 ? 0 : dayOfWeek;
    const lastSunday = new Date(date);
    lastSunday.setDate(date.getDate() - diffToSunday);
    lastSunday.setHours(12, 0, 0, 0);
    return lastSunday;
  }
}

export function getDatesAt10AM(intervals: NotificationInterval[], fromDate: Date) {
  const datesAt10AM: string[] = [];

  intervals.forEach((interval) => {
    const startDate = new Date(interval.enableDate);
    startDate.setHours(10, 0, 0, 0);

    const endDate = interval.disableDate ? new Date(interval.disableDate) : new Date();
    endDate.setHours(10, 0, 0, 0);

    if (endDate > fromDate) {
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (currentDate > fromDate) {
          const formattedDate = getDateDayFormat(currentDate);
          datesAt10AM.push(formattedDate);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });
  return datesAt10AM;
}

export function getSundaysAtNoon(intervals: NotificationInterval[], fromDate: Date) {
  const sundaysAt12AM: string[] = [];

  intervals.forEach((interval) => {
    const startDate = new Date(interval.enableDate);
    startDate.setHours(12, 0, 0, 0);

    const endDate = interval.disableDate ? new Date(interval.disableDate) : new Date();
    endDate.setHours(12, 0, 0, 0);

    if (endDate > fromDate) {
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 && currentDate > fromDate) {
          const formattedDate = getDateDayFormat(currentDate);
          sundaysAt12AM.push(formattedDate);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });

  return sundaysAt12AM;
}

export function getDateSomeDaysAgo(daysAgo: number) {
  const today = new Date();
  today.setDate(today.getDate() - daysAgo);
  return today;
}

export function getCategoryByAge(age: number) {
  const categories = Object.values(PROGRAM_CATEGORY);
  for (let category of categories) {
    if (age > AGE_COHORT[category].from && age < AGE_COHORT[category].to) {
      return category;
    }
  }
}

export function extractVideoName(url: string, maxLength?: number): string {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];

    if (maxLength && filename.length > maxLength) {
      return filename.substring(0, maxLength);
    }

    return filename;
  } catch (err) {
    console.warn("Invalid video URL:", err);
    return "";
  }
}
