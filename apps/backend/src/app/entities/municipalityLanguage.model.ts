import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Municipality } from "./municipality.model";
import { Language } from "./language.model";

@Entity({ name: "municipalities_languages" })
export class MunicipalityLanguage {
  @PrimaryColumn({ name: "municipality_id", type: "char", length: 10 })
  municipalityId!: string;

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

  @ManyToOne(() => Municipality, (municipality) => municipality.municipalityLanguages, { onDelete: "CASCADE" })
  municipality?: Municipality;

  @ManyToOne(() => Language, (language) => language.municipalityLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

