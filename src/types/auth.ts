export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type DominantFoot = 'RIGHT' | 'LEFT' | 'BOTH';

export type CompetitiveLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'SEMIPROFESSIONAL'
  | 'PROFESSIONAL';

export interface User {
  id: string;
  name: string;
  lastName: string;
  birthDate: string;

  gender: Gender;
  dominantFoot: DominantFoot;

  height: number;
  weight: number;

  competitiveLevel: CompetitiveLevel;

  email: string;
  phone: string;

  role: 'PLAYER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  createdAt: string;
  updatedAt: string;
}