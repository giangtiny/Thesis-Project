import React from 'react';
import {
  AspectRatio,
  BackgroundImage,
  Box,
  Center,
  Grid,
  Image,
  Overlay,
  SimpleGrid,
  Text
} from '@mantine/core';
import { useImageGroupStyle } from './ImageGroup.style';
import { openImagesCarouselModal } from '@/utils/modals';
interface Props {
  images: string[];
}

export default function ImageGroup(props: Props) {
  const { classes } = useImageGroupStyle();
  const CustomImage = ({ index, onClick }: { index?: number; onClick: () => void }) => {
    return index === 4 ? (
      <Box className={classes.box} onClick={onClick}>
        <BackgroundImage src={props.images[5]} className={classes.backGround}>
          <Center p="md" mx="auto">
            <Text className={classes.moreImagesText}>+ 4</Text>
          </Center>
          <Overlay opacity={0.5} color="#000" zIndex={0} className={classes.overlay} />
        </BackgroundImage>
      </Box>
    ) : (
      <Image
        src={props.images[index || 0]}
        alt="image"
        className={classes.generalImages}
        classNames={{
          image: index === 2 ? classes.imageTopRight : ''
        }}
        onClick={onClick}
      />
    );
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <Image
          src={props.images[0]}
          alt="image"
          classNames={{
            root: classes.root,
            imageWrapper: classes.imageWrapper,
            figure: classes.figure,
            image: classes.image
          }}
          className={classes.generalImages}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <SimpleGrid cols={2}>
          {[1, 2, 3, 4].map((i) => (
            <CustomImage key={i} index={i} onClick={openImagesCarouselModal} />
          ))}
        </SimpleGrid>
      </Grid.Col>
    </Grid>
  );
}
