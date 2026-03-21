-- MWALAJS DATABASE BACKUP
-- Database: mwala
-- Date: 2026-03-21T13:10:35.034Z


-- Table: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT '2026-03-21 05:21:38',
  `updatedAt` datetime NOT NULL DEFAULT '2026-03-21 05:21:38',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (1,'mmgf','g@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (2,'mmgf','g3@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (3,'mmgf','g5@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (4,'mmgf','g4@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (5,'mmgf','g45@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `user` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (6,'mmgf','g7@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));


-- Table: userh2
DROP TABLE IF EXISTS `userh2`;
CREATE TABLE `userh2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT '2026-03-21 07:36:26',
  `updatedAt` datetime NOT NULL DEFAULT '2026-03-21 07:36:26',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `userh2` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (1,'mmgf','gb@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `userh2` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (2,'mmgf','g@bh.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `userh2` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (3,'mmgf','g5@kh.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `userh2` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (5,'mmgf','g45@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `userh2` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (6,'mmgf','g4@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));


-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT '2026-03-21 05:21:38',
  `updatedAt` datetime NOT NULL DEFAULT '2026-03-21 05:21:38',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (1,'mmgf','gb@h.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `users` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (2,'mmgf','g@bh.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
INSERT INTO `users` (`id`,`name`,`email`,`password`,`age`,`address`,`createdAt`,`updatedAt`) VALUES (3,'mmgf','g5@kh.b','122',11,'vh',Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time),Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));

