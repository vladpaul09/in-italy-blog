import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Podcast } from "./podcast.model";
import { Category } from "./category.model";

@Entity({ name: "podcasts_categories" })
export class PodcastCategory {
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

  @PrimaryColumn({
    name: "category_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Podcast, (podcast) => podcast.podcastCategories, { onDelete: "CASCADE" })
  podcast?: Podcast;

  @ManyToOne(() => Category, (category) => category.podcastCategories, { onDelete: "CASCADE" })
  category?: Category;
}

