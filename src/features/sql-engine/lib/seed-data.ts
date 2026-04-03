export const SEED_SQL = `
CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  affiliation TEXT NOT NULL,
  species TEXT NOT NULL,
  homeworld TEXT NOT NULL
);

CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  league TEXT NOT NULL,
  stadium TEXT NOT NULL
);

CREATE TABLE fan_clubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  membership_year INTEGER NOT NULL,
  FOREIGN KEY (character_id) REFERENCES characters(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Star Wars Characters
INSERT INTO characters (name, affiliation, species, homeworld) VALUES
  ('Luke Skywalker', 'Rebel Alliance', 'Human', 'Tatooine'),
  ('Darth Vader', 'Galactic Empire', 'Human', 'Tatooine'),
  ('Leia Organa', 'Rebel Alliance', 'Human', 'Alderaan'),
  ('Han Solo', 'Rebel Alliance', 'Human', 'Corellia'),
  ('Yoda', 'Jedi Order', 'Unknown', 'Unknown'),
  ('Chewbacca', 'Rebel Alliance', 'Wookiee', 'Kashyyyk'),
  ('Obi-Wan Kenobi', 'Jedi Order', 'Human', 'Stewjon'),
  ('Padmé Amidala', 'Galactic Republic', 'Human', 'Naboo'),
  ('Mace Windu', 'Jedi Order', 'Human', 'Haruun Kal'),
  ('Ahsoka Tano', 'Rebel Alliance', 'Togruta', 'Shili'),
  ('Din Djarin', 'Mandalorians', 'Human', 'Aq Vetina'),
  ('Grogu', 'Jedi Order', 'Unknown', 'Unknown'),
  ('Lando Calrissian', 'Rebel Alliance', 'Human', 'Socorro'),
  ('Boba Fett', 'Bounty Hunters', 'Human', 'Kamino'),
  ('Rey', 'Resistance', 'Human', 'Jakku');

-- Champions League Teams
INSERT INTO teams (name, country, league, stadium) VALUES
  ('Real Madrid', 'Spain', 'La Liga', 'Santiago Bernabéu'),
  ('FC Barcelona', 'Spain', 'La Liga', 'Spotify Camp Nou'),
  ('Manchester City', 'England', 'Premier League', 'Etihad Stadium'),
  ('Bayern Munich', 'Germany', 'Bundesliga', 'Allianz Arena'),
  ('Liverpool', 'England', 'Premier League', 'Anfield'),
  ('PSG', 'France', 'Ligue 1', 'Parc des Princes'),
  ('Juventus', 'Italy', 'Serie A', 'Allianz Stadium'),
  ('AC Milan', 'Italy', 'Serie A', 'San Siro'),
  ('Inter Milan', 'Italy', 'Serie A', 'San Siro'),
  ('Borussia Dortmund', 'Germany', 'Bundesliga', 'Signal Iduna Park'),
  ('Ajax', 'Netherlands', 'Eredivisie', 'Johan Cruyff Arena'),
  ('Benfica', 'Portugal', 'Liga Portugal', 'Estádio da Luz');

-- Fun Fan Club Memberships
INSERT INTO fan_clubs (character_id, team_id, membership_year) VALUES
  (1, 1, 2015),   -- Luke Skywalker → Real Madrid
  (2, 4, 2010),   -- Darth Vader → Bayern Munich
  (3, 2, 2018),   -- Leia Organa → FC Barcelona
  (4, 5, 2012),   -- Han Solo → Liverpool
  (5, 1, 1999),   -- Yoda → Real Madrid
  (6, 10, 2020),  -- Chewbacca → Borussia Dortmund
  (7, 3, 2016),   -- Obi-Wan Kenobi → Manchester City
  (8, 7, 2014),   -- Padmé Amidala → Juventus
  (9, 6, 2019),   -- Mace Windu → PSG
  (10, 8, 2021),  -- Ahsoka Tano → AC Milan
  (11, 9, 2022),  -- Din Djarin → Inter Milan
  (12, 11, 2023), -- Grogu → Ajax
  (13, 12, 2017), -- Lando Calrissian → Benfica
  (14, 4, 2011),  -- Boba Fett → Bayern Munich
  (15, 2, 2024),  -- Rey → FC Barcelona
  (1, 5, 2020),   -- Luke Skywalker → Liverpool (second team)
  (5, 3, 2005),   -- Yoda → Manchester City (second team)
  (2, 9, 2015),   -- Darth Vader → Inter Milan (second team)
  (4, 1, 2023),   -- Han Solo → Real Madrid (second team)
  (3, 8, 2022);   -- Leia Organa → AC Milan (second team)
`
