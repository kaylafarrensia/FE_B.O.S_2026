import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { API } from '@/lib/API'

const MOCK_REGIONS = [
  { id: 1, name: 'Kemanggisan', isRegistrationOpen: true },
  { id: 2, name: 'Alam Sutera', isRegistrationOpen: true },
  { id: 3, name: 'Bekasi', isRegistrationOpen: true },
  { id: 4, name: 'Bandung', isRegistrationOpen: true },
  { id: 5, name: 'Malang', isRegistrationOpen: true },
  { id: 6, name: 'Semarang', isRegistrationOpen: true },
]

const MOCK_FACULTIES = [
  // Kemanggisan (regionId 1)
  { id: 1, name: 'Binus Business School Undergraduate Programs', regionId: 1 },
  { id: 2, name: 'Faculty of Engineering', regionId: 1 },
  { id: 3, name: 'Faculty of Humanities', regionId: 1 },
  { id: 4, name: 'School of Computer Science', regionId: 1 },
  { id: 5, name: 'School of Design', regionId: 1 },
  { id: 6, name: 'School of Information Systems', regionId: 1 },
  { id: 7, name: 'School of Accounting', regionId: 1 },
  {
    id: 8,
    name: 'Faculty of Digital Communication and Hotel & Tourism',
    regionId: 1,
  },
  { id: 9, name: 'Double Programs', regionId: 1 },
  { id: 10, name: 'Master Track Programs', regionId: 1 },

  // Alam Sutera (regionId 2)
  { id: 11, name: 'Binus Business School Undergraduate Programs', regionId: 2 },
  {
    id: 12,
    name: 'Faculty of Digital Communication and Hotel & Tourism',
    regionId: 2,
  },
  { id: 13, name: 'Faculty of Engineering', regionId: 2 },
  { id: 14, name: 'Faculty of Humanities', regionId: 2 },
  { id: 15, name: 'School of Computer Science', regionId: 2 },
  { id: 16, name: 'School of Design', regionId: 2 },
  { id: 17, name: 'School of Information Systems', regionId: 2 },
  { id: 18, name: 'School of Accounting', regionId: 2 },
  { id: 19, name: 'Master Track Programs', regionId: 2 },
  { id: 20, name: 'Global Class Programs', regionId: 2 },

  // Bandung (regionId 4)
  { id: 21, name: 'Binus Business School Undergraduate Programs', regionId: 4 },
  { id: 22, name: 'School of Computer Science', regionId: 4 },
  { id: 23, name: 'School of Design', regionId: 4 },
  { id: 24, name: 'Double Programs', regionId: 4 },

  // Malang (regionId 5)
  { id: 25, name: 'Binus Business School Undergraduate Programs', regionId: 5 },
  { id: 26, name: 'School of Computer Science', regionId: 5 },
  { id: 27, name: 'School of Design', regionId: 5 },
  {
    id: 28,
    name: 'Faculty of Digital Communication and Hotel & Tourism',
    regionId: 5,
  },
  { id: 29, name: 'Double Programs', regionId: 5 },
]

const MOCK_MAJORS = [
  // Kemanggisan - School of Computer Science (facultyId: 4)
  { id: 1, name: 'Computer Science', facultyId: 4 },
  { id: 2, name: 'Cyber Security', facultyId: 4 },
  { id: 3, name: 'Artificial Intelligence', facultyId: 4 },
  { id: 4, name: 'Data Science', facultyId: 4 },
  { id: 5, name: 'Game Application and Technology', facultyId: 4 },

  // Kemanggisan - School of Information Systems (facultyId: 6)
  { id: 6, name: 'Information Systems', facultyId: 6 },
  { id: 7, name: 'Business Analytics', facultyId: 6 },

  // Alam Sutera - School of Computer Science (facultyId: 15)
  { id: 8, name: 'Computer Science', facultyId: 15 },
  { id: 9, name: 'CS - Global Class', facultyId: 15 },
  { id: 10, name: 'Cyber Security', facultyId: 15 },
  { id: 11, name: 'Artificial Intelligence', facultyId: 15 },

  // Alam Sutera - School of Information Systems (facultyId: 17)
  { id: 12, name: 'Information Systems', facultyId: 17 },

  // Bandung - School of Computer Science (facultyId: 22)
  { id: 13, name: 'Computer Science', facultyId: 22 },
  { id: 14, name: 'Artificial Intelligence', facultyId: 22 },

  // Malang - School of Computer Science (facultyId: 26)
  { id: 15, name: 'Computer Science', facultyId: 26 },
  { id: 16, name: 'Artificial Intelligence', facultyId: 26 },
]

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
]

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
]

