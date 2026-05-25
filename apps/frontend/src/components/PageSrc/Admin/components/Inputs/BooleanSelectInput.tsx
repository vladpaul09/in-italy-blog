import { FC } from "react";
import { SelectInput, useResourceContext, useTranslate } from "react-admin";

const BooleanSelectInput: FC<{ source: string; label?: string; alwaysOn?: boolean }> = ({ source, label, alwaysOn }) => {
  const t = useTranslate();
  const resource = useResourceContext();

  return (
    <SelectInput
      source={source}
      label={label ? label : t(`resources.${resource}.fields.${source}`)}
      choices={[
        { id: true, name: t("miscellaneous.yes") },
        { id: false, name: t("miscellaneous.no") },
      ]}
      translateChoice={false}
      alwaysOn={alwaysOn}
    />
  );
};

export default BooleanSelectInput;
