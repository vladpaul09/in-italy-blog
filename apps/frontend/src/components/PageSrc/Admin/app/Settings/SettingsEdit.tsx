import { FC } from "react";
import {
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  FormDataConsumer,
  ArrayInput,
  SimpleFormIterator,
  ImageInput,
  ImageField,
  useResourceContext,
  useTranslate,
  EditBase,
  Form,
  SaveButton,
  TextInput,
} from "react-admin";
import Grid from "@mui/material/Grid";
import config from "@/config";
import settingsTypeEntry, { settingsTypeEntryDefaultValue } from "../../entries/settingsType.entry";
import ResourceType from "../../entries/resourceType.entry";
import Typography from "@mui/material/Typography";
import ImageInputIcon from "../../components/Buttons/ImageInputIcon";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const SettingsEdit: FC = () => {
  const resource = useResourceContext();
  const translate = useTranslate();

  const homepageBoxesReferences = {
    [ResourceType.CategoriesArticles]: "categories-articles",
    [ResourceType.CategoriesEvents]: "categories-events",
    [ResourceType.CategoriesPodcasts]: "categories-podcasts",
    [ResourceType.Articles]: "articles",
    [ResourceType.Events]: "events",
  };

  return (
    <EditBase redirect={false}>
      <Form>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "right", "&:last-child": { paddingBottom: 2 } }}>
                <SaveButton />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput source="homepageTopBoxOneType" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDataConsumer<{ homepageTopBoxOneType: (typeof settingsTypeEntry)[number]["id"] }>>
                      {({ formData, ...rest }) => {
                        const { homepageTopBoxOneType } = formData;

                        const sources = {
                          [ResourceType.CategoriesArticles]: "homepageTopBoxOneCategoryArticleId",
                          [ResourceType.CategoriesEvents]: "homepageTopBoxOneCategoryEventId",
                          [ResourceType.CategoriesPodcasts]: "homepageTopBoxOneCategoryPodcastId",
                          [ResourceType.Articles]: "homepageTopBoxOneArticleId",
                          [ResourceType.Events]: "homepageTopBoxOneEventId",
                        };

                        return (
                          <ReferenceInput
                            {...rest}
                            source={sources[homepageTopBoxOneType] || sources[ResourceType.CategoriesArticles]}
                            reference={homepageBoxesReferences[homepageTopBoxOneType] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                            sort={{ field: "id", order: "ASC" }}
                            perPage={config.admin.suggestionLimit}
                          >
                            <AutocompleteInput />
                          </ReferenceInput>
                        );
                      }}
                    </FormDataConsumer>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput source="homepageTopBoxTwoType" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDataConsumer<{ homepageTopBoxTwoType: (typeof settingsTypeEntry)[number]["id"] }>>
                      {({ formData, ...rest }) => {
                        const { homepageTopBoxTwoType } = formData;

                        const sources = {
                          [ResourceType.CategoriesArticles]: "homepageTopBoxTwoCategoryArticleId",
                          [ResourceType.CategoriesEvents]: "homepageTopBoxTwoCategoryEventId",
                          [ResourceType.CategoriesPodcasts]: "homepageTopBoxTwoCategoryPodcastId",
                          [ResourceType.Articles]: "homepageTopBoxTwoArticleId",
                          [ResourceType.Events]: "homepageTopBoxTwoEventId",
                        };

                        return (
                          <ReferenceInput
                            {...rest}
                            source={sources[homepageTopBoxTwoType] || sources[ResourceType.CategoriesArticles]}
                            reference={homepageBoxesReferences[homepageTopBoxTwoType] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                            sort={{ field: "id", order: "ASC" }}
                            perPage={config.admin.suggestionLimit}
                          >
                            <AutocompleteInput />
                          </ReferenceInput>
                        );
                      }}
                    </FormDataConsumer>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput source="homepageTopBoxThreeType" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDataConsumer<{ homepageTopBoxThreeType: (typeof settingsTypeEntry)[number]["id"] }>>
                      {({ formData, ...rest }) => {
                        const { homepageTopBoxThreeType } = formData;

                        const sources = {
                          [ResourceType.CategoriesArticles]: "homepageTopBoxThreeCategoryArticleId",
                          [ResourceType.CategoriesEvents]: "homepageTopBoxThreeCategoryEventId",
                          [ResourceType.CategoriesPodcasts]: "homepageTopBoxThreeCategoryPodcastId",
                          [ResourceType.Articles]: "homepageTopBoxThreeArticleId",
                          [ResourceType.Events]: "homepageTopBoxThreeEventId",
                        };

                        return (
                          <ReferenceInput
                            {...rest}
                            source={sources[homepageTopBoxThreeType] || sources[ResourceType.CategoriesArticles]}
                            reference={homepageBoxesReferences[homepageTopBoxThreeType] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                            sort={{ field: "id", order: "ASC" }}
                            perPage={config.admin.suggestionLimit}
                          >
                            <AutocompleteInput />
                          </ReferenceInput>
                        );
                      }}
                    </FormDataConsumer>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput source="homepageTopBoxFourType" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDataConsumer<{ homepageTopBoxFourType: (typeof settingsTypeEntry)[number]["id"] }>>
                      {({ formData, ...rest }) => {
                        const { homepageTopBoxFourType } = formData;

                        const sources = {
                          [ResourceType.CategoriesArticles]: "homepageTopBoxFourCategoryArticleId",
                          [ResourceType.CategoriesEvents]: "homepageTopBoxFourCategoryEventId",
                          [ResourceType.CategoriesPodcasts]: "homepageTopBoxFourCategoryPodcastId",
                          [ResourceType.Articles]: "homepageTopBoxFourArticleId",
                          [ResourceType.Events]: "homepageTopBoxFourEventId",
                        };

                        return (
                          <ReferenceInput
                            {...rest}
                            source={sources[homepageTopBoxFourType] || sources[ResourceType.CategoriesArticles]}
                            reference={homepageBoxesReferences[homepageTopBoxFourType] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                            sort={{ field: "id", order: "ASC" }}
                            perPage={config.admin.suggestionLimit}
                          >
                            <AutocompleteInput />
                          </ReferenceInput>
                        );
                      }}
                    </FormDataConsumer>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput source="homepageTopBoxFiveType" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormDataConsumer<{ homepageTopBoxFiveType: (typeof settingsTypeEntry)[number]["id"] }>>
                      {({ formData, ...rest }) => {
                        const { homepageTopBoxFiveType } = formData;

                        const sources = {
                          [ResourceType.CategoriesArticles]: "homepageTopBoxFiveCategoryArticleId",
                          [ResourceType.CategoriesEvents]: "homepageTopBoxFiveCategoryEventId",
                          [ResourceType.CategoriesPodcasts]: "homepageTopBoxFiveCategoryPodcastId",
                          [ResourceType.Articles]: "homepageTopBoxFiveArticleId",
                          [ResourceType.Events]: "homepageTopBoxFiveEventId",
                        };

                        return (
                          <ReferenceInput
                            {...rest}
                            source={sources[homepageTopBoxFiveType] || sources[ResourceType.CategoriesArticles]}
                            reference={homepageBoxesReferences[homepageTopBoxFiveType] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                            sort={{ field: "id", order: "ASC" }}
                            perPage={config.admin.suggestionLimit}
                          >
                            <AutocompleteInput />
                          </ReferenceInput>
                        );
                      }}
                    </FormDataConsumer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12 }}>
                    <ArrayInput source="homepageBottomBoxes">
                      <SimpleFormIterator inline>
                        <SelectInput source="type" choices={settingsTypeEntry} defaultValue={settingsTypeEntryDefaultValue} />
                        <FormDataConsumer<{ type: (typeof settingsTypeEntry)[number]["id"] }>>
                          {({ formData, scopedFormData, ...rest }) => {
                            if (!scopedFormData) return null;

                            const { type } = scopedFormData;

                            const sources = {
                              [ResourceType.CategoriesArticles]: "categoryArticleId",
                              [ResourceType.CategoriesEvents]: "categoryEventId",
                              [ResourceType.CategoriesPodcasts]: "categoryPodcastId",
                              [ResourceType.Articles]: "articleId",
                              [ResourceType.Events]: "eventId",
                            };

                            return (
                              <ReferenceInput
                                {...rest}
                                source={sources[type] || sources[ResourceType.CategoriesArticles]}
                                reference={homepageBoxesReferences[type] || homepageBoxesReferences[ResourceType.CategoriesArticles]}
                                sort={{ field: "id", order: "ASC" }}
                                perPage={config.admin.suggestionLimit}
                              >
                                <AutocompleteInput />
                              </ReferenceInput>
                            );
                          }}
                        </FormDataConsumer>
                      </SimpleFormIterator>
                    </ArrayInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12 }}>
                    <ArrayInput source="homepageAroundYou">
                      <SimpleFormIterator inline>
                        <ReferenceInput
                          source={"categoryArticleId"}
                          reference={ResourceType.CategoriesArticles}
                          sort={{ field: "id", order: "ASC" }}
                          perPage={config.admin.suggestionLimit}
                          filter={{ parentId: null }}
                        >
                          <AutocompleteInput />
                        </ReferenceInput>
                      </SimpleFormIterator>
                    </ArrayInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12 }}>
                    <ArrayInput source="regionalArticles">
                      <SimpleFormIterator inline>
                        <ReferenceInput
                          source="categoryArticleId"
                          reference={ResourceType.CategoriesArticles}
                          sort={{ field: "id", order: "ASC" }}
                          perPage={config.admin.suggestionLimit}
                          filter={{ parentId: null }}
                        >
                          <AutocompleteInput />
                        </ReferenceInput>
                      </SimpleFormIterator>
                    </ArrayInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    <ArrayInput source="showcasePodcast">
                      <SimpleFormIterator inline>
                        <ReferenceInput
                          source="podcastId"
                          reference="podcasts"
                          sort={{ field: "id", order: "ASC" }}
                          perPage={config.admin.suggestionLimit}
                        >
                          <AutocompleteInput optionText="name" />
                        </ReferenceInput>
                      </SimpleFormIterator>
                    </ArrayInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    <ArrayInput source="homepageHeaderImages">
                      <SimpleFormIterator>
                        <ImageInput
                          source="image"
                          removeIcon={ImageInputIcon}
                          placeholder={
                            <Typography component="p" sx={{ py: 3 }}>
                              {translate(`resources.${resource}.imagePlaceholderText`)}
                            </Typography>
                          }
                          fullWidth
                        >
                          <ImageField source="src" title="title" />
                        </ImageInput>
                        <ImageInput
                          source="mobileImage"
                          removeIcon={ImageInputIcon}
                          placeholder={
                            <Typography component="p" sx={{ py: 3 }}>
                              {translate(`resources.${resource}.mobileImagePlaceholderText`, {
                                _: "Mobile Image"
                              })}
                            </Typography>
                          }
                          fullWidth
                        >
                          <ImageField source="src" title="title" />
                        </ImageInput>
                        <TextInput source="link" fullWidth />
                      </SimpleFormIterator>
                    </ArrayInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    <ImageInput
                      source="defaultImage"
                      removeIcon={ImageInputIcon}
                      placeholder={
                        <Typography component="p" sx={{ py: 3 }}>
                          {translate(`resources.${resource}.imagePlaceholderText`)}
                        </Typography>
                      }
                      fullWidth
                    >
                      <ImageField source="src" title="title" />
                    </ImageInput>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card variant="outlined">
              <CardContent sx={{ "&:last-child": { paddingBottom: 2 } }}>
                <SaveButton />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </EditBase>
  );
};

export default SettingsEdit;
