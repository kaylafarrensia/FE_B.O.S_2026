import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API } from '@/lib/API';

export default function useLookupQuery() {
  const regionQuery = useQuery({
    queryKey: [QUERY_KEYS.REGIONS],
    queryFn: async () =>
      (await API.get('/lookup/regions')).data,
  });

  const facultyQuery = useQuery({
    queryKey: [QUERY_KEYS.FACULTIES],
    queryFn: async () =>
      (await API.get('/lookup/faculties')).data,
  });

  const majorQuery = useQuery({
    queryKey: [QUERY_KEYS.MAJORS],
    queryFn: async () =>
      (await API.get('/lookup/majors')).data,
  });

  const lntCourseQuery = useQuery({
    queryKey: [QUERY_KEYS.LNT_COURSES],
    queryFn: async () =>
      (await API.get('/lookup/lnt-courses')).data,
  });

  const scheduleQuery = useQuery({
    queryKey: [QUERY_KEYS.SCHEDULES],
    queryFn: async () =>
      (await API.get('/lookup/schedules')).data,
  });

  return {
    regionQuery,
    facultyQuery,
    majorQuery,
    lntCourseQuery,
    scheduleQuery,
  };
}
