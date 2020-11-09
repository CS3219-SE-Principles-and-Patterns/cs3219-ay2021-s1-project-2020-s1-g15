import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Table,
  PageHeader,
  Tag,
  Input,
  Pagination,
  Form,
  Select,
  Space,
  Row,
  Typography,
  Tooltip,
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
  SearchForm,
  GetSingleQuestionRes,
  toRelativeTimeAgo,
  useUpvoteDownvote,
} from "../../utils";
import FluidPage from "../../components/layout";
import styles from "./forum.module.css";
import { useAuth } from "components/authentication";

const { Search } = Input;
const { Option } = Select;
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

const defaultSearchForm: SearchForm = {
  searchText: "",
  level: "",
  subject: "",
};

const ForumPage = ({ questions, total }): JSX.Element => {
  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [currQuestions, setQuestions] = useState<GetSingleQuestionRes[]>(
    questions
  );
  const [currTotal, setCurrTotal] = useState<number>(total);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false); //State for loading indicator
  const [form] = Form.useForm();
  const [searchForm, setSearchForm] = useState<SearchForm>(defaultSearchForm);
  const { isAuthenticated } = useAuth();

  const onFormFinish = async (searchReq: SearchForm) => {
    // validation will throw error and stop execution if it fails
    await form.validateFields();
    setLoading(true);
    setSearchForm({ ...searchReq });
    setLoading(false);
  };

  const clearFilters = () => {
    form.setFields([
      { name: Config.Subject.NAME, value: undefined },
      { name: Config.Level.NAME, value: undefined },
      { name: Config.SearchText.NAME, value: undefined },
    ]);
    setSearchForm(defaultSearchForm);
  };

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
                <Tag color="blue">{record.level}</Tag>
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
      searchText: searchForm.searchText ?? "",
      level: searchForm.level ?? "",
      subject: searchForm.subject ?? "",
      page,
      pageSize,
    });
    setQuestions(questions);
    setCurrTotal(total);
    setLoading(false);
  }, [
    page,
    pageSize,
    searchForm.level,
    searchForm.searchText,
    searchForm.subject,
  ]);

  useEffect(() => {
    if (!isInitial) {
      // prevent re-fetching on first load
      fetchData();
    } else {
      setIsInitial(false);
    }
  }, [fetchData, isInitial]);

  const filterForm = (
    <>
      <Form layout="inline" form={form} onFinish={onFormFinish}>
        {/* Search function */}
        <Form.Item
          name={Config.SearchText.NAME}
          label={Config.SearchText.LABEL}
          rules={Config.SearchText.RULES}
          className={styles.m8}
        >
          <Search
            placeholder={Config.SearchText.PLACEHOLDER}
            enterButton={
              <Button
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
              >
                Search
              </Button>
            }
          />
        </Form.Item>
        {/* LEVEL SELECT */}
        <Form.Item
          name={Config.Level.NAME}
          label={Config.Level.LABEL}
          className={styles.m8}
        >
          <Select disabled={loading} placeholder={Config.Level.PLACEHOLDER}>
            {levelOptions.map((level) => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* SUBJECT SELECT */}
        <Form.Item
          name={Config.Subject.NAME}
          label={Config.Subject.LABEL}
          className={styles.m8}
        >
          <Select disabled={loading} placeholder={Config.Subject.PLACEHOLDER}>
            {subjectOptions.map((subject) => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Row justify="end">
        <Button danger onClick={clearFilters} className={styles.m8}>
          Clear Filters
        </Button>
      </Row>
    </>
  );

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

          <Table
            title={() => filterForm}
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

// This gets called on every request
export async function getServerSideProps() {
  const { questions, total } = await getPaginatedQuestions({
    level: "",
    subject: "",
    searchText: "",
    page: 1,
    pageSize: 10,
  });
  // Pass data to the page via props
  return { props: { questions, total } };
}
export default ForumPage;
