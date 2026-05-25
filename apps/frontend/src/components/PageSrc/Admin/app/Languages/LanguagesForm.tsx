import { FC } from "react";
import { BooleanInput, ImageField, ImageInput, TextInput, Labeled, BooleanField, NumberInput } from "react-admin";
import FieldText from "../../components/Fields/FieldText";

const LanguagesForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  return (
    <>
      {isShow ? <FieldText source="id" /> : isEdit ? <TextInput source="id" disabled={isShow} /> : <TextInput source="id" />}
      {isShow ? <FieldText source="name" /> : <TextInput source="name" disabled={isShow} />}
      {isShow ? (
        <Labeled>
          <BooleanField source="default" />
        </Labeled>
      ) : (
        <BooleanInput source="default" />
      )}

      {isShow ? (
        <Labeled>
          <BooleanField source="status" />
        </Labeled>
      ) : (
        <BooleanInput source="status" />
      )}

      {isShow ? (
        <Labeled>
          <ImageField source="image.src" title="image.title" />
        </Labeled>
      ) : (
        <ImageInput source="image">
          <ImageField source="src" title="title" />
        </ImageInput>
      )}
    </>
  );
};

export default LanguagesForm;
