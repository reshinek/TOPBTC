/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     9/1/2017 5:54:39 PM                          */
/*==============================================================*/


alter table COININFO 
   drop foreign key FK_COININFO_RELATIONS_COIN;

alter table COINPRICE 
   drop foreign key FK_COINPRIC_RELATIONS_COIN;

alter table EXCHANGEPRICE 
   drop foreign key FK_EXCHANGE_RELATIONS_EXCHANGE;

alter table MARKET 
   drop foreign key FK_MARKET_MARKET_COIN;

alter table MARKET 
   drop foreign key FK_MARKET_MARKET2_EXCHANGE;

drop table if exists COIN;


alter table COININFO 
   drop foreign key FK_COININFO_RELATIONS_COIN;

drop table if exists COININFO;


alter table COINPRICE 
   drop foreign key FK_COINPRIC_RELATIONS_COIN;

drop table if exists COINPRICE;


alter table EXCHANGEPRICE 
   drop foreign key FK_EXCHANGE_RELATIONS_EXCHANGE;

drop table if exists EXCHANGEPRICE;

drop table if exists EXCHANGES;


alter table MARKET 
   drop foreign key FK_MARKET_MARKET_COIN;

alter table MARKET 
   drop foreign key FK_MARKET_MARKET2_EXCHANGE;

drop table if exists MARKET;

/*==============================================================*/
/* Table: COIN                                                  */
/*==============================================================*/
create table COIN
(
   COINID               char(64) not null  comment '',
   NAME_EN              char(64)  comment '',
   NAME_CH              char(64)  comment '',
   CODE                 char(16)  comment '',
   PRICE                float  comment '',
   VOLUME               float  comment '',
   MARKET_CAP           float  comment '',
   AVAILABLE_SUPPLY     float  comment '',
   TOTAL_SUPPLY         float  comment '',
   P1H                  float(8)  comment '',
   P24H                 float(8)  comment '',
   P7D                  float(8)  comment '',
   LAST_UPDATE          timestamp  comment '',
   RANK                 int  comment '',
   ISASSET              bool  comment '',
   primary key (COINID)
);

/*==============================================================*/
/* Table: COININFO                                              */
/*==============================================================*/
create table COININFO
(
   COINID               char(64) not null  comment '',
   AMOUNT               float  comment '',
   INTRODUCTION         text  comment '',
   COUNTRY              char(64)  comment '',
   BLOCKTIME            char(64)  comment '',
   MINEABLE             bool  comment '',
   RELEASE_TIME         char(64)  comment '',
   DIFFICULTY           float  comment '',
   BLOCK_REWARDS        char(64)  comment '',
   COST                 float  comment '',
   ISASSET              bool  comment '',
   EXPLORER             text  comment '',
   WEBSITE              text  comment '',
   MSGBOARD             text  comment ''
);

/*==============================================================*/
/* Table: COINPRICE                                             */
/*==============================================================*/
create table COINPRICE
(
   ID                   int not null  comment '',
   COINID               char(64) not null  comment '',
   PRICE                float  comment '',
   DATE                 timestamp  comment '',
   MARKET_CAP           float  comment '',
   P1H                  float(8)  comment '',
   P7D                  float(8)  comment '',
   P24H                 float(8)  comment '',
   VOLUME               float  comment '',
   RANK                 int  comment '',
   SUPPLY               float  comment '',
   primary key (ID)
);

/*==============================================================*/
/* Table: EXCHANGEPRICE                                         */
/*==============================================================*/
create table EXCHANGEPRICE
(
   EXCHANGEID           char(64) not null  comment '',
   TOTAL_CAP_USD        float  comment ''
);

/*==============================================================*/
/* Table: EXCHANGES                                             */
/*==============================================================*/
create table EXCHANGES
(
   EXCHANGEID           char(64) not null  comment '',
   NAME_EN              char(64)  comment '',
   URL                  char(255)  comment '',
   TOTAL_CAP_USD        float  comment '',
   primary key (EXCHANGEID)
);

/*==============================================================*/
/* Table: MARKET                                                */
/*==============================================================*/
create table MARKET
(
   COINID               char(64) not null  comment '',
   EXCHANGEID           char(64) not null  comment '',
   PAIR                 char(32) not null  comment '',
   VOLUME               float  comment '',
   PRICE                float  comment '',
   DATE                 timestamp  comment '',
   P24                  float(8)  comment '',
   primary key (COINID, EXCHANGEID, PAIR)
);

alter table COININFO add constraint FK_COININFO_RELATIONS_COIN foreign key (COINID)
      references COIN (COINID) on delete restrict on update restrict;

alter table COINPRICE add constraint FK_COINPRIC_RELATIONS_COIN foreign key (COINID)
      references COIN (COINID) on delete restrict on update restrict;

alter table EXCHANGEPRICE add constraint FK_EXCHANGE_RELATIONS_EXCHANGE foreign key (EXCHANGEID)
      references EXCHANGES (EXCHANGEID) on delete restrict on update restrict;

alter table MARKET add constraint FK_MARKET_MARKET_COIN foreign key (COINID)
      references COIN (COINID) on delete restrict on update restrict;

alter table MARKET add constraint FK_MARKET_MARKET2_EXCHANGE foreign key (EXCHANGEID)
      references EXCHANGES (EXCHANGEID) on delete restrict on update restrict;