export default function useLookupQuery(regionId, facultyId) {
  // Always fetch regions because it does not depend on selected parameters
  const regionQuery = useQuery({
    queryKey: [QUERY_KEYS.REGIONS],
    queryFn: async () => {
      try {
        const res = await API.get('/lookup/regions')
        return res.data
      } catch (err) {
        console.warn('API error, using fallback mock regions:', err)
        return { data: MOCK_REGIONS }
      }
    },
  })

  // Only query faculties when a valid regionId is provided
  const facultyQuery = useQuery({
    queryKey: [QUERY_KEYS.FACULTIES, regionId],
    queryFn: async () => {
      try {
        const url = regionId
          ? `/lookup/faculties?regionId=${regionId}`
          : '/lookup/faculties'
        const res = await API.get(url)
        return res.data
      } catch (err) {
        console.warn('API error, using fallback mock faculties:', err)
        return { data: MOCK_FACULTIES }
      }
    },
    enabled: Boolean(regionId) && Number(regionId) > 0,
  })

  // Only query majors when a valid facultyId is provided
  const majorQuery = useQuery({
    queryKey: [QUERY_KEYS.MAJORS, facultyId],
    queryFn: async () => {
      try {
        const url = facultyId
          ? `/lookup/majors?facultyId=${facultyId}`
          : '/lookup/majors'
        const res = await API.get(url)
        return res.data
      } catch (err) {
        console.warn('API error, using fallback mock majors:', err)
        return { data: MOCK_MAJORS }
      }
    },
    enabled: Boolean(facultyId) && Number(facultyId) > 0,
  })

  // Only query courses when a valid regionId is provided
  const lntCourseQuery = useQuery({
    queryKey: [QUERY_KEYS.LNT_COURSES, regionId],
    queryFn: async () => {
      try {
        const url = regionId
          ? `/lookup/courses?regionId=${regionId}`
          : '/lookup/courses'
        const res = await API.get(url)
        return res.data
      } catch (err) {
        console.warn('API error, using fallback mock lnt courses:', err)
        return { data: MOCK_LNT_COURSES }
      }
    },
    enabled: Boolean(regionId) && Number(regionId) > 0,
  })

  // Only query schedules when a valid regionId is provided
  const scheduleQuery = useQuery({
    queryKey: [QUERY_KEYS.SCHEDULES, regionId],
    queryFn: async () => {
      try {
        const url = regionId
          ? `/lookup/schedules?regionId=${regionId}`
          : '/lookup/schedules'
        const res = await API.get(url)
        return res.data
      } catch (err) {
        console.warn('API error, using fallback mock schedules:', err)
        return { data: MOCK_SCHEDULES }
      }
    },
    enabled: Boolean(regionId) && Number(regionId) > 0,
  })

  const extractData = (resData, fallback) => {
    if (Array.isArray(resData)) return resData
    if (Array.isArray(resData?.data)) return resData.data
    return fallback
  }

  return {
    regionQuery: {
      ...regionQuery,
      data: extractData(regionQuery.data, MOCK_REGIONS),
    },
    facultyQuery: {
      ...facultyQuery,
      data: extractData(facultyQuery.data, MOCK_FACULTIES),
    },
    majorQuery: {
      ...majorQuery,
      data: extractData(majorQuery.data, MOCK_MAJORS),
    },
    lntCourseQuery: {
      ...lntCourseQuery,
      data: extractData(lntCourseQuery.data, MOCK_LNT_COURSES),
    },
    scheduleQuery: {
      ...scheduleQuery,
      data: extractData(scheduleQuery.data, MOCK_SCHEDULES),
    },
  }
}
