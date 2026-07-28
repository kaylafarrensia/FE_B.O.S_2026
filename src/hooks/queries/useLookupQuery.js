import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API } from '@/lib/API';

const MOCK_REGIONS = [
  { id: 1, name: 'Kemanggisan', isRegistrationOpen: true },
  { id: 2, name: 'Alam Sutera', isRegistrationOpen: true },
  { id: 3, name: 'Bekasi', isRegistrationOpen: true },
  { id: 4, name: 'Bandung', isRegistrationOpen: true },
  { id: 5, name: 'Malang', isRegistrationOpen: true },
  { id: 6, name: 'Semarang', isRegistrationOpen: true },
];

const MOCK_FACULTIES = [
  { id: 1, name: 'School of Computer Science', regionId: 1 },
  { id: 2, name: 'School of Information Systems', regionId: 1 },
  { id: 3, name: 'School of Design', regionId: 1 },
  { id: 4, name: 'School of Computer Science', regionId: 2 },
  { id: 5, name: 'School of Information Systems', regionId: 2 },
  { id: 6, name: 'School of Computer Science', regionId: 3 },
  { id: 7, name: 'School of Computer Science', regionId: 4 },
  { id: 8, name: 'School of Computer Science', regionId: 5 },
  { id: 9, name: 'School of Computer Science', regionId: 6 },
];

const MOCK_MAJORS = [
  { id: 1, name: 'Computer Science', facultyId: 1 },
  { id: 2, name: 'Cyber Security', facultyId: 1 },
  { id: 3, name: 'Game Application and Technology', facultyId: 1 },
  { id: 4, name: 'Information Systems', facultyId: 2 },
  { id: 5, name: 'Business Information Technology', facultyId: 2 },
  { id: 6, name: 'Interactive Design & Technology', facultyId: 3 },
  { id: 7, name: 'Computer Science', facultyId: 4 },
  { id: 8, name: 'Information Systems', facultyId: 5 },
  { id: 9, name: 'Computer Science', facultyId: 6 },
  { id: 10, name: 'Computer Science', facultyId: 7 },
  { id: 11, name: 'Computer Science', facultyId: 8 },
  { id: 12, name: 'Computer Science', facultyId: 9 },
];

const MOCK_LNT_COURSES = [
  // Kemanggisan (regionId 1)
  { id: 1, title: 'Front-End Development', regionId: 1 },
  { id: 2, title: 'Back-End Development', regionId: 1 },
  { id: 3, title: 'UI/UX Design', regionId: 1 },
  { id: 4, title: 'Java Programming', regionId: 1 },
  { id: 5, title: 'Mobile Application Development', regionId: 1 },
  { id: 6, title: 'Machine Learning', regionId: 1 },

  // Alam Sutera (regionId 2)
  { id: 7, title: 'Front-End Development', regionId: 2 },
  { id: 8, title: 'UI/UX Design', regionId: 2 },
  { id: 9, title: 'Back-End Development', regionId: 2 },
  { id: 10, title: 'Java Programming', regionId: 2 },
  { id: 11, title: 'C Programming', regionId: 2 },
  { id: 12, title: 'Machine Learning', regionId: 2 },

  // Bandung (regionId 4)
  { id: 13, title: 'Front-End Development', regionId: 4 },
  { id: 14, title: 'Back-End Development', regionId: 4 },
  { id: 15, title: 'UI/UX Design', regionId: 4 },

  // Malang (regionId 5)
  { id: 16, title: 'Front-End Development', regionId: 5 },
  { id: 17, title: 'Back-End Development', regionId: 5 },
  { id: 18, title: 'UI/UX Design', regionId: 5 },
  { id: 19, title: 'Java Programming', regionId: 5 },
  { id: 20, title: 'C Programming', regionId: 5 },
];

const MOCK_SCHEDULES = [
  {
    id: 1,
    title: 'BNCC Launching Day 1',
    description: 'BNCC Opening & Orientation Day 1',
    startTime: '2026-09-15T09:00:00.000Z',
    endTime: '2026-09-15T12:00:00.000Z',
    regionId: 1,
  },
  {
    id: 2,
    title: 'BNCC Launching Day 2',
    description: 'BNCC Opening & Orientation Day 2',
    startTime: '2026-09-16T13:00:00.000Z',
    endTime: '2026-09-16T16:00:00.000Z',
    regionId: 1,
  },
  {
    id: 3,
    title: 'BNCC Launching Alam Sutera',
    description: 'BNCC Opening & Orientation Alsut',
    startTime: '2026-09-17T09:00:00.000Z',
    endTime: '2026-09-17T12:00:00.000Z',
    regionId: 2,
  },
];

export default function useLookupQuery() {
  const regionQuery = useQuery({
    queryKey: [QUERY_KEYS.REGIONS],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/regions');
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock regions:', err);
        return { data: MOCK_REGIONS };
      }
    },
  });

  const facultyQuery = useQuery({
    queryKey: [QUERY_KEYS.FACULTIES],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/faculties');
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock faculties:', err);
        return { data: MOCK_FACULTIES };
      }
    },
  });

  const majorQuery = useQuery({
    queryKey: [QUERY_KEYS.MAJORS],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/majors');
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock majors:', err);
        return { data: MOCK_MAJORS };
      }
    },
  });

  const lntCourseQuery = useQuery({
    queryKey: [QUERY_KEYS.LNT_COURSES],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/lnt-courses');
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock lnt courses:', err);
        return { data: MOCK_LNT_COURSES };
      }
    },
  });

  const scheduleQuery = useQuery({
    queryKey: [QUERY_KEYS.SCHEDULES],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/schedules');
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock schedules:', err);
        return { data: MOCK_SCHEDULES };
      }
    },
  });

  return {
    regionQuery: { ...regionQuery, data: regionQuery.data?.data || MOCK_REGIONS },
    facultyQuery: { ...facultyQuery, data: facultyQuery.data?.data || MOCK_FACULTIES },
    majorQuery: { ...majorQuery, data: majorQuery.data?.data || MOCK_MAJORS },
    lntCourseQuery: { ...lntCourseQuery, data: lntCourseQuery.data?.data || MOCK_LNT_COURSES },
    scheduleQuery: { ...scheduleQuery, data: scheduleQuery.data?.data || MOCK_SCHEDULES },
  };
}
