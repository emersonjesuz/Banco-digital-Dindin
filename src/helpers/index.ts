import { format } from "date-fns";

export function formatDate(data: string | Date, formatting: string) {
  return format(new Date(data), formatting);
}

export function dayWeek(date: string): string {
  const getDay = new Date(date).getDay();

  const week = {
    Domingo: 0,
    Segunda: 1,
    terça: 2,
    Quarta: 3,
    Quinta: 4,
    Sexta: 5,
    Sabado: 6,
  };

  let day = "";

  for (const weeksDay of Object.entries(week)) {
    const hasTheDay = weeksDay.includes(getDay);
    if (hasTheDay) {
      day = weeksDay[0];
      break;
    }
  }

  return day;
}

export function setItemLocalStore(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getItemLocalStore(key: string) {
  return localStorage.getItem(key);
}

export function clearItemLocalstore() {
  localStorage.clear();
}
