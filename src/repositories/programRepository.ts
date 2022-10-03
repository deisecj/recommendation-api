import { Program } from "../models/Program";
import { AppDataSource } from "./dataSource";

interface TotalProgramsByHoobies {
  hobby: string;
  total: number;
}

export const ProgramRepository = AppDataSource.getRepository(Program).extend({
  async getTotalProgramsByHobbies(userId: string, hobbies: string[]): Promise<TotalProgramsByHoobies[]> {
    let query = this.createQueryBuilder('p')
      .innerJoin('p.attendees', 'r')
      .select("count(p.id) as total, unnest(p.hobbies) as hobby")
      .where('r."userId"::text = :userId', { userId });

    if (hobbies.length > 0) {
      query = query.where('p.hobbies && ARRAY[:...hobbies]', { hobbies });
    }

    const result = await query.groupBy("unnest(p.hobbies)").getRawMany();

    return result.map((item) => {
      return { ...item, total: parseInt(item.total) };
    });
  },

  async getRecommendedByLikeScores(userId: string): Promise<Program[]> {
    const HIGHEST_PROGRAMS_NATIVE_SQL = `
        SELECT phobs.id, SUM(rec.score) FROM 
          (SELECT 
              p.*, unnest(p.hobbies) as unnest_hobbies 
            FROM program p 
            INNER JOIN program_attendees_resident pr ON pr."programId" = p.id 
          WHERE pr."residentUserId"::text = $1
          ) as phobs
      LEFT JOIN recommendation_likes_score rec ON rec.hobby IN (phobs.unnest_hobbies)
      GROUP BY phobs.id
      ORDER BY SUM(rec.score) DESC
      LIMIT 3
    `;
    
    const highestPrograms = await this.query(HIGHEST_PROGRAMS_NATIVE_SQL, [userId]);
    const programIds = highestPrograms.map(program => program.id);

    if (programIds.length === 0) {
      return [];
    }
    
    return await this.createQueryBuilder().where('id::text IN (:...ids)', { ids: programIds }).getMany();
  }
});
