import { Entity, Column, PrimaryColumn, Index } from "typeorm"
import { BaseEntity } from "./BaseEntity"

@Entity()
export class RecommendationLikesScore extends BaseEntity {  
  @PrimaryColumn()
  hobby: string

  @PrimaryColumn("uuid")
  @Index()
  userId: string

  @Column("decimal")
  score: number
  
}
