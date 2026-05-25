import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Region } from "./region.model";
import { Language } from "./language.model";

@Entity({ name: "regions_languages" })
export class RegionLanguage {
  @PrimaryColumn({ name: "region_id", type: "char", length: 2 })
  regionId!: string;

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

  @ManyToOne(() => Region, (region) => region.regionLanguages, { onDelete: "CASCADE" })
  region?: Region;

  @ManyToOne(() => Language, (language) => language.regionLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

