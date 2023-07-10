import { AppShell } from '@/components/Layout';
import NewDetail from '@/components/NewDetail';
import newsApi from '@/api/news';
import { NewsDetailDto } from '@/utils/types';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import moment from 'moment';
import config from '@/config/config';

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const news = await newsApi.getAllNews();
    const paths = news?.map((newsItem: NewsDetailDto) => ({
      params: { id: newsItem.id.toString() }
    }));

    return {
      paths,
      fallback: true
    };
  } catch (err) {
    console.error(err);
    return { paths: [], fallback: true }; // Make sure to return a value in case of an error
  }
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  try {
    let news = await newsApi.getNewsById(id as string);
    let otherNews;
    try {
      otherNews = await newsApi.getNewsByPage({ offset: 3, maxPerPage: 5 });
    } catch (err) {
      console.error(err);
    }

    if (news) {
      otherNews = otherNews.map((item: any) => {
        return {
          ...item,
          thumbnail: config.IMAGE_URL + item.thumbnail,
          time: moment(item.time).utc().format('DD-MM-YYYY')
        };
      });
      return {
        props: { news, otherNews },
        revalidate: 30
      };
    } else {
      return {
        notFound: true
      };
    }
  } catch (err) {
    console.error(err);
    return {
      notFound: true
    };
  }
};

export default function NewsDetailPage(props: { news: NewsDetailDto; otherNews: NewsDetailDto[] }) {
  return (
    <AppShell headerSize="xl">
      <NewDetail newsDetailData={props.news} otherNews={props.otherNews} />
    </AppShell>
  );
}
