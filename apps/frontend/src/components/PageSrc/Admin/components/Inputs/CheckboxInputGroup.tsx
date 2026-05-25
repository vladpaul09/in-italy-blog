import { FC } from "react";
import { CheckboxGroupInput, useChoicesContext } from "react-admin";

const CheckboxInputGroup: FC<{ source: string; label?: string; row?: boolean }> = ({ source, label, row }) => {
  const { allChoices } = useChoicesContext();
  return <CheckboxGroupInput choices={allChoices} source={source} label={label} row={row} />;
};

export default CheckboxInputGroup;
