import { FC } from "react";
import {
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  NumberInput,
  ImageField,
  ImageInput,
  Labeled,
  ReferenceField,
  ReferenceInput,
  TextInput,
  useCanAccess,
  useResourceContext,
  useTranslate,
} from "react-admin";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LanguageArrayInput from "../../components/Inputs/LanguageArrayInput";
import CKEditorInput from "../../components/Inputs/CKEditorInput";
import CKEditorField from "../../components/Fields/CKEditorField";
import FieldText from "../../components/Fields/FieldText";
import ResourceType from "../../entries/resourceType.entry";

const MunicipalitiesForm: FC<{ actionType: "create" | "edit" | "show" }> = ({ actionType }) => {
  const resource = useResourceContext();
  const translate = useTranslate();

  const { canAccess } = useCanAccess({
    action: "field.show_frontend",
    resource: resource,
  });

  const isShow = actionType === "show";
  const isEdit = actionType === "edit";

  return (
    <Grid container spacing={2}>
      {isShow && (
        <>
          <Grid size={12}>
            <FieldText source="id" />
          </Grid>
          <Grid size={12}>
            <FieldText source="slug" />
          </Grid>
        </>
      )}
      {!isShow && (
        <>
          <Grid size={12}>
            <TextInput disabled={isEdit} source="id" />
          </Grid>
          {isEdit && (
            <Grid size={12}>
              <TextInput source="slug" />
            </Grid>
          )}
        </>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ReferenceField source="provinceId" reference={ResourceType.Provinces} />
          </Labeled>
        ) : (
          <ReferenceInput source="provinceId" reference={ResourceType.Provinces}>
            <AutocompleteInput optionText="name" />
          </ReferenceInput>
        )}
      </Grid>

      {canAccess && (
        <Grid size={12}>
          {isShow ? (
            <Labeled>
              <BooleanField source="showFrontend" />
            </Labeled>
          ) : (
            <BooleanInput source="showFrontend" defaultValue={false} />
          )}
        </Grid>
      )}
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ImageField source="image.src" title="image.title" />
          </Labeled>
        ) : (
          <ImageInput
            source="image"
            placeholder={
              <Typography component="p" sx={{ py: 3 }}>
                {translate(`resources.${resource}.imagePlaceholderText`)}
              </Typography>
            }
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        )}
      </Grid>
      <Grid size={12}>
        {isShow ? (
          <Labeled>
            <ImageField source="mobileImage.src" title="mobileImage.title" />
          </Labeled>
        ) : (
          <ImageInput
            source="mobileImage"
            placeholder={
              <Typography component="p" sx={{ py: 3 }}>
                {translate(`resources.${resource}.mobileImagePlaceholderText`)}
              </Typography>
            }
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="latitude" /> : <TextInput source="latitude" defaultValue={0} />}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="longitude" /> : <TextInput source="longitude" defaultValue={0} />}</Grid>

      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="radius" /> : <NumberInput source="radius" defaultValue={10000} />}</Grid>
      <Grid size={{ xs: 12, md: 6 }}>{isShow ? <FieldText source="radiusUnit" /> : <TextInput source="radiusUnit" defaultValue={"m"} />}</Grid>

      <Grid size={12}>
        <LanguageArrayInput source="municipalityLanguages" isShow={isShow}>
          {isShow ? <FieldText source="name" /> : <TextInput source="name" />}
          {isShow ? <CKEditorField source="description" /> : <CKEditorInput source="description" />}
        </LanguageArrayInput>
      </Grid>
    </Grid>
  );
};

export default MunicipalitiesForm;
