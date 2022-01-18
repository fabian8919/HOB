--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

-- Started on 2021-12-16 08:39:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "house_bot";
--
-- TOC entry 3401 (class 1262 OID 16482)
-- Name: house_bot; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "house_bot" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Colombia.1252';


\connect "house_bot"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = "heap";

--
-- TOC entry 212 (class 1259 OID 16491)
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."clientes" (
    "id" integer NOT NULL,
    "nit" bigint NOT NULL,
    "razon_social" character varying(100) NOT NULL,
    "activo" boolean NOT NULL,
    "telefono" character varying(50),
    "direccion" character varying(120),
    "correo" character varying(100),
    "fecha" timestamp with time zone
);


--
-- TOC entry 211 (class 1259 OID 16490)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."clientes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 211
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."clientes_id_seq" OWNED BY "public"."clientes"."id";


--
-- TOC entry 214 (class 1259 OID 16498)
-- Name: clientes_usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."clientes_usuarios" (
    "id" integer NOT NULL,
    "cliente_nit" bigint NOT NULL,
    "usuario_cedula" bigint NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 16497)
-- Name: clientes_usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."clientes_usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 213
-- Name: clientes_usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."clientes_usuarios_id_seq" OWNED BY "public"."clientes_usuarios"."id";


--
-- TOC entry 224 (class 1259 OID 24758)
-- Name: modulos_padre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."modulos_padre" (
    "id" integer NOT NULL,
    "id_modulo_padre" character varying NOT NULL,
    "nombre" character varying
);


--
-- TOC entry 223 (class 1259 OID 24757)
-- Name: modulos_padre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."modulos_padre_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 223
-- Name: modulos_padre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."modulos_padre_id_seq" OWNED BY "public"."modulos_padre"."id";


--
-- TOC entry 216 (class 1259 OID 16505)
-- Name: permisos_acciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."permisos_acciones" (
    "id" integer NOT NULL,
    "id_permiso" character varying(20) NOT NULL,
    "nombre" character varying(50) NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16504)
-- Name: permisos_acciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."permisos_acciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 215
-- Name: permisos_acciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."permisos_acciones_id_seq" OWNED BY "public"."permisos_acciones"."id";


--
-- TOC entry 220 (class 1259 OID 16519)
-- Name: permisos_modulos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."permisos_modulos" (
    "id" integer NOT NULL,
    "id_modulo" character varying(20) NOT NULL,
    "nombre_modulo" character varying(50) NOT NULL,
    "icono" character varying(100),
    "modulo_padre" character varying(20)
);


--
-- TOC entry 219 (class 1259 OID 16518)
-- Name: permisos_modulos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."permisos_modulos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 219
-- Name: permisos_modulos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."permisos_modulos_id_seq" OWNED BY "public"."permisos_modulos"."id";


--
-- TOC entry 226 (class 1259 OID 24767)
-- Name: relacion_modulos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."relacion_modulos" (
    "id" integer NOT NULL,
    "rel_padre" character varying NOT NULL,
    "rel_hijo" character varying NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 24766)
-- Name: relacion_modulos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."relacion_modulos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 225
-- Name: relacion_modulos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."relacion_modulos_id_seq" OWNED BY "public"."relacion_modulos"."id";


--
-- TOC entry 210 (class 1259 OID 16484)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."usuarios" (
    "id" integer NOT NULL,
    "cedula" bigint NOT NULL,
    "nombre" character varying(100),
    "correo" character varying(100) NOT NULL,
    "contrasena" character varying(50) NOT NULL,
    "fecha" timestamp with time zone NOT NULL,
    "activo" boolean,
    "bloqueado" boolean,
    "intentos" integer,
    "ultimo_acceso" timestamp with time zone
);


--
-- TOC entry 209 (class 1259 OID 16483)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 209
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."usuarios_id_seq" OWNED BY "public"."usuarios"."id";


--
-- TOC entry 218 (class 1259 OID 16512)
-- Name: usuarios_permisos_acciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."usuarios_permisos_acciones" (
    "id" integer NOT NULL,
    "cedula_usuario" bigint NOT NULL,
    "permiso_id_accion" character varying(20) NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16511)
-- Name: usuarios_permisos_acciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."usuarios_permisos_acciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_permisos_acciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."usuarios_permisos_acciones_id_seq" OWNED BY "public"."usuarios_permisos_acciones"."id";


