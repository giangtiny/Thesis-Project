import React, { useRef } from 'react';

import { Image, Center } from '@mantine/core';
import { useRouter } from 'next/router';

import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';
import { NewsDetailDto } from '@/utils/types';

interface Props {
  newData: NewsDetailDto[];
}

const AllNews = (props: Props) => {
  const { newData } = props;
  const autoplayOptions: any = {
    delay: 3000
  };
  const autoplay = useRef(Autoplay(autoplayOptions));

  const router = useRouter();
  const onClickNews = (id: string) => {
    router.push('/news/' + id);
  };
  return (
    <>
      <div className="mkdf-page-content-holder mkdf-grid-col-12">
        <section className="wpb-content-wrapper">
          <Center>
            <Carousel
              w={1100}
              h={650}
              loop
              withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}>
              {newData.slice(0, 5).map((item) => {
                return (
                  <Carousel.Slide key={item.id}>
                    <div className="mkdf-ni-item-inner carousel-parent">
                      <div className="mkdf-post-image">
                        <Image
                          height={'90vh'}
                          fit="cover"
                          src={item.thumbnail}
                          className="attachment-full size-full"
                          alt="s"
                          style={{ objectFit: 'cover', maxWidth: '1300px', height: '650px' }}
                        />
                      </div>
                      <Center>
                        <div className="mkdf-ni-content carousel-content">
                          <div className="mkdf-ni-info mkdf-ni-info-top">
                            <Center>
                              <div className="mkdf-post-info-category tag-carousel">
                                <a onClick={() => onClickNews(item.id)}>{item.tag}</a>
                              </div>
                            </Center>
                          </div>
                          <div>
                            <h4 className="entry-title mkdf-post-title">
                              <a
                                style={{
                                  backgroundColor: 'white',
                                  fontSize: '3rem',
                                  lineHeight: '1.3'
                                }}
                                onClick={() => onClickNews(item.id)}
                                title="Travel is a new experience.">
                                {item.title}
                              </a>
                            </h4>
                          </div>
                          <div className="mkdf-ni-info mkdf-ni-info-bottom">
                            <div className="mkdf-post-info-author-image"></div>
                            <div className="mkdf-post-info-author">
                              <a
                                className="mkdf-post-info-author-link"
                                onClick={() => onClickNews(item.id)}
                                style={{ backgroundColor: 'white' }}>
                                {item.time}
                              </a>
                            </div>
                          </div>
                        </div>
                      </Center>
                    </div>
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </Center>
          <div className="mkdf-row-grid-section-wrapper mkdf-content-aligment-left">
            <div className="mkdf-row-grid-section">
              <div className="vc_row wpb_row vc_row-fluid">
                <div className="wpb_column vc_column_container vc_col-sm-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div className="vc_empty_space" style={{ height: '43px' }}>
                        <span className="vc_empty_space_inner"></span>
                      </div>
                      <div className="wpb_text_column wpb_content_element">
                        <div className="wpb_wrapper">
                          <h6>See the latest posts</h6>
                        </div>
                      </div>
                      <div className="vc_empty_space" style={{ height: '34px' }}>
                        <span className="vc_empty_space_inner"></span>
                      </div>
                      <div
                        className="mkdf-news-holder mkdf-layout2 mkdf-grid-list mkdf-three-columns mkdf-normal-space"
                        data-post-status="publish"
                        data-post-in="937,941,945"
                        data-ignore-sticky-posts="1"
                        data-posts-per-page="3"
                        data-paged="1"
                        data-max-num-pages="1"
                        data-next-page="2"
                        data-title-tag="h4"
                        data-image-size="full"
                        data-display-categories="yes"
                        data-date-format="difference"
                        data-display-author="yes"
                        data-display-share="no"
                        data-display-hot-trending-icons="yes"
                        data-layout="mkdf_layout2">
                        <div
                          className="mkdf-news-list-inner mkdf-outer-space"
                          data-number-of-items="1"
                          data-slider-speed="5000"
                          data-slider-speed-animation="600">
                          <div className="mkdf-news-item mkdf-layout2-item mkdf-item-space">
                            <div className="mkdf-ni-inner">
                              <div className="mkdf-ni-image-holder">
                                <div className="mkdf-post-image">
                                  <a
                                    onClick={() => onClickNews(newData[6].id)}
                                    title="Travel is a new experience.">
                                    <img
                                      width="1100"
                                      height="1322"
                                      src={newData[6].thumbnail}
                                      className="attachment-full size-full"
                                      alt="m"
                                      loading="lazy"
                                      sizes="(max-width: 1100px) 100vw, 1100px"
                                    />
                                  </a>
                                </div>
                                <div className="mkdf-post-info-hot-trending">
                                  <div className="mkdf-post-info-hot"></div>
                                </div>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-info mkdf-ni-info-top">
                                  <div
                                    className="mkdf-post-info-category"
                                    style={{ backgroundColor: '#d43f44' }}>
                                    <a onClick={() => onClickNews(newData[6].id)}>
                                      {newData[6].tag}
                                    </a>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[6].id)}
                                      title="Travel is a new experience.">
                                      {newData[6].title}
                                    </a>
                                  </h4>
                                </div>
                                <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                  <div className="mkdf-post-info-author-image"></div>
                                  <div className="mkdf-post-info-author">
                                    <span className="mkdf-post-info-author-text"> </span>
                                    <a
                                      className="mkdf-post-info-author-link"
                                      onClick={() => onClickNews(newData[6].id)}>
                                      {newData[6].time}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout2-item mkdf-item-space">
                            <div className="mkdf-ni-inner">
                              <div className="mkdf-ni-image-holder">
                                <div className="mkdf-post-image">
                                  <a
                                    onClick={() => onClickNews(newData[7].id)}
                                    title="Bandwagon of existing trends.">
                                    <img
                                      width="1100"
                                      height="1322"
                                      src={newData[7].thumbnail}
                                      className="attachment-full size-full"
                                      alt="m"
                                      loading="lazy"
                                      sizes="(max-width: 1100px) 100vw, 1100px"
                                    />
                                  </a>
                                </div>
                                <div className="mkdf-post-info-hot-trending">
                                  <div className="mkdf-post-info-nsfw">
                                    <span className="mkdf-news-ht-icon mkdf-news-nsfw">
                                      <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 34 34">
                                        <circle className="st0" cx="17" cy="17" r="16" />
                                        <path
                                          className="st1"
                                          d="M32.9,18.8C31.5,31.5,18.5,33,18.8,32.9c-0.9-0.8-1.7-1.7-2.5-2.5l1.2,1.2c-0.9-0.9-1.7-1.7-2.6-2.6
                            c-0.9-0.9-1.7-1.7-2.6-2.6c-1.4-1.4-2.9-2.7-3.9-4.4c-2.1-3.6-1.6-8.3,1.1-11.5c2.7-3.1,7.1-4.3,10.9-2.9c1.6,0.6,2.9,1.6,4.2,2.8
                            c0.5,0.5,0.9,0.9,1.4,1.4c0.9,0.9,1.8,1.8,2.6,2.6L32.9,18.8z"
                                        />
                                        <path className="st1" d="M20,29.7" />
                                        <path
                                          className="st2"
                                          d="M17,7C11.5,7,7,11.5,7,17s4.5,10,10,10s10-4.5,10-10S22.5,7,17,7z M9.5,17c0-4.2,3.4-7.5,7.5-7.5
                            c1.6,0,3.1,0.5,4.4,1.4L10.9,21.4C10,20.1,9.5,18.6,9.5,17z M17,24.5c-1.6,0-3.1-0.5-4.4-1.4l10.5-10.5c0.9,1.2,1.4,2.8,1.4,4.4
                            C24.5,21.2,21.2,24.5,17,24.5z"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-info mkdf-ni-info-top">
                                  <div
                                    className="mkdf-post-info-category"
                                    style={{ backgroundColor: '#f56600' }}>
                                    <a onClick={() => onClickNews(newData[7].id)}>
                                      {newData[7].tag}
                                    </a>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[7].id)}
                                      title="Bandwagon of existing trends.">
                                      {newData[7].title}
                                    </a>
                                  </h4>
                                </div>
                                <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                  <div className="mkdf-post-info-author-image"></div>
                                  <div className="mkdf-post-info-author">
                                    <span className="mkdf-post-info-author-text"> </span>
                                    <a
                                      className="mkdf-post-info-author-link"
                                      onClick={() => onClickNews(newData[7].id)}>
                                      {newData[7].time}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout2-item mkdf-item-space">
                            <div className="mkdf-ni-inner">
                              <div className="mkdf-ni-image-holder">
                                <div className="mkdf-post-image">
                                  <a
                                    onClick={() => onClickNews(newData[8].id)}
                                    title="Arms around each other.">
                                    <img
                                      width="1100"
                                      height="1319"
                                      src={newData[8].thumbnail}
                                      className="attachment-full size-full"
                                      alt="m"
                                      loading="lazy"
                                      sizes="(max-width: 1100px) 100vw, 1100px"
                                    />
                                  </a>
                                </div>
                                <div className="mkdf-post-info-hot-trending">
                                  <div className="mkdf-post-info-nsfw">
                                    <span className="mkdf-news-ht-icon mkdf-news-nsfw">
                                      <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 34 34">
                                        <circle className="st0" cx="17" cy="17" r="16" />
                                        <path
                                          className="st1"
                                          d="M32.9,18.8C31.5,31.5,18.5,33,18.8,32.9c-0.9-0.8-1.7-1.7-2.5-2.5l1.2,1.2c-0.9-0.9-1.7-1.7-2.6-2.6
                            c-0.9-0.9-1.7-1.7-2.6-2.6c-1.4-1.4-2.9-2.7-3.9-4.4c-2.1-3.6-1.6-8.3,1.1-11.5c2.7-3.1,7.1-4.3,10.9-2.9c1.6,0.6,2.9,1.6,4.2,2.8
                            c0.5,0.5,0.9,0.9,1.4,1.4c0.9,0.9,1.8,1.8,2.6,2.6L32.9,18.8z"
                                        />
                                        <path className="st1" d="M20,29.7" />
                                        <path
                                          className="st2"
                                          d="M17,7C11.5,7,7,11.5,7,17s4.5,10,10,10s10-4.5,10-10S22.5,7,17,7z M9.5,17c0-4.2,3.4-7.5,7.5-7.5
                            c1.6,0,3.1,0.5,4.4,1.4L10.9,21.4C10,20.1,9.5,18.6,9.5,17z M17,24.5c-1.6,0-3.1-0.5-4.4-1.4l10.5-10.5c0.9,1.2,1.4,2.8,1.4,4.4
                            C24.5,21.2,21.2,24.5,17,24.5z"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-info mkdf-ni-info-top">
                                  <div
                                    className="mkdf-post-info-category"
                                    style={{ backgroundColor: '#f1d249' }}>
                                    <a onClick={() => onClickNews(newData[8].id)}>
                                      {newData[8].tag}
                                    </a>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[8].id)}
                                      title="Arms around each other.">
                                      {newData[8].title}
                                    </a>
                                  </h4>
                                </div>
                                <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                  <div className="mkdf-post-info-author-image"></div>
                                  <div className="mkdf-post-info-author">
                                    <span className="mkdf-post-info-author-text"> </span>
                                    <a
                                      className="mkdf-post-info-author-link"
                                      onClick={() => onClickNews(newData[8].id)}>
                                      {newData[8].time}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mkdf-row-grid-section-wrapper">
            <div className="mkdf-row-grid-section">
              <div className="vc_row wpb_row vc_row-fluid vc_custom_1549630387252">
                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-9 vc_col-md-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div
                        className="mkdf-news-holder mkdf-layout2 mkdf-grid-list mkdf-one-columns mkdf-normal-space"
                        data-post-status="publish"
                        data-post-in="957"
                        data-ignore-sticky-posts="1"
                        data-posts-per-page="1"
                        data-paged="1"
                        data-max-num-pages="1"
                        data-next-page="2"
                        data-title-tag="h3"
                        data-image-size="full"
                        data-display-categories="yes"
                        data-date-format="difference"
                        data-display-author="yes"
                        data-display-share="yes"
                        data-display-hot-trending-icons="no"
                        data-layout="mkdf_layout2">
                        <div
                          className="mkdf-news-list-inner mkdf-outer-space"
                          data-number-of-items="1"
                          data-slider-speed="5000"
                          data-slider-speed-animation="600">
                          <div className="mkdf-news-item mkdf-layout2-item mkdf-item-space">
                            <div className="mkdf-ni-inner">
                              <div className="mkdf-ni-image-holder">
                                <div className="mkdf-post-image">
                                  <a
                                    onClick={() => onClickNews(newData[9].id)}
                                    title="The entertainment branch of industry.">
                                    <img
                                      width="1100"
                                      height="657"
                                      src={newData[9].thumbnail}
                                      className="attachment-full size-full"
                                      alt="g"
                                      loading="lazy"
                                      sizes="(max-width: 1100px) 100vw, 1100px"
                                    />
                                  </a>
                                </div>
                                <div className="mkdf-blog-share">
                                  <div className="mkdf-social-share-holder mkdf-dropdown mkdf-left">
                                    <a
                                      className="mkdf-social-share-dropdown-opener"
                                      href="javascript:void(0)">
                                      <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 34 34">
                                        <circle className="st0" cx="16.8" cy="16.9" r="16.1" />
                                        <path
                                          className="st1"
                                          d="M20,32.7c7.1-1.5,12.4-7.6,12.9-14.8L31,16.1l-6-5.8l-3.7,2.1l-10,1l2.2,5.9L12.2,25l7.9,7.7"
                                        />
                                        <path
                                          className="st2"
                                          d="M10.6,8.7c1.8,0,3.3,1.2,3.6,2.9h4c0.4-1.7,1.9-2.9,3.6-2.9c2.1,0,3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8
            c-1.8,0-3.3-1.2-3.6-2.9h-4c-0.2,0.9-0.7,1.6-1.4,2.1l1.5,3.4c0.2,0,0.4-0.1,0.7-0.1c2.1,0,3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8
            c-2.1,0-3.8-1.7-3.8-3.8c0-1.2,0.6-2.3,1.5-3l-1.5-3.4c-0.2,0-0.4,0.1-0.7,0.1c-2.1,0-3.8-1.7-3.8-3.8C6.8,10.4,8.5,8.7,10.6,8.7z"
                                        />
                                      </svg>
                                    </a>
                                    <div className="mkdf-social-share-dropdown">
                                      <ul>
                                        <li className="mkdf-facebook-share">
                                          <a className="mkdf-share-link" href="#">
                                            <span className="mkdf-social-network-text">Fb.</span>
                                            <span className="mkdf-social-network-bg-1"></span>
                                            <span className="mkdf-social-network-bg-2"></span>
                                          </a>
                                        </li>
                                        <li className="mkdf-twitter-share">
                                          <a className="mkdf-share-link" href="#">
                                            <span className="mkdf-social-network-text">Tw.</span>
                                            <span className="mkdf-social-network-bg-1"></span>
                                            <span className="mkdf-social-network-bg-2"></span>
                                          </a>
                                        </li>
                                        <li className="mkdf-pinterest-share">
                                          <a className="mkdf-share-link" href="#">
                                            <span className="mkdf-social-network-text">Pin.</span>
                                            <span className="mkdf-social-network-bg-1"></span>
                                            <span className="mkdf-social-network-bg-2"></span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-info mkdf-ni-info-top">
                                  <div
                                    className="mkdf-post-info-category"
                                    style={{ backgroundColor: '#57c2c8' }}>
                                    <a onClick={() => onClickNews(newData[9].id)}>
                                      {newData[9].tag}
                                    </a>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[9].id)}
                                      title="The entertainment branch of industry.">
                                      {newData[9].title}
                                    </a>
                                  </h3>
                                </div>
                                <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                  <div className="mkdf-post-info-author-image"></div>
                                  <div className="mkdf-post-info-author">
                                    <span className="mkdf-post-info-author-text"> </span>
                                    <a
                                      className="mkdf-post-info-author-link"
                                      onClick={() => onClickNews(newData[9].id)}>
                                      {newData[9].time}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="vc_empty_space" style={{ height: '30px' }}>
                        <span className="vc_empty_space_inner"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-3 vc_col-md-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div className="mkdf-elements-holder mkdf-one-column mkdf-responsive-mode-768">
                        <div
                          className="mkdf-eh-item"
                          data-1367-1600="12px 0 0 0"
                          data-1025-1366="12px 0 0 0"
                          data-769-1024="12px 0 0 0"
                          data-681-768="0px 0 0 0"
                          data-680="0px 0 0 0">
                          <div className="mkdf-eh-item-inner">
                            <div
                              className="mkdf-eh-item-content mkdf-eh-custom-7432"
                              style={{ padding: '12px 0 0 0' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="wpb_widgetised_column wpb_content_element">
                        <div className="wpb_wrapper">
                          <div className="widget mkdf-blog-list-widget">
                            <div
                              className="mkdf-blog-list-holder mkdf-grid-list mkdf-disable-bottom-space mkdf-bl-minimal mkdf-one-columns mkdf-medium-space mkdf-bl-pag-no-pagination"
                              data-type="minimal"
                              data-number-of-posts="4"
                              data-number-of-columns="one"
                              data-space-between-items="medium"
                              data-category="culture"
                              data-orderby="date"
                              data-order="ASC"
                              data-image-size="thumbnail"
                              data-title-tag="h6"
                              data-excerpt-length="40"
                              data-post-info-section="yes"
                              data-post-info-image="yes"
                              data-post-info-author="yes"
                              data-post-info-date="yes"
                              data-post-info-category="yes"
                              data-post-info-comments="no"
                              data-post-info-like="no"
                              data-post-info-share="no"
                              data-pagination-type="no-pagination"
                              data-max-num-pages="10"
                              data-next-page="2">
                              <div className="mkdf-bl-wrapper mkdf-outer-space">
                                <ul className="mkdf-blog-list">
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-bli-content">
                                        <h6 className="entry-title mkdf-post-title">
                                          <a
                                            onClick={() => onClickNews(newData[10].id)}
                                            title="Contemporary art really has value">
                                            {newData[10].title}
                                          </a>
                                        </h6>
                                        <div className="mkdf-post-info-author-holder">
                                          <div className="mkdf-post-info-author-image"></div>
                                          <div className="mkdf-post-info-author">
                                            <a
                                              className="mkdf-post-info-author-link"
                                              onClick={() => onClickNews(newData[10].id)}>
                                              {newData[10].time}
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-bli-content">
                                        <h6 className="entry-title mkdf-post-title">
                                          <a
                                            onClick={() => onClickNews(newData[11].id)}
                                            title="Open the gates of transmission">
                                            {newData[11].title}
                                          </a>
                                        </h6>
                                        <div className="mkdf-post-info-author-holder">
                                          <div className="mkdf-post-info-author-image"></div>
                                          <div className="mkdf-post-info-author">
                                            <a
                                              className="mkdf-post-info-author-link"
                                              onClick={() => onClickNews(newData[11].id)}>
                                              {newData[11].time}
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-bli-content">
                                        <h6 className="entry-title mkdf-post-title">
                                          <a
                                            onClick={() => onClickNews(newData[12].id)}
                                            title="Life is design without an eraser.">
                                            {newData[12].title}
                                          </a>
                                        </h6>
                                        <div className="mkdf-post-info-author-holder">
                                          <div className="mkdf-post-info-author-image"></div>
                                          <div className="mkdf-post-info-author">
                                            <a
                                              className="mkdf-post-info-author-link"
                                              onClick={() => onClickNews(newData[12].id)}>
                                              {newData[12].time}
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-bli-content">
                                        <h6 className="entry-title mkdf-post-title">
                                          <a
                                            onClick={() => onClickNews(newData[13].id)}
                                            title="A work of art is an adventure">
                                            {newData[13].title}
                                          </a>
                                        </h6>
                                        <div className="mkdf-post-info-author-holder">
                                          <div className="mkdf-post-info-author-image"></div>
                                          <div className="mkdf-post-info-author">
                                            <a
                                              className="mkdf-post-info-author-link"
                                              onClick={() => onClickNews(newData[13].id)}>
                                              {newData[13].time}
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mkdf-row-grid-section-wrapper">
            <div className="mkdf-row-grid-section">
              <div className="vc_row wpb_row vc_row-fluid vc_custom_1549637160771">
                <div className="wpb_column vc_column_container vc_col-sm-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div
                        className="mkdf-news-holder mkdf-layout4 mkdf-grid-list mkdf-four-columns mkdf-normal-space"
                        data-post-status="publish"
                        data-post-in="995,991,987,983,979,975,971,967"
                        data-ignore-sticky-posts="1"
                        data-posts-per-page="8"
                        data-paged="1"
                        data-max-num-pages="1"
                        data-next-page="2"
                        data-title-tag="h6"
                        data-image-size="full"
                        data-display-date="yes"
                        data-date-format="difference"
                        data-layout="mkdf_layout4">
                        <div
                          className="mkdf-news-list-inner mkdf-outer-space"
                          data-number-of-items="1"
                          data-slider-speed="5000"
                          data-slider-speed-animation="600">
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[10].id)}
                                  title="Solution to each new problem.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[10].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[10].id)}
                                      title="Solution to each new problem.">
                                      {newData[10].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[10].id)}>
                                    {newData[10].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[11].id)}
                                  title="Important ingredient to family life.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[11].thumbnail}
                                    className="attachment-full size-full"
                                    alt="f"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[11].id)}
                                      title="Important ingredient to family life.">
                                      {newData[11].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[11].id)}>
                                    {newData[11].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[12].id)}
                                  title="If you live a rebellious lifestyle.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[12].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[12].id)}
                                      title="If you live a rebellious lifestyle.">
                                      {newData[12].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[12].id)}>
                                    {newData[12].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[13].id)}
                                  title="Wonderful countries in the world.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[13].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[13].id)}
                                      title="Wonderful countries in the world.">
                                      {newData[13].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[13].id)}>
                                    {newData[13].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[14].id)}
                                  title="Wandering the city is entertainment.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[14].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[14].id)}
                                      title="Wandering the city is entertainment.">
                                      {newData[14].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[14].id)}>
                                    {newData[14].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[15].id)}
                                  title="Never lose sight of the fact.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[15].thumbnail}
                                    className="attachment-full size-full"
                                    alt="j"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[15].id)}
                                      title="Never lose sight of the fact.">
                                      {newData[15].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[15].id)}>
                                    {newData[15].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[16].id)}
                                  title="My dreams for the future are simple.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[16].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[16].id)}
                                      title="My dreams for the future are simple.">
                                      {newData[16].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[16].id)}>
                                    {newData[16].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout4-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner clearfix">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[17].id)}
                                  title="I look for anything new and inspiring.">
                                  <img
                                    width="1100"
                                    height="719"
                                    src={newData[17].thumbnail}
                                    className="attachment-full size-full"
                                    alt="s"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[17].id)}
                                      title="I look for anything new and inspiring.">
                                      {newData[17].title}
                                    </a>
                                  </h6>
                                </div>
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(newData[17].id)}>
                                    {newData[17].time}
                                  </a>
                                  <meta content="UserComments: 0" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mkdf-row-grid-section-wrapper">
            <div className="mkdf-row-grid-section">
              <div className="vc_row wpb_row vc_row-fluid">
                <div className="wpb_column vc_column_container vc_col-sm-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div
                        className="mkdf-news-holder mkdf-video-block1 mkdf-news-block-pp-two-third-one-third mkdf-normal-space"
                        data-post-status="publish"
                        data-post-in="1004,1008,1012"
                        data-only-videos="yes"
                        data-ignore-sticky-posts="1"
                        data-posts-per-page="3"
                        data-paged="1"
                        data-max-num-pages="1"
                        data-next-page="2"
                        data-title-tag="h6"
                        data-image-size="full"
                        data-display-date="no"
                        data-featured-title-tag="h3"
                        data-featured-image-size="full"
                        data-featured-display-categories="yes"
                        data-featured-display-date="no"
                        data-featured-date-format="no"
                        data-featured-display-share="yes"
                        data-featured-display-hot-trending-icons="no"
                        data-layout="mkdf_video_block1">
                        <div
                          className="mkdf-news-list-inner mkdf-outer-space"
                          data-number-of-items="1"
                          data-slider-speed="5000"
                          data-slider-speed-animation="600">
                          <div className="mkdf-news-block-part-featured">
                            <div className="mkdf-news-item mkdf-video-layout1-item mkdf-item-space">
                              <div className="mkdf-news-item-inner">
                                <div className="mkdf-news-video-holder">
                                  <div className="mkdf-post-image">
                                    <a
                                      onClick={() => onClickNews(newData[18].id)}
                                      title="Architecture belongs to culture.">
                                      <img
                                        width="1100"
                                        height="680"
                                        src={newData[18].thumbnail}
                                        className="attachment-full size-full"
                                        alt="j"
                                        loading="lazy"
                                        sizes="(max-width: 1100px) 100vw, 1100px"
                                      />
                                    </a>
                                  </div>
                                  <div className="mkdf-blog-share">
                                    <div className="mkdf-social-share-holder mkdf-dropdown mkdf-left">
                                      <a
                                        className="mkdf-social-share-dropdown-opener"
                                        href="javascript:void(0)"></a>
                                      <div className="mkdf-social-share-dropdown">
                                        <ul>
                                          <li className="mkdf-facebook-share">
                                            <a className="mkdf-share-link" href="#">
                                              <span className="mkdf-social-network-text">Fb.</span>
                                              <span className="mkdf-social-network-bg-1"></span>
                                              <span className="mkdf-social-network-bg-2"></span>
                                            </a>
                                          </li>
                                          <li className="mkdf-twitter-share">
                                            <a className="mkdf-share-link" href="#">
                                              <span className="mkdf-social-network-text">Tw.</span>
                                              <span className="mkdf-social-network-bg-1"></span>
                                              <span className="mkdf-social-network-bg-2"></span>
                                            </a>
                                          </li>
                                          <li className="mkdf-pinterest-share">
                                            <a className="mkdf-share-link" href="#">
                                              <span className="mkdf-social-network-text">Pin.</span>
                                              <span className="mkdf-social-network-bg-1"></span>
                                              <span className="mkdf-social-network-bg-2"></span>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mkdf-ni-content">
                                  <div className="mkdf-ni-info mkdf-ni-info-top">
                                    <div
                                      className="mkdf-post-info-category"
                                      style={{ backgroundColor: '#154440' }}>
                                      <a onClick={() => onClickNews(newData[18].id)}>
                                        {newData[18].tag}
                                      </a>
                                    </div>
                                  </div>
                                  <h3 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[22].id)}
                                      title="Architecture belongs to culture.">
                                      {newData[18].title}
                                    </a>
                                  </h3>
                                  <div className="mkdf-ni-info"></div>
                                </div>
                                <a
                                  onClick={() => onClickNews(newData[18].id)}
                                  title="Architecture belongs to culture."
                                  className="mkdf-ni-icon">
                                  <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 37 37">
                                    <circle className="st0" cx="18.5" cy="18.3" r="16.4" />
                                    <path
                                      className="st1"
                                      d="M34.4,22.3l-2-1.4l-9-6.3l0,0l-7.6-5.3l-0.9,10.9c-0.5,1-1.1,2.2-1.6,3.5l0.4,3.5l9.8,6.9l0.1,0
                C30,31.7,33.4,26.6,34.4,22.3L34.4,22.3z"
                                    />
                                    <g>
                                      <path
                                        className="st2"
                                        d="M13,11c0-2,1.4-2.8,3-1.6l9.4,6.6c1.7,1.2,1.7,3.1,0,4.3L16,26.9c-1.7,1.2-3,0.5-3-1.6V11z"
                                      />
                                    </g>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="mkdf-news-block-part-non-featured">
                            <div className="mkdf-news-item mkdf-video-layout1-item mkdf-item-space">
                              <div className="mkdf-news-item-inner">
                                <div className="mkdf-news-video-holder">
                                  <div className="mkdf-post-image">
                                    <a
                                      onClick={() => onClickNews(newData[19].id)}
                                      title="Travel early and travel often">
                                      <img
                                        style={{ height: '40vh!important' }}
                                        src={newData[19].thumbnail}
                                        className="attachment-full size-full"
                                        alt="m"
                                        loading="lazy"
                                        sizes="(max-width: 1100px) 100vw, 1100px"
                                      />
                                    </a>
                                  </div>
                                </div>
                                <div className="mkdf-ni-content">
                                  <div className="mkdf-ni-info mkdf-ni-info-top">
                                    <div
                                      className="mkdf-post-info-category"
                                      style={{ backgroundColor: '#154440' }}>
                                      <a onClick={() => onClickNews(newData[19].id)}>
                                        {newData[19].tag}
                                      </a>
                                    </div>
                                  </div>
                                  <h6 className="entry-title mkdf-post-title">
                                    <a
                                      onClick={() => onClickNews(newData[19].id)}
                                      title="Travel early and travel often">
                                      {newData[19].title}
                                    </a>
                                  </h6>
                                  <div className="mkdf-ni-info"></div>
                                </div>
                                <a
                                  onClick={() => onClickNews(newData[19].id)}
                                  title="Travel early and travel often"
                                  className="mkdf-ni-icon">
                                  <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 37 37">
                                    <circle className="st0" cx="18.5" cy="18.3" r="16.4" />
                                    <path
                                      className="st1"
                                      d="M34.4,22.3l-2-1.4l-9-6.3l0,0l-7.6-5.3l-0.9,10.9c-0.5,1-1.1,2.2-1.6,3.5l0.4,3.5l9.8,6.9l0.1,0
                C30,31.7,33.4,26.6,34.4,22.3L34.4,22.3z"
                                    />
                                    <g>
                                      <path
                                        className="st2"
                                        d="M13,11c0-2,1.4-2.8,3-1.6l9.4,6.6c1.7,1.2,1.7,3.1,0,4.3L16,26.9c-1.7,1.2-3,0.5-3-1.6V11z"
                                      />
                                    </g>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mkdf-row-grid-section-wrapper">
            <div className="mkdf-row-grid-section">
              <div className="vc_row wpb_row vc_row-fluid vc_custom_1553772734077">
                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-9 vc_col-md-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div
                        className="mkdf-news-holder mkdf-layout5 mkdf-grid-list mkdf-three-columns mkdf-normal-space"
                        data-post-status="publish"
                        data-post-in="460,453,445,438,434,423"
                        data-ignore-sticky-posts="1"
                        data-posts-per-page="6"
                        data-paged="1"
                        data-max-num-pages="1"
                        data-next-page="2"
                        data-title-tag="h6"
                        data-image-size="full"
                        data-display-categories="yes"
                        data-display-date="yes"
                        data-date-format="difference"
                        data-display-hot-trending-icons="no"
                        data-layout="mkdf_layout5">
                        <div
                          className="mkdf-news-list-inner mkdf-outer-space"
                          data-number-of-items="1"
                          data-slider-speed="5000"
                          data-slider-speed-animation="600">
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[21].id)}
                                  title="Everybody has a creative potential.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[21].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#154440' }}>
                                        <a onClick={() => onClickNews(newData[21].id)}>
                                          {newData[21].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[21].id)}
                                          title="Everybody has a creative potential.">
                                          {newData[21].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[21].id)}>
                                          {newData[21].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[21].id)}
                                title="Everybody has a creative potential."></a>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[22].id)}
                                  title="Your soul is infinitely creative.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[22].thumbnail}
                                    className="attachment-full size-full"
                                    alt="s"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#f56600' }}>
                                        <a onClick={() => onClickNews(newData[22].id)}>
                                          {newData[22].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[22].id)}
                                          title="Your soul is infinitely creative.">
                                          {newData[22].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[22].id)}>
                                          {newData[22].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[22].id)}
                                title="Your soul is infinitely creative."></a>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[23].id)}
                                  title="When you have a creative mind.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[23].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#d43f44' }}>
                                        <a onClick={() => onClickNews(newData[23].id)}>
                                          {newData[23].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[23].id)}
                                          title="When you have a creative mind.">
                                          {newData[23].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[23].id)}>
                                          {newData[23].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[23].id)}
                                title="When you have a creative mind."></a>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[24].id)}
                                  title="They&#8217;re all art expressions.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[24].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#de4190' }}>
                                        <a onClick={() => onClickNews(newData[24].id)}>
                                          {newData[24].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[24].id)}
                                          title="They&#8217;re all art expressions.">
                                          {newData[24].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[24].id)}>
                                          {newData[24].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[24].id)}
                                title="They&#8217;re all art expressions."></a>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[25].id)}
                                  title="Cooking is an art, a creative thing.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[25].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#a5d300' }}>
                                        <a onClick={() => onClickNews(newData[25].id)}>
                                          {newData[25].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[25].id)}
                                          title="Cooking is an art, a creative thing.">
                                          {newData[25].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[25].id)}>
                                          {newData[25].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[25].id)}
                                title="Cooking is an art, a creative thing."></a>
                            </div>
                          </div>
                          <div className="mkdf-news-item mkdf-layout5-item mkdf-item-space">
                            <div className="mkdf-ni-item-inner">
                              <div className="mkdf-post-image">
                                <a
                                  onClick={() => onClickNews(newData[26].id)}
                                  title="A creative project is a moving target.">
                                  <img
                                    width="1100"
                                    height="1421"
                                    src={newData[26].thumbnail}
                                    className="attachment-full size-full"
                                    alt="m"
                                    loading="lazy"
                                    sizes="(max-width: 1100px) 100vw, 1100px"
                                  />
                                </a>
                              </div>
                              <div className="mkdf-ni-content">
                                <div className="mkdf-ni-content-wrapper">
                                  <div className="mkdf-ni-content-inner">
                                    <div className="mkdf-ni-info mkdf-ni-info-top">
                                      <div
                                        className="mkdf-post-info-category"
                                        style={{ backgroundColor: '#f1d249' }}>
                                        <a onClick={() => onClickNews(newData[26].id)}>
                                          {newData[26].tag}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="entry-title mkdf-post-title">
                                        <a
                                          onClick={() => onClickNews(newData[26].id)}
                                          title="A creative project is a moving target.">
                                          {newData[26].title}
                                        </a>
                                      </h6>
                                    </div>
                                    <div className="mkdf-ni-info mkdf-ni-info-bottom">
                                      <div className="mkdf-post-info-date entry-date published updated">
                                        <a onClick={() => onClickNews(newData[26].id)}>
                                          {newData[26].time}
                                        </a>
                                        <meta content="UserComments: 0" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <a
                                className="mkdf-ni-item-link"
                                onClick={() => onClickNews(newData[26].id)}
                                title="A creative project is a moving target."></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wpb_column vc_column_container vc_col-sm-12 vc_col-lg-3 vc_col-md-12">
                  <div className="vc_column-inner">
                    <div className="wpb_wrapper">
                      <div className="wpb_widgetised_column wpb_content_element">
                        <div className="wpb_wrapper">
                          <div className="widget mkdf-separator-widget">
                            <div className="mkdf-separator-holder clearfix mkdf-separator-center mkdf-separator-normal">
                              <div
                                className="mkdf-separator"
                                style={{
                                  borderColor: 'transparent',
                                  borderStyle: 'solid',
                                  marginTop: '17px'
                                }}></div>
                            </div>
                          </div>
                          <div className="widget mkdf-blog-list-widget">
                            <div className="mkdf-blog-list-holder mkdf-grid-list mkdf-disable-bottom-space mkdf-bl-simple mkdf-one-columns mkdf-normal-space mkdf-bl-pag-no-pagination">
                              <div className="mkdf-bl-wrapper mkdf-outer-space">
                                <ul className="mkdf-blog-list">
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-post-image">
                                        <a
                                          onClick={() => onClickNews(newData[27].id)}
                                          title="Contemporary art really has value">
                                          <img
                                            width="150"
                                            height="150"
                                            src={newData[27].thumbnail}
                                            className="attachment-thumbnail size-thumbnail"
                                            alt="n"
                                            loading="lazy"
                                            sizes="(max-width: 150px) 100vw, 150px"
                                          />
                                        </a>
                                      </div>
                                      <div className="mkdf-bli-content">
                                        <span
                                          className="entry-title mkdf-post-title"
                                          style={{ textTransform: 'uppercase' }}>
                                          <a
                                            onClick={() => onClickNews(newData[27].id)}
                                            title="Contemporary art really has value">
                                            {newData[27].title}
                                          </a>
                                        </span>
                                        <div className="mkdf-post-info-date entry-date published updated">
                                          <a onClick={() => onClickNews(newData[27].id)}>
                                            {newData[27].time}
                                          </a>
                                          <meta content="UserComments: 0" />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-post-image">
                                        <a
                                          onClick={() => onClickNews(newData[28].id)}
                                          title="Open the gates of transmission">
                                          <img
                                            width="150"
                                            height="150"
                                            src={newData[28].thumbnail}
                                            className="attachment-thumbnail size-thumbnail"
                                            alt="m"
                                            loading="lazy"
                                            sizes="(max-width: 150px) 100vw, 150px"
                                          />
                                        </a>
                                      </div>
                                      <div className="mkdf-bli-content">
                                        <span
                                          className="entry-title mkdf-post-title"
                                          style={{ textTransform: 'uppercase' }}>
                                          <a
                                            onClick={() => onClickNews(newData[28].id)}
                                            title="Open the gates of transmission">
                                            {newData[28].title}
                                          </a>
                                        </span>
                                        <div className="mkdf-post-info-date entry-date published updated">
                                          <a onClick={() => onClickNews(newData[28].id)}>
                                            {newData[28].time}
                                          </a>
                                          <meta content="UserComments: 0" />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-post-image">
                                        <a
                                          onClick={() => onClickNews(newData[29].id)}
                                          title="Life is design without an eraser.">
                                          <img
                                            width="150"
                                            height="150"
                                            src={newData[29].thumbnail}
                                            className="attachment-thumbnail size-thumbnail"
                                            alt="m"
                                            loading="lazy"
                                            sizes="(max-width: 150px) 100vw, 150px"
                                          />
                                        </a>
                                      </div>
                                      <div className="mkdf-bli-content">
                                        <span
                                          className="entry-title mkdf-post-title"
                                          style={{ textTransform: 'uppercase' }}>
                                          <a
                                            onClick={() => onClickNews(newData[29].id)}
                                            title="Life is design without an eraser.">
                                            {newData[29].title}
                                          </a>
                                        </span>
                                        <div className="mkdf-post-info-date entry-date published updated">
                                          <a onClick={() => onClickNews(newData[29].id)}>
                                            {newData[29].time}
                                          </a>
                                          <meta content="UserComments: 0" />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-post-image">
                                        <a
                                          onClick={() => onClickNews(newData[30].id)}
                                          title="A work of art is an adventure">
                                          <img
                                            width="150"
                                            height="150"
                                            src={newData[30].thumbnail}
                                            className="attachment-thumbnail size-thumbnail"
                                            alt="m"
                                            loading="lazy"
                                            sizes="(max-width: 150px) 100vw, 150px"
                                          />
                                        </a>
                                      </div>
                                      <div className="mkdf-bli-content">
                                        <span
                                          className="entry-title mkdf-post-title"
                                          style={{ textTransform: 'uppercase' }}>
                                          <a
                                            onClick={() => onClickNews(newData[30].id)}
                                            title="A work of art is an adventure">
                                            {newData[30].title}
                                          </a>
                                        </span>
                                        <div className="mkdf-post-info-date entry-date published updated">
                                          <a onClick={() => onClickNews(newData[30].id)}>
                                            {newData[30].time}
                                          </a>
                                          <meta content="UserComments: 0" />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="mkdf-bl-item mkdf-item-space clearfix">
                                    <div className="mkdf-bli-inner">
                                      <div className="mkdf-post-image">
                                        <a
                                          onClick={() => onClickNews(newData[31].id)}
                                          title="Create a culture where you can">
                                          <img
                                            width="150"
                                            height="150"
                                            src={newData[31].thumbnail}
                                            className="attachment-thumbnail size-thumbnail"
                                            alt="m"
                                            loading="lazy"
                                            sizes="(max-width: 150px) 100vw, 150px"
                                          />
                                        </a>
                                      </div>
                                      <div className="mkdf-bli-content">
                                        <span
                                          className="entry-title mkdf-post-title"
                                          style={{ textTransform: 'uppercase' }}>
                                          <a
                                            onClick={() => onClickNews(newData[31].id)}
                                            title="Create a culture where you can">
                                            {newData[31].title}
                                          </a>
                                        </span>
                                        <div className="mkdf-post-info-date entry-date published updated">
                                          <a onClick={() => onClickNews(newData[31].id)}>
                                            {newData[31].time}
                                          </a>
                                          <meta content="UserComments: 0" />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="widget mkdf-separator-widget">
                            <div className="mkdf-separator-holder clearfix mkdf-separator-center mkdf-separator-normal">
                              <div
                                className="mkdf-separator"
                                style={{
                                  borderColor: 'transparent',
                                  borderStyle: 'solid',
                                  marginTop: '14px'
                                }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AllNews;
