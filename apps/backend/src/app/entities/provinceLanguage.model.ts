import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Province } from "./province.model";
import { Language } from "./language.model";

@Entity({ name: "provinces_languages" })
export class ProvinceLanguage {
  @PrimaryColumn({ name: "province_id", type: "char", length: 4 })
  provinceId!: string;

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Province, (province) => province.provinceLanguages, { onDelete: "CASCADE" })
  province?: Province;

  @ManyToOne(() => Language, (language) => language.provinceLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