--
-- TOC entry 222 (class 1259 OID 16526)
-- Name: usuarios_permisos_modulos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."usuarios_permisos_modulos" (
    "id" integer NOT NULL,
    "cedula_usuario" bigint NOT NULL,
    "modulo_id" character varying(20) NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 16525)
-- Name: usuarios_permisos_modulos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."usuarios_permisos_modulos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_permisos_modulos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."usuarios_permisos_modulos_id_seq" OWNED BY "public"."usuarios_permisos_modulos"."id";


--
-- TOC entry 3205 (class 2604 OID 16494)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."clientes_id_seq"'::"regclass");


--
-- TOC entry 3206 (class 2604 OID 16501)
-- Name: clientes_usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes_usuarios" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."clientes_usuarios_id_seq"'::"regclass");


--
-- TOC entry 3211 (class 2604 OID 24761)
-- Name: modulos_padre id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."modulos_padre" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."modulos_padre_id_seq"'::"regclass");


--
-- TOC entry 3207 (class 2604 OID 16508)
-- Name: permisos_acciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."permisos_acciones" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."permisos_acciones_id_seq"'::"regclass");


--
-- TOC entry 3209 (class 2604 OID 16522)
-- Name: permisos_modulos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."permisos_modulos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."permisos_modulos_id_seq"'::"regclass");


--
-- TOC entry 3212 (class 2604 OID 24770)
-- Name: relacion_modulos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."relacion_modulos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."relacion_modulos_id_seq"'::"regclass");


--
-- TOC entry 3204 (class 2604 OID 16487)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."usuarios_id_seq"'::"regclass");


--
-- TOC entry 3208 (class 2604 OID 16515)
-- Name: usuarios_permisos_acciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_acciones" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."usuarios_permisos_acciones_id_seq"'::"regclass");


--
-- TOC entry 3210 (class 2604 OID 16529)
-- Name: usuarios_permisos_modulos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_modulos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."usuarios_permisos_modulos_id_seq"'::"regclass");


--
-- TOC entry 3381 (class 0 OID 16491)
-- Dependencies: 212
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."clientes" ("id", "nit", "razon_social", "activo", "telefono", "direccion", "correo", "fecha") VALUES (2, 45564154, 'House Of Bot', true, '+57', 'Carrera 8B Numero 22 - 45', 'hob@hob.com.co', NULL);
INSERT INTO "public"."clientes" ("id", "nit", "razon_social", "activo", "telefono", "direccion", "correo", "fecha") VALUES (1, 5415151, 'Pruebas A', true, '11111', 'Cra  98a d n', 'angelus@gmail.com', NULL);


--
-- TOC entry 3383 (class 0 OID 16498)
-- Dependencies: 214
-- Data for Name: clientes_usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."clientes_usuarios" ("id", "cliente_nit", "usuario_cedula") VALUES (10, 45564154, 1006432645);
INSERT INTO "public"."clientes_usuarios" ("id", "cliente_nit", "usuario_cedula") VALUES (13, 5415151, 1006432645);


--
-- TOC entry 3393 (class 0 OID 24758)
-- Dependencies: 224
-- Data for Name: modulos_padre; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."modulos_padre" ("id", "id_modulo_padre", "nombre") VALUES (2, '154659', 'ADMINISTRACION');
INSERT INTO "public"."modulos_padre" ("id", "id_modulo_padre", "nombre") VALUES (3, '6351351', 'SOCIAL NETWORK');


--
-- TOC entry 3385 (class 0 OID 16505)
-- Dependencies: 216
-- Data for Name: permisos_acciones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."permisos_acciones" ("id", "id_permiso", "nombre") VALUES (2, '88HS', 'crear usuarios');
INSERT INTO "public"."permisos_acciones" ("id", "id_permiso", "nombre") VALUES (3, '123123', 'borar user');


