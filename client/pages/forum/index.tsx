import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Button,
  Table,
  PageHeader,
  Tag,
  Input,
  Pagination,
  Select,
  Space,
  Row,
  Typography,
  Tooltip,
  Card,
  Radio,
} from "antd";
import {
  SearchOutlined,
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import {
  NavMenuKey,
  PageTitle,
  QuestionTableData,
  Route,
  getPaginatedQuestions,
  Level,
  Subject,
  GetSingleQuestionRes,
  toRelativeTimeAgo,
  useUpvoteDownvote,
} from "../../utils";
import FluidPage from "../../components/layout";
import styles from "./forum.module.css";
import { useAuth } from "components/authentication";

const { Search } = Input;
const { Text } = Typography;

const subjectOptions: Subject[] = Object.values(Subject);
const levelOptions: Level[] = Object.values(Level);

// config values for the form
const Config = Object.freeze({
  SearchText: Object.freeze({
    NAME: "searchText",
    LABEL: "Search",
    PLACEHOLDER: "Search for a question",
    RULES: [
      {
        max: 1000,
      },
    ],
  }),
  Level: Object.freeze({
    NAME: "level",
    LABEL: "Level",
    PLACEHOLDER: "Choose a level",
  }),
  Subject: Object.freeze({
    NAME: "subject",
    LABEL: "Subject",
    PLACEHOLDER: "Choose a subject",
  }),
});

const ForumPage = (): JSX.Element => {
  const [currQuestions, setQuestions] = useState<GetSingleQuestionRes[]>([]);
  const [currTotal, setCurrTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const searchText = useRef<Input>(null);
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "controversial">(
    "recent"
  );
  const { isAuthenticated } = useAuth();

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const columns: ColumnsType<QuestionTableData> = [
    {
      key: "title",
      render: (_, record) => {
        const {
          hasUpvoted,
          hasDownvoted,
          upvotesLocal,
          downvotesLocal,
          upvoteOnClick,
          downvoteOnClick,
          // eslint-disable-next-line react-hooks/rules-of-hooks
        } = useUpvoteDownvote({
          isQuestionVote: true,
          questionId: record._id,
          upvotes: record.upvotes,
          downvotes: record.downvotes,
        });

        return (
          <Row align="middle">
            <Button.Group size="small" style={{ marginRight: "1rem" }}>
              <Tooltip title={isAuthenticated ? "Upvote" : "Login to upvote"}>
                <Button
                  icon={hasUpvoted ? <LikeFilled /> : <LikeOutlined />}
                  onClick={upvoteOnClick}
                >
                  {upvotesLocal.toString()}
                </Button>
              </Tooltip>
              <Tooltip
                title={isAuthenticated ? "Downvote" : "Login to downvote"}
              >
                <Button
                  icon={hasDownvoted ? <DislikeFilled /> : <DislikeOutlined />}
                  onClick={downvoteOnClick}
                >
                  {downvotesLocal.toString()}
                </Button>
              </Tooltip>
            </Button.Group>
            <Space direction="vertical">
              <Text style={{ fontSize: "20px" }}>{record.title}</Text>
              <Row>
                <Tag color="geekblue">{record.level}</Tag>
                <Tag color="purple">{record.subject}</Tag>
              </Row>
              {record.user ? (
                <Link
                  href={`${Route.USER}/[username]`}
                  as={`${Route.USER}/${record.user.username}`}
                >
                  {`@${record.user.username}`}
                </Link>
              ) : null}
              <Text type="secondary">
                {toRelativeTimeAgo(record.createdAt)}, {record.answerIds.length}{" "}
                answers
              </Text>
            </Space>
          </Row>
        );
      },
    },
    {
      key: "action",
      align: "right",
      render: (_, record) => (
        <Button className={styles.tableButton} type={"primary"}>
          <Link
            href={`${Route.QUESTION}/[qid]/[slug]`}
            as={Route.QUESTION_VIEW(record._id, record.slug)}
          >
            View Question
          </Link>
        </Button>
      ),
    },
  ];

  const tableData = currQuestions.map((question: GetSingleQuestionRes) => ({
    key: question._id,
    ...question,
  }));

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { questions, total } = await getPaginatedQuestions({
      searchText: searchText.current?.state.value ?? "",
      level: filterLevel ?? "",
      subject: filterSubject ?? "",
      sortBy: sortBy,
      page,
      pageSize,
    });
    setQuestions(questions);
    setCurrTotal(total);
    setLoading(false);
  }, [page, pageSize, searchText, filterLevel, filterSubject, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
      {
        <div className={styles.mainContent}>
          <PageHeader
            className={styles.pageHeader}
            title={<h1>Forum</h1>}
            extra={[
              <Button type="primary" key="3">
                <Link href={Route.QUESTION_ASK}>Ask a Question</Link>
              </Button>,
            ]}
          />

          <Card>
            <Search
              allowClear
              ref={searchText}
              size="large"
              placeholder={Config.SearchText.PLACEHOLDER}
              disabled={loading}
              onSearch={fetchData}
              enterButton={
                <Button
                  disabled={loading}
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                >
                  Search
                </Button>
              }
            />
            <Select
              allowClear
              disabled={loading}
              placeholder={Config.Level.PLACEHOLDER}
              style={{ minWidth: "225px" }}
              onChange={(value: string) => setFilterLevel(value)}
              options={levelOptions.map((level) => {
                return {
                  label: level,
                  value: level,
                };
              })}
            />
            <Select
              allowClear
              disabled={loading}
              placeholder={Config.Subject.PLACEHOLDER}
              style={{ minWidth: "185px" }}
              onChange={(value: string) => setFilterSubject(value)}
              options={subjectOptions.map((subject) => {
                return {
                  label: subject,
                  value: subject,
                };
              })}
            />
            <Row style={{ marginTop: "1rem" }}>
              <Radio.Group
                onChange={(e) => setSortBy(e.target.value)}
                disabled={loading}
                defaultValue="recent"
                buttonStyle="solid"
              >
                <Tooltip title="Most recent questions">
                  <Radio.Button value="recent">Recent</Radio.Button>
                </Tooltip>
                <Tooltip title="Trending questions in the last 2 weeks">
                  <Radio.Button value="trending">Trending</Radio.Button>
                </Tooltip>
                <Tooltip title="Controversial questions in the last 2 weeks">
                  <Radio.Button value="controversial">
                    Controversial
                  </Radio.Button>
                </Tooltip>
              </Radio.Group>
            </Row>
          </Card>

          <Table
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            showHeader={false}
          />
          <div className={styles.flex}>
            <Pagination
              className={styles.pagination}
              current={page}
              onChange={onPageChange}
              pageSize={pageSize}
              defaultPageSize={10}
              total={currTotal}
              pageSizeOptions={["10", "20", "30"]}
            />
          </div>
        </div>
      }
    </FluidPage>
  );
};

export default ForumPage;
