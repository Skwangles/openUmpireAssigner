-- Create 'levels' table
CREATE TABLE levels (
  id INTEGER PRIMARY KEY,
  level_name TEXT NOT NULL
);

-- Insert default values for 'levels' table
INSERT INTO levels (level_name) VALUES
  ('MR1'),
  ('MR2'),
  ('MR3')
  ('WR1'),
  ('WR2');

-- Create 'club' table
CREATE TABLE club (
  id INTEGER PRIMARY KEY,
  club_name TEXT NOT NULL
);

-- Create 'communication' table
CREATE TABLE communication (
  id INTEGER PRIMARY KEY,
  communication_type TEXT NOT NULL
);

-- Insert default values for 'communication' table
INSERT INTO communication (communication_type) VALUES
  ('All'),
  ('Email only'),
  ('Phone only')
  ('Other');

-- Create 'teams' table
CREATE TABLE teams (
  id INTEGER PRIMARY KEY,
  team_name TEXT NOT NULL
);

-- Create 'restrictedturfs' table
CREATE TABLE restrictedturfs (
  id INTEGER PRIMARY KEY,
  turf_name TEXT NOT NULL
);

-- Insert default values for 'restrictedturfs' table
INSERT INTO restrictedturfs (turf_name) VALUES
  ('GHC Turf 1'),
  ('GHC Turf 2'),
  ('St Pauls'),
  ('St Peters');

-- Create 'umpires' table
CREATE TABLE umpires (
  id INTEGER PRIMARY KEY,
  Name TEXT,
  Email TEXT,
  Phone TEXT,
  club_id INTEGER REFERENCES club (id),
  teams_id INTEGER REFERENCES teams (id),
  restrictedturfs_id INTEGER REFERENCES restrictedturfs (id),
  BlockoutDates DATE,
  LimitedTimes TEXT,
  levels_id INTEGER REFERENCES levels (id),
  communication_id INTEGER REFERENCES communication (id),
  ToBeAwareOf TEXT,
  Notes TEXT
);

