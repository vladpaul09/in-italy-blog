import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import PostScope from "../../entries/postScope.entry";
import { ArticleLanguage } from "./articleLanguage.model";
import { Category } from "./category.model";
import { ArticleCategory } from "./articleCategory.model";
import { Municipality } from "./municipality.model";
import { ArticleMunicipality } from "./articleMunicipality.model";
import { User } from "./user.model";
import { UserAlias } from "./userAlias.model";

@Entity({ name: "articles" })
export class Article {
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

  @Column({ name: "user_review_id", type: "bigint", unsigned: true, nullable: true })
  userReviewId!: number | null;

  @Column({ type: "varchar", nullable: true })
  image!: string | null;

  @Column({ name: "mobile_image", type: "varchar", nullable: true })
  mobileImage!: string | null;

  @Column({ type: "enum", enum: PostScope, default: PostScope.EVERYWHERE })
  scope!: PostScope;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @Column({ name: "author_id", type: "bigint", unsigned: true })
  authorId!: number;

  @Column({ name: "author_alias_id", type: "bigint", unsigned: true, nullable: true })
  authorAliasId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ArticleLanguage, (articleLanguage) => articleLanguage.article, { cascade: true })
  articleLanguages?: ArticleLanguage[];

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable({
    name: "articles_categories",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories?: Category[];

  @OneToMany(() => ArticleCategory, (articleCategory) => articleCategory.article)
  articleCategories?: ArticleCategory[];

  @ManyToMany(() => Municipality, (municipality) => municipality.articles)
  @JoinTable({
    name: "articles_municipalities",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "municipality_id", referencedColumnName: "id" },
  })
  municipalities?: Municipality[];

  @OneToMany(() => ArticleMunicipality, (articleMunicipality) => articleMunicipality.article)
  articleMunicipalities?: ArticleMunicipality[];

  @ManyToOne(() => User, (user) => user.articles, { onDelete: "CASCADE" })
  user?: User;

  @ManyToOne(() => User, (user) => user.reviewedArticles, { onDelete: "SET NULL", nullable: true })
  userReview?: User | null;

  @ManyToOne(() => User, (user) => user.authoredArticles, { onDelete: "CASCADE" })
  author?: User;

  @ManyToOne(() => UserAlias, (alias) => alias.articles, { onDelete: "SET NULL", nullable: true })
  authorAlias?: UserAlias | null;
}

