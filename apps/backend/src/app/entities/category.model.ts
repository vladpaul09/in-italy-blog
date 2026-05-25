import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import CategoriesType, { CategoryPageView } from "../../entries/categoriesType.entry";
import { User } from "./user.model";
import { CategoryLanguage } from "./categoryLanguage.model";
import { Article } from "./article.model";
import { ArticleCategory } from "./articleCategory.model";
import { Event } from "./event.model";
import { EventCategory } from "./eventCategory.model";
import { Podcast } from "./podcast.model";
import { PodcastCategory } from "./podcastCategory.model";
import { Tag } from "./tag.model";
import { CategoryTag } from "./categoryTag.model";
import { MenuItem } from "./menuItem.model";
import { Member } from "./member.model";
import { MemberCategory } from "./memberCategory.model";

@Entity({ name: "categories" })
export class Category {
  @Column({
    type: "bigint",
    unsigned: true,
    primary: true,
    generated: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  id!: number;

  @Column({ type: "varchar" })
  slug!: string;

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  userId!: number;

  @Column({ name: "parent_id", type: "bigint", unsigned: true, nullable: true })
  parentId!: number | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string | null;

  @Column({ name: "mobile_image", type: "varchar", length: 255, nullable: true })
  mobileImage!: string | null;

  @Column({ type: "enum", enum: CategoriesType })
  type!: CategoriesType;

  @Column({ name: "page_view", type: "enum", enum: CategoryPageView, default: CategoryPageView.POSTS_VIEW })
  pageView!: CategoryPageView;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @OneToMany(() => CategoryLanguage, (categoryLanguage) => categoryLanguage.category, { cascade: true })
  categoryLanguages?: CategoryLanguage[];

  @ManyToOne(() => Category, (category) => category.childCategories, { onDelete: "SET NULL" })
  @JoinColumn({ name: "parent_id" })
  parentCategory?: Category | null;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories?: Category[];

  @ManyToMany(() => Article, (article) => article.categories)
  @JoinTable({
    name: "articles_categories",
    joinColumn: { name: "category_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "article_id", referencedColumnName: "id" },
  })
  articles?: Article[];

  @OneToMany(() => ArticleCategory, (articleCategory) => articleCategory.category)
  articleCategories?: ArticleCategory[];

  @ManyToMany(() => Event, (event) => event.categories)
  @JoinTable({
    name: "events_categories",
    joinColumn: { name: "category_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "event_id", referencedColumnName: "id" },
  })
  events?: Event[];

  @OneToMany(() => EventCategory, (eventCategory) => eventCategory.category)
  eventCategories?: EventCategory[];

  @ManyToMany(() => Podcast, (podcast) => podcast.categories)
  @JoinTable({
    name: "podcasts_categories",
    joinColumn: { name: "category_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "podcast_id", referencedColumnName: "id" },
  })
  podcasts?: Podcast[];

  @OneToMany(() => PodcastCategory, (podcastCategory) => podcastCategory.category)
  podcastCategories?: PodcastCategory[];

  @ManyToMany(() => Tag, (tag) => tag.categories)
  @JoinTable({
    name: "categories_tags",
    joinColumn: { name: "category_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags?: Tag[];

  @OneToMany(() => CategoryTag, (categoryTag) => categoryTag.category)
  categoryTags?: CategoryTag[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems?: MenuItem[];

  @ManyToMany(() => Member, (member) => member.categories)
  members?: Member[];

  @OneToMany(() => MemberCategory, (memberCategory) => memberCategory.category)
  memberCategories?: MemberCategory[];
}

