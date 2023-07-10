import { getAllNews } from "@/api/news";
import News from "@/components/News/News";
import { NewsProps } from "@/utils/types";
import { useEffect, useState } from "react";

export default function AccountsPage() {
  const [news, setNews] = useState<NewsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const response = await getAllNews();
      setNews(response?.data || []);
      setLoading(false);
    })();
  }, []);
  return <News newsData={news}></News>;
}
