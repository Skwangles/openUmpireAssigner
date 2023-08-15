// Define types for each table
declare module "database" {
  type Level = {
    id: number;
    level_name: string;
  };

  type Club = {
    id: number;
    club_name: string;
  };

  type Communication = {
    id: number;
    communication_type: string;
  };

  type Team = {
    id: number;
    team_name: string;
  };

  type RestrictedTurf = {
    id: number;
    turf_name: string;
  };

  type Umpire = {
    id: number;
    Name: string;
    Email: string;
    Phone: string;
    club_id: number;
    teams_id: number;
    restrictedturfs_id: number;
    BlockoutDates: Date;
    LimitedTimes: string;
    communication_id: number;
    ToBeAwareOf: string;
    Notes: string;
  };

  type UmpireLevel = {
    umpire_id: number;
    level_id: number;
  };

  // Define types for the updated schema

  type UserAccountAccessType = "Admin" | "Individual" | "ReadAll";

  type UserAccount = {
    id: number;
    username: string;
    password_hash: string;
    access_type: UserAccountAccessType;
    umpire_id: number;
  };

  // Usage example
  const userAccount: UserAccount = {
    id: 1,
    username: "admin",
    password_hash: "admin_password_hash",
    access_type: "Admin",
    umpire_id: 1,
  };
}
