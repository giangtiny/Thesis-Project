import { useRef, useState } from 'react';
import { Modal, Button, Group } from '@mantine/core';

import dynamic from 'next/dynamic';
import '@karianpour/pannellum-react/es/pannellum/css/video-js.css';
import '@karianpour/pannellum-react/es/pannellum/css/pannellum.css';
import '@karianpour/pannellum-react/es/pannellum/css/style-textInfo.css';
import { Icon360View } from '@tabler/icons';
import { useImagePreviewStyle } from './ImagePreview.style';
import { Carousel } from '@mantine/carousel';
const DynamicPannellum = dynamic(
  () => import('@karianpour/pannellum-react').then((mod) => mod.Pannellum),
  { ssr: false }
);
interface Props {
  images360: string[];
}
const ImagePreview = (props: Props) => {
  const [opened, setOpened] = useState(false);
  const { classes } = useImagePreviewStyle();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size="xl">
        <Carousel draggable={false}>
          {props.images360?.map((item) => (
            <Carousel.Slide>
              <DynamicPannellum
                width="100%"
                height="500px"
                image={item}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                showZoomCtrl={false}
                autoRotate={10}></DynamicPannellum>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>

      <Group position="center">
        {props.images360?.length ? (
          <Icon360View onClick={() => setOpened(true)} className={classes['icon']}></Icon360View>
        ) : (
          <></>
        )}
      </Group>
    </>
  );
};

export default ImagePreview;
