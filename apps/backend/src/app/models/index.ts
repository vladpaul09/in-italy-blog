import Article from "./article.model";
import Category from "./category.model";
import Municipality from "./municipality.model";
import ArticleCategory from "./articleCategory.model";
import ArticleMunicipality from "./articleMunicipality.model";
import User from "./user.model";
import Group from "./group.model";
import GroupPermission from "./groupPermission.model";
import Permission from "./permission.model";
import UserGroup from "./userGroup.model";
import UserRegion from "./userRegion.model";
import UserProvince from "./userProvince.model";
import UserMunicipality from "./userMunicipality.model";
import ArticleLanguage from "./articleLanguage.model";
import CategoryLanguage from "./categoryLanguage.model";
import MunicipalityLanguage from "./municipalityLanguage.model";
import RegionLanguage from "./regionLanguage.model";
import ProvinceLanguage from "./provinceLanguage.model";
import Language from "./language.model";
import Region from "./region.model";
import Province from "./province.model";
import PodcastLanguage from "./podcastLanguage.model";
import Podcast from "./podcast.model";
import PodcastCategory from "./podcastCategory.model";
import I18n from "./i18n.model";
import Media from "./media.model";
import Event from "./event.model";
import EventLanguage from "./eventLanguage.model";
import EventCategory from "./eventCategory.model";
import MenuItem from "./menuItem.model";
import Settings from "./settings.model";
import MenuItemLanguage from "./menuItemLanguage.model";
import ContactForm from "./contactForm.model";
import BusinessRegistrationForm from "./businessRegistrationForm.model";
import PodcastMunicipality from "./podcastMunicipality.model";
import Newsletter from "./newsletter.model";
import UserAlias from "./userAlias.model";
import Page from "./page.model";
import PageLanguage from "./pageLanguage.model";
import PushSubscription from "./pushSubscription.model";
import Tag from "./tag.model";
import TagLanguage from "./tagLanguage.model";
import CategoryTag from "./categoryTag.model";

/** Users => groups permissions regions provinces municipalities associations */
User.hasMany(UserAlias, { foreignKey: "user_id", as: "aliases" });
User.belongsToMany(Group, { through: UserGroup, foreignKey: "user_id", otherKey: "group_id", as: "groups" });
User.belongsToMany(Region, { through: UserRegion, foreignKey: "user_id", otherKey: "region_id", as: "regions" });
User.belongsToMany(Province, { through: UserProvince, foreignKey: "user_id", otherKey: "province_id", as: "provinces" });
User.belongsToMany(Municipality, { through: UserMunicipality, foreignKey: "user_id", otherKey: "municipality_id", as: "municipalities" });

/** Users => aliases association */
UserAlias.belongsTo(User, { foreignKey: "user_id", as: "user" });
UserAlias.hasMany(Article, { foreignKey: "authorId", as: "articles" });
UserAlias.hasMany(Event, { foreignKey: "authorId", as: "events" });
UserAlias.hasMany(Podcast, { foreignKey: "authorId", as: "podcasts" });

/** Groups => permissions associations */
Group.belongsToMany(Permission, { through: GroupPermission, foreignKey: "group_id", otherKey: "permissionCodename", as: "permissions" });

/** Region => provinces, languages associations */
Region.hasMany(Province, { foreignKey: "region_id", as: "provinces" });
Region.hasMany(RegionLanguage, { foreignKey: "region_id", as: "regionLanguages" });
Region.belongsToMany(Language, { through: RegionLanguage, foreignKey: "region_id", otherKey: "language_id", as: "languages" });

/** Region Language => region associations */
RegionLanguage.belongsTo(Region, { foreignKey: "region_id", as: "region" });
RegionLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });

/** Province => region, municipalities, languages associations */
Province.hasMany(ProvinceLanguage, { foreignKey: "province_id", as: "provinceLanguages" });
Province.belongsToMany(Language, { through: ProvinceLanguage, foreignKey: "province_id", otherKey: "language_id", as: "languages" });
Province.belongsTo(Region, { foreignKey: "region_id", as: "region" });
Province.hasMany(Municipality, { foreignKey: "province_id", as: "municipalities" });

/** Province Language => province, language associations */
ProvinceLanguage.belongsTo(Province, { foreignKey: "province_id", as: "province" });
ProvinceLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });

