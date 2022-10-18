CREATE TABLE chat(
    id         int unique PRIMARY KEY,
    value      varchar(255),
	date 	   timestamp with time zone NOT NULL,
	userId	   int NOT NULL,
	FOREIGN KEY (userId) REFERENCES public."user" (id)
);

CREATE SEQUENCE chat_id_seq;
ALTER TABLE "chat" ALTER id SET DEFAULT NEXTVAL('chat_id_seq');