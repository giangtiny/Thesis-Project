import { openModal } from '@mantine/modals';
import { CommentDto } from '../types';
import CommentsModal from '@/components/CommentsModal';
import CommentsNewModal from '@/components/CommentsNewModal';

export const openCommentNewModal = (
  hotel?: {
    name: string;
    image: string;
    id: string;
  },
  commment?: CommentDto
) => {
  return openModal({
    children: <CommentsNewModal hotel={hotel} comment={commment} />,
    size: 'auto'
  });
};
