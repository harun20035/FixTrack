--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adminnote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adminnote (
    id integer NOT NULL,
    admin_id integer NOT NULL,
    tenant_id integer NOT NULL,
    note character varying NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.adminnote OWNER TO postgres;

--
-- Name: adminnote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adminnote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adminnote_id_seq OWNER TO postgres;

--
-- Name: adminnote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adminnote_id_seq OWNED BY public.adminnote.id;


--
-- Name: assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment (
    id integer NOT NULL,
    issue_id integer NOT NULL,
    contractor_id integer NOT NULL,
    status character varying(50) NOT NULL,
    estimated_cost double precision,
    planned_date timestamp without time zone,
    rejection_reason character varying,
    created_at timestamp without time zone NOT NULL,
    actual_cost numeric(10,2),
    notes text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assignment OWNER TO postgres;

--
-- Name: assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignment_id_seq OWNER TO postgres;

--
-- Name: assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignment_id_seq OWNED BY public.assignment.id;


--
-- Name: assignmentdocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignmentdocument (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    document_url character varying NOT NULL,
    type character varying(50)
);


ALTER TABLE public.assignmentdocument OWNER TO postgres;

--
-- Name: assignmentdocument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignmentdocument_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignmentdocument_id_seq OWNER TO postgres;

--
-- Name: assignmentdocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignmentdocument_id_seq OWNED BY public.assignmentdocument.id;


--
-- Name: assignmentimage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignmentimage (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    image_url character varying NOT NULL
);


ALTER TABLE public.assignmentimage OWNER TO postgres;

--
-- Name: assignmentimage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignmentimage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignmentimage_id_seq OWNER TO postgres;

--
-- Name: assignmentimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignmentimage_id_seq OWNED BY public.assignmentimage.id;


--
-- Name: assignmentnotification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignmentnotification (
    id integer NOT NULL,
    contractor_id integer NOT NULL,
    assignment_id integer NOT NULL,
    issue_id integer NOT NULL,
    notification_type character varying(50) NOT NULL,
    assigned_by character varying NOT NULL,
    message character varying,
    is_read boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.assignmentnotification OWNER TO postgres;

--
-- Name: assignmentnotification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignmentnotification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignmentnotification_id_seq OWNER TO postgres;

--
-- Name: assignmentnotification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignmentnotification_id_seq OWNED BY public.assignmentnotification.id;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    issue_id integer NOT NULL,
    user_id integer NOT NULL,
    content character varying NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_seq OWNER TO postgres;

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: issue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    category_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying,
    location character varying,
    status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE public.issue OWNER TO postgres;

--
-- Name: issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issue_id_seq OWNER TO postgres;

--
-- Name: issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issue_id_seq OWNED BY public.issue.id;


--
-- Name: issuecategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issuecategory (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.issuecategory OWNER TO postgres;

--
-- Name: issuecategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issuecategory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issuecategory_id_seq OWNER TO postgres;

--
-- Name: issuecategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issuecategory_id_seq OWNED BY public.issuecategory.id;


--
-- Name: issueimage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issueimage (
    id integer NOT NULL,
    issue_id integer NOT NULL,
    image_url character varying NOT NULL
);


ALTER TABLE public.issueimage OWNER TO postgres;

--
-- Name: issueimage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issueimage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issueimage_id_seq OWNER TO postgres;

--
-- Name: issueimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issueimage_id_seq OWNED BY public.issueimage.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    issue_id integer NOT NULL,
    user_id integer NOT NULL,
    note character varying NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO postgres;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    user_id integer NOT NULL,
    issue_id integer NOT NULL,
    old_status character varying NOT NULL,
    new_status character varying NOT NULL,
    changed_by character varying NOT NULL,
    is_read boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    id integer NOT NULL,
    issue_id integer NOT NULL,
    tenant_id integer NOT NULL,
    score integer NOT NULL,
    comment character varying,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- Name: rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_id_seq OWNER TO postgres;

--
-- Name: rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_id_seq OWNED BY public.rating.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: rolerequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rolerequest (
    id integer NOT NULL,
    user_id integer NOT NULL,
    current_role_id integer NOT NULL,
    requested_role_id integer NOT NULL,
    motivation character varying NOT NULL,
    status character varying(20) NOT NULL,
    admin_notes character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    cv_file_url character varying(255)
);


ALTER TABLE public.rolerequest OWNER TO postgres;

--
-- Name: rolerequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rolerequest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rolerequest_id_seq OWNER TO postgres;

--
-- Name: rolerequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rolerequest_id_seq OWNED BY public.rolerequest.id;


--
-- Name: survey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.survey (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    issue_id integer,
    satisfaction_level character varying(50) NOT NULL,
    issue_category character varying(50) NOT NULL,
    description text NOT NULL,
    suggestions text,
    contact_preference character varying(10) DEFAULT 'no'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.survey OWNER TO postgres;

--
-- Name: survey_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.survey_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.survey_id_seq OWNER TO postgres;

--
-- Name: survey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.survey_id_seq OWNED BY public.survey.id;


--
-- Name: systemsettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.systemsettings (
    id integer NOT NULL,
    allow_registration boolean NOT NULL,
    require_approval boolean NOT NULL,
    email_notifications boolean NOT NULL,
    maintenance_mode boolean NOT NULL,
    auto_assignment boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.systemsettings OWNER TO postgres;

--
-- Name: systemsettings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.systemsettings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.systemsettings_id_seq OWNER TO postgres;

--
-- Name: systemsettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.systemsettings_id_seq OWNED BY public.systemsettings.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    role_id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying NOT NULL,
    phone character varying(20),
    address character varying,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: adminnote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminnote ALTER COLUMN id SET DEFAULT nextval('public.adminnote_id_seq'::regclass);


--
-- Name: assignment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment ALTER COLUMN id SET DEFAULT nextval('public.assignment_id_seq'::regclass);


--
-- Name: assignmentdocument id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentdocument ALTER COLUMN id SET DEFAULT nextval('public.assignmentdocument_id_seq'::regclass);


--
-- Name: assignmentimage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentimage ALTER COLUMN id SET DEFAULT nextval('public.assignmentimage_id_seq'::regclass);


--
-- Name: assignmentnotification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentnotification ALTER COLUMN id SET DEFAULT nextval('public.assignmentnotification_id_seq'::regclass);


--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: issue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue ALTER COLUMN id SET DEFAULT nextval('public.issue_id_seq'::regclass);


--
-- Name: issuecategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuecategory ALTER COLUMN id SET DEFAULT nextval('public.issuecategory_id_seq'::regclass);


--
-- Name: issueimage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issueimage ALTER COLUMN id SET DEFAULT nextval('public.issueimage_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: rating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN id SET DEFAULT nextval('public.rating_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: rolerequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolerequest ALTER COLUMN id SET DEFAULT nextval('public.rolerequest_id_seq'::regclass);


--
-- Name: survey id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey ALTER COLUMN id SET DEFAULT nextval('public.survey_id_seq'::regclass);


--
-- Name: systemsettings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.systemsettings ALTER COLUMN id SET DEFAULT nextval('public.systemsettings_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: adminnote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adminnote (id, admin_id, tenant_id, note, created_at) FROM stdin;
1	4	2	utz	2025-09-05 12:07:11.439208
2	4	2	utz	2025-09-05 12:07:51.00168
3	4	2	utz	2025-09-05 12:08:21.074269
4	4	2	jj	2025-09-05 12:11:25.874969
5	4	2	ads	2025-09-05 12:15:02.643233
6	4	2	heakhjruja	2025-09-07 17:25:27.5931
7	4	2	ztjtjtj	2025-09-08 09:03:41.436902
8	4	2	napomena	2025-09-08 10:47:10.57679
9	4	2	tzrffhtfh	2025-09-09 11:17:26.18646
\.


--
-- Data for Name: assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment (id, issue_id, contractor_id, status, estimated_cost, planned_date, rejection_reason, created_at, actual_cost, notes, updated_at) FROM stdin;
1	2	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:40:09.895073	\N	\N	2025-08-15 16:40:09.895174
2	8	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:45:52.76433	\N	\N	2025-08-15 16:45:52.764416
5	10	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:48:04.092559	\N	\N	2025-08-15 16:48:04.092636
6	12	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:48:16.223539	\N	\N	2025-08-15 16:48:16.223643
8	14	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:51:06.358849	\N	\N	2025-08-15 16:51:06.358971
9	15	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:52:41.254722	\N	\N	2025-08-15 16:52:41.254815
10	26	3	Dodijeljeno	\N	\N	\N	2025-09-05 10:33:18.732187	\N	\N	2025-09-05 10:33:18.732303
11	19	3	Dodijeljeno	\N	\N	\N	2025-09-07 17:22:27.941087	\N	\N	2025-09-07 17:22:27.941163
12	20	7	Dodijeljeno	\N	\N	\N	2025-09-08 08:50:55.433681	\N	\N	2025-09-08 08:50:55.433759
3	9	5	Dodijeljeno	20	2025-09-19 00:00:00	\N	2025-08-15 16:47:06.579969	\N	\N	2025-08-15 16:47:06.580056
4	11	5	Dodijeljeno	50	2025-09-11 00:00:00	uzizikzi	2025-08-15 16:47:51.144349	\N	\N	2025-08-15 16:47:51.144439
7	13	5	Dodijeljeno	\N	\N	\N	2025-08-15 16:49:54.169599	\N	ztuzuzt	2025-08-15 16:49:54.169684
13	18	7	Dodijeljeno	\N	\N	\N	2025-09-08 22:09:50.076895	\N	\N	2025-09-08 22:09:50.07699
14	27	7	Dodijeljeno	\N	\N	\N	2025-09-08 22:12:41.231847	\N	\N	2025-09-08 22:12:41.231949
15	22	3	Dodijeljeno	\N	\N	\N	2025-09-08 22:27:25.812627	\N	\N	2025-09-08 22:27:25.81274
\.


--
-- Data for Name: assignmentdocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignmentdocument (id, assignment_id, document_url, type) FROM stdin;
\.


--
-- Data for Name: assignmentimage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignmentimage (id, assignment_id, image_url) FROM stdin;
\.


--
-- Data for Name: assignmentnotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignmentnotification (id, contractor_id, assignment_id, issue_id, notification_type, assigned_by, message, is_read, created_at) FROM stdin;
1	7	13	18	new_assignment	upravnik u	Dobili ste novi zadatak: Problemi sa strujom u kuhinji	f	2025-09-08 22:09:50.103527
2	7	14	27	new_assignment	upravnik u	Dobili ste novi zadatak: Problemi sa toplom vodom	f	2025-09-08 22:12:41.257037
3	3	15	22	new_assignment	upravnik u	Dobili ste novi zadatak: Klima ne hladi	t	2025-09-08 22:27:25.844529
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, issue_id, user_id, content, created_at) FROM stdin;
1	2	2	Ovo je moja kuća živio sam tu	2025-07-25 14:03:06.802416
2	6	2	ee	2025-07-25 15:39:44.373385
3	17	2	hgh	2025-09-06 10:09:52.48847
4	38	7	potrebna dva majstora	2025-09-07 17:19:33.991458
5	35	2	retete	2025-09-17 14:02:26.042262
\.


--
-- Data for Name: issue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issue (id, tenant_id, category_id, title, description, location, status, created_at, updated_at) FROM stdin;
5	2	13	Zauzet parking	Parking popunjen sav	Sarajevo	Čeka dijelove	2025-07-24 13:09:02.882298	\N
1	2	4	Kvar Lifta	Lift se zaglavio	Sarajevo	U toku	2025-07-24 13:00:50.759423	\N
6	2	1	Test završenog issue-a	Ovo je test prijava sa statusom Završeno	Test lokacija	Završeno	2025-07-25 17:38:52.155992	\N
19	2	2	Grijanje ne radi u dnevnoj sobi	Radijatori su potpuno hladni	Sarajevo	Završeno	2025-08-15 18:53:28.791398	\N
17	2	1	Problemi sa toplom vodom	Nema tople vode ujutro	Sarajevo	Primljeno	2025-08-15 18:45:38.762296	\N
8	2	1	Problemi sa vodom	Voda curi iz slavine u kuhinji	Sarajevo	Dodijeljeno izvođaču	2025-08-15 18:45:38.762296	\N
12	2	2	Prekidač ne radi	Prekidač u hodniku ne reaguje	Sarajevo	Završeno	2025-08-15 18:45:38.762296	\N
15	2	2	Utičnica iskočila	Utičnica u spavaćoj sobi iskočila	Sarajevo	Čeka dijelove	2025-08-15 18:45:38.762296	\N
11	2	1	Zatvorena kanalizacija	Kanalizacija se blokirala	Sarajevo	Otkazano	2025-08-15 18:45:38.762296	\N
18	2	1	Problemi sa strujom u kuhinji	Nema struje u kuhinji, prekidači ne reaguju	Sarajevo	Dodijeljeno izvođaču	2025-08-15 18:53:28.791398	\N
21	2	1	Utičnica iskočila u spavaćoj sobi	Utičnica u spavaćoj sobi ne radi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
23	2	3	Zatvorena kanalizacija	Kanalizacija se blokirala u kupaoni	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
24	2	1	Prekidač ne radi u hodniku	Prekidač u hodniku ne reaguje	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
25	2	2	Ventilacija ne radi	Ventilacija u kupaoni ne radi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
28	2	2	Grijanje ne radi u spavaćoj sobi	Radijatori u spavaćoj sobi su hladni	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
30	2	1	Utičnica ne radi u kuhinji	Utičnica u kuhinji ne radi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
31	2	2	Klima ne radi u spavaćoj sobi	Klima u spavaćoj sobi ne hladi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
32	2	3	Problemi sa kanalizacijom	Kanalizacija se blokirala u kuhinji	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
33	2	1	Prekidač ne radi u kupaoni	Prekidač u kupaoni ne reaguje	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
34	2	2	Grijanje ne radi u hodniku	Radijatori u hodniku su hladni	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
35	2	3	Curenje iz prozora	Voda curi iz prozora nakon kiše	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
36	2	1	Problemi sa strujom u spavaćoj sobi	Nema struje u spavaćoj sobi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
37	2	2	Ventilacija ne radi u kuhinji	Ventilacija u kuhinji ne radi	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
27	2	1	Problemi sa toplom vodom	Nema tople vode ujutro	Sarajevo	Dodijeljeno izvođaču	2025-08-15 18:53:28.791398	\N
10	2	3	Grijanje ne radi	Radijatori su hladni	Sarajevo	Otkazano	2025-08-15 18:45:38.762296	\N
29	2	3	Problemi sa vodom u kuhinji	Voda curi iz slavine u kuhinjiđ	Sarajevo	Primljeno	2025-08-15 18:53:28.791398	\N
14	2	1	Curenje iz balkona	Voda curi sa balkona	Sarajevo	Završeno	2025-08-15 18:45:38.762296	\N
38	7	14	Kvar u stanu, TV ne radi	rfewfeewfw	Travnik	Primljeno	2025-09-07 17:19:02.653471	\N
2	2	3	Radijator	radijator se čudno ponaša	Visoko	Na lokaciji	2025-07-24 13:04:19.109997	\N
13	2	3	Klima se pokvarila	Klima ne hladi kako treba	Sarajevo	Završeno	2025-08-15 18:45:38.762296	\N
20	2	3	Curenje vode iz slavine	Voda curi iz slavine u kupaoni	Sarajevo	Završeno	2025-08-15 18:53:28.791398	\N
26	2	3	Curenje iz balkona	Voda curi sa balkona nakon kiše	Sarajevo	Završeno	2025-08-15 18:53:28.791398	\N
22	2	2	Klima ne hladi	Klima u dnevnoj sobi ne hladi kako treba	Sarajevo	Popravka u toku	2025-08-15 18:53:28.791398	\N
9	2	2	Kvar struje	Nema struje u dnevnoj sobi	Sarajevo	Dodijeljeno izvođaču	2025-08-15 18:45:38.762296	\N
39	2	2	Kvar sijalice	opisertetetete	Zavidovići	Primljeno	2025-09-14 13:26:05.85471	\N
40	2	2	Kvar struje	gkmehdghrjgirikgjrgnrhnhjtrunj	Sarajevo	Primljeno	2025-09-17 14:02:05.68531	\N
\.


--
-- Data for Name: issuecategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issuecategory (id, name) FROM stdin;
1	Vodoinstalacije
2	Elektroinstalacije
3	Grijanje
4	Lift
5	Zajedničke Prostorije
6	Fasada
7	Krov
8	Prozori i Vrata
9	Interfon
10	Rasvjeta
11	Otpad
12	Ventilacija
13	Parking
14	Ostalo
\.


--
-- Data for Name: issueimage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issueimage (id, issue_id, image_url) FROM stdin;
1	1	media\\issues\\1\\viber_image_2025-04-17_13-08-13-929.png
2	2	media\\issues\\2\\viber_image_2025-04-17_13-08-13-929.png
5	38	media\\issues\\38\\4k-wallpaper-minimal-anime-3840x1920.jpg
6	39	media\\issues\\39\\foosha-vilage-luffy-hometown-wallpaper-2560x1440_51.jpg
7	40	media\\issues\\40\\4k-wallpaper-minimal-anime-3840x1920.jpg
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, issue_id, user_id, note, created_at) FROM stdin;
1	12	4	npomena	2025-09-08 11:08:12.715351
2	27	4	rtzh fhtfmtrhtmrh	2025-09-09 12:05:24.163999
3	18	4	NAPOMENAAAAAAAA	2025-09-09 12:05:32.001269
4	38	4	tzjt	2025-09-10 13:30:09.529572
5	2	4	napomena ee	2025-09-10 13:31:42.079115
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, user_id, issue_id, old_status, new_status, changed_by, is_read, created_at) FROM stdin;
1	2	1	Primljeno	U toku	Sistem	t	2025-07-25 14:54:33.607087
2	2	1	Primljeno	U toku	Sistem	t	2025-07-25 14:57:47.207827
3	2	5	Primljeno	U toku	Sistem	t	2025-07-25 15:12:20.26335
7	5	11	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:47:51.154746
8	5	10	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:48:04.096905
9	5	12	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:48:16.228907
10	5	13	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:49:54.178113
11	5	14	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:51:06.36357
12	5	15	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-08-15 16:52:41.260783
14	3	26	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-05 10:33:18.749106
4	2	5	Primljeno	U toku	Sistem	t	2025-07-25 15:17:22.347804
5	2	5	Primljeno	Završeno	Sistem	t	2025-07-25 17:35:45.916229
6	2	5	Primljeno	Zavrseno	Sistem	t	2025-07-25 17:36:50.46655
13	2	10	Dodijeljeno izvođaču	Završeno	Upravnik	t	2025-08-15 20:26:05.12071
15	2	10	Završeno	Otkazano	Upravnik	t	2025-09-05 10:33:32.827408
19	2	14	Dodijeljeno izvođaču	Završeno	Izvođač	f	2025-09-05 15:18:00.996378
20	2	15	Dodijeljeno izvođaču	Završeno	Izvođač	f	2025-09-05 15:18:12.457809
21	3	19	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-07 17:22:27.950402
22	2	2	Dodijeljeno izvođaču	Na lokaciji	Izvođač	f	2025-09-07 17:27:19.548039
23	2	13	Dodijeljeno izvođaču	Završeno	Izvođač	f	2025-09-07 18:27:34.450914
24	7	20	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-08 08:50:55.448697
25	2	20	Dodijeljeno izvođaču	Završeno	Upravnik	f	2025-09-08 09:03:24.057799
26	2	26	Dodijeljeno izvođaču	Završeno	Upravnik	f	2025-09-08 09:03:51.691027
27	2	19	Dodijeljeno izvođaču	Završeno	Upravnik	f	2025-09-08 09:04:05.246499
28	2	12	Dodijeljeno izvođaču	Završeno	Izvođač	f	2025-09-08 12:12:18.045821
29	2	15	Završeno	Čeka dijelove	Izvođač	f	2025-09-08 12:20:24.921914
30	2	11	Dodijeljeno izvođaču	Otkazano	Izvođač	f	2025-09-08 13:03:00.405599
31	7	18	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-08 22:09:50.091799
32	7	27	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-08 22:12:41.244568
33	3	22	Primljeno	Dodijeljeno izvođaču	Upravnik	f	2025-09-08 22:27:25.830539
35	2	9	Dodijeljeno izvođaču	Popravka u toku	Izvođač	f	2025-09-10 09:53:18.64162
36	2	22	Dodijeljeno izvođaču	Popravka u toku	Upravnik	f	2025-09-10 15:11:16.683805
37	2	9	Popravka u toku	Završeno	Upravnik	f	2025-09-10 15:13:40.426518
38	2	9	Završeno	Popravka u toku	Upravnik	f	2025-09-10 15:13:57.178306
39	2	9	Popravka u toku	Dodijeljeno izvođaču	Upravnik	t	2025-09-10 15:20:57.024567
\.


--
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rating (id, issue_id, tenant_id, score, comment, created_at) FROM stdin;
1	6	2	3		2025-07-25 15:55:40.086368
2	13	2	4		2025-09-07 19:14:25.349304
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name) FROM stdin;
1	Stanar
2	Upravnik
3	Izvođač
4	Administrator
\.


--
-- Data for Name: rolerequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rolerequest (id, user_id, current_role_id, requested_role_id, motivation, status, admin_notes, created_at, updated_at, cv_file_url) FROM stdin;
2	7	1	3	MOTIVACIONO PISMO:\nOvo je motivaciono pismo. heeheheheheheehehheehehheheeh\n\nRAZLOG ZA POSTAJANJE IZVOĐAČA:\nrazlog hahahahahahahhahahahhaahhah\n\nCV/ISKUSTVO: Nije priložen\n	approved	\N	2025-09-07 19:34:00.012521	2025-09-07 19:34:46.241601	\N
3	10	1	3	MOTIVACIONO PISMO:\ndrg edrgdrnrdndrgdrgrndngdndrgndrgdrgndgdrndgdgdrndrgdndrn\n\nRAZLOG ZA POSTAJANJE IZVOĐAČA:\nverrbfe4nbegnbe4gegne4nhnengegnetngen\n\nCV/ISKUSTVO: Nije priložen\n	pending	\N	2025-09-07 19:39:30.25075	2025-09-07 19:39:30.250827	\N
1	2	1	3	MOTIVACIONO PISMO:\nlkmdrhfkshfijdjgnlkdjgerdhjngoičtrghrtoighntrjnrtlhjnhtrknjktrhjntlik\n\nRAZLOG ZA POSTAJANJE IZVOĐAČA:\njkhbf duoifhgočhoirhjorfčhjnopčirhjolčt\n\nCV/ISKUSTVO: Nije priložen\n	rejected	\N	2025-09-05 10:26:20.865793	2025-09-08 11:56:24.927318	\N
5	12	1	2	MOTIVACIONO PISMO:\ngdrh6 ztrhjtzhmtz5ermrergf htdmhgmhfdxmhxmgedgedgedgegegegedr\n\nISKUSTVO U UPRAVLJANJU:\nthmhgmxhmhgmfhxgfjmhghtxfmhtxmxutmutrutmutmutmjmjuzmcum\n\nPLANOVI ZA UPRAVLJANJE ZGRADAMA:\njmtjtmtjxmxmmmzugmxzzmztyzt7uzty,utr6u,tr6u.,ru6,uu7,,\n\nCV/ISKUSTVO: Priložen\n\nPOTVRDA PROMJENE ULOGE: Prihvaćeno\n	approved	\N	2025-09-08 11:55:31.092152	2025-09-08 11:56:37.826914	\N
4	11	1	3	MOTIVACIONO PISMO:\nlprčetjkgrohjoipthjk09ijkhtz0gk0zkj0koihoivf ztkgoi\n\nRAZLOG ZA POSTAJANJE IZVOĐAČA:\ngwoptjhoirhzjguoihij9jhotrhjkt0hniki0thoinjm\n\nCV/ISKUSTVO: Priložen\n	rejected	\N	2025-09-08 11:38:04.864358	2025-09-09 10:42:22.484433	\N
6	11	1	2	MOTIVACIONO PISMO:\nkuhktgjhmrhmerhrehrz5tr mztufutfutrztrfdxghhdrmfhthtffjgfxgm g\n\nISKUSTVO U UPRAVLJANJU:\nmghthmnztrewtrntenwwentetnwentnwtntnwntrewezrezrnzenrernztern\n\nPLANOVI ZA UPRAVLJANJE ZGRADAMA:\nebtewbrte4nwtnwt4nwten4tnt4n64nw6m4nw4w5nn54wt4nwn4wt4ntw4nwtb4nwt\n\nCV/ISKUSTVO: Priložen\n\nPOTVRDA PROMJENE ULOGE: Prihvaćeno\n	rejected	\N	2025-09-09 10:43:21.960674	2025-09-09 10:50:50.998144	applications/11/manager_application.pdf
\.


--
-- Data for Name: survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.survey (id, tenant_id, issue_id, satisfaction_level, issue_category, description, suggestions, contact_preference, created_at) FROM stdin;
1	2	\N	zadovoljan	grijanje	jzijkzikkzktkzkzkzkzkz	kzkzkzkzkzkzk	no	2025-09-05 14:32:12.039866
2	7	\N	vrlo_nezadovoljan	ostalo	snackanafffff	rstgstgeggege	yes	2025-09-09 10:19:30.866211
\.


--
-- Data for Name: systemsettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.systemsettings (id, allow_registration, require_approval, email_notifications, maintenance_mode, auto_assignment, created_at, updated_at) FROM stdin;
1	t	t	t	f	f	2025-09-05 09:18:33.026854	2025-09-05 09:18:33.02694
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, role_id, full_name, email, password_hash, phone, address, created_at) FROM stdin;
2	1	Ekrem Jevrić	ekrem@gmail.com	$2b$12$bifZHjlfRy21djSqsLkDPeumuCqG82fplmR.EQAfH2F8athAFY492	061123456		2025-07-22 19:03:47.061953
4	2	upravnik u	upravnik@gmail.com	$2b$12$aJTg3C2rLGQ198ewXpUKZ.9v2rRSBG1xtxJdex38.M3Tub7DDfZV.	\N	\N	2025-07-26 10:45:06.71969
5	3	izvodjac i	izvodjac@gmail.com	$2b$12$3wIacxX3ebZYYdECnqgxI.iXdiPZOUI9sJIWuNwhpTbNDngzs.UC.	\N	\N	2025-07-26 10:47:19.642622
6	4	admin a	admin@gmail.com	$2b$12$JBcwvBEHFtXYUC2biGt.HOxTTbJCL5pPZE5HkBi8d8E3MuTrSc8Ze	\N	\N	2025-07-26 10:48:36.695828
3	3	Hamza Trky	hamza@gmail.com	$2b$12$NgC3voe4SYuV5BHdo1hEAu.2tLzabD62hJ.7Lnc5C0UogLcN5ctyW	\N	\N	2025-07-22 19:06:33.34598
8	1	test t	test@gmail.com	$2b$12$000J47tD.3/gygmv936p9OesdGwqpRj8QhgMEVaJk5NSI9B0w9SE6	\N	\N	2025-09-07 17:42:22.759359
9	1	namik n	namik@gmail.com	$2b$12$LxD8JI9sgyDGB095ynSPzO6O.jDTtA4bskt3f5EvjcXYWn.EG9xk6	\N	\N	2025-09-07 17:46:46.934647
7	3	Osman Namso	osman@gmail.com	$2b$12$/sCZaDPakzEzGNEfPXd9PexEImZlsAb6P9KFUz89fsIWZSo3eFCIa	666		2025-09-06 10:45:03.360264
10	1	tito we	tito@gmail.com	$2b$12$7u76fLzZ2Z0gDuYNCPJ7Y.aye.HRdnxlTImcvSi81I4kOmCsJFcwG	\N	\N	2025-09-07 19:39:10.538907
11	1	Halid Bešlić	halid@gmail.com	$2b$12$35kvsGrOQjP0KGp0E5jD1uBNc/DmoFK3LV2Xi.pHn.tfav/PxSJT6	\N	\N	2025-09-08 11:17:22.399601
12	2	dino mehmeda mujkić	dino@gmail.com	$2b$12$46E0LvUEiGuZalzowMK99eT87CyL2uVTcBzpc0tGohGeUwlOQRcdy	\N	\N	2025-09-08 11:52:36.65776
\.


--
-- Name: adminnote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adminnote_id_seq', 9, true);


--
-- Name: assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignment_id_seq', 15, true);


--
-- Name: assignmentdocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignmentdocument_id_seq', 1, false);


--
-- Name: assignmentimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignmentimage_id_seq', 1, false);


--
-- Name: assignmentnotification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignmentnotification_id_seq', 3, true);


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 5, true);


--
-- Name: issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issue_id_seq', 40, true);


--
-- Name: issuecategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issuecategory_id_seq', 14, true);


--
-- Name: issueimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issueimage_id_seq', 7, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_seq', 5, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 39, true);


--
-- Name: rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_id_seq', 2, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 4, true);


--
-- Name: rolerequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rolerequest_id_seq', 6, true);


--
-- Name: survey_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.survey_id_seq', 2, true);


--
-- Name: systemsettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.systemsettings_id_seq', 1, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 12, true);


--
-- Name: adminnote adminnote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminnote
    ADD CONSTRAINT adminnote_pkey PRIMARY KEY (id);


--
-- Name: assignment assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (id);


--
-- Name: assignmentdocument assignmentdocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentdocument
    ADD CONSTRAINT assignmentdocument_pkey PRIMARY KEY (id);


--
-- Name: assignmentimage assignmentimage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentimage
    ADD CONSTRAINT assignmentimage_pkey PRIMARY KEY (id);


--
-- Name: assignmentnotification assignmentnotification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentnotification
    ADD CONSTRAINT assignmentnotification_pkey PRIMARY KEY (id);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: issue issue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue
    ADD CONSTRAINT issue_pkey PRIMARY KEY (id);


--
-- Name: issuecategory issuecategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuecategory
    ADD CONSTRAINT issuecategory_pkey PRIMARY KEY (id);


--
-- Name: issueimage issueimage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issueimage
    ADD CONSTRAINT issueimage_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: rolerequest rolerequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolerequest
    ADD CONSTRAINT rolerequest_pkey PRIMARY KEY (id);


--
-- Name: survey survey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_pkey PRIMARY KEY (id);


--
-- Name: systemsettings systemsettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.systemsettings
    ADD CONSTRAINT systemsettings_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_role_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_role_name ON public.role USING btree (name);


--
-- Name: ix_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);


