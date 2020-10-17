import { Button, Table, PageHeader, Tag, Input, Pagination, Col } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAllQuestion } from "../../components/api";
import FluidPage from "../../components/layout";
import { ColumnsType } from "antd/es/table";
import {
  menuKeys,
  pageTitles,
  Question,
  QuestionTableData,
  routesObject,
} from "../../util";
import React from "react";
import styles from "./forum.module.css";
import { useAuth } from "../../components/authentication";

const { Search } = Input;
const Forum = ({ data }): JSX.Element => {
  const { firebaseUser } = useAuth();
  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>(data);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false); //State for loading indicator

  const router = useRouter();
  const dummyAsk = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push({
      pathname: `${routesObject.editQuestion}`,
      query: {
        qid: null,
      },
    });
  };

  const ViewQuestion = (_id: string) =>
    router.push(`${routesObject.question}/${_id}`);

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
            onClick={() => ViewQuestion(record._id)}
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

  const tableData = questions.map(
    (x: Question, index: number) =>
      ({
        key: index,
        ...x,
      } as QuestionTableData)
  );
  const navigateToUserPage = async (id: string) => {
    router.push({ pathname: `${routesObject.user}/${id}` });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllQuestion({ page, pageSize });
      setQuestions(data);
      setLoading(false);
    };
    if (isInitial) {
      // prevent re-fetching on first load
      fetchData();
    } else {
      setIsInitial(false);
    }
  }, [isInitial, page, pageSize]);

  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.forum}>
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
              total={20}
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
  const data: Question[] = await getAllQuestion({ page: 1, pageSize: 10 });
  // Pass data to the page via props
  return { props: { data } };
}
export default Forum;
