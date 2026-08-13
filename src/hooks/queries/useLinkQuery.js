import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API } from '@/lib/API';

const MOCK_LINKS = {
  wa_info: 'https://chat.whatsapp.com/demo-bncc',
  wa_payment: 'https://chat.whatsapp.com/demo-bncc-payment',
  zoom: 'https://zoom.us/j/demo-bncc',
};

export default function useLinkQuery(regionId) {
  const linkQuery = useQuery({
    queryKey: [QUERY_KEYS.LINKS, regionId],
    queryFn: async () => {
      try {
        const url = `/public/links?regionId=${regionId}`;
        const res = await API.get(url);
        return res.data;
      } catch (err) {
        console.warn('API error, using fallback mock links:', err);
        return { data: MOCK_LINKS };
      }
    },
    enabled: Boolean(regionId) && Number(regionId) > 0,
  });

  return {
    linkQuery: linkQuery?.data?.data || MOCK_LINKS,
  };
}

