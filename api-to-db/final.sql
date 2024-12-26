-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.31 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `account` (
  `account_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type` varchar(30) DEFAULT NULL COMMENT '청약예금, 청약부금 , 청약저축, 주택청약종합저축',
  `created_at` date NOT NULL,
  `payment_count` int DEFAULT '0',
  `total_amount` int DEFAULT '0' COMMENT '(단위 : 만원)',
  `recognized_amount` int DEFAULT '0' COMMENT '(단위 : 만원)',
  `relationship` int NOT NULL COMMENT '1: 본인, 2: 배우자',
  PRIMARY KEY (`account_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_relationship` CHECK ((`relationship` in (1,2))),
  CONSTRAINT `chk_type` CHECK ((`type` in (_utf8mb4'청약예금',_utf8mb4'청약부금',_utf8mb4'청약저축',_utf8mb4'주택청약종합저축')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `depth` int NOT NULL DEFAULT '1' COMMENT 'default 1 / 대댓글 : 2',
  `comment_id2` bigint DEFAULT NULL,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  KEY `comment_id2` (`comment_id2`),
  KEY `idx_comment_id` (`comment_id`),
  KEY `FKhvh0e2ybgg16bpu229a5teje7` (`parent_comment_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`comment_id2`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE,
  CONSTRAINT `FKhvh0e2ybgg16bpu229a5teje7` FOREIGN KEY (`parent_comment_id`) REFERENCES `comment` (`comment_id`),
  CONSTRAINT `FKmk3c8pbvysjndxywunibl2voc` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`),
  CONSTRAINT `comment_chk_1` CHECK ((`depth` in (1,2)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `condition01` (
  `condition01_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `birthday` date NOT NULL,
  `si_do` varchar(255) NOT NULL,
  `gun_gu` varchar(255) NOT NULL,
  `transfer_date` date NOT NULL,
  `region_move_in_date` date DEFAULT NULL,
  `metropolitan_area_date` date DEFAULT NULL,
  `is_householder` char(1) NOT NULL COMMENT 'N: 본인이 세대원 / Y : 본인이 세대주',
  `married` int NOT NULL COMMENT '0: 미혼 / 1: 기혼 / 2: 예비신혼부부 / 3: 한부모',
  `married_date` date DEFAULT NULL,
  PRIMARY KEY (`condition01_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `condition01_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_householder` CHECK ((`is_householder` in (_utf8mb4'Y',_utf8mb4'N'))),
  CONSTRAINT `chk_married` CHECK ((`married` in (0,1,2,3)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `condition03` (
  `condition03_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `car_price` int NOT NULL COMMENT '단위 : 만원',
  `property_price` int NOT NULL COMMENT '0 : 미보유 혹은 2억 1,150만원 이하 / 1 : 2억 1,150만원 초과 3억 3,100만원 이하 / 2 : 3억 3,100만원 초과',
  `total_asset` int NOT NULL COMMENT '단위:만원',
  `my_asset` int NOT NULL COMMENT '단위:만원',
  `spouse_asset` int DEFAULT NULL COMMENT '단위:만원',
  `family_average_monthly_income` int NOT NULL COMMENT '단위:만원',
  `previous_year_average_monthly_income` int NOT NULL COMMENT '단워:만원',
  `income_activity` int DEFAULT NULL COMMENT '0 : 외벌이 / 1 : 맞벌이',
  `spouse_average_monthly_income` int DEFAULT NULL COMMENT '단위:만원',
  `income_tax_payment_period` int NOT NULL COMMENT '단위:년',
  `last_winned` date DEFAULT NULL COMMENT '가장 최근에 당첨된 날짜 / 없으면 null',
  `ineligible` date DEFAULT NULL COMMENT '부적격자 판정된 날짜 / 없으면 null',
  PRIMARY KEY (`condition03_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `condition03_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_property_price` CHECK ((`property_price` in (0,1,2)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `detail` (
  `detail_id` bigint NOT NULL AUTO_INCREMENT,
  `house_id` bigint NOT NULL,
  `MODEL_NO` int NOT NULL,
  `house_ty` varchar(255) DEFAULT NULL,
  `suply_ar` decimal(38,2) DEFAULT NULL,
  `SUPLY_HSHLDCO` int NOT NULL DEFAULT '0',
  `SPSPLY_HSHLDCO` int NOT NULL DEFAULT '0' COMMENT '01 전용 / 04는 없어요',
  `MNYCH_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `NWWDS_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `LFE_FRST_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `OLD_PARNTS_SUPORT_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `INSTT_RECOMEND_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `ETC_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `TRANSR_INSTT_ENFSN_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `YGMN_HSHLDCO` int DEFAULT NULL COMMENT '01 전용 // 시행안되는중?인가 왜 0개지',
  `NWBB_HSHLDCO` int DEFAULT NULL COMMENT '01 전용',
  `LTTOT_TOP_AMOUNT` int NOT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `house_id` (`house_id`),
  CONSTRAINT `detail_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13875 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `detail01` (
  `detail01_id` bigint NOT NULL AUTO_INCREMENT,
  `house_id` bigint NOT NULL,
  `house_dtl_secd` varchar(255) DEFAULT NULL,
  `house_dtl_secd_nm` varchar(255) DEFAULT NULL,
  `RENT_SECD` int NOT NULL COMMENT '(0: 분양주택, 1: 분양전환 가능임대)',
  `rent_secd_nm` varchar(255) DEFAULT NULL,
  `subscrpt_area_code` varchar(255) DEFAULT NULL,
  `subscrpt_area_code_nm` varchar(255) DEFAULT NULL,
  `RCEPT_BGNDE` date NOT NULL,
  `RCEPT_ENDDE` date NOT NULL,
  `SPSPLY_RCEPT_BGNDE` date DEFAULT NULL,
  `SPSPLY_RCEPT_ENDDE` date DEFAULT NULL,
  `GNRL_RNK1_CRSPAREA_RCPTDE` date NOT NULL,
  `GNRL_RNK1_CRSPAREA_ENDDE` date NOT NULL,
  `GNRL_RNK1_ETC_GG_RCPTDE` date DEFAULT NULL,
  `GNRL_RNK1_ETC_GG_ENDDE` date DEFAULT NULL,
  `GNRL_RNK1_ETC_AREA_RCPTDE` date DEFAULT NULL,
  `GNRL_RNK1_ETC_AREA_ENDDE` date DEFAULT NULL,
  `GNRL_RNK2_CRSPAREA_RCPTDE` date NOT NULL,
  `GNRL_RNK2_CRSPAREA_ENDDE` date NOT NULL,
  `GNRL_RNK2_ETC_GG_RCPTDE` date DEFAULT NULL,
  `GNRL_RNK2_ETC_GG_ENDDE` date DEFAULT NULL,
  `GNRL_RNK2_ETC_AREA_RCPTDE` date DEFAULT NULL,
  `GNRL_RNK2_ETC_AREA_ENDDE` date DEFAULT NULL,
  `cnstrct_entrps_nm` varchar(255) DEFAULT NULL,
  `SPECLT_RDN_EARTH_AT` char(1) NOT NULL COMMENT 'Y / N',
  `MDAT_TRGET_AREA_SECD` char(1) NOT NULL COMMENT 'Y / N',
  `PARCPRC_ULS_AT` char(1) NOT NULL COMMENT 'Y / N',
  `IMPRMN_BSNS_AT` char(1) NOT NULL COMMENT 'Y / N',
  `PUBLIC_HOUSE_EARTH_AT` char(1) NOT NULL COMMENT 'Y / N',
  `LRSCL_BLDLND_AT` char(1) NOT NULL COMMENT 'Y / N',
  `NPLN_PRVOPR_PUBLIC_HOUSE_AT` char(1) NOT NULL COMMENT 'Y / N',
  `PUBLIC_HOUSE_SPCLW_APPLC_AT` char(1) NOT NULL COMMENT 'Y / N',
  PRIMARY KEY (`detail01_id`),
  KEY `house_id` (`house_id`),
  CONSTRAINT `detail01_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `detail04` (
  `detail04_id` bigint NOT NULL AUTO_INCREMENT,
  `house_id` bigint NOT NULL,
  `SUBSCRPT_RCEPT_BGNDE` date NOT NULL,
  `SUBSCRPT_RCEPT_ENDDE` date NOT NULL,
  `SPSPLY_RCEPT_BGNDE` date DEFAULT NULL,
  `SPSPLY_RCEPT_ENDDE` date DEFAULT NULL,
  `GNRL_RCEPT_BGNDE` date DEFAULT NULL,
  `GNRL_RCEPT_ENDDE` date DEFAULT NULL,
  PRIMARY KEY (`detail04_id`),
  KEY `house_id` (`house_id`),
  CONSTRAINT `detail04_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=945 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `family` (
  `family_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `relationship` int NOT NULL COMMENT '코드로 관리, 노션에 정리 했어요',
  `living_together` int NOT NULL COMMENT '0: 동거 x  /  1: 동거 o   /   2: 배우자와 동거 o',
  `living_together_date` int DEFAULT NULL COMMENT '0 : 1년 미만 / 1 : 1년 이상 3년 미만 / 2 : 3년 이상',
  `birthday` date DEFAULT NULL,
  `is_married` char(1) DEFAULT NULL COMMENT 'Y: 혼인x / N: 혼인o',
  `house_count` int NOT NULL DEFAULT '0',
  `house_sold_date` date DEFAULT NULL COMMENT '날짜 / null 이면 없음',
  `seq_index` int NOT NULL,
  PRIMARY KEY (`family_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `family_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_is_married` CHECK ((`is_married` in (_utf8mb4'Y',_utf8mb4'N'))),
  CONSTRAINT `chk_living_together` CHECK ((`living_together` in (0,1,2))),
  CONSTRAINT `chk_living_together_date` CHECK ((`living_together_date` in (0,1,2)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `house` (
  `house_id` bigint NOT NULL AUTO_INCREMENT,
  `HOUSE_MANAGE_NO` bigint NOT NULL,
  `PBLANC_NO` bigint NOT NULL,
  `house_nm` varchar(255) DEFAULT NULL,
  `house_secd` varchar(255) DEFAULT NULL,
  `house_secd_nm` varchar(255) DEFAULT NULL,
  `hssply_zip` varchar(255) DEFAULT NULL,
  `hssply_adres` varchar(255) DEFAULT NULL,
  `TOT_SUPLY_HSHLDCO` int NOT NULL,
  `RCRIT_PBLANC_DE` date NOT NULL,
  `PRZWNER_PRESNATN_DE` date NOT NULL,
  `CNTRCT_CNCLS_BGNDE` date NOT NULL,
  `CNTRCT_CNCLS_ENDDE` date NOT NULL,
  `hmpg_adres` varchar(255) DEFAULT NULL,
  `bsns_mby_nm` varchar(255) DEFAULT NULL,
  `mdhs_telno` varchar(255) DEFAULT NULL,
  `mvn_prearnge_ym` varchar(255) DEFAULT NULL,
  `pblanc_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`house_id`),
  UNIQUE KEY `HOUSE_MANAGE_NO` (`HOUSE_MANAGE_NO`),
  UNIQUE KEY `PBLANC_NO` (`PBLANC_NO`),
  CONSTRAINT `CHK_HOUSE_SECD` CHECK ((`house_secd` in (_utf8mb4'01',_utf8mb4'04'))),
  CONSTRAINT `CHK_HOUSE_SECD_NM` CHECK ((`house_secd_nm` in (_utf8mb4'APT',_utf8mb4'무순위/잔여세대')))
) ENGINE=InnoDB AUTO_INCREMENT=2962 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `interest` (
  `interest_id` bigint NOT NULL AUTO_INCREMENT,
  `house_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`interest_id`),
  KEY `FKadu5ro6bpwbukrpxll0u8rtax` (`house_id`),
  KEY `FKdg0cowio10tq086oaj1uxv7oe` (`user_id`),
  CONSTRAINT `FKadu5ro6bpwbukrpxll0u8rtax` FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`) ON DELETE CASCADE,
  CONSTRAINT `FKdg0cowio10tq086oaj1uxv7oe` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `notification` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_checked` char(1) NOT NULL DEFAULT 'N',
  `message` text NOT NULL,
  `type` enum('ABOUT_ANNOUNCEMENT','ABOUT_COMMENT','ABOUT_POST') NOT NULL,
  `house_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `FK4vqw3ejha6qv1hlyx4r1j41o2` (`house_id`),
  KEY `FKn1l10g2mvj4r1qs93k952fshe` (`post_id`),
  KEY `FKb0yvoep4h4k92ipon31wmdf7e` (`user_id`),
  CONSTRAINT `FK4vqw3ejha6qv1hlyx4r1j41o2` FOREIGN KEY (`house_id`) REFERENCES `house` (`house_id`) ON DELETE CASCADE,
  CONSTRAINT `FKb0yvoep4h4k92ipon31wmdf7e` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FKn1l10g2mvj4r1qs93k952fshe` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_chk_1` CHECK ((`is_checked` in (_utf8mb4'N',_utf8mb4'Y')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `post` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `subject` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `social_account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf8diiq622py185e6o17ry157u` (`provider_user_id`),
  KEY `FKe077f5rlmayycish4itikihul` (`user_id`),
  CONSTRAINT `FKe077f5rlmayycish4itikihul` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiration_date` datetime(6) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg7im3j7f0g31yhl6qco2iboy5` (`user_id`),
  CONSTRAINT `FKe32ek7ixanakfqsdaokm4q9y2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `create_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `is_social` char(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL,
  `user_verify` tinyint NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UK4bgmpi98dylab6qdvf9xyaxu4` (`phone_number`),
  CONSTRAINT `user_chk_1` CHECK ((`is_social` in (_utf8mb4'N',_utf8mb4'Y'))),
  CONSTRAINT `user_chk_2` CHECK ((`status` between 0 and 1)),
  CONSTRAINT `user_chk_3` CHECK ((`user_verify` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `expiration_date` datetime(6) DEFAULT NULL,
  `is_verified` bit(1) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `verification_type` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `verification_chk_1` CHECK ((`verification_type` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
