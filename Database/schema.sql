-- Useful lines for psql

-- psql -U postgres -h 127.0.0.1 -d questionsandanswers -f ./schema.sql;

\copy questions
FROM '/Users/jamesmoore/Documents/Orietation/QnA-API-Service/db/qa/CSVs/questions.csv'
DELIMITER ',' CSV HEADER;

ALTER TABLE  answers
  ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL SET DEFAULT (now);

ALTER TABLE  questions
  ALTER COLUMN date SET DEFAULT now();
---------------------------------------------------------------------------------------------------------------------------------------------

-- DROP DATABASE IF EXISTS questionsandanswers;

CREATE DATABASE questionsandanswers
    WITH
    OWNER = postgres

-- Tables
CREATE TABLE questions (
    questionId SERIAL,
    productId BIGINT,
    body text,
    date BIGINT,
    askerName text,
    askerEmail text,
    reported BIGINT,
    helpfullness BIGINT,
    CONSTRAINT questions_pkey PRIMARY KEY (questionId)
);


CREATE TABLE answers (
    answerID BIGSERIAL,
    questionID BIGSERIAL,
    body text,
    date BIGINT,
    answerName text,
    answerEmail text,
    reported BIGINT,
    helpfulness BIGINT,
    CONSTRAINT answers_pkey PRIMARY KEY (answerID)
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
