import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Province } from "./province.model";
import { MunicipalityLanguage } from "./municipalityLanguage.model";
import { Article } from "./article.model";
import { Event } from "./event.model";
import { Podcast } from "./podcast.model";
import { ArticleMunicipality } from "./articleMunicipality.model";
import { PodcastMunicipality } from "./podcastMunicipality.model";
import { Member } from "./member.model";
import { UserMunicipality } from "./userMunicipality.model";

@Entity({ name: "municipalities" })
export class Municipality {
  @PrimaryColumn({ type: "char", length: 10 })
  id!: string;

  @Column({ type: "varchar", length: 100 })
  slug!: string;

  @Column({ name: "province_id", type: "char", length: 4 })
  provinceId!: string;

  @Column({ type: "decimal", precision: 12, scale: 7 })
  latitude!: string;

  @Column({ type: "decimal", precision: 12, scale: 7 })
  longitude!: string;

  @Column({ type: "int", unsigned: true })
  radius!: number;

  @Column({ name: "radius_unit", type: "char", length: 2 })
  radiusUnit!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string | null;

  @Column({ name: "mobile_image", type: "varchar", length: 255, nullable: true })
  mobileImage!: string | null;

  @Column({ name: "show_frontend", type: "boolean", default: false })
  showFrontend!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Province, (province) => province.municipalities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "province_id" })
  province?: Province;

  @OneToMany(() => MunicipalityLanguage, (municipalityLanguage) => municipalityLanguage.municipality, { cascade: true })
  municipalityLanguages?: MunicipalityLanguage[];

  @OneToMany(() => Event, (event) => event.municipality)
  events?: Event[];

  @ManyToMany(() => Article, (article) => article.municipalities)
  @JoinTable({
    name: "articles_municipalities",
    joinColumn: { name: "municipality_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "article_id", referencedColumnName: "id" },
  })
  articles?: Article[];

  @OneToMany(() => ArticleMunicipality, (articleMunicipality) => articleMunicipality.municipality)
  articleMunicipalities?: ArticleMunicipality[];

  @ManyToMany(() => Podcast, (podcast) => podcast.municipalities)
  @JoinTable({
    name: "podcasts_municipalities",
    joinColumn: { name: "municipality_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "podcast_id", referencedColumnName: "id" },
  })
  podcasts?: Podcast[];

  @OneToMany(() => PodcastMunicipality, (pm) => pm.municipality)
  podcastMunicipalities?: PodcastMunicipality[];

  @OneToMany(() => Member, (member) => member.municipality)
  members?: Member[];

  @OneToMany(() => UserMunicipality, (userMunicipality) => userMunicipality.municipality)
  userMunicipalities?: UserMunicipality[];
}

