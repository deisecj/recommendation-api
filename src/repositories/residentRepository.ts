import { Resident } from "../models/Resident";
import { AppDataSource } from "./dataSource";

export const ResidentRepository = AppDataSource.getRepository(Resident).extend({
  async getHobbies(userId: string): Promise<string[]> {
    const result = await this.createQueryBuilder("r")
      .select("array_cat(r.hobbies, p.hobbies)", "hobbies")
      .leftJoin("r.programs", "p")
      .where('r."userId"::text = :id', { id: userId })
      .groupBy("array_cat(r.hobbies, p.hobbies)")
      .getRawMany();
    
   const allHobbies = result.flatMap((element) => element.hobbies);
   const uniqueHobbies = new Set<string>(allHobbies);
   
   return Array.from(uniqueHobbies);
   
  }
});
