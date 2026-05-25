import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Language } from "./language.model";

@Entity({ name: "i18n" })
export class I18n {
  @PrimaryColumn({ type: "varchar" })
  id!: string;

  @PrimaryColumn({ name: "lang_id", type: "varchar", length: 10 })
  langId!: string;

  @Column({ type: "text" })
  value!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Language, (language) => language.translations, { onDelete: "CASCADE" })
  language?: Language;
}

