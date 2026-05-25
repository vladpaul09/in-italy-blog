import { FC } from "react";
import {
  TextInput,
  ReferenceArrayInput,
  PasswordInput,
  AutocompleteArrayInput,
  Labeled,
  ReferenceArrayField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import Grid from "@mui/material/Grid";
import config from "@/config";
import FieldText from "../../components/Fields/FieldText";
import { ArrayInput, SimpleFormIterator } from "react-admin";

const UsersForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const isShow = actionType === "show";
  const isEdit = actionType === "edit";
  const isCreate = actionType === "create";

  return (
    <Grid container spacing={2}>
      {isShow && (
        <Grid size={12}>
          <FieldText source="id" />
        </Grid>
      )}
      {isEdit && (
        <Grid size={12}>
          <TextInput source="id" disabled />
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="firstName" /> : <TextInput source="firstName" disabled={isShow} />}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="lastName" /> : <TextInput source="lastName" disabled={isShow} />}</Grid>
      {isShow ? (
        <Grid size={12}>
          <Labeled>
            <ArrayField source="aliases">
              <SingleFieldList linkType={false}>
                <ChipField source="name" />
              </SingleFieldList>
            </ArrayField>
          </Labeled>
        </Grid>
      ) : (
        <Grid size={12}>
          <ArrayInput source="aliases">
            <SimpleFormIterator disableReordering inline>
              <TextInput source="name" />
            </SimpleFormIterator>
          </ArrayInput>
        </Grid>
      )}
      <Grid size={12}>{isShow ? <FieldText source="email" /> : <TextInput source="email" disabled={isShow} />}</Grid>
      {isCreate && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <PasswordInput source="password.current" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PasswordInput source="password.confirm" />
          </Grid>
        </>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="parentId" reference="users" sort={{ field: "id", order: "ASC" }} perPage={config.admin.suggestionLimit} />
          </Labeled>
        ) : (
          <ReferenceArrayInput source="parentId" reference="users" sort={{ field: "id", order: "ASC" }} perPage={config.admin.suggestionLimit}>
            <AutocompleteArrayInput optionText={(record) => `${record.firstName} ${record.lastName}`} />
          </ReferenceArrayInput>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="regions" reference="regions" sort={{ field: "id", order: "ASC" }} perPage={config.admin.suggestionLimit} />
          </Labeled>
        ) : (
          <ReferenceArrayInput source="regions" reference="regions" sort={{ field: "id", order: "ASC" }} perPage={config.admin.suggestionLimit}>
            <AutocompleteArrayInput optionText="name" />
          </ReferenceArrayInput>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField
              source="provinces"
              reference="provinces"
              sort={{ field: "id", order: "ASC" }}
              perPage={config.admin.suggestionLimit}
            />
          </Labeled>
        ) : (
          <ReferenceArrayInput source="provinces" reference="provinces" sort={{ field: "id", order: "ASC" }} perPage={config.admin.suggestionLimit}>
            <AutocompleteArrayInput optionText="name" />
          </ReferenceArrayInput>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField
              source="municipalities"
              reference="municipalities"
              sort={{ field: "id", order: "ASC" }}
              perPage={config.admin.suggestionLimit}
            />
          </Labeled>
        ) : (
          <ReferenceArrayInput
            source="municipalities"
            reference="municipalities"
            sort={{ field: "id", order: "ASC" }}
            perPage={config.admin.suggestionLimit}
          >
            <AutocompleteArrayInput optionText="name" />
          </ReferenceArrayInput>
        )}
      </Grid>
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceArrayField source="groups" reference="groups" perPage={config.admin.suggestionLimit} />
          </Labeled>
        ) : (
          <ReferenceArrayInput source="groups" reference="groups" perPage={config.admin.suggestionLimit}>
            <AutocompleteArrayInput optionText="name" />
          </ReferenceArrayInput>
        )}
      </Grid>
    </Grid>
  );
};

export default UsersForm;
