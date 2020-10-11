import { Button, Table, PageHeader, Tag, Input, Pagination } from "antd";
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

const { Search } = Input;
const Forum = ({ data }): JSX.Element => {
  console.log(data);
  const [questions, setQuestions] = useState<Question[]>(data);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setLoading] = useState(false); //State for loading indicator

  const router = useRouter();
  const dummyAsk = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`${routesObject.question}/ask`);
  };

  const ViewQuestion = (_id: string) =>
    router.push(`${routesObject.question}/${_id}`);

  const onPageChange = (page: number) => {
    console.log(page);
    setPage(page);
  };

  const columns: ColumnsType<QuestionTableData> = [
    {
      title: "id",
      dataIndex: "_id",
      key: "id",
    },
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
        <Button onClick={() => ViewQuestion(record._id)} type={"primary"}>
          View Question
        </Button>
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

  useEffect(() => {
    const fetchData = async () => {
      console.log("triggered fetch");
      setLoading(true);
      const data = await getAllQuestion({ page, pageSize });
      setQuestions(data);
    };

    fetchData();
  }, [page, pageSize]);

  return (
    <FluidPage title={pageTitles.forum} selectedkey={menuKeys.forum}>
      {
        <div className={styles.mainContent}>
          <PageHeader
            className={styles.pageHeader}
            title={<h1>Forum</h1>}
            subTitle="This is the forum"
            extra={[
              <Button key="3" onClick={dummyAsk}>
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
          <Table columns={columns} dataSource={tableData} pagination={false} />
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
