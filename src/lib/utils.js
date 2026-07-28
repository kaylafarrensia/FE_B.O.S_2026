import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  return `${formattedDate} ${formattedTime}`;
};

export const formatScheduleDisplay = (schedule) => {
  if (!schedule || !schedule.startTime) return '';
  const date = new Date(schedule.startTime);
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const hariTanggal = `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  const pad = (n) => n.toString().padStart(2, '0');
  const s = new Date(schedule.startTime);
  const e = new Date(schedule.endTime);
  const jam = `${pad(s.getHours())}.${pad(s.getMinutes())} - ${pad(e.getHours())}.${pad(e.getMinutes())} WIB`;
  return `${hariTanggal} ${jam}`;
};

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatStartEndTime(start, end) {
  if (!start || !end) return '';
  const pad = (n) => n.toString().padStart(2, '0');
  const s = new Date(start);
  const e = new Date(end);
  return `${pad(s.getHours())}.${pad(s.getMinutes())} - ${pad(e.getHours())}.${pad(e.getMinutes())} WIB`;
}
