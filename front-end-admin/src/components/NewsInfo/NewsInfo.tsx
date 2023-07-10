import { useEffect, useState } from "react";
import { TextInput, Group, Button, PasswordInput, Select, Alert, Text, Image, FileInput, Textarea, Flex, Divider, Center, Skeleton } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { NewsProps, NewContent } from "@/utils/types";
import { api } from "@/api/axios";
import { createNews, createNewsContent, deleteNewsContentApi, getAllNews, getNewsById, updateNewsApi, updateNewsContentApi } from "@/api/news";
import { getAllHotel } from "@/api/hotel";
import { accountFormInputProps } from "@/constants/forms";
import { closeAllModals } from "@mantine/modals";
import { IconCheck, IconTrash, IconUpload } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { styles } from "@/utils/toasts";
interface FormValues {
  id?: string;
  title: string;
  thumbnail: string;
  tag: string;
  time: string;
  content: {
    id: string;
    header: string;
    image: string;
    highLight?: string;
    text: string;
  }[];
}

export default function NewsInfo(props: { type: string; news?: NewsProps; setUpdated: React.Dispatch<React.SetStateAction<boolean>>; updated: boolean }) {
  const { news, setUpdated, updated } = props;
  const [type, setType] = useState<string>(props.type);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [contentFiles, setContentFiles] = useState<(File | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const handleImageChange = (file: File | null, index?: number) => {
    if (file) {
      if (typeof index !== "undefined") {
        // Image is for a content
        let newContentFiles = [...contentFiles];
        newContentFiles[index] = file;
        setContentFiles(newContentFiles);

        // Immediately reflect the new image in the UI
        let newContent = [...form.values.content];
        newContent[index].image = URL.createObjectURL(file);
        form.setFieldValue("content", newContent);
      } else {
        // Image is the thumbnail
        setThumbnailFile(file);
        form.setFieldValue("thumbnail", URL.createObjectURL(file));
      }
    }
  };

  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      title: "",
      thumbnail: "",
      tag: "",
      time: "",
      content: [] as NewContent[],
    },
  });

  useEffect(() => {
    if (type === "update" && news) {
      form.setValues({
        id: news.id,
        title: news.title,
        thumbnail: news.thumbnail,
        tag: news.tag,
        time: news.time,
        content: news.content || [],
      });

      setContentFiles(new Array(news.content?.length || 0).fill(null));

      (async () => {
        const response = await getNewsById(news?.id || "");
        if (response && response.data) {
          form.setValues({
            content: response.data.content || [],
          });
          setContentFiles(new Array(news.content?.length || 0).fill(null));
          setLoading(false);
        }
      })();
    }
  }, []);

  const addNews = async () => {
    let thumbnailData;
    if (thumbnailFile instanceof File) {
      thumbnailData = thumbnailFile;
    } else {
      thumbnailData = form.values.thumbnail;
    }

    const response = await createNews({
      title: form.values.title,
      tag: form.values.tag,
      time: new Date().toISOString(),
      thumbnail: thumbnailData,
    });

    if (response) {
      form.setValues({
        id: response.data || "",
      });
      setUpdated(!updated);
      setType("update");
    } else {
      console.log("Error adding news");
    }
  };

  const updateNews = async () => {
    let thumbnailData;
    if (thumbnailFile instanceof File) {
      thumbnailData = thumbnailFile;
    } else {
      thumbnailData = form.values.thumbnail;
    }

    const response = await updateNewsApi({
      id: form.values.id,
      title: form.values.title,
      tag: form.values.tag,
      time: new Date().toISOString(),
      thumbnail: thumbnailData,
    });

    if (response) {
      setUpdated(!updated);
    } else {
      console.log("Error updating news");
    }
  };

  const addContent = () => {
    if (form.values.id) {
      form.setFieldValue("content", [...form.values.content, { id: "", header: "", image: "", text: "", highLight: "" }]);
      setLoading(false);
    } else {
      showNotification({
        title: "Thất Bại!",
        message: "Tin tức cần được tạo trước khi tạo nội dung!",
        styles: (theme) => styles("red", theme),
      });
    }
  };

  const updateContent = (index: number, field: keyof NewContent, value: string) => {
    let newContent = [...form.values.content];
    if (field === "header" || field === "text" || field === "image" || field === "highLight") {
      newContent[index][field] = value;
    }
    form.setFieldValue("content", newContent);
  };

  const deleteContent = async (index: number) => {
    try {
      const response = await deleteNewsContentApi(form.values.content[index].id);
      let newContent = [...form.values.content];
      newContent.splice(index, 1);
      form.setFieldValue("content", newContent);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const saveContent = async (index: number) => {
    let contentItem = form.values.content[index];

    let isUpdate = contentItem.id;

    if (isUpdate) {
      try {
        let contentImage;
        if (contentFiles[index] instanceof File) {
          contentImage = contentFiles[index];
        } else {
          contentImage = contentItem.image;
        }

        const data = {
          id: contentItem.id,
          header: contentItem.header,
          newsId: form.values.id || "",
          text: contentItem.text,
          highLight: contentItem.highLight || "",
          image: contentImage,
        };
        const response = await updateNewsContentApi(data);
        if (response) {
          showNotification({
            title: "Thành Công!",
            message: "Chỉnh sửa đoạn tin tức thành công !",
            styles: (theme) => styles("green", theme),
          });
        } else {
          console.error("Failed to update content");
        }
      } catch (error) {
        console.error("Error updating content:", error);
      }
    } else {
      try {
        let contentImage;
        if (contentFiles[index] instanceof File) {
          contentImage = contentFiles[index];
        } else {
          contentImage = contentItem.image;
        }
        const data = {
          header: contentItem.header,
          newsId: form.values.id || "",
          text: contentItem.text,
          highLight: contentItem.highLight || "",
          image: contentImage,
        };
        const id = await createNewsContent(data);

        const newContents = form.values.content.map((content, i) => {
          if (i === index) {
            return { ...content, id };
          } else {
            return content;
          }
        });
        form.setFieldValue("content", [...newContents]);
        if (id) {
        } else {
          console.error("Failed to create content");
        }
      } catch (error) {
        console.error("Error creating content:", error);
      }
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(type === "add" ? addNews : updateNews)}>
        {type === "update" && news && <TextInput label="ID" disabled {...form.getInputProps("id")} />}
        <FileInput
          label="Tải lên ảnh bìa mới"
          onChange={(e: any) => handleImageChange(e)}
          id="thumbnail"
          name="thumbnail"
          required
          placeholder="Tải ảnh lên"
          icon={<IconUpload size={14} />}
          accept="image/png,image/jpeg,image/jpg,image/ifif"
        />
        {form.values.thumbnail && <Image src={form.values.thumbnail} />}
        <TextInput label="Tiêu Đề" placeholder="Nhập tiêu đề" {...form.getInputProps("title")} required />
        <TextInput label="Danh Mục" placeholder="Nhập danh mục" {...form.getInputProps("tag")} required />
        {type === "update" && news && <TextInput label="Thời gian đăng" disabled {...form.getInputProps("time")} />}
        <Group position="right" mt="md">
          <Button color="teal" type="submit">
            Lưu
          </Button>
        </Group>
        <Skeleton visible={loading}>
          {form.values.content.map((content, index) => (
            <div key={index}>
              <Divider m={20}></Divider>
              <Flex justify={"space-between"}>
                <Text>Đoạn {index + 1}</Text>
                <Group position="right" mt="md">
                  <IconTrash color="red" onClick={() => deleteContent(index)} style={{ cursor: "pointer" }}>
                    Delete
                  </IconTrash>
                  <Button color="teal" onClick={() => saveContent(index)}>
                    Lưu
                  </Button>
                </Group>
              </Flex>
              <Textarea autosize minRows={1} label="Tiêu Đề" value={content.header} onChange={(e) => updateContent(index, "header", e.currentTarget.value)} />
              <FileInput
                label="Hình Ảnh"
                onChange={(e: any) => {
                  handleImageChange(e, index);
                }}
                id={`image${index}`}
                name={`image${index}`}
                placeholder="Tải ảnh lên"
                icon={<IconUpload size={14} />}
                accept="image/png,image/jpeg,image/jpg,image/ifif"
              />
              {content.image && (
                <div>
                  <Image src={content.image} alt={`content-${index}`} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              <Textarea autosize minRows={3} label="Văn Bản" value={content.text} onChange={(e) => updateContent(index, "text", e.currentTarget.value)} />
              <Textarea autosize minRows={3} label="Highlight" value={content.highLight} onChange={(e) => updateContent(index, "highLight", e.currentTarget.value)} />
            </div>
          ))}
        </Skeleton>
        <Divider m={20}></Divider>
        <Center>
          <Button variant="outline" onClick={addContent}>
            Thêm đoạn mới
          </Button>
        </Center>
      </form>
    </>
  );
}
