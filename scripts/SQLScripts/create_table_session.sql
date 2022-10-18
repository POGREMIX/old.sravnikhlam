CREATE TABLE session(
    id         int unique PRIMARY KEY,
    userId     int NOT NULL REFERENCES public."user" (id),
	created	   timestamp with time zone NOT NULL
);

CREATE SEQUENCE session_id_seq;
ALTER TABLE "session" ALTER id SET DEFAULT NEXTVAL('session_id_seq');