import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mediaAPI } from '@/lib/api/media';
import { toast } from 'sonner';

export function useMediaList() {
  return useQuery({
    queryKey: ['media-list'],
    queryFn: mediaAPI.list,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMediaUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => mediaAPI.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-list'] });
      toast.success('Image uploaded');
    },
    onError: () => {
      toast.error('Upload failed');
    },
  });
}
