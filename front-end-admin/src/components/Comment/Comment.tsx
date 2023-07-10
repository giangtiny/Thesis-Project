import { Text, Group, Avatar, Grid, ActionIcon, Paper, Container, Textarea, Flex, Space, Collapse, Box, Input } from "@mantine/core";
import { IconCheck, IconEdit, IconMessage, IconSend, IconStar, IconTrash, IconX } from "@tabler/icons";
import { useCommentStyles } from "./Comment.style";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { CommentAddDto, CommentUpdateDto, addCommentAPI, deleteCommentAPI, getCommentAPI, updateCommentAPI } from "@/api/comment";
import { on } from "events";
interface ItemCommentProps {
  _id: string;
  accommodationID?: string;
  date: string;
  content: string;
  userID: string;
  userName: string;
  userAvatar: string;
  phoneNumber: string;
  parentID?: string;
  starRating: number;
  level: number;
  replyComment: ItemCommentProps[];
}

interface ListCommentProps {
  comment: ItemCommentProps;
  objectId: string;
  ownerID: string;
  assetType: string;
  getCommentData: () => void;
}
const ItemComment = (props: ListCommentProps) => {
  const { _id, accommodationID, date, content, userID, userAvatar, userName, phoneNumber, parentID, starRating, level, replyComment } = props.comment;
  const [showRepling, setShowRepling] = useState<boolean>(false);
  const [opened, { toggle }] = useDisclosure(false);
  const [reply, setReply] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateContent, setUpdateContent] = useState<string>(content);
  const handleClickIconReply = () => {
    setShowRepling(true);
    toggle;
  };
  const handleShowEdit = () => {
    setIsUpdate(true);
    setUpdateContent(content);
  };
  const handleSendNewComment = async () => {
    const dataAdd: CommentAddDto = {
      id: props.objectId,
      type: props.assetType,
      date: new Date().toISOString(),
      content: reply,
      ownerID: props.ownerID,
      parentId: _id,
      level: level + 1,
    };
    await addCommentAPI(dataAdd);
    setShowRepling(false);
    setReply("");
    props.getCommentData();
  };

  const handleDeleteComment = async () => {
    await deleteCommentAPI(_id, level);
    props.getCommentData();
  };
  const handleUpdateComment = async () => {
    const dataUpdate: CommentUpdateDto = {
      accommodationID: props.objectId,
      id: _id,
      type: props.assetType,
      date: new Date().toISOString(),
      content: updateContent,
      ownerID: props.ownerID,
      parentId: parentID || "",
      level: level,
      userName: userName,
      userAvatar: userAvatar,
      phoneNumber: phoneNumber,
    };
    console.log(dataUpdate);
    await updateCommentAPI(dataUpdate);
    setUpdateContent("");
    setIsUpdate(false);
    props.getCommentData();
  };

  return (
    <Grid.Col span={12} p={0}>
      <Flex justify={"start"} align={"center"} w={"100%"}>
        <Flex>
          <Space w={"sm"}></Space>
          <Avatar src={userAvatar} radius="xl" />
        </Flex>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[3],
            padding: theme.spacing.sm,
            borderRadius: theme.radius.md,
            cursor: "pointer",
            width: "100%",
            "&:hover": {
              backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
            },
          })}
          m={"sm"}
          onClick={level === 1 ? toggle : undefined}
          style={{ borderWidth: level === 1 ? "1px" : undefined }}
        >
          <Group>
            <div>
              <Flex justify={"start"} align={"baseline"}>
                <Text size="sm" weight={500}>
                  {userName}
                </Text>
                <Space w={"sm"}></Space>
                {level === 1 && (
                  <Text color="dimmed" size="xs">
                    {starRating}
                    <IconStar size={"0.7rem"} fill="yellow" strokeWidth={"5%"} />
                  </Text>
                )}
              </Flex>
              <Text color="dimmed" size="xs">
                {date}
              </Text>
            </div>
            <ActionIcon onClick={() => handleDeleteComment()}>
              <IconTrash size={14} stroke={1.5} />
            </ActionIcon>
            {props.ownerID === userID ||
              (userID === "649720464f9af8b793609a5a" && (
                <ActionIcon onClick={() => handleShowEdit()}>
                  <IconEdit size={14} stroke={1.5} />
                </ActionIcon>
              ))}
            {!replyComment && (
              <ActionIcon onClick={() => handleClickIconReply()}>
                <IconMessage size={14} stroke={1.5} />
              </ActionIcon>
            )}
          </Group>
          {isUpdate ? (
            <>
              <>
                <Input defaultValue={updateContent} onChange={(event) => setUpdateContent(event.currentTarget.value)}></Input>
                <Space h={"sm"}></Space>
                <Flex>
                  <IconCheck color="green" size={14} stroke={5} onClick={handleUpdateComment} />
                  <Space w={"sm"}></Space>
                  <IconX color="red" size={14} stroke={5} onClick={() => setIsUpdate(false)} />
                </Flex>
              </>
            </>
          ) : (
            <Text fz="sm">{content}</Text>
          )}
        </Box>
      </Flex>
      <Collapse in={level == 1 ? opened : true}>
        {level === 1 ? (
          <Group pl={32} style={{ gap: 0 }}>
            {replyComment?.map((rep, index) => {
              return <ItemComment comment={rep} objectId={props.objectId} ownerID={props.ownerID} assetType={props.assetType} getCommentData={props.getCommentData} />;
            })}
          </Group>
        ) : (
          <Group style={{ gap: 0 }}>
            {replyComment?.map((rep, index) => {
              return <ItemComment comment={rep} objectId={props.objectId} ownerID={props.ownerID} assetType={props.assetType} getCommentData={props.getCommentData} />;
            })}
          </Group>
        )}

        {showRepling && (
          <Group pl={64} style={{ gap: 0 }}>
            <Flex justify={"center"} align={"center"}>
              <Avatar src={userAvatar} radius="xl" />
              <Space w={"sm"}></Space>
              <Textarea w={"30rem"} placeholder="Nhập câu trả lời của bạn" onChange={(event) => setReply(event.currentTarget.value)}></Textarea>
              <ActionIcon onClick={handleSendNewComment}>
                <IconSend size={14} stroke={1.5} />
              </ActionIcon>
            </Flex>
          </Group>
        )}
      </Collapse>
    </Grid.Col>
  );
};
interface Props {
  objectId: string;
  ownerID: string;
  assetType: string;
}
export default function Comment(props: Props) {
  const { classes } = useCommentStyles();
  const [commentsData, setCommentsData] = useState<ItemCommentProps[]>([]);

  const getCommentData = async () => {
    await getCommentAPI(props.objectId).then((res) => {
      setCommentsData(res);
    });
  };

  useEffect(() => {
    getCommentData();
  }, []);
  return (
    <Paper p={"xl"} bg={"white"}>
      <Text fw={600} fz="lg" pb="xs">
        Bình luận:
      </Text>
      <Group ml={20}>
        <Grid w={"100%"}>
          {commentsData?.map((item, index) => {
            return (
              <Grid.Col span={12} key={index + item._id}>
                <ItemComment comment={item} objectId={props.objectId} ownerID={props.ownerID} assetType={props.assetType} getCommentData={getCommentData} />
              </Grid.Col>
            );
          })}
        </Grid>
      </Group>
    </Paper>
  );
}
