import { Container, Flex, Image, Paper, Text } from '@mantine/core';
import { createStyles, useMantineTheme } from '@mantine/styles';
import { useNewDetailStyles } from './NewDetail.style';
import { NewsDetailDto } from '@/utils/types';
import config from '@/config/config';
import { useRouter } from 'next/router';

interface Props {
  newsDetailData: NewsDetailDto;
  otherNews: NewsDetailDto[];
}
function NewsDetail(props: Props) {
  const { classes } = useNewDetailStyles();
  const { newsDetailData, otherNews } = props;

  const router = useRouter();
  const onClickNews = (id: string) => {
    router.push('/news/' + id);
  };
  return (
    <Container>
      <div className="mkdf-container-inner clearfix">
        <div className="mkdf-post-single-info-on-image">
          <div className="mkdf-news-post-top-holder">
            <div className="mkdf-top-part-post-image">
              <img
                width="1100"
                height="550"
                style={{ height: 'auto' }}
                src={config.IMAGE_URL + newsDetailData?.thumbnail}
                className="attachment-full size-full wp-post-image"
                alt="m"
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
            <div className="mkdf-npt-info">
              <div className="mkdf-npt-info-top-holder">
                <div className="mkdf-post-info-hot-trending">
                  <div className="mkdf-post-info-hot">
                    <span className="mkdf-news-ht-icon mkdf-news-hot"></span>
                  </div>
                </div>
              </div>
              <div className="mkdf-npt-info-bottom-holder">
                <div className="mkdf-npt-info-top">
                  <div className="mkdf-post-info-category" style={{ backgroundColor: '#d43f44' }}>
                    <a>{newsDetailData.tag}</a>
                  </div>
                </div>
                <h1 className="entry-title mkdf-post-title">{newsDetailData.title}</h1>
                <div className="mkdf-npt-info-bottom">
                  <div className="mkdf-post-info-date entry-date published updated">
                    <a>{newsDetailData.time}</a>
                    <meta content="UserComments: 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mkdf-grid-row mkdf-content-has-sidebar mkdf-grid-normal-gutter">
            <div className="mkdf-page-content-holder mkdf-grid-col-9">
              <div className="mkdf-blog-holder mkdf-blog-single mkdf-blog-single-info-on-image">
                <article
                  id="post-945"
                  className="post-945 post type-post status-publish format-standard has-post-thumbnail hentry category-travel tag-celebrities tag-city tag-inspiration tag-modern">
                  <div className="mkdf-post-content">
                    <div className="mkdf-post-text">
                      <div className="mkdf-post-text-inner">
                        <div className="mkdf-post-text-main">
                          <section className="wpb-content-wrapper">
                            {newsDetailData.content?.map((content, index) => {
                              return (
                                <div key={index + content.header}>
                                  <div className="vc_row wpb_row vc_row-fluid">
                                    <div className="wpb_column vc_column_container vc_col-sm-12">
                                      <div className="vc_column-inner">
                                        <div className="wpb_wrapper">
                                          <div
                                            className="vc_empty_space vc_custom_1548847238311"
                                            style={{ height: '0px' }}>
                                            <span className="vc_empty_space_inner"></span>
                                          </div>
                                          <div className="wpb_text_column wpb_content_element">
                                            <div className="wpb_wrapper">
                                              <div className="wpb_text_column wpb_content_element">
                                                <div className="wpb_wrapper">
                                                  <h4>{content.header}</h4>
                                                </div>
                                              </div>

                                              <p>
                                                {!index && (
                                                  <span
                                                    className="mkdf-dropcaps mkdf-normal"
                                                    style={{ color: '#ff3154' }}>
                                                    {content.text[0]}
                                                  </span>
                                                )}
                                                {!index
                                                  ? content.text.slice(1)
                                                  : content.text.slice()}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="vc_empty_space" style={{ height: 29 }}>
                                            <span className="vc_empty_space_inner"></span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {content.highLight && (
                                    <div className="wpb_text_column wpb_content_element">
                                      <div className="wpb_wrapper">
                                        <blockquote>
                                          <h4>
                                            <span style={{ color: '#ff3154' }}>
                                              “{content.highLight}”
                                            </span>
                                          </h4>
                                        </blockquote>
                                      </div>
                                    </div>
                                  )}
                                  <div className="vc_row wpb_row vc_row-fluid">
                                    <div className="wpb_column vc_column_container vc_col-sm-12">
                                      <div className="vc_column-inner">
                                        <div className="wpb_wrapper">
                                          <div className="mkdf-single-image-holder">
                                            <div className="mkdf-si-inner">
                                              <img
                                                width="1100"
                                                height="638"
                                                src={config.IMAGE_URL + content.image}
                                                className="attachment-full size-full"
                                                alt="m"
                                                loading="lazy"
                                                sizes="(max-width: 1100px) 100vw, 1100px"
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className="vc_empty_space"
                                            style={{ height: '51px' }}>
                                            <span className="vc_empty_space_inner"></span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="mkdf-related-posts-holder mkdf-news-holder clearfix">
                  <div className="mkdf-related-posts-holder-inner">
                    <div className="mkdf-related-posts-title">
                      <h4>Related Posts</h4>
                    </div>
                    <div className="mkdf-related-posts-inner clearfix">
                      <div className="mkdf-related-post mkdf-news-item">
                        <div className="mkdf-related-post-wrapper">
                          <div className="mkdf-related-post-image">
                            <a
                              onClick={() => onClickNews(otherNews[0].id)}
                              title="I could have focused on flowers">
                              <img
                                width="650"
                                height="550"
                                src={otherNews[0].thumbnail}
                                className="attachment-buzzy_mikado_image_portrait size-buzzy_mikado_image_portrait wp-post-image"
                                alt="m"
                                loading="lazy"
                              />
                            </a>
                          </div>
                          <div className="mkdf-related-post-inner">
                            <div className="mkdf-related-info-inner">
                              <div className="mkdf-related-category-holder">
                                <div
                                  className="mkdf-post-info-category"
                                  style={{ backgroundColor: '#e6e600' }}>
                                  <a>{otherNews[0].tag}</a>
                                </div>
                              </div>
                              <h6 className="entry-title mkdf-post-title">
                                <a
                                  onClick={() => onClickNews(otherNews[0].id)}
                                  title="I could have focused on flowers">
                                  {otherNews[0].title}
                                </a>
                              </h6>
                              <div className="mkdf-post-info">
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(otherNews[0].id)}>
                                    {otherNews[0].time}
                                  </a>
                                  <meta content="UserComments: 2" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mkdf-related-post mkdf-news-item">
                        <div className="mkdf-related-post-wrapper">
                          <div className="mkdf-related-post-image">
                            <a
                              onClick={() => onClickNews(otherNews[1].id)}
                              title="Shadow of the art">
                              <img
                                width="650"
                                height="550"
                                src={otherNews[1].thumbnail}
                                className="attachment-buzzy_mikado_image_portrait size-buzzy_mikado_image_portrait wp-post-image"
                                alt="m"
                                loading="lazy"
                              />
                            </a>
                          </div>
                          <div className="mkdf-related-post-inner">
                            <div className="mkdf-related-info-inner">
                              <div className="mkdf-related-category-holder">
                                <div
                                  className="mkdf-post-info-category"
                                  style={{ backgroundColor: '#e777af' }}>
                                  <a onClick={() => onClickNews(otherNews[1].id)}>
                                    {otherNews[1].tag}
                                  </a>
                                </div>
                              </div>
                              <h6 className="entry-title mkdf-post-title">
                                <a
                                  onClick={() => onClickNews(otherNews[1].id)}
                                  title="Shadow of the art">
                                  {otherNews[1].title}
                                </a>
                              </h6>
                              <div className="mkdf-post-info">
                                <div className="mkdf-post-info-date entry-date published updated">
                                  <a onClick={() => onClickNews(otherNews[1].id)}>
                                    {otherNews[1].time}
                                  </a>
                                  <meta content="UserComments: 2" />
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
            <div className="mkdf-sidebar-holder ">
              <aside className="mkdf-sidebar">
                <div
                  className="widget mkdf-blog-list-widget"
                  style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="mkdf-widget-title-holder">
                    <h5 className="mkdf-widget-title" style={{ marginBottom: '1px' }}>
                      Trending Posts
                    </h5>
                  </div>
                  <div
                    className="mkdf-blog-list-holder mkdf-grid-list mkdf-disable-bottom-space mkdf-bl-simple mkdf-one-columns mkdf-normal-space mkdf-bl-pag-no-pagination"
                    data-type="simple"
                    data-number-of-posts="3"
                    data-number-of-columns="one"
                    data-space-between-items="normal"
                    data-category="culture"
                    data-orderby="date"
                    data-order="ASC"
                    data-image-size="thumbnail"
                    data-title-tag="span"
                    data-title-transform="uppercase"
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
                    data-max-num-pages="13"
                    data-next-page="2">
                    <div className="mkdf-bl-wrapper mkdf-outer-space">
                      <ul className="mkdf-blog-list">
                        <li className="mkdf-bl-item mkdf-item-space clearfix">
                          <div className="mkdf-bli-inner">
                            <div className="mkdf-post-image">
                              <a
                                onClick={() => onClickNews(otherNews[2].id)}
                                title="Contemporary art really has value">
                                <img
                                  width="150"
                                  height="150"
                                  src={otherNews[2].thumbnail}
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
                                  onClick={() => onClickNews(otherNews[2].id)}
                                  title="Contemporary art really has value">
                                  {otherNews[2].title}
                                </a>
                              </span>
                              <div className="mkdf-post-info-date entry-date published updated">
                                <a onClick={() => onClickNews(otherNews[2].id)}>
                                  {otherNews[2].time}
                                </a>
                                <meta content="UserComments: 2" />
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="mkdf-bl-item mkdf-item-space clearfix">
                          <div className="mkdf-bli-inner">
                            <div className="mkdf-post-image">
                              <a
                                onClick={() => onClickNews(otherNews[3].id)}
                                title="Open the gates of transmission">
                                <img
                                  width="150"
                                  height="150"
                                  src={otherNews[3].thumbnail}
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
                                  onClick={() => onClickNews(otherNews[3].id)}
                                  title="Open the gates of transmission">
                                  {otherNews[3].title}
                                </a>
                              </span>
                              <div className="mkdf-post-info-date entry-date published updated">
                                <a onClick={() => onClickNews(otherNews[3].id)}>
                                  {otherNews[3].time}
                                </a>
                                <meta content="UserComments: 2" />
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="mkdf-bl-item mkdf-item-space clearfix">
                          <div className="mkdf-bli-inner">
                            <div className="mkdf-post-image">
                              <a
                                onClick={() => onClickNews(otherNews[4].id)}
                                title="Life is design without an eraser.">
                                <img
                                  width="150"
                                  height="150"
                                  src={otherNews[4].thumbnail}
                                  className="attachment-thumbnail size-thumbnail"
                                  alt="m"
                                  loading="lazy"
                                  sizes="(max-width: 150px) 100vw, 150px"
                                />
                              </a>
                              <div className="mkdf-post-info-hot-trending">
                                <div className="mkdf-post-info-hot">
                                  <span className="mkdf-news-ht-icon mkdf-news-hot"></span>
                                </div>
                              </div>
                            </div>
                            <div className="mkdf-bli-content">
                              <span
                                className="entry-title mkdf-post-title"
                                style={{ textTransform: 'uppercase' }}>
                                <a
                                  onClick={() => onClickNews(otherNews[4].id)}
                                  title="Life is design without an eraser.">
                                  {otherNews[4].title}
                                </a>
                              </span>
                              <div className="mkdf-post-info-date entry-date published updated">
                                <a onClick={() => onClickNews(otherNews[4].id)}>
                                  {otherNews[4].time}
                                </a>
                                <meta content="UserComments: 2" />
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default NewsDetail;