/** Municipality => province, languages associations */
Municipality.hasMany(MunicipalityLanguage, { foreignKey: "municipality_id", as: "municipalityLanguages" });
Municipality.belongsToMany(Language, { through: MunicipalityLanguage, foreignKey: "municipality_id", otherKey: "language_id", as: "languages" });
Municipality.belongsTo(Province, { foreignKey: "province_id", as: "province" });
Municipality.belongsToMany(Article, {
  through: ArticleMunicipality,
  foreignKey: "municipality_id",
  otherKey: "article_id",
  as: "articles",
});
Municipality.hasMany(Event, { foreignKey: "municipality_id", as: "events" });
Municipality.belongsToMany(Podcast, { through: PodcastMunicipality, foreignKey: "municipalityId", otherKey: "podcastId", as: "podcasts" });

/** Municipality Language => municipality, language associations */
MunicipalityLanguage.belongsTo(Municipality, { foreignKey: "municipality_id", as: "municipality" });
MunicipalityLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });

/** Article associations */
Article.hasMany(ArticleLanguage, { foreignKey: "articleId", as: "articleLanguages" });
Article.belongsTo(User, { foreignKey: "userId", as: "user" });
Article.belongsTo(User, { foreignKey: "userReviewId", as: "userReview" });
Article.belongsToMany(Category, { through: ArticleCategory, foreignKey: "articleId", otherKey: "categoryId", as: "categories" });
Article.belongsToMany(Municipality, { through: ArticleMunicipality, foreignKey: "articleId", otherKey: "municipalityId", as: "municipalities" });
Article.belongsTo(User, { foreignKey: "authorId", as: "author" });
Article.belongsTo(UserAlias, { foreignKey: "authorAliasId", as: "authorAlias" });

/** Event associations */
Event.hasMany(EventLanguage, { foreignKey: "eventId", as: "eventLanguages" });
Event.belongsTo(User, { foreignKey: "userId", as: "user" });
Event.belongsTo(Municipality, { foreignKey: "municipalityId", as: "municipality" });
Event.belongsToMany(Category, { through: EventCategory, foreignKey: "eventId", otherKey: "categoryId", as: "categories" });
Event.belongsTo(User, { foreignKey: "authorId", as: "author" });
Event.belongsTo(UserAlias, { foreignKey: "authorAliasId", as: "authorAlias" });

/** Category associations */
Category.hasMany(CategoryLanguage, { foreignKey: "category_id", as: "categoryLanguages" });
Category.belongsTo(User, { foreignKey: "userId", as: "user" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parentCategory" });
Category.hasMany(Category, { foreignKey: "parentId", as: "childCategories" });

Category.belongsToMany(Article, {
  through: ArticleCategory,
  foreignKey: "categoryId",
  otherKey: "articleId",
  as: "categoryArticles",
});

Category.belongsToMany(Event, {
  through: EventCategory,
  foreignKey: "categoryId",
  otherKey: "eventId",
  as: "categoryEvents",
});

Category.belongsToMany(Podcast, {
  through: PodcastCategory,
  foreignKey: "categoryId",
  otherKey: "podcastId",
  as: "categoryPodcasts",
});

Category.belongsToMany(Tag, {
  through: CategoryTag,
  foreignKey: "categoryId",
  otherKey: "tagId",
  as: "tags",
});

/** CategoryTag Junction table associations for tags */
CategoryTag.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
CategoryTag.belongsTo(Tag, { foreignKey: "tagId", as: "tag" });

/** I18n associations */
I18n.belongsTo(Language, { foreignKey: "langId", as: "language" });

/** Language associations */
Language.hasMany(ArticleLanguage, { foreignKey: "languageId", as: "articleLanguages" });
Language.hasMany(CategoryLanguage, { foreignKey: "language_id", as: "categoryLanguages" });
Language.hasMany(MunicipalityLanguage, { foreignKey: "language_id", as: "municipalityLanguages" });
Language.hasMany(ProvinceLanguage, { foreignKey: "language_id", as: "provinceLanguages" });
Language.hasMany(RegionLanguage, { foreignKey: "language_id", as: "regionLanguages" });
Language.hasMany(PodcastLanguage, { foreignKey: "language_id", as: "podcastLanguages" });
Language.hasMany(EventLanguage, { foreignKey: "languageId", as: "eventLanguages" });
Language.hasMany(I18n, { foreignKey: "langId", as: "translations" });
Language.hasMany(PageLanguage, { foreignKey: "languageId", as: "pageLanguages" });
Language.hasMany(TagLanguage, { foreignKey: "language_id", as: "tagLanguages" });

// Language model associations for the other direction
ArticleLanguage.belongsTo(Language, { foreignKey: "languageId", as: "language" });
CategoryLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });
PodcastLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });
EventLanguage.belongsTo(Language, { foreignKey: "languageId", as: "language" });