--
-- TOC entry 3389 (class 0 OID 16519)
-- Dependencies: 220
-- Data for Name: permisos_modulos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (5, 'P98', 'Permisos', 'fas fa-shield-alt', '154659');
INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (3, 'C23', 'Clientes', 'fas fa-user', '154659');
INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (4, 'U56', 'Usuarios', 'fas fa-users', '154659');
INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (6, 'M45', 'Modulos', 'fas fa-folder', '154659');
INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (7, 'MP79', 'Modulos Padre', 'fas fa-folder-open', '154659');
INSERT INTO "public"."permisos_modulos" ("id", "id_modulo", "nombre_modulo", "icono", "modulo_padre") VALUES (8, 'CH97', 'Chat', 'fas fa-comment-alt', '6351351');


--
-- TOC entry 3395 (class 0 OID 24767)
-- Dependencies: 226
-- Data for Name: relacion_modulos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3379 (class 0 OID 16484)
-- Dependencies: 210
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."usuarios" ("id", "cedula", "nombre", "correo", "contrasena", "fecha", "activo", "bloqueado", "intentos", "ultimo_acceso") VALUES (17, 41914243, 'Flor Rodriguez', 'pruebas@pruebas.com', '615110f7b906602d73d65d93246da165', '2021-11-27 23:01:33.408527-05', true, false, NULL, '2021-11-27 23:05:03.627676-05');
INSERT INTO "public"."usuarios" ("id", "cedula", "nombre", "correo", "contrasena", "fecha", "activo", "bloqueado", "intentos", "ultimo_acceso") VALUES (18, 789456, 'Fabian Zabala', 'fabianzabala22@gmail.com', '31e221b2eff9ffa68af745c3f7000d90', '2021-11-29 20:11:39.579376-05', true, false, NULL, NULL);
INSERT INTO "public"."usuarios" ("id", "cedula", "nombre", "correo", "contrasena", "fecha", "activo", "bloqueado", "intentos", "ultimo_acceso") VALUES (16, 1006432645, 'Angelo Velandia', 'velandia_angelo@outlook.com', 'f4fcda5f454d72fa01547141b361959c', '2021-11-27 17:35:38.635815-05', true, false, 1, '2021-12-15 15:50:18.742572-05');
INSERT INTO "public"."usuarios" ("id", "cedula", "nombre", "correo", "contrasena", "fecha", "activo", "bloqueado", "intentos", "ultimo_acceso") VALUES (8, 4514989, 'Danuiela', 'ana@aaaa', '81dc9bdb52d04dc20036dbd8313ed055', '2021-11-26 14:40:57.112286-05', true, false, NULL, NULL);


--
-- TOC entry 3387 (class 0 OID 16512)
-- Dependencies: 218
-- Data for Name: usuarios_permisos_acciones; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."usuarios_permisos_acciones" ("id", "cedula_usuario", "permiso_id_accion") VALUES (7, 1006432645, '88HS');


--
-- TOC entry 3391 (class 0 OID 16526)
-- Dependencies: 222
-- Data for Name: usuarios_permisos_modulos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (8, 1006432645, 'C23');
INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (9, 1006432645, 'U56');
INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (11, 1006432645, 'CH97');
INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (12, 1006432645, 'M45');
INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (13, 1006432645, 'MP79');
INSERT INTO "public"."usuarios_permisos_modulos" ("id", "cedula_usuario", "modulo_id") VALUES (14, 1006432645, 'P98');


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 211
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."clientes_id_seq"', 2, true);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 213
-- Name: clientes_usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."clientes_usuarios_id_seq"', 13, true);


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 223
-- Name: modulos_padre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."modulos_padre_id_seq"', 3, true);


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 215
-- Name: permisos_acciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."permisos_acciones_id_seq"', 3, true);


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 219
-- Name: permisos_modulos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."permisos_modulos_id_seq"', 8, true);


--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 225
-- Name: relacion_modulos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."relacion_modulos_id_seq"', 1, false);


--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 209
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."usuarios_id_seq"', 18, true);


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_permisos_acciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."usuarios_permisos_acciones_id_seq"', 7, true);


--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_permisos_modulos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."usuarios_permisos_modulos_id_seq"', 14, true);


--
-- TOC entry 3216 (class 2606 OID 16496)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes"
    ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("nit");


--
-- TOC entry 3218 (class 2606 OID 16503)
-- Name: clientes_usuarios clientes_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes_usuarios"
    ADD CONSTRAINT "clientes_usuarios_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3228 (class 2606 OID 24765)
