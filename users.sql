-- Table structure
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for table users
DELETE FROM `users`;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `age`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 'mmgf', 'g@h.b', '122', 11, 'vh', Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time), Sat Mar 21 2026 08:21:38 GMT+0300 (East Africa Time));
