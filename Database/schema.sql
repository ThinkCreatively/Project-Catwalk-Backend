-- Useful lines for psql

-- psql -U postgres -h 127.0.0.1 -d questionsandanswers -f ./schema.sql;

-- \copy answerPhotos
-- FROM '/Users/jamesmoore/Documents/Orietation/QnA-API-Service/db/qa/CSVs/answers_photos.csv'
-- DELIMITER ',' CSV HEADER;

-- ALTER TABLE  questions
--   ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL;

-- ALTER TABLE  questions
--   ALTER COLUMN date SET DEFAULT now();

-- Changing answers to have photos column and then seed those columns with the correct photos

-- Add photos column set it to an array, give it default as well
-- ALTER TABLE answers ADD photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Create temp table that will be used for sorting photos by answerID
-- CREATE TEMP TABLE urls AS SELECT answerID, array_agg(url) as url_list FROM answerPhotos GROUP BY answerID;

-- Update answertable so that the photos array of each answer has the right answers
-- UPDATE answers SET photos = url_list FROM urls WHERE answers.answerId = urls.answerID;
---------------------------------------------------------------------------------------------------------------------------------------------
-- DROP DATABASE IF EXISTS questionsandanswers;

CREATE DATABASE qa
    WITH
    OWNER = postgres

-- Tables
CREATE TABLE questions (
    questionId SERIAL PRIMARY KEY,
    productId BIGINT,
    body text,
    date BIGINT,
    askerName text,
    askerEmail text,
    reported BIGINT,
    helpfullness BIGINT
);


CREATE TABLE answers (
    answerId SERIAL PRIMARY KEY,
    questionID BIGSERIAL,
    body text,
    date BIGINT,
    answerName text,
    answerEmail text,
    reported BIGINT,
    helpfulness BIGINT
);


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
