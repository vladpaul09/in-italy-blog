import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Page } from "./page.model";
import { Language } from "./language.model";

@Entity({ name: "pages_languages" })
export class PageLanguage {
  @PrimaryColumn({
    name: "page_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  pageId!: number;

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ name: "meta_title", type: "varchar", length: 255 })
  metaTitle!: string;

  @Column({ name: "meta_description", type: "text" })
  metaDescription!: string;

  @Column({ name: "page_title", type: "varchar", length: 255 })
  pageTitle!: string;

  @Column({ name: "page_description", type: "text" })
  pageDescription!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Page, (page) => page.pageLanguages, { onDelete: "CASCADE" })
  page?: Page;

  @ManyToOne(() => Language, (language) => language.pageLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