// Join table associations
ArticleCategory.belongsTo(Article, { foreignKey: "articleId", as: "article" });
ArticleCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

ArticleMunicipality.belongsTo(Article, { foreignKey: "articleId", as: "article" });
ArticleMunicipality.belongsTo(Municipality, { foreignKey: "municipalityId", as: "municipality" });

EventCategory.belongsTo(Event, { foreignKey: "eventId", as: "event" });
EventCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

/** Podcast associations => user, categories, podcastLanguages */
Podcast.hasMany(PodcastLanguage, { foreignKey: "podcastId", as: "podcastLanguages" });
Podcast.belongsTo(User, { foreignKey: "userId", as: "user" });
Podcast.belongsToMany(Category, { through: PodcastCategory, foreignKey: "podcastId", otherKey: "categoryId", as: "categories" });
Podcast.belongsToMany(Municipality, { through: PodcastMunicipality, foreignKey: "podcastId", otherKey: "municipalityId", as: "municipalities" });
Podcast.belongsTo(User, { foreignKey: "authorId", as: "author" });
Podcast.belongsTo(UserAlias, { foreignKey: "authorAliasId", as: "authorAlias" });

/** MenuItem associations */
MenuItem.belongsTo(MenuItem, { foreignKey: "parentId", as: "parentMenuItem" });
MenuItem.hasMany(MenuItem, { foreignKey: "parentId", as: "childMenuItems" });
MenuItem.hasMany(MenuItemLanguage, { foreignKey: "menuItemId", as: "menuItemLanguages" });
MenuItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

/** MenuItemLanguage associations */
MenuItemLanguage.belongsTo(MenuItem, { foreignKey: "menuItemId", as: "menuItem" });
MenuItemLanguage.belongsTo(Language, { foreignKey: "languageId", as: "language" });

/** Page associations */
Page.hasMany(PageLanguage, { foreignKey: "pageId", as: "pageLanguages" });

/** PageLanguage associations */
PageLanguage.belongsTo(Page, { foreignKey: "pageId", as: "page" });
PageLanguage.belongsTo(Language, { foreignKey: "languageId", as: "language" });

/** PushSubscription associations */
PushSubscription.belongsTo(Language, { foreignKey: "locale", as: "language" });

/** Tag associations */
Tag.hasMany(TagLanguage, { foreignKey: "tag_id", as: "tagLanguages" });
Tag.belongsToMany(Category, { through: CategoryTag, foreignKey: "tagId", otherKey: "categoryId", as: "categories" });

/** TagLanguage associations */
TagLanguage.belongsTo(Tag, { foreignKey: "tag_id", as: "tag" });
TagLanguage.belongsTo(Language, { foreignKey: "language_id", as: "language" });

export {
  Article,
  Category,
  Municipality,
  ArticleCategory,
  ArticleMunicipality,
  ArticleLanguage,
  CategoryLanguage,
  MunicipalityLanguage,
  RegionLanguage,
  ProvinceLanguage,
  User,
  UserAlias,
  UserGroup,
  UserRegion,
  UserProvince,
  UserMunicipality,
  Group,
  GroupPermission,
  Permission,
  Language,
  Region,
  Province,
  Podcast,
  PodcastLanguage,
  PodcastCategory,
  I18n,
  Event,
  EventLanguage,
  EventCategory,
  Media,
  MenuItem,
  Settings,
  MenuItemLanguage,
  ContactForm,
  BusinessRegistrationForm,
  PodcastMunicipality,
  Newsletter,
  Page,
  PageLanguage,
  PushSubscription,
  Tag,
  TagLanguage,
  CategoryTag,
};
