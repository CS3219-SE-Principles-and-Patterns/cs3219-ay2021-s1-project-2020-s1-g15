import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Table,
  PageHeader,
  Tag,
  Input,
  Pagination,
  Col,
  Form,
  Select,
  Divider,
} from "antd";
import { ColumnsType } from "antd/es/table";

import {
  NavMenuKey,
  PageTitle,
  Question,
  QuestionTableData,
  Route,
  getPaginatedQuestions,
  Level,
  Subject,
  SearchForm,
} from "../../utils";
import FluidPage from "../../components/layout";
import styles from "./forum.module.css";
import { FormLabel } from "components/util";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const subjectOptions: Subject[] = Object.values(Subject);
const levelOptions: Level[] = Object.values(Level);
// config values for the form
const Config = Object.freeze({
  SearchText: Object.freeze({
    NAME: "searchText",
    LABEL: "Search",
    PLACEHOLDER: "Search for your question",
    RULES: [
      {
        max: 1000,
      },
    ],
  }),
  Level: Object.freeze({
    NAME: "level",
    LABEL: "Level",
    PLACEHOLDER: "Choose an appropriate level",
  }),
  Subject: Object.freeze({
    NAME: "subject",
    LABEL: "Subject",
    PLACEHOLDER: "Choose an appropriate subject",
  }),
});

const defaultSearchForm: SearchForm = {
  searchText: "",
  level: "",
  subject: "",
};

const ForumPage = ({ questions, total }): JSX.Element => {
  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [currQuestions, setQuestions] = useState<Question[]>(questions);
  const [currTotal, setCurrTotal] = useState<number>(total);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false); //State for loading indicator
  const [form] = Form.useForm();
  const [searchForm, setSearchForm] = useState<SearchForm>(defaultSearchForm);

  const router = useRouter();

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

  const dummyAsk = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push({
      pathname: `${Route.QUESTION_ASK}`,
    });
  };

  const ViewQuestion = (_id: string, slug: string) =>
    router.push(Route.QUESTION_VIEW(_id, slug));

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const columns: ColumnsType<QuestionTableData> = [
    {
      title: "title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "level",
      dataIndex: "level",
      key: "createdAt",
      render: (text, record) => (
        <span>
          <Tag color="blue" key={record._id}>
            {text}
          </Tag>
        </span>
      ),
    },
    {
      title: "subject",
      dataIndex: "subject",
      key: "createdAt",
      render: (text, record) => (
        <span>
          <Tag color="purple" key={record._id}>
            {text}
          </Tag>
        </span>
      ),
    },
    {
      title: "action",
      key: "action",
      render: (_, record) => (
        <Col>
          <Button
            className={styles.tableButton}
            onClick={() => ViewQuestion(record._id, record.slug)}
            type={"primary"}
          >
            View Question
          </Button>
          <Button onClick={() => navigateToUserPage(record.userId)}>
            View User
          </Button>
        </Col>
      ),
    },
  ];

  const tableData = currQuestions.map(
    (x: Question, index: number) =>
      ({
        key: index,
        ...x,
      } as QuestionTableData)
  );
  const navigateToUserPage = async (id: string) => {
    router.push(`${Route.USER}/${id}`);
  };

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

  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
      {
        <div className={styles.mainContent}>
          <PageHeader
            className={styles.pageHeader}
            title={<h1>Forum</h1>}
            subTitle="This is the forum"
            extra={[
              <Button type="primary" key="3" onClick={dummyAsk}>
                Ask a Question
              </Button>,
            ]}
          />
          <Divider />
          <Form layout="vertical" form={form} onFinish={onFormFinish}>
            {/* Search function */}
            <Form.Item
              name={Config.SearchText.NAME}
              label={<FormLabel label={Config.SearchText.LABEL} />}
              rules={Config.SearchText.RULES}
            >
              <Search
                className={styles.searchBar}
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
              label={<FormLabel label={Config.Level.LABEL} />}
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
              label={<FormLabel label={Config.Subject.LABEL} />}
            >
              <Select
                disabled={loading}
                placeholder={Config.Subject.PLACEHOLDER}
              >
                {subjectOptions.map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button danger onClick={clearFilters}>
                Clear Filters
              </Button>
            </Form.Item>
          </Form>

          <br />
          <Table
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
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
