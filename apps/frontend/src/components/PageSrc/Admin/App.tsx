import { FC, lazy } from "react";
import { Admin, Resource } from "react-admin";
import MainLayout from "./components/Layout/MainLayout";
import { Route } from "react-router-dom";
import dataProvider from "./data-provider/dataProvider";
import mainAuthProvider from "./data-provider/mainAuthProvider";
import i18nProvider from "./i18n/i18nProvider";
import { darkTheme, lightTheme } from "./theme";
import ResourceType from "./entries/resourceType.entry";
import NewspaperIcon from "@mui/icons-material/Newspaper";

const UsersList = lazy(() => import("./app/Users/UsersList"));
const UsersShow = lazy(() => import("./app/Users/UsersShow"));
const UsersCreate = lazy(() => import("./app/Users/UsersCreate"));
const UsersEdit = lazy(() => import("./app/Users/UsersEdit"));

const GroupsList = lazy(() => import("./app/Groups/GroupsList"));
const GroupsShow = lazy(() => import("./app/Groups/GroupsShow"));
const GroupsCreate = lazy(() => import("./app/Groups/GroupsCreate"));
const GroupsEdit = lazy(() => import("./app/Groups/GroupsEdit"));

const ArticlesList = lazy(() => import("./app/Articles/ArticlesList"));
const ArticlesShow = lazy(() => import("./app/Articles/ArticlesShow"));
const ArticlesEdit = lazy(() => import("./app/Articles/ArticlesEdit"));
const ArticlesCreate = lazy(() => import("./app/Articles/ArticlesCreate"));

const EventsList = lazy(() => import("./app/Events/EventsList"));
const EventsShow = lazy(() => import("./app/Events/EventsShow"));
const EventsEdit = lazy(() => import("./app/Events/EventsEdit"));
const EventsCreate = lazy(() => import("./app/Events/EventsCreate"));

const CategoriesList = lazy(() => import("./app/Categories/CategoriesList"));
const CategoriesShow = lazy(() => import("./app/Categories/CategoriesShow"));
const CategoriesEdit = lazy(() => import("./app/Categories/CategoriesEdit"));
const CategoriesCreate = lazy(() => import("./app/Categories/CategoriesCreate"));

const LanguagesList = lazy(() => import("./app/Languages/LanguagesList"));
const LanguagesShow = lazy(() => import("./app/Languages/LanguagesShow"));
const LanguagesEdit = lazy(() => import("./app/Languages/LanguagesEdit"));
const LanguagesCreate = lazy(() => import("./app/Languages/LanguagesCreate"));
const LanguagesOrder = lazy(() => import("./app/Languages/LanguagesOrder"));

const MunicipalitiesList = lazy(() => import("./app/Municipalities/MunicipalitiesList"));
const MunicipalitiesShow = lazy(() => import("./app/Municipalities/MunicipalitiesShow"));
const MunicipalitiesEdit = lazy(() => import("./app/Municipalities/MunicipalitiesEdit"));
const MunicipalitiesCreate = lazy(() => import("./app/Municipalities/MunicipalitiesCreate"));

const ProvincesList = lazy(() => import("./app/Provinces/ProvincesList"));
const ProvincesShow = lazy(() => import("./app/Provinces/ProvincesShow"));
const ProvincesEdit = lazy(() => import("./app/Provinces/ProvincesEdit"));
const ProvincesCreate = lazy(() => import("./app/Provinces/ProvincesCreate"));

const RegionsList = lazy(() => import("./app/Regions/RegionsList"));
const RegionsShow = lazy(() => import("./app/Regions/RegionsShow"));
const RegionsEdit = lazy(() => import("./app/Regions/RegionsEdit"));
const RegionsCreate = lazy(() => import("./app/Regions/RegionsCreate"));

const PodcastsList = lazy(() => import("./app/Podcasts/PodcastsList"));
const PodcastsShow = lazy(() => import("./app/Podcasts/PodcastsShow"));
const PodcastsEdit = lazy(() => import("./app/Podcasts/PodcastsEdit"));
const PodcastsCreate = lazy(() => import("./app/Podcasts/PodcastsCreate"));

const WebsiteIntlList = lazy(() => import("./app/WebsiteIntl/WebsiteIntlList"));
const WebsiteIntlShow = lazy(() => import("./app/WebsiteIntl/WebsiteIntlShow"));
const WebsiteIntlEdit = lazy(() => import("./app/WebsiteIntl/WebsiteIntlEdit"));
const WebsiteIntlCreate = lazy(() => import("./app/WebsiteIntl/WebsiteIntlCreate"));

