import { FC } from "react";
import { Menu, useCanAccess, useTranslate } from "react-admin";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import EventIcon from "@mui/icons-material/Event";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Submenu from "./SubMenu";
import ResourceType from "../../entries/resourceType.entry";

const MainMenu: FC = () => {
  const translate = useTranslate();

  // Permission checks for each resource - checking create or edit permissions
  const { canAccess: canAccessUsersCreate } = useCanAccess({
    resource: ResourceType.Users,
    action: "create",
  });
  const { canAccess: canAccessUsersEdit } = useCanAccess({
    resource: ResourceType.Users,
    action: "edit",
  });
  const canAccessUsers = canAccessUsersCreate || canAccessUsersEdit;

  const { canAccess: canAccessGroupsCreate } = useCanAccess({
    resource: ResourceType.Groups,
    action: "create",
  });
  const { canAccess: canAccessGroupsEdit } = useCanAccess({
    resource: ResourceType.Groups,
    action: "edit",
  });
  const canAccessGroups = canAccessGroupsCreate || canAccessGroupsEdit;

  const { canAccess: canAccessWebsiteIntlCreate } = useCanAccess({
    resource: ResourceType.WebsiteIntl,
    action: "create",
  });
  const { canAccess: canAccessWebsiteIntlEdit } = useCanAccess({
    resource: ResourceType.WebsiteIntl,
    action: "edit",
  });
  const canAccessWebsiteIntl = canAccessWebsiteIntlCreate || canAccessWebsiteIntlEdit;

  const { canAccess: canAccessLanguagesCreate } = useCanAccess({
    resource: ResourceType.Languages,
    action: "create",
  });
  const { canAccess: canAccessLanguagesEdit } = useCanAccess({
    resource: ResourceType.Languages,
    action: "edit",
  });
  const canAccessLanguages = canAccessLanguagesCreate || canAccessLanguagesEdit;

  const { canAccess: canAccessMunicipalitiesCreate } = useCanAccess({
    resource: ResourceType.Municipalities,
    action: "create",
  });
  const { canAccess: canAccessMunicipalitiesEdit } = useCanAccess({
    resource: ResourceType.Municipalities,
    action: "edit",
  });
  const canAccessMunicipalities = canAccessMunicipalitiesCreate || canAccessMunicipalitiesEdit;

  const { canAccess: canAccessProvincesCreate } = useCanAccess({
    resource: ResourceType.Provinces,
    action: "create",
  });
  const { canAccess: canAccessProvincesEdit } = useCanAccess({
    resource: ResourceType.Provinces,
    action: "edit",
  });
  const canAccessProvinces = canAccessProvincesCreate || canAccessProvincesEdit;

  const { canAccess: canAccessRegionsCreate } = useCanAccess({
    resource: ResourceType.Regions,
    action: "create",
  });
  const { canAccess: canAccessRegionsEdit } = useCanAccess({
    resource: ResourceType.Regions,
    action: "edit",
  });
  const canAccessRegions = canAccessRegionsCreate || canAccessRegionsEdit;

  const { canAccess: canAccessArticlesCreate } = useCanAccess({
    resource: ResourceType.Articles,
    action: "create",
  });
  const { canAccess: canAccessArticlesEdit } = useCanAccess({
    resource: ResourceType.Articles,
    action: "edit",
  });
  const canAccessArticles = canAccessArticlesCreate || canAccessArticlesEdit;

  const { canAccess: canAccessCategoriesArticlesCreate } = useCanAccess({
    resource: ResourceType.CategoriesArticles,
    action: "create",
  });
  const { canAccess: canAccessCategoriesArticlesEdit } = useCanAccess({
    resource: ResourceType.CategoriesArticles,
    action: "edit",
  });
  const canAccessCategoriesArticles = canAccessCategoriesArticlesCreate || canAccessCategoriesArticlesEdit;

  const { canAccess: canAccessEventsCreate } = useCanAccess({
    resource: ResourceType.Events,
    action: "create",
  });
  const { canAccess: canAccessEventsEdit } = useCanAccess({
    resource: ResourceType.Events,
    action: "edit",
  });
  const canAccessEvents = canAccessEventsCreate || canAccessEventsEdit;

  const { canAccess: canAccessCategoriesEventsCreate } = useCanAccess({
    resource: ResourceType.CategoriesEvents,
    action: "create",
  });
  const { canAccess: canAccessCategoriesEventsEdit } = useCanAccess({
    resource: ResourceType.CategoriesEvents,
    action: "edit",
  });
  const canAccessCategoriesEvents = canAccessCategoriesEventsCreate || canAccessCategoriesEventsEdit;

  const { canAccess: canAccessPodcastsCreate } = useCanAccess({
    resource: ResourceType.Podcasts,
    action: "create",
  });
  const { canAccess: canAccessPodcastsEdit } = useCanAccess({
    resource: ResourceType.Podcasts,
    action: "edit",
  });
  const canAccessPodcasts = canAccessPodcastsCreate || canAccessPodcastsEdit;

  const { canAccess: canAccessCategoriesPodcastsCreate } = useCanAccess({
    resource: ResourceType.CategoriesPodcasts,
    action: "create",
  });
  const { canAccess: canAccessCategoriesPodcastsEdit } = useCanAccess({
    resource: ResourceType.CategoriesPodcasts,
    action: "edit",
  });
  const canAccessCategoriesPodcasts = canAccessCategoriesPodcastsCreate || canAccessCategoriesPodcastsEdit;

  const { canAccess: canAccessContactFormCreate } = useCanAccess({
    resource: ResourceType.ContactForm,
    action: "list",
  });
  const { canAccess: canAccessContactFormEdit } = useCanAccess({
    resource: ResourceType.ContactForm,
    action: "show",
  });
  const canAccessContactForm = canAccessContactFormCreate || canAccessContactFormEdit;

  const { canAccess: canAccessNewsletterCreate } = useCanAccess({
    resource: ResourceType.Newsletter,
    action: "list",
  });
  const { canAccess: canAccessNewsletterEdit } = useCanAccess({
    resource: ResourceType.Newsletter,
    action: "show",
  });
  const canAccessNewsletter = canAccessNewsletterCreate || canAccessNewsletterEdit;

  const { canAccess: canAccessBusinessRegistrationFormCreate } = useCanAccess({
    resource: ResourceType.BusinessRegistrationForm,
    action: "list",
  });
  const { canAccess: canAccessBusinessRegistrationFormEdit } = useCanAccess({
    resource: ResourceType.BusinessRegistrationForm,
    action: "show",
  });
  const canAccessBusinessRegistrationForm = canAccessBusinessRegistrationFormCreate || canAccessBusinessRegistrationFormEdit;

  const { canAccess: canAccessNewsCreate } = useCanAccess({
    resource: ResourceType.News,
    action: "create",
  });
  const { canAccess: canAccessNewsEdit } = useCanAccess({
    resource: ResourceType.News,
    action: "edit",
  });
  const canAccessNews = canAccessNewsCreate || canAccessNewsEdit;

  const { canAccess: canAccessMenuItemsCreate } = useCanAccess({
    resource: ResourceType.MenuItems,
    action: "create",
  });
  const { canAccess: canAccessMenuItemsEdit } = useCanAccess({
    resource: ResourceType.MenuItems,
    action: "edit",
  });
  const canAccessMenuItems = canAccessMenuItemsCreate || canAccessMenuItemsEdit;

  const { canAccess: canAccessSettingsShow } = useCanAccess({
    resource: ResourceType.Settings,
    action: "show",
  });
  const { canAccess: canAccessSettingsEdit } = useCanAccess({
    resource: ResourceType.Settings,
    action: "edit",
  });
  const canAccessSettings = canAccessSettingsShow || canAccessSettingsEdit;

  const { canAccess: canAccessPagesCreate } = useCanAccess({
    resource: ResourceType.Pages,
    action: "create",
  });
  const { canAccess: canAccessPagesEdit } = useCanAccess({
    resource: ResourceType.Pages,
    action: "edit",
  });
  const canAccessPages = canAccessPagesCreate || canAccessPagesEdit;

  const { canAccess: canAccessTagsCreate } = useCanAccess({
    resource: ResourceType.Tags,
    action: "create",
  });
  const { canAccess: canAccessTagsEdit } = useCanAccess({
    resource: ResourceType.Tags,
    action: "edit",
  });
  const canAccessTags = canAccessTagsCreate || canAccessTagsEdit;

  return (
    <Menu>
      <Menu.DashboardItem />
      
      {/* Administration Submenu */}
      {(canAccessUsers || canAccessGroups || canAccessWebsiteIntl || canAccessLanguages || canAccessPages || canAccessTags) && (
        <Submenu text={translate("menu.administration")} icon={<SupervisorAccountIcon />}>
          {canAccessUsers && <Menu.ResourceItem name={ResourceType.Users} />}
          {canAccessGroups && <Menu.ResourceItem name={ResourceType.Groups} />}
          {canAccessWebsiteIntl && <Menu.ResourceItem name={ResourceType.WebsiteIntl} />}
          {canAccessLanguages && <Menu.ResourceItem name={ResourceType.Languages} />}
          {canAccessPages && <Menu.ResourceItem name={ResourceType.Pages} />}
          {canAccessTags && <Menu.ResourceItem name={ResourceType.Tags} />}
        </Submenu>
      )}

      {/* Regional Submenu */}
      {(canAccessMunicipalities || canAccessProvinces || canAccessRegions) && (
        <Submenu text={translate("menu.regional")} icon={<MapIcon />}>
          {canAccessMunicipalities && <Menu.ResourceItem name={ResourceType.Municipalities} />}
          {canAccessProvinces && <Menu.ResourceItem name={ResourceType.Provinces} />}
          {canAccessRegions && <Menu.ResourceItem name={ResourceType.Regions} />}
        </Submenu>
      )}

      {/* Articles Submenu */}
      {(canAccessArticles || canAccessCategoriesArticles) && (
        <Submenu text={translate("menu.articles")} icon={<ArticleIcon />}>
          {canAccessArticles && <Menu.ResourceItem name={ResourceType.Articles} />}
          {canAccessCategoriesArticles && <Menu.ResourceItem name={ResourceType.CategoriesArticles} />}
        </Submenu>
      )}

      {/* Events Submenu */}
      {(canAccessEvents || canAccessCategoriesEvents) && (
        <Submenu text={translate("menu.events")} icon={<EventIcon />}>
          {canAccessEvents && <Menu.ResourceItem name={ResourceType.Events} />}
          {canAccessCategoriesEvents && <Menu.ResourceItem name={ResourceType.CategoriesEvents} />}
        </Submenu>
      )}

      {/* Podcasts Submenu */}
      {(canAccessPodcasts || canAccessCategoriesPodcasts) && (
        <Submenu text={translate("menu.podcasts")} icon={<PodcastsIcon />}>
          {canAccessPodcasts && <Menu.ResourceItem name={ResourceType.Podcasts} />}
          {canAccessCategoriesPodcasts && <Menu.ResourceItem name={ResourceType.CategoriesPodcasts} />}
        </Submenu>
      )}

      {/* Subscriptions Submenu */}
      {(canAccessContactForm || canAccessNewsletter || canAccessBusinessRegistrationForm) && (
        <Submenu text={translate("menu.subscriptions")} icon={<ContactMailIcon />}>
          {canAccessContactForm && <Menu.ResourceItem name={ResourceType.ContactForm} />}
          {canAccessNewsletter && <Menu.ResourceItem name={ResourceType.Newsletter} />}
          {canAccessBusinessRegistrationForm && <Menu.ResourceItem name={ResourceType.BusinessRegistrationForm} />}
        </Submenu>
      )}

      {/* Individual Menu Items */}
      {canAccessNews && <Menu.ResourceItem name={ResourceType.News} />}
      {canAccessMenuItems && <Menu.ResourceItem name={ResourceType.MenuItems} />}
      
      {canAccessSettings && (
        <Menu.Item to="/settings/all" primaryText={translate("menu.settings")} leftIcon={<SettingsIcon />} />
      )}
      {/* <Menu.ResourceItems /> */}
    </Menu>
  );
};

export default MainMenu;
