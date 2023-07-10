import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Flex,
  Badge,
  Space,
  Container,
  Box,
  Center
} from '@mantine/core';
import { useCommentStyle } from './Comment.style';
import { CommentDto } from '@/utils/types';
import { gradientBadgeProps } from '@/constants/props';
import { IconChevronRight, IconCornerDownRight, IconStar, IconTriangle } from '@tabler/icons';
import { openCommentNewModal } from '@/utils/modals/commentNewModal';

interface Props {
  currentComment: CommentDto;
  isInModal?: boolean;
  handleShowMoreClick?: () => void;
}

export default function Comment({ currentComment, isInModal, handleShowMoreClick }: Props) {
  const {
    _id,
    hotelID,
    date,
    content,
    userID,
    userAvatar,
    userName,
    phoneNumber,
    parentID,
    starRating,
    level,
    replyComment
  } = currentComment;

  const { classes } = useCommentStyle();
  const textRef = useRef<any>(); // create a ref to the Text component
  const [isLineClamped, setIsLineClamped] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { clientHeight, scrollHeight } = textRef.current;
      if (scrollHeight > clientHeight) {
        setIsLineClamped(true);
      } else {
        setIsLineClamped(false);
      }
    }
  }, [currentComment]);
  function getReplyCount(comment: CommentDto) {
    let count = 0;
    for (let reply of comment.replyComment || []) {
      count += 1;
      count += getReplyCount(reply);
    }
    return count;
  }

  const renderReplyCount = () => {
    if (level === 1)
      return (
        <>
          <>{`- ${getReplyCount(currentComment)} Trả lời -  `}</>
          <Space w="0.2rem" />
          <Flex align={'center'}>
            <IconStar size={'0.7rem'} fill="yellow" strokeWidth={'5%'} />
            {starRating}
          </Flex>
        </>
      );
    else return '';
  };

  return (
    <Paper radius="lg" className={classes.comment}>
      <Flex justify={'space-between'}>
        <div>
          <Group>
            <Avatar className={classes.avatar} src={userAvatar} alt={userName} radius="xl" />
            <div className={classes.authorInfo}>
              <Group>
                <Text size="sm" className={classes.authorName}>
                  {userName}
                </Text>
                <Space w="lg" />
                {level === 2 && replyComment.length === 0 && (
                  <Badge
                    style={{ cursor: 'pointer' }}
                    onClick={() => openCommentNewModal(undefined, currentComment)}>
                    Trả lời ngay
                  </Badge>
                )}
              </Group>
              <Flex>
                <Text size="xs" color="dimmed" className={classes.date}>
                  {date} {renderReplyCount()}
                </Text>
                <Text size="sm"></Text>
              </Flex>
            </div>
          </Group>
          {!isInModal ? (
            <Box w={'30rem'} className={classes.body}>
              <Text lineClamp={3} ref={textRef}>
                {content}
              </Text>
              {(isLineClamped || replyComment?.length > 0) && (
                <Flex justify={'start'} align={'center'}>
                  <Text
                    size="md"
                    fw={'bold'}
                    color="black"
                    underline
                    style={{ cursor: 'pointer' }}
                    onClick={handleShowMoreClick}>
                    Show More
                  </Text>
                  <IconChevronRight size={'1rem'} fill="#00000" />
                </Flex>
              )}
            </Box>
          ) : (
            <Box w={'30rem'} className={classes.body}>
              <Text>{content}</Text>
            </Box>
          )}
        </div>
      </Flex>

      {isInModal && replyComment.length > 0 && (
        <div style={{ paddingLeft: level === 1 ? '3rem' : 0 }}>
          {replyComment.map((reply) => (
            <Comment currentComment={reply} isInModal={true}></Comment>
          ))}
        </div>
      )}
    </Paper>
  );
}
