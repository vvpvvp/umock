-- MySQL dump 10.13  Distrib 5.6.24, for osx10.8 (x86_64)
--
-- Host: localhost    Database: umock
-- ------------------------------------------------------
-- Server version	5.1.63

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
-- drop database umock IF EXISTS `umock`;
-- create database `umock` character set utf8;
--
-- Table structure for table `mockset`
--

DROP TABLE IF EXISTS `mockset`;

CREATE TABLE `mockset` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `projectId` varchar(10) DEFAULT NULL COMMENT '项目id',
  `url` varchar(100) NOT NULL DEFAULT '' COMMENT 'url',
  `type` varchar(10) DEFAULT NULL COMMENT 'url 类型',
  `tags` varchar(10) DEFAULT NULL COMMENT '标签',
  `summary` varchar(200) DEFAULT NULL COMMENT '简短描述',
  `result` longtext NOT NULL COMMENT '预设返回结果',
  `active` tinyint(1) DEFAULT NULL COMMENT '是否开启拦截',
  `dataHandler` varchar(11) DEFAULT NULL COMMENT 'over覆盖,overlying叠加，拦截类型',
  `createTime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `modifyTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `project`
--

# Dump of table project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '项目名称',
  `uniqueKey` varchar(100) NOT NULL DEFAULT '' COMMENT '唯一标识',
  `identification` varchar(10) DEFAULT '0' COMMENT '1:URL前缀, 0: HEAD参数',
  `rewritePath` varchar(100) DEFAULT NULL COMMENT '删除的前缀',
  `summary` varchar(100) DEFAULT NULL COMMENT '描述',
  `proxy` varchar(100) DEFAULT NULL COMMENT '反向代理地址',
  `swagger` varchar(100) DEFAULT NULL COMMENT 'swagger url',
  `modifyTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `proxys` varchar(5000) DEFAULT NULL COMMENT '反向代理地址列表',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;

/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-29 20:29:10
