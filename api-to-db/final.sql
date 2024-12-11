CREATE TABLE `house` (
	`house_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`HOUSE_MANAGE_NO`	BIGINT	NOT NULL,
	`PBLANC_NO`	BIGINT	NOT NULL,
	`HOUSE_NM`	VARCHAR(344)	NOT NULL,
	`HOUSE_SECD`	CHAR(2)	NOT NULL	COMMENT '01: APT, 04: 무순위/잔여세대, 01 -> detail01 / 04 -> detail04',
	`HOUSE_SECD_NM`	VARCHAR(32)	NOT NULL	COMMENT 'APT 또는 무순위/잔여세대 만 올 수 있음',
	`HSSPLY_ZIP`	VARCHAR(6)	NOT NULL,
	`HSSPLY_ADRES`	VARCHAR(256)	NOT NULL,
	`TOT_SUPLY_HSHLDCO`	INTEGER	NOT NULL,
	`RCRIT_PBLANC_DE`	DATE	NOT NULL,
	`PRZWNER_PRESNATN_DE`	DATE	NOT NULL,
	`CNTRCT_CNCLS_BGNDE`	DATE	NOT NULL,
	`CNTRCT_CNCLS_ENDDE`	DATE	NOT NULL,
	`HMPG_ADRES`	VARCHAR(256)	NULL,
	`BSNS_MBY_NM`	VARCHAR(200)	NOT NULL,
	`MDHS_TELNO`	VARCHAR(30)	NOT NULL,
	`MVN_PREARNGE_YM`	VARCHAR(6)	NOT NULL,
	`PBLANC_URL`	VARCHAR(300)	NOT NULL,
	PRIMARY KEY (`house_id`),
	UNIQUE (`HOUSE_MANAGE_NO`),
	UNIQUE (`PBLANC_NO`),
	-- `HOUSE_SECD`는 '01' 또는 '04'만 허용
	CONSTRAINT `CHK_HOUSE_SECD` CHECK (`HOUSE_SECD` IN ('01', '04')),
	-- `HOUSE_SECD_NM`은 'APT' 또는 '무순위/잔여세대'만 허용
	CONSTRAINT `CHK_HOUSE_SECD_NM` CHECK (`HOUSE_SECD_NM` IN ('APT', '무순위/잔여세대'))
);

CREATE TABLE `DETAIL04` (
	`detail04_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`house_id`	BIGINT	NOT NULL,
	`SUBSCRPT_RCEPT_BGNDE`	DATE	NOT NULL,
	`SUBSCRPT_RCEPT_ENDDE`	DATE	NOT NULL,
	`SPSPLY_RCEPT_BGNDE`	DATE	NULL,
	`SPSPLY_RCEPT_ENDDE`	DATE	NULL,
	`GNRL_RCEPT_BGNDE`	DATE	NULL,
	`GNRL_RCEPT_ENDDE`	DATE	NULL,
	PRIMARY KEY (`detail04_id`),
	FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`)    ON DELETE CASCADE
);

CREATE TABLE `DETAIL01` (
	`detail01_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`house_id`	BIGINT	NOT NULL,
	`HOUSE_DTL_SECD`	CHAR(2)	NOT NULL	COMMENT '(01: 민영, 03: 국민)',
	`HOUSE_DTL_SECD_NM`	VARCHAR(10)	NOT NULL	COMMENT '민영, 국민',
	`RENT_SECD`	INTEGER	NOT NULL	COMMENT '(0: 분양주택, 1: 분양전환 가능임대)',
	`RENT_SECD_NM`	VARCHAR(36)	NOT NULL	COMMENT '분양주택, 분양전환 가능임대',
	`SUBSCRPT_AREA_CODE`	CHAR(3)	NOT NULL,
	`SUBSCRPT_AREA_CODE_NM`	VARCHAR(10)	NOT NULL,
	`RCEPT_BGNDE`	DATE	NOT NULL,
	`RCEPT_ENDDE`	DATE	NOT NULL,
	`SPSPLY_RCEPT_BGNDE`	DATE	NULL,
	`SPSPLY_RCEPT_ENDDE`	DATE	NULL,
	`GNRL_RNK1_CRSPAREA_RCPTDE`	DATE	NOT NULL,
	`GNRL_RNK1_CRSPAREA_ENDDE`	DATE	NOT NULL,
	`GNRL_RNK1_ETC_GG_RCPTDE`	DATE	NULL,
	`GNRL_RNK1_ETC_GG_ENDDE`	DATE	NULL,
	`GNRL_RNK1_ETC_AREA_RCPTDE`	DATE	NULL,
	`GNRL_RNK1_ETC_AREA_ENDDE`	DATE	NULL,
	`GNRL_RNK2_CRSPAREA_RCPTDE`	DATE	NOT NULL,
	`GNRL_RNK2_CRSPAREA_ENDDE`	DATE	NOT NULL,
	`GNRL_RNK2_ETC_GG_RCPTDE`	DATE	NULL,
	`GNRL_RNK2_ETC_GG_ENDDE`	DATE	NULL,
	`GNRL_RNK2_ETC_AREA_RCPTDE`	DATE	NULL,
	`GNRL_RNK2_ETC_AREA_ENDDE`	DATE	NULL,
	`CNSTRCT_ENTRPS_NM`	VARCHAR(300)	NULL,
	`SPECLT_RDN_EARTH_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`MDAT_TRGET_AREA_SECD`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`PARCPRC_ULS_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`IMPRMN_BSNS_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`PUBLIC_HOUSE_EARTH_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`LRSCL_BLDLND_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`NPLN_PRVOPR_PUBLIC_HOUSE_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	`PUBLIC_HOUSE_SPCLW_APPLC_AT`	CHAR(1)	NOT NULL	COMMENT 'Y / N',
	PRIMARY KEY (`detail01_id`),
	FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`)    ON DELETE CASCADE
);

CREATE TABLE `DETAIL` (
	`detail_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`house_id`	BIGINT	NOT NULL,
	`MODEL_NO`	INTEGER	NOT NULL,
	`HOUSE_TY`	VARCHAR(30)	NOT NULL,
	`SUPLY_AR`	DECIMAL(7, 4)	NULL	COMMENT '01 전용',
	`SUPLY_HSHLDCO`	INTEGER	NOT NULL	DEFAULT 0,
	`SPSPLY_HSHLDCO`	INTEGER	NOT NULL	DEFAULT 0	COMMENT '01 전용 / 04는 없어요',
	`MNYCH_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`NWWDS_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`LFE_FRST_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`OLD_PARNTS_SUPORT_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`INSTT_RECOMEND_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`ETC_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`TRANSR_INSTT_ENFSN_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`YGMN_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용 // 시행안되는중?인가 왜 0개지',
	`NWBB_HSHLDCO`	INTEGER	NULL	COMMENT '01 전용',
	`LTTOT_TOP_AMOUNT`	INTEGER	NOT NULL,
	PRIMARY KEY (`detail_id`),
	FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`)    ON DELETE CASCADE
);

CREATE TABLE `user` (
	`user_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`email`	VARCHAR(30)	NOT NULL,
	`name`	VARCHAR(30)	NOT NULL,
	`nickname`	VARCHAR(30)	NOT NULL,
	`password`	VARCHAR(30)	NOT NULL,
	`phone_number`	VARCHAR(11)	NULL,
	`created_at`	DATE	NOT NULL	DEFAULT (CURRENT_DATE),
	`last_login`	DATE	NOT NULL	DEFAULT (CURRENT_DATE),
	`status`	INTEGER	NOT NULL	DEFAULT 1	COMMENT '0: 비활성, 1: 활성, 2: 탈퇴',
	PRIMARY KEY (`user_id`),
	UNIQUE (`email`),
	UNIQUE (`phone_number`),
	UNIQUE (`nickname`),
	CONSTRAINT `chk_status` CHECK (`status` IN (0, 1, 2))
);

