import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";

import { RegionLanguage } from "./regionLanguage.model";
import { Region } from "./region.model";

import { ProvinceLanguage } from "./provinceLanguage.model";
import { MunicipalityLanguage } from "./municipalityLanguage.model";
import { CategoryLanguage } from "./categoryLanguage.model";
import { ArticleLanguage } from "./articleLanguage.model";
import { TagLanguage } from "./tagLanguage.model";
import { PodcastLanguage } from "./podcastLanguage.model";
import { EventLanguage } from "./eventLanguage.model";
import { PageLanguage } from "./pageLanguage.model";
import { I18n } from "./i18n.model";
import { PushSubscription } from "./pushSubscription.model";
import { MenuItemLanguage } from "./menuItemLanguage.model";

@Entity("languages")
export class Language {
  @PrimaryColumn({ type: "varchar", length: 10 })
  id!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "boolean", default: false })
  default!: boolean;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string;

  @Column({ name: "sort_order", type: "int", unsigned: true, default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => RegionLanguage, (regionLanguage) => regionLanguage.language)
  regionLanguages?: RegionLanguage[];

  @OneToMany(() => ProvinceLanguage, (provinceLanguage) => provinceLanguage.language)
  provinceLanguages?: ProvinceLanguage[];

  @OneToMany(() => MunicipalityLanguage, (municipalityLanguage) => municipalityLanguage.language)
  municipalityLanguages?: MunicipalityLanguage[];

  @OneToMany(() => CategoryLanguage, (categoryLanguage) => categoryLanguage.language)
  categoryLanguages?: CategoryLanguage[];

  @OneToMany(() => ArticleLanguage, (articleLanguage) => articleLanguage.language)
  articleLanguages?: ArticleLanguage[];

  @OneToMany(() => TagLanguage, (tagLanguage) => tagLanguage.language)
  tagLanguages?: TagLanguage[];

  @OneToMany(() => PodcastLanguage, (podcastLanguage) => podcastLanguage.language)
  podcastLanguages?: PodcastLanguage[];

  @OneToMany(() => EventLanguage, (eventLanguage) => eventLanguage.language)
  eventLanguages?: EventLanguage[];

  @OneToMany(() => PageLanguage, (pageLanguage) => pageLanguage.language)
  pageLanguages?: PageLanguage[];

  @OneToMany(() => I18n, (i18n) => i18n.language)
  translations?: I18n[];

  @OneToMany(() => PushSubscription, (subscription) => subscription.language)
  pushSubscriptions?: PushSubscription[];

  @ManyToMany(() => Region, (region) => region.languages)
  regions?: Region[];

  @OneToMany(() => MenuItemLanguage, (menuItemLanguage) => menuItemLanguage.language)
  menuItemLanguages?: MenuItemLanguage[];
}
