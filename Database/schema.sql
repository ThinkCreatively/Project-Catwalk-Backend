-- Useful lines for psql

-- psql -U postgres -h 127.0.0.1 -d questionsandanswers -f ./schema.sql;

-- \copy answerPhotos
-- FROM '/Users/jamesmoore/Documents/Orietation/QnA-API-Service/db/qa/CSVs/answers_photos.csv'
-- DELIMITER ',' CSV HEADER;

-- ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ

-- Changing date to be timestamps and default to create timestamps of current time
-- ALTER TABLE  questions
--   ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL;

-- ALTER TABLE  questions
--   ALTER COLUMN date SET DEFAULT now();

-- ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ

-- Changing answers to have photos column and then seed those columns with the correct photos
-- Add photos column set it to an array, give it default as well
-- ALTER TABLE answers ADD photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Create temp table that will be used for sorting photos by answerID
-- CREATE TEMP TABLE urls AS SELECT answerID, array_agg(url) as url_list FROM answerPhotos GROUP BY answerID;

-- Update answertable so that the photos array of each answer has the right answers
-- UPDATE answers SET photos = url_list FROM urls WHERE answers.answerId = urls.answerID;

-- ƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒƒ

-- Creates user with all permissions
-- CREATE USER qauser WITH PASSWORD '12345';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO qauser;
-- GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO qauser;

-- Indexes
-- CREATE INDEX productId_questions_idx ON questions (productId);
-- CREATE INDEX reported_questions__idx ON questions (reported);
-- CREATE INDEX questionId_answers_idx ON answers (questionId);
---------------------------------------------------------------------------------------------------------------------------------------------
DROP DATABASE IF EXISTS qa;

CREATE DATABASE qa
    WITH
    OWNER = postgres
;
-- Tables
DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
    questionId SERIAL PRIMARY KEY NOT NULL,
    productId BIGINT NOT NULL,
    body text NOT NULL,
    date BIGINT NOT NULL,
    askerName text NOT NULL,
    askerEmail text NOT NULL,
    reported BOOLEAN NOT NULL,
    helpfullness BIGINT NOT NULL
);

DROP TABLE IF EXISTS answers CASCADE;
CREATE TABLE answers (
    answerId SERIAL PRIMARY KEY NOT NULL,
    questionID BIGSERIAL NOT NULL,
    body text NOT NULL,
    date BIGINT NOT NULL,
    answerName text NOT NULL,
    answerEmail text NOT NULL,
    reported BOOLEAN NOT NULL,
    helpfulness BIGINT NOT NULL
);

DROP TABLE IF EXISTS answerPhotos;
CREATE TABLE answerPhotos (
    photoID BIGSERIAL,
    answerID BIGSERIAL,
    URL text,
    CONSTRAINT answerPhotos_pkey PRIMARY KEY (photoID),
    CONSTRAINT answerID FOREIGN KEY (photoID)
        REFERENCES answers (answerID) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
