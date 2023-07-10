import { Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import AccountInfo from "@/components/AccountInfo";

import { NewsProps, UserProps } from "@/utils/types";
import NewsInfo from "@/components/NewsInfo/NewsInfo";

export const newsInfoModal = (type: string, updated: boolean, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, news?: NewsProps) => {
  console.log(type, updated, setUpdated, news);
  return openModal({
    title: (
      <Text fw={600} fz="lg">
        Tin tức
      </Text>
    ),
    children: <NewsInfo type={type} news={news} setUpdated={setUpdated} updated={updated} />,
    size: "lg",
  });
};
