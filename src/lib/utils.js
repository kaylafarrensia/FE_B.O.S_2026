import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateTimeString) => {
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
  const date = new Date(schedule.startTime);

  const hari = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

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

  const hariTanggal = `${hari[date.getDay()]}, ${date.getDate()} ${
    bulan[date.getMonth()]
  } ${date.getFullYear()}`;

  const pad = (n) => n.toString().padStart(2, '0');

  const s = new Date(schedule.startTime);
  const e = new Date(schedule.endTime);

  const jam = `${pad(s.getHours())}.${pad(s.getMinutes())} - ${pad(
    e.getHours()
  )}.${pad(e.getMinutes())} WIB`;

  return `${hariTanggal} ${jam}`;
};

// Format: Jumat, 16 September 2024
export function formatDate(dateString) {
  const date = new Date(dateString);

  const hari = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

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

  return `${hari[date.getDay()]}, ${date.getDate()} ${
    bulan[date.getMonth()]
  } ${date.getFullYear()}`;
}

// Format: 19.00 - 21.00 WIB
export function formatStartEndTime(start, end) {
  const pad = (n) => n.toString().padStart(2, '0');

  const s = new Date(start);
  const e = new Date(end);

  return `${pad(s.getHours())}.${pad(s.getMinutes())} - ${pad(
    e.getHours()
  )}.${pad(e.getMinutes())} WIB`;
}

export const isDataUrl = (value) =>
  /^data:([^;]+);base64,/.test(value);

export const stripDataUrlPrefix = (value) => {
  const m = value.match(/^data:([^;]+);base64,(.*)$/);

  if (!m) {
    return {
      mime: undefined,
      data: value,
    };
  }

  return {
    mime: m[1],
    data: m[2],
  };
};

export const base64ToArrayBuffer = (b64) => {
  const { data } = stripDataUrlPrefix(b64);

  const binary = atob(data);
  const len = binary.length;

  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

export const base64ToBlob = (b64, mimeOverride) => {
  const { mime, data } = stripDataUrlPrefix(b64);

  const buffer = base64ToArrayBuffer(data);

  const type =
    mimeOverride || mime || 'application/octet-stream';

  return new Blob([buffer], {
    type,
  });
};

export const arrayBufferToBase64 = (buffer, mime) => {
  const bytes = new Uint8Array(buffer);

  let binary = '';

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const b64 = btoa(binary);

  return mime
    ? `data:${mime};base64,${b64}`
    : b64;
};

export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error('Failed to read blob as base64'));

    reader.onload = () =>
      resolve(String(reader.result || ''));

    reader.readAsDataURL(blob);
  });