--
-- Name: adminnote adminnote_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminnote
    ADD CONSTRAINT adminnote_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public."user"(id);


--
-- Name: adminnote adminnote_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminnote
    ADD CONSTRAINT adminnote_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public."user"(id);


--
-- Name: assignment assignment_contractor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_contractor_id_fkey FOREIGN KEY (contractor_id) REFERENCES public."user"(id);


--
-- Name: assignment assignment_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: assignmentdocument assignmentdocument_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentdocument
    ADD CONSTRAINT assignmentdocument_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(id);


--
-- Name: assignmentimage assignmentimage_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentimage
    ADD CONSTRAINT assignmentimage_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(id);


--
-- Name: assignmentnotification assignmentnotification_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentnotification
    ADD CONSTRAINT assignmentnotification_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(id);


--
-- Name: assignmentnotification assignmentnotification_contractor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentnotification
    ADD CONSTRAINT assignmentnotification_contractor_id_fkey FOREIGN KEY (contractor_id) REFERENCES public."user"(id);


--
-- Name: assignmentnotification assignmentnotification_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignmentnotification
    ADD CONSTRAINT assignmentnotification_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: comment comment_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: comment comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: issue issue_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue
    ADD CONSTRAINT issue_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.issuecategory(id);


--
-- Name: issue issue_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue
    ADD CONSTRAINT issue_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public."user"(id);


--
-- Name: issueimage issueimage_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issueimage
    ADD CONSTRAINT issueimage_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: notes notes_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: notification notification_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: rating rating_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: rating rating_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public."user"(id);


--
-- Name: rolerequest rolerequest_current_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolerequest
    ADD CONSTRAINT rolerequest_current_role_id_fkey FOREIGN KEY (current_role_id) REFERENCES public.role(id);


--
-- Name: rolerequest rolerequest_requested_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolerequest
    ADD CONSTRAINT rolerequest_requested_role_id_fkey FOREIGN KEY (requested_role_id) REFERENCES public.role(id);


--
-- Name: rolerequest rolerequest_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rolerequest
    ADD CONSTRAINT rolerequest_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: survey survey_issue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issue(id);


--
-- Name: survey survey_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public."user"(id);


--
-- Name: user user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- PostgreSQL database dump complete
--

