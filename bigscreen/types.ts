export interface Student {
  id: string;
  name: string;
  team_id: string;
  total_exp: number;
  total_points: number;
  avatar_url: string;
  badges?: Badge[];
}

export interface Team {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export interface Badge {
  id: string | number;
  name: string;
  description: string;
  image?: string;
  icon?: string;
  awardedDate?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  challenger: { name: string; avatar: string };
  status: string;
}

export const calculateLevel = (totalExp: number): { level: number; progress: number } => {
  const expForLevel = (lvl: number) => Math.floor(100 * Math.pow(1.25, Math.max(0, lvl - 1)));
  let acc = 0;
  let lvl = 1;
  while (totalExp - acc >= expForLevel(lvl)) {
    acc += expForLevel(lvl);
    lvl += 1;
  }
  const currentNeed = expForLevel(lvl);
  const currentProgress = Math.max(0, Math.min(1, (totalExp - acc) / currentNeed));
  return { level: lvl, progress: Math.round(currentProgress * 100) };
};