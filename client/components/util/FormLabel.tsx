import React, { FC } from "react";

import { Typography } from "antd";
const { Title } = Typography;

export type FormLabelProp = {
  label: string;
};

export const FormLabel: FC<FormLabelProp> = ({ label }): JSX.Element => {
  return (
    <Title style={{ marginBottom: "0px" }} level={4}>
      {label}
    </Title>
  );
};
