import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Article } from "./article.model";
import { Municipality } from "./municipality.model";

@Entity({ name: "articles_municipalities" })
export class ArticleMunicipality {
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

  @PrimaryColumn({ name: "municipality_id", type: "char", length: 10 })
  municipalityId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Article, (article) => article.articleMunicipalities, { onDelete: "CASCADE" })
  article?: Article;

  @ManyToOne(() => Municipality, (municipality) => municipality.articleMunicipalities, { onDelete: "CASCADE" })
  municipality?: Municipality;
}

