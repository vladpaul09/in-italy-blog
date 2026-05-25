import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Podcast } from "./podcast.model";
import { Language } from "./language.model";

@Entity({ name: "podcasts_languages" })
export class PodcastLanguage {
  @PrimaryColumn({
    name: "podcast_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  podcastId!: number;

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ name: "short_description", type: "varchar" })
  shortDescription!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Podcast, (podcast) => podcast.podcastLanguages, { onDelete: "CASCADE" })
  podcast?: Podcast;

  @ManyToOne(() => Language, (language) => language.podcastLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

