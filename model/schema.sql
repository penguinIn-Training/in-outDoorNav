DROP TABLE IF EXISTS users  ;

create table users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(256) NOT NULL,
  last_name VARCHAR(256) NOT NULL,
  attendance VARCHAR(256) NOT NULL
);

INSERT INTO users (first_name,last_name,attendance) VALUES ('abdallah','ali',50);
INSERT INTO users (first_name,last_name,attendance) VALUES ('khalil','ali',55);
INSERT INTO users (first_name,last_name,attendance) VALUES ('mohammad','ali',1);
INSERT INTO users (first_name,last_name,attendance) VALUES ('3awad','ali',33);
INSERT INTO users (first_name,last_name,attendance) VALUES ('amjad','ali',10);
INSERT INTO users (first_name,last_name,attendance) VALUES ('salah','ali',99);
INSERT INTO users (first_name,last_name,attendance) VALUES ('talah','ali',22);
INSERT INTO users (first_name,last_name,attendance) VALUES ('majdy','ali',88);
INSERT INTO users (first_name,last_name,attendance) VALUES ('gasan','ali',30);
INSERT INTO users (first_name,last_name,attendance) VALUES ('ahmad','ali',0);