-- Name: modulos_padre modulos_padre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."modulos_padre"
    ADD CONSTRAINT "modulos_padre_pkey" PRIMARY KEY ("id_modulo_padre");


--
-- TOC entry 3220 (class 2606 OID 16510)
-- Name: permisos_acciones permisos_acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."permisos_acciones"
    ADD CONSTRAINT "permisos_acciones_pkey" PRIMARY KEY ("id_permiso");


--
-- TOC entry 3224 (class 2606 OID 32961)
-- Name: permisos_modulos permisos_modulos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."permisos_modulos"
    ADD CONSTRAINT "permisos_modulos_pkey" PRIMARY KEY ("id_modulo");


--
-- TOC entry 3230 (class 2606 OID 24774)
-- Name: relacion_modulos relacion_modulos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."relacion_modulos"
    ADD CONSTRAINT "relacion_modulos_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3222 (class 2606 OID 16517)
-- Name: usuarios_permisos_acciones usuarios_permisos_acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_acciones"
    ADD CONSTRAINT "usuarios_permisos_acciones_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3226 (class 2606 OID 16531)
-- Name: usuarios_permisos_modulos usuarios_permisos_modulos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_modulos"
    ADD CONSTRAINT "usuarios_permisos_modulos_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3214 (class 2606 OID 16489)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("cedula");


--
-- TOC entry 3231 (class 2606 OID 16532)
-- Name: clientes_usuarios clientes_usuarios_cliente_nit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes_usuarios"
    ADD CONSTRAINT "clientes_usuarios_cliente_nit_fkey" FOREIGN KEY ("cliente_nit") REFERENCES "public"."clientes"("nit") NOT VALID;


--
-- TOC entry 3232 (class 2606 OID 16537)
-- Name: clientes_usuarios clientes_usuarios_usuario_cedula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clientes_usuarios"
    ADD CONSTRAINT "clientes_usuarios_usuario_cedula_fkey" FOREIGN KEY ("usuario_cedula") REFERENCES "public"."usuarios"("cedula") NOT VALID;


--
-- TOC entry 3238 (class 2606 OID 32967)
-- Name: relacion_modulos relacion_modulos_rel_hijo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."relacion_modulos"
    ADD CONSTRAINT "relacion_modulos_rel_hijo_fkey" FOREIGN KEY ("rel_hijo") REFERENCES "public"."permisos_modulos"("id_modulo");


--
-- TOC entry 3237 (class 2606 OID 24780)
-- Name: relacion_modulos relacion_modulos_rel_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."relacion_modulos"
    ADD CONSTRAINT "relacion_modulos_rel_padre_fkey" FOREIGN KEY ("rel_padre") REFERENCES "public"."modulos_padre"("id_modulo_padre");


--
-- TOC entry 3233 (class 2606 OID 16542)
-- Name: usuarios_permisos_acciones usuarios_permisos_acciones_cedula_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_acciones"
    ADD CONSTRAINT "usuarios_permisos_acciones_cedula_usuario_fkey" FOREIGN KEY ("cedula_usuario") REFERENCES "public"."usuarios"("cedula") NOT VALID;


--
-- TOC entry 3234 (class 2606 OID 16547)
-- Name: usuarios_permisos_acciones usuarios_permisos_acciones_permiso_id_accion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_acciones"
    ADD CONSTRAINT "usuarios_permisos_acciones_permiso_id_accion_fkey" FOREIGN KEY ("permiso_id_accion") REFERENCES "public"."permisos_acciones"("id_permiso") NOT VALID;


--
-- TOC entry 3235 (class 2606 OID 16552)
-- Name: usuarios_permisos_modulos usuarios_permisos_modulos_cedula_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_modulos"
    ADD CONSTRAINT "usuarios_permisos_modulos_cedula_usuario_fkey" FOREIGN KEY ("cedula_usuario") REFERENCES "public"."usuarios"("cedula") NOT VALID;


--
-- TOC entry 3236 (class 2606 OID 32976)
-- Name: usuarios_permisos_modulos usuarios_permisos_modulos_modulo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."usuarios_permisos_modulos"
    ADD CONSTRAINT "usuarios_permisos_modulos_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."permisos_modulos"("id_modulo") NOT VALID;


-- Completed on 2021-12-16 08:39:13

--
-- PostgreSQL database dump complete
--

