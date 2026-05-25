import { FC } from "react";
import { TextInput, ReferenceArrayInput, useResourceContext, Labeled, ReferenceArrayField } from "react-admin";
import FieldText from "../../components/Fields/FieldText";
import ResourceType from "../../entries/resourceType.entry";
import config from "@/config";
import CheckboxInputGroup from "../../components/Inputs/CheckboxInputGroup";

const GroupsForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const resource = useResourceContext();

  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  return (
    <>
      {isShow && <FieldText source="id" />}
      {isEdit && <TextInput source="id" disabled />}
      {isShow ? <FieldText source="name" /> : <TextInput source="name" disabled={isShow} />}
      {isShow ? <FieldText source="description" /> : <TextInput source="description" multiline={true} disabled={isShow} />}

      {isShow ? (
        <Labeled>
          <ReferenceArrayField
            source="permissions"
            reference={ResourceType.Permissions}
            sort={{ field: "codename", order: "ASC" }}
            perPage={config.admin.dataProviderPerPage}
          />
        </Labeled>
      ) : (
        <ReferenceArrayInput
          source="permissions"
          reference={ResourceType.Permissions}
          sort={{ field: "codename", order: "ASC" }}
          perPage={config.admin.dataProviderPerPage}
        >
          <CheckboxInputGroup row={false} source="permissions" label={`resources.${resource}.fields.permissions`} />
        </ReferenceArrayInput>
      )}
    </>
  );
};

export default GroupsForm;
