import React from 'react';
import { UnstyledButton, Text, Group, Paper, Container, Image } from '@mantine/core';
import { RoomProps } from '@/utils/types';
import { useAppDispatch } from '@redux/store';
import { roomActions } from '@redux/slices';
import MainHomePage from './component/MainHomePage';
import NewFeature from './component/NewFeature';
import Connect from './component/Connect';
import Events from './component/Events';
import TravelTip from './component/TravelTip';
import Roamie from './component/Roamie';
import DownloadApp from './component/DownloadApp';
import Environmental from './component/Environmental';
import Inspired from './component/Inspired';
import Blog from './component/Blog';
import Footer from '@/components/Layout/Footer';
import { footerData } from '@/constants/static-data';
import NewLetter from './component/NewLetter';
import FooterLading from './component/FooterLading';

export default function HomePage(props: RoomProps) {
  const dispatch = useAppDispatch();
  const { setRoom, unSetRoom } = roomActions;
  const { id, number, beds, available } = props;

  return (
    <div>
      <MainHomePage></MainHomePage>
      {/* <NewFeature></NewFeature> */}
      <Connect></Connect>
      <Events></Events>
      <TravelTip></TravelTip>
      <Roamie></Roamie>
      {/* <DownloadApp></DownloadApp> */}
      <Environmental></Environmental>
      <Inspired></Inspired>

      <Footer data={footerData}></Footer>
    </div>
  );
}