const MenuItemsList = lazy(() => import("./app/MenuItems/MenuItemsList"));
const MenuItemsShow = lazy(() => import("./app/MenuItems/MenuItemsShow"));
const MenuItemsEdit = lazy(() => import("./app/MenuItems/MenuItemsEdit"));
const MenuItemsCreate = lazy(() => import("./app/MenuItems/MenuItemsCreate"));

const SettingsEdit = lazy(() => import("./app/Settings/SettingsEdit"));

const ContactFormList = lazy(() => import("./app/ContactForm/ContactFormList"));
const ContactFormShow = lazy(() => import("./app/ContactForm/ContactFormShow"));

const NewsletterList = lazy(() => import("./app/Newsletter/NewsletterList"));
const NewsletterShow = lazy(() => import("./app/Newsletter/NewsletterShow"));

const BusinessRegistrationFormList = lazy(() => import("./app/BusinessRegistrationForm/BusinessRegistrationFormList"));
const BusinessRegistrationFormShow = lazy(() => import("./app/BusinessRegistrationForm/BusinessRegistrationFormShow"));

const PagesList = lazy(() => import("./app/Pages/PagesList"));
const PagesShow = lazy(() => import("./app/Pages/PagesShow"));
const PagesEdit = lazy(() => import("./app/Pages/PagesEdit"));
const PagesCreate = lazy(() => import("./app/Pages/PagesCreate"));

const TagsList = lazy(() => import("./app/Tags/TagsList"));
const TagsShow = lazy(() => import("./app/Tags/TagsShow"));
const TagsEdit = lazy(() => import("./app/Tags/TagsEdit"));
const TagsCreate = lazy(() => import("./app/Tags/TagsCreate"));

const App: FC = () => {
  return (
    <Admin
      layout={MainLayout}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      authProvider={mainAuthProvider}
      theme={lightTheme}
      darkTheme={darkTheme}
    >
      <Resource name="users" list={UsersList} show={UsersShow} create={UsersCreate} edit={UsersEdit} />
      <Resource name="groups" list={GroupsList} show={GroupsShow} create={GroupsCreate} edit={GroupsEdit} />
      <Resource name="articles" list={ArticlesList} show={ArticlesShow} create={ArticlesCreate} edit={ArticlesEdit} />
      <Resource name={ResourceType.News} list={ArticlesList} show={ArticlesShow} create={ArticlesCreate} edit={ArticlesEdit} icon={NewspaperIcon} />
      <Resource name={ResourceType.Events} list={EventsList} show={EventsShow} create={EventsCreate} edit={EventsEdit} />
      <Resource name="podcasts" list={PodcastsList} show={PodcastsShow} create={PodcastsCreate} edit={PodcastsEdit} />
      <Resource name="categories-articles" list={CategoriesList} show={CategoriesShow} create={CategoriesCreate} edit={CategoriesEdit} />
      <Resource name="categories-events" list={CategoriesList} show={CategoriesShow} create={CategoriesCreate} edit={CategoriesEdit} />
      <Resource name="categories-podcasts" list={CategoriesList} show={CategoriesShow} create={CategoriesCreate} edit={CategoriesEdit} />
      <Resource name="languages" list={LanguagesList} show={LanguagesShow} create={LanguagesCreate} edit={LanguagesEdit}>
        <Route path="order" element={<LanguagesOrder />} />
      </Resource>
      <Resource name="municipalities" list={MunicipalitiesList} create={MunicipalitiesCreate} edit={MunicipalitiesEdit} show={MunicipalitiesShow} />
      <Resource name="provinces" list={ProvincesList} create={ProvincesCreate} edit={ProvincesEdit} show={ProvincesShow} />
      <Resource name="regions" list={RegionsList} create={RegionsCreate} edit={RegionsEdit} show={RegionsShow} />
      <Resource name="website-intl" list={WebsiteIntlList} show={WebsiteIntlShow} create={WebsiteIntlCreate} edit={WebsiteIntlEdit} />
      <Resource name="menu-items" list={MenuItemsList} show={MenuItemsShow} create={MenuItemsCreate} edit={MenuItemsEdit} />
      <Resource name="settings" edit={SettingsEdit} />
      <Resource name={ResourceType.ContactForm} list={ContactFormList} show={ContactFormShow} />
      <Resource name={ResourceType.Newsletter} list={NewsletterList} show={NewsletterShow} />
      <Resource name={ResourceType.BusinessRegistrationForm} list={BusinessRegistrationFormList} show={BusinessRegistrationFormShow} />
      <Resource name={ResourceType.Pages} list={PagesList} show={PagesShow} create={PagesCreate} edit={PagesEdit} />
      <Resource name={ResourceType.Tags} list={TagsList} show={TagsShow} create={TagsCreate} edit={TagsEdit} />
    </Admin>
  );
};

export default App;
