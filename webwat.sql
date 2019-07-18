-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.6-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for webwat
DROP DATABASE IF EXISTS `webwat`;
CREATE DATABASE IF NOT EXISTS `webwat` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `webwat`;

-- Dumping structure for table webwat.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table webwat.categories: ~3 rows (approximately)
DELETE FROM `categories`;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `name`) VALUES
	(1, 'ประชาสัมพันธ์'),
	(2, 'กิจกรรม'),
	(7, 'mflv[');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Dumping structure for table webwat.news
DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table webwat.news: ~0 rows (approximately)
DELETE FROM `news`;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;

-- Dumping structure for table webwat.roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table webwat.roles: ~2 rows (approximately)
DELETE FROM `roles`;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`) VALUES
	(1, 'Admin'),
	(2, 'User');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Dumping structure for table webwat.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table webwat.users: ~3 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `avatar`, `name`, `username`, `password`, `role_id`, `email`, `created_at`, `updated_at`) VALUES
	(1, '/img/150x150.png', 'John Doe', 'admin', '$2b$10$9JJSkZM74p.O4D0BqWSA.eQ5s0D1X9l4uQwqyFkZ68op/Qgkb6Zbu', 1, 'admin@gmail.com', '2019-07-18 22:17:48', '2019-07-18 11:16:11'),
	(2, '/uploads/avatar/2fb5f795-9bce-4366-95ee-caf556e6576d.png', 'Jack Elit', 'satawat', '$2b$10$nyponB1ZOuOmV682H5XUh.vLSL3XjWb6Nuf7bdCpmNXv5tquTNONy', 2, 'elit@gmail.com', '2019-07-18 22:17:56', '2019-07-18 21:59:02'),
	(3, '/uploads/avatar/e058176f-5a2d-4e94-820e-c1afa041d710.png', 'Fuck U', 'u', '$2b$10$rH4Yv0ZpE3U8fza.L97cJ.rvwr.L7l2lut/cx/3vmpN9sypDOvTD6', 1, 'u@abcd.com', '2019-07-18 22:18:07', '2019-07-18 22:12:16');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
