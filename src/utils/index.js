import { format } from "date-fns";

export function formatDate(data, formatting) {
  return format(new Date(data), formatting);
}

export function dayWeek(date) {
  const day = new Date(date).getDay();

  return !day
    ? "Domingo"
    : day === 1
    ? "Segunda"
    : day === 2
    ? "terça"
    : day === 3
    ? "Quarta"
    : day === 4
    ? "Quinta"
    : day === 5
    ? "Sexta"
    : "Sabado";
}

export function setItem(key, value) {
  localStorage.setItem(key, value);
}

export function getItem(key) {
  return localStorage.getItem(key);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function clearItem() {
  localStorage.clear();
}
