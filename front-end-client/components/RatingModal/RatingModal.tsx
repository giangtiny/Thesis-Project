import React, { useEffect, createRef } from 'react';
import { Center, Container, Flex, Grid, ScrollArea, Space, Text } from '@mantine/core';
import { useCommentsModalStyle } from './RatingModal.style';
import { CommentDto } from '@/utils/types';

import Comment from '@/components/Comment';
import { IconStar } from '@tabler/icons';

interface Props {
  rating: number;
  comment?: CommentDto;
  comments: CommentDto[];
}

export default function RatingModal(props: Props) {
  const { comment, comments } = props;
  const { classes } = useCommentsModalStyle();

  // Create a ref for each comment
  interface CommentRefs {
    [key: string]: React.RefObject<HTMLDivElement>;
  }

  const commentRefs = comments.reduce((acc: CommentRefs, value) => {
    acc[value._id] = createRef();
    return acc;
  }, {});

  // Scroll to the provided comment when the component mounts
  useEffect(() => {
    if (comment && commentRefs[comment._id]) {
      commentRefs[comment._id].current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comment]);

  return (
    <Container>
      <Flex>
        <Grid>
          <Grid.Col span={12}>
            <Flex justify={'start'} align={'center'}>
              <Text fw={'bold'} className={classes.ratingInComment}>
                <Center>
                  <IconStar size={'1.25rem'} fill="#000" />
                  <Space w="sm" /> {props.rating}
                </Center>
              </Text>
              <Space w="sm" />
              <Text fw={'bold'} className={classes.ratingInCommentCount}>
                · {comments.length} đánh giá
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
        <ScrollArea style={{ height: 550 }}>
          {comments.map((commentItem) => {
            return (
              <div ref={commentRefs[commentItem._id]}>
                <Comment isInModal={true} currentComment={commentItem} />
              </div>
            );
          })}
        </ScrollArea>
      </Flex>
    </Container>
  );
}
