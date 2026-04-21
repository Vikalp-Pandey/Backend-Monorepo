import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getItems,
  uploadFileToS3,
  saveFolders,
  deleteFolder,
  deleteFile,
} from '@/api/fileupload.api';
import { toast } from 'react-toastify';

export const useFiles = (parentFolder: string | null) => {
  const queryClient = useQueryClient();

  const fetchItems = useQuery({
    queryKey: ['files', parentFolder ?? 'root'],
    queryFn: () => getItems(parentFolder || undefined),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });

  const fileUpload = useMutation({
    mutationFn: uploadFileToS3,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['files', parentFolder ?? 'root'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shared-with-me'],
      });
    },
    onError: (err: any) => {
      const errorData = err.response?.data;
      if (errorData?.data?.stack) {
        console.log(errorData.data.stack);
      }
      const errorMessage = errorData?.detail || errorData?.error || 'Upload failed';
      toast.error(errorMessage);
    },
  });

  const folderCreate = useMutation({
    mutationFn: ({
      name,
      parentId,
    }: {
      name: string;
      parentId: string | null;
    }) => saveFolders({ name, size: 0, parentFolder: parentId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['files', parentFolder ?? 'root'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shared-with-me'],
      });
    },
    onError: (err: any) => {
      console.log(err.response);
    },
  });

  const fileDelete = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['files', parentFolder ?? 'root'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shared-with-me'],
      });
    },
    onError: (err: any) => {
      console.log(err.response.data.error);
      const errorMessage =
        err.response?.data?.error 

      toast.error(errorMessage);
    },
  });

  const folderDelete = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      // Refresh current folder data
      queryClient.invalidateQueries({
        queryKey: ['files', parentFolder ?? 'root'],
      });
      queryClient.invalidateQueries({
        queryKey: ['shared-with-me'],
      });
    },
    onError: (err: any) => {
      console.log(err.response.data.error);
      
      const errorMessage =
        err.response?.data?.error 

      toast.error(errorMessage);
    },
  });
  return { fetchItems, fileUpload, folderCreate, fileDelete, folderDelete };
};
