import { Button, Table, PageHeader, Tag, Input, Pagination, Col } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPaginatedQuestions } from "../../components/api";
import FluidPage from "../../components/layout";
import { ColumnsType } from "antd/es/table";
import {
  NavMenuKey,
  PageTitle,
  Question,
  QuestionTableData,
  Route,
} from "../../util";
import React from "react";
import styles from "./forum.module.css";
import { useAuth } from "../../components/authentication";

const { Search } = Input;
const Forum = ({ questions, total }): JSX.Element => {
  const { firebaseUser } = useAuth();
  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [currQuestions, setQuestions] = useState<Question[]>(questions);
  const [currTotal, setCurrTotal] = useState<number>(total);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false); //State for loading indicator

  const router = useRouter();
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { questions, total } = await getPaginatedQuestions({
        page,
        pageSize,
      });
      setQuestions(questions);
      setCurrTotal(total);
      setLoading(false);
    };
    if (!isInitial) {
      // prevent re-fetching on first load
      fetchData();
    } else {
      setIsInitial(false);
    }
  }, [isInitial, page, pageSize]);

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
          <Search
            className={styles.searchBar}
            placeholder="Search for your question"
            enterButton
          />

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
    page: 1,
    pageSize: 10,
  });
  // Pass data to the page via props
  return { props: { questions, total } };
}
export default Forum;
