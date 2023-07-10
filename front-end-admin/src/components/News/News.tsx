import React, { useState, useEffect } from "react";
import { Text, Button, Container, Badge, Group, ActionIcon, Image, Center } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import { openModal, closeAllModals } from "@mantine/modals";
import { api } from "@/api/axios";
import { useAccountsStyles } from "./News.style";
import { getColor } from "@/utils/randomColor";
import { newsInfoModal } from "@/utils/modals/newsInfoModal";
import { NewsProps } from "@/utils/types";
import { deleteNewsApi, getAllNews } from "@/api/news";

interface Props {
  newsData: NewsProps[];
}
export default function News(props: Props) {
  const { newsData } = props;
  const [updated, setUpdated] = useState(false);
  const [data, setData] = useState<NewsProps[]>(newsData);
  const { classes, cx } = useAccountsStyles();
  const deleteNews = async (newsId: string) => {
    const response = deleteNewsApi(newsId);
    response
      .then(() => {
        setData((prevData) => prevData.filter((news) => news.id !== newsId));
        closeAllModals();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    (async () => {
      const response = await getAllNews();
      setData(response?.data || []);
    })();
    setData(newsData);
  }, [updated, newsData]);

  return (
    <Container
      fluid
      ml={0}
      mr={0}
      pt={12}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ backgroundColor: "white" }}>
        <div className={classes.divButtonAdd}>
          <Button color="teal" onClick={() => newsInfoModal("add", updated, setUpdated)}>
            Thêm tin tức
          </Button>
        </div>

        <DataTable
          style={{ flexGrow: 1, overflow: "auto", display: "block", minHeight: data.length > 0 ? 80 : 150 }}
          highlightOnHover
          withBorder
          withColumnBorders
          onCellClick={({ record, recordIndex, column, columnIndex }) => {
            if (column.accessor !== "Delete") {
              newsInfoModal("update", updated, setUpdated, record);
            }
          }}
          columns={[
            {
              accessor: "ID",
              title: "STT",
              textAlignment: "center",
              render: (record: NewsProps, index) => index + 1,
            },
            {
              accessor: "thumbnail",
              title: "Ảnh bìa",
              textAlignment: "center",
              render: (record: NewsProps, _) => (
                <Center>
                  <Image width={"20rem"} src={record.thumbnail} />
                </Center>
              ),
            },
            {
              accessor: "title",
              title: "Danh Mục",
              textAlignment: "center",
              render: (record: NewsProps, _) => <Badge color={getColor(record.tag)}>{record.tag}</Badge>,
            },
            {
              accessor: "title",
              title: "Tiêu đề",
              textAlignment: "center",
              render: (record: NewsProps, _) => <Text>{record.title}</Text>,
            },

            {
              accessor: "title",
              title: "Thời gian đăng",
              textAlignment: "center",
              render: (record: NewsProps, _) => <Text>{record.time}</Text>,
            },

            {
              accessor: "Delete",
              title: "Thao Tác",
              textAlignment: "center",
              render: (record: NewsProps, _) => (
                <Group spacing={4} position="center" noWrap>
                  <ActionIcon
                    color="blue"
                    onClick={() => {
                      newsInfoModal("update", updated, setUpdated, record);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={() => {
                      openModal({
                        title: "Xóa tin tức",
                        children: (
                          <>
                            <Text>Bạn có xác nhận muốn xóa tin tức này?</Text>
                            <Group position="right">
                              {/*@ts-ignore*/}
                              <Button variant="outline" onClick={closeAllModals}>
                                Hủy
                              </Button>
                              <Button
                                color="red"
                                type="submit"
                                onClick={() => {
                                  deleteNews(record.id || "");
                                }}
                              >
                                Xóa
                              </Button>
                            </Group>
                          </>
                        ),
                      });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          records={data}
          noRecordsText="Chưa có tin tức nào"
          idAccessor="ID"
        />
      </div>
    </Container>
  );
}