CREATE TABLE `post` (
	`post_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`category`	VARCHAR(20)	NULL,
	`title`	VARCHAR(100)	NOT NULL,
	`subject`	TEXT	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL,
	PRIMARY KEY (`post_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE `comment` (
	`comment_id`	BIGINT	NOT NULL	AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`post_id`	BIGINT	NOT NULL,
	`depth`	INTEGER	NOT NULL	DEFAULT 1 CHECK (depth IN (1, 2))	COMMENT 'default 1 / 대댓글 : 2',
	`comment_id2`	BIGINT	NULL,
	`comments`	TEXT	NOT NULL,
	`created_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	DATETIME	NULL,
	PRIMARY KEY (`comment_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)   ON DELETE CASCADE,
	FOREIGN KEY (`comment_id2`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE
);

CREATE INDEX idx_comment_id ON comment(comment_id);

CREATE TABLE `wish` (
	`wish_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`house_id`	BIGINT	NOT NULL,
	`supply`	CHAR(2)	NULL	COMMENT '01 : 일반 / 02 : 특별-노부모 / 03 : 특별-신혼 등등..',
	`type`	VARCHAR(30)	NULL	COMMENT 'detail 테이블의 HOUSE_TY 참조',
	`alarm`	CHAR(1)	NOT NULL	DEFAULT 'Y'	COMMENT 'Y : 알리받기 / N : 알림 안받기',
	PRIMARY KEY (`wish_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`)    ON DELETE CASCADE,
	CONSTRAINT `chk_alarm` CHECK (`alarm` IN ('Y', 'N'))
);

CREATE TABLE `account` (
	`account_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`type`	VARCHAR(30) NULL    COMMENT '청약예금, 청약부금 , 청약저축, 주택청약종합저축',
	`created_at`	DATE	NOT NULL,
	`payment_count`	INTEGER	NULL	DEFAULT 0,
	`total_amount`	INTEGER	NULL	DEFAULT 0	COMMENT '(단위 : 만원)',
	`recognized_amount`	INTEGER	NULL	DEFAULT 0	COMMENT '(단위 : 만원)',
	`relationship`	INTEGER	NOT NULL	COMMENT '1: 본인, 2: 배우자',
	PRIMARY KEY (`account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	CONSTRAINT `chk_type` CHECK (`type` IN ('청약예금', '청약부금', '청약저축', '주택청약종합저축')),
    CONSTRAINT `chk_relationship` CHECK (`relationship` IN (1, 2))
);

CREATE TABLE `family` (
	`family_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`relationship`	INTEGER	NOT NULL	COMMENT '코드로 관리, 노션에 정리 했어요',
	`living_together`	INTEGER	NOT NULL	COMMENT '0: 동거 x  /  1: 동거 o   /   2: 배우자와 동거 o',
	`living_together_date`	INTEGER	NULL	COMMENT '0 : 1년 미만 / 1 : 1년 이상 3년 미만 / 2 : 3년 이상',
	`birthday`	DATE	NULL,
	`is_married`	CHAR(1)	NULL	COMMENT 'Y: 혼인x / N: 혼인o',
	`house_count`	INTEGER	NOT NULL    DEFAULT 0,
	`house_sold_date`	DATE	NULL	COMMENT '날짜 / null 이면 없음',
	PRIMARY KEY (`family_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	CONSTRAINT `chk_living_together` CHECK (`living_together` IN (0, 1, 2)),
    CONSTRAINT `chk_living_together_date` CHECK (`living_together_date` IN (0, 1, 2)),
    CONSTRAINT `chk_is_married` CHECK (`is_married` IN ('Y', 'N'))
);

CREATE TABLE `condition01` (
	`condition01_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`birthday`	DATE	NOT NULL,
	`si_do`	VARCHAR(60)	NOT NULL,
	`gun_gu`	VARCHAR(60)	NOT NULL,
	`transfer_date`	DATE	NOT NULL,
	`region_move_in_date`	DATE	NULL,
	`metropolitan_area_date`	DATE	NULL,
	`is_householder`	CHAR(1)	NOT NULL	COMMENT 'N: 본인이 세대원 / Y : 본인이 세대주',
	`married`	INTEGER	NOT NULL	COMMENT '0: 미혼 / 1: 기혼 / 2: 예비신혼부부 / 3: 한부모',
	`married_date`	DATE	NULL,
	PRIMARY KEY (`condition01_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `chk_householder` CHECK (`is_householder` IN ('Y', 'N')),
    CONSTRAINT `chk_married` CHECK (`married` IN (0, 1, 2, 3))
);

CREATE TABLE `condition02` (
	`condition02_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`grandparents`	CHAR(1)	NOT NULL	comment 'Y or N',
	`parents`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	`children`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	`grandchildren`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	`spouse`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	`in_laws`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	PRIMARY KEY (`condition02_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	CONSTRAINT `chk_grandparents` CHECK (`grandparents` IN ('Y', 'N')),
	CONSTRAINT `chk_parents` CHECK (`parents` IN ('Y', 'N')),
	CONSTRAINT `chk_children` CHECK (`children` IN ('Y', 'N')),
	CONSTRAINT `chk_grandchildren` CHECK (`grandchildren` IN ('Y', 'N')),
	CONSTRAINT `chk_spouse` CHECK (`spouse` IN ('Y', 'N')),
	CONSTRAINT `chk_in_laws` CHECK (`in_laws` IN ('Y', 'N'))
);

CREATE TABLE `condition03` (
	`condition03_id`	BIGINT	NOT NULL    AUTO_INCREMENT,
	`user_id`	BIGINT	NOT NULL,
	`car_price`	INTEGER	NOT NULL	COMMENT '단위 : 만원',
	`property_price`	INTEGER	NOT NULL	COMMENT '0 : 미보유 혹은 2억 1,150만원 이하 / 1 : 2억 1,150만원 초과 3억 3,100만원 이하 / 2 : 3억 3,100만원 초과',
	`total_asset`	INTEGER	NOT NULL	COMMENT '단위:만원',
	`my_asset`	INTEGER	NOT NULL	COMMENT '단위:만원',
	`spouse_asset`	INTEGER	NULL	COMMENT '단위:만원',
	`family_average_monthly_income`	INTEGER	NOT NULL	COMMENT '단위:만원',
	`previous_year_average_monthly_income`	INTEGER	NOT NULL	COMMENT '단워:만원',
	`income_activity`	INTEGER	NULL	COMMENT '0 : 외벌이 / 1 : 맞벌이',
	`spouse_average_monthly_income`	INTEGER	NULL	COMMENT '단위:만원',
	`income_tax_payment_period`	INTEGER	NOT NULL	COMMENT '단위:년',
	`is_owner`	CHAR(1)	NOT NULL	comment 'Y or N',
	`is_sold_house`	CHAR(1)	NOT NULL	COMMENT 'Y or N',
	`last_winned`	DATE	NULL	COMMENT '가장 최근에 당첨된 날짜 / 없으면 null',
	`ineligible`	DATE	NULL	COMMENT '부적격자 판정된 날짜 / 없으면 null',
	PRIMARY KEY (`condition03_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
	CONSTRAINT `chk_property_price` CHECK (`property_price` IN (0, 1, 2)),
	CONSTRAINT `chk_is_owner` CHECK (`is_owner` IN ('Y', 'N')),
	CONSTRAINT `chk_sold_house` CHECK (`is_sold_house` IN ('Y', 'N'))
);