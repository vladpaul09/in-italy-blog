import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Event } from "./event.model";
import { Language } from "./language.model";

@Entity({ name: "events_languages" })
export class EventLanguage {
  @PrimaryColumn({
    name: "event_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  eventId!: number;

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

  @ManyToOne(() => Event, (event) => event.eventLanguages, { onDelete: "CASCADE" })
  event?: Event;

  @ManyToOne(() => Language, (language) => language.eventLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

