-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 15 avr. 2024 à 11:49
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `iat`
--

-- --------------------------------------------------------

--
-- Structure de la table `resultsraw`
--

DROP TABLE IF EXISTS `resultsraw`;
CREATE TABLE IF NOT EXISTS `resultsraw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `numBlock` int(11) NOT NULL,
  `numTrial` int(11) NOT NULL,
  `item` varchar(255) NOT NULL,
  `isLeft` tinyint(1) NOT NULL,
  `accuracy` tinyint(1) NOT NULL,
  `rt` float NOT NULL,
  `exclude` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `resultssummary`
--

DROP TABLE IF EXISTS `resultssummary`;
CREATE TABLE IF NOT EXISTS `resultssummary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `tempsMax` float NOT NULL,
  `endDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `entireExp` tinyint(1) NOT NULL DEFAULT '0',
  `exclude` tinyint(1) NOT NULL DEFAULT '1',
  `meanB3` float DEFAULT NULL,
  `meanB4` float DEFAULT NULL,
  `meanB6` float DEFAULT NULL,
  `meanB7` float DEFAULT NULL,
  `stdB3B6` float DEFAULT NULL,
  `stdB4B7` float DEFAULT NULL,
  `da` float DEFAULT NULL,
  `db` float DEFAULT NULL,
  `dScore` float DEFAULT NULL,
  `percentCorrect` float NOT NULL,
  `propRT300` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `summaryblocks`
--

DROP TABLE IF EXISTS `summaryblocks`;
CREATE TABLE IF NOT EXISTS `summaryblocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `numBlock` int(11) NOT NULL,
  `catLeft` varchar(255) NOT NULL,
  `catRight` varchar(255) NOT NULL,
  `areCatCompatible` int(11) NOT NULL DEFAULT '2',
  `meanCatLeftRT` float NOT NULL,
  `meanCatRightRT` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ic_c` tinyint(4) NOT NULL,
  `os` varchar(255) NOT NULL,
  `device` varchar(255) NOT NULL,
  `startDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
