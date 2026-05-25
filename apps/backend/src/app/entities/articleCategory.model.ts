import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

import { Article } from "./article.model";
import { Category } from "./category.model";

@Entity({ name: "articles_categories" })
export class ArticleCategory {
  @PrimaryColumn({
    name: "article_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  articleId!: number;

  @PrimaryColumn({
    name: "category_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Article, (article) => article.articleCategories, { onDelete: "CASCADE" })
  article?: Article;

  @ManyToOne(() => Category, (category) => category.articleCategories, { onDelete: "CASCADE" })
  category?: Category;
}

