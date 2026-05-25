import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Event } from "./event.model";
import { Category } from "./category.model";

@Entity({ name: "events_categories" })
export class EventCategory {
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

  @ManyToOne(() => Event, (event) => event.eventCategories, { onDelete: "CASCADE" })
  event?: Event;

  @ManyToOne(() => Category, (category) => category.eventCategories, { onDelete: "CASCADE" })
  category?: Category;
}

