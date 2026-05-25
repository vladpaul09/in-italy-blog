import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { MemberPreferredTravelPeriod } from "./memberPreferredTravelPeriod.model";
import { PreferredTravelPeriodEnum } from "../../entries/memberEnums.entry";

@Entity({ name: "preferred_travel_periods" })
export class PreferredTravelPeriod {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ name: "value", type: "enum", enum: PreferredTravelPeriodEnum, unique: true })
  value!: PreferredTravelPeriodEnum;

  @OneToMany(() => MemberPreferredTravelPeriod, (mptp) => mptp.preferredTravelPeriodEntity)
  memberPreferredTravelPeriods?: MemberPreferredTravelPeriod[];
}

