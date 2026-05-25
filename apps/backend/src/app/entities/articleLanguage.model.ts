import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Article } from "./article.model";
import { Language } from "./language.model";

@Entity({ name: "articles_languages" })
export class ArticleLanguage {
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

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Article, (article) => article.articleLanguages, { onDelete: "CASCADE" })
  article?: Article;

  @ManyToOne(() => Language, (language) => language.articleLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

