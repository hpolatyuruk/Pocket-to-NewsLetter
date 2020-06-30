-- Table: public.userpreferences

-- DROP TABLE public.userpreferences;

CREATE TABLE public.userpreferences
(
    pocketusername character varying(50) COLLATE pg_catalog
    ."default" NOT NULL,
    emailaddress character varying
    (50) COLLATE pg_catalog."default" NOT NULL,
    accesstoken character varying
    (32) COLLATE pg_catalog."default" NOT NULL,
    linkcountperdigest integer NOT NULL,
    cronexpression character varying
    (15) COLLATE pg_catalog."default" NOT NULL,
    subscribed boolean NOT NULL,
    createdat timestamp
    with time zone NOT NULL,
    updatedat timestamp
    with time zone,
    sorttype character varying
    (10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT userpreferences_pkey PRIMARY KEY
    (pocketusername)
)

TABLESPACE pg_default;

    ALTER TABLE public.userpreferences
    OWNER to postgres;