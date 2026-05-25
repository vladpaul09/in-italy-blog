import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Podcast } from "./podcast.model";
import { Municipality } from "./municipality.model";

@Entity({ name: "podcasts_municipalities" })
export class PodcastMunicipality {
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

  @PrimaryColumn({ name: "municipality_id", type: "char", length: 10 })
  municipalityId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Podcast, (podcast) => podcast.podcastMunicipalities, { onDelete: "CASCADE" })
  podcast?: Podcast;

  @ManyToOne(() => Municipality, (municipality) => municipality.podcastMunicipalities, { onDelete: "CASCADE" })
  municipality?: Municipality;
}

