import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsAPI, Ad, AdPosition } from '@/lib/api';

export function useAds(position?: string) {
    const queryClient = useQueryClient();

    const { data: ads, isLoading } = useQuery({
        queryKey: ['ads', position],
        queryFn: () => position ? adsAPI.getActiveByPosition(position) : adsAPI.getAll(),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<Ad>) => adsAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Ad> }) => adsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adsAPI.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
        },
    });

    const trackViewMutation = useMutation({
        mutationFn: (id: string) => adsAPI.trackView(id),
    });

    const trackClickMutation = useMutation({
        mutationFn: (id: string) => adsAPI.trackClick(id),
    });

    return {
        ads,
        isLoading,
        createAd: createMutation.mutate,
        updateAd: (id: string, data: Partial<Ad>) => updateMutation.mutate({ id, data }),
        deleteAd: deleteMutation.mutate,
        trackView: trackViewMutation.mutate,
        trackClick: trackClickMutation.mutate,
    };
}
