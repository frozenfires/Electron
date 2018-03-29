CREATE OR REPLACE PROCEDURE XATCRP.PROC_BALANCE (
    IN IN_DATE	VARCHAR(8),
    IN IN_UNTID	VARCHAR(10),
    OUT OUT_RET	INTEGER )
  SPECIFIC "PROC_BALANCE"
  LANGUAGE SQL
  NOT DETERMINISTIC
  EXTERNAL ACTION
  MODIFIES SQL DATA
  CALLED ON NULL INPUT
  INHERIT SPECIAL REGISTERS
  OLD SAVEPOINT LEVEL
BEGIN
P2:BEGIN ATOMIC
  /*变量定义*/
  DECLARE v_date VARCHAR(8);
  DECLARE v_untid VARCHAR(10);
  DECLARE v_count INTEGER;
  DECLARE v_count_p INTEGER;
  DECLARE v_count_c INTEGER;
  DECLARE v_status VARCHAR(20);
  DECLARE v_ret VARCHAR(20);
  SET v_date = IN_DATE;
  SET v_untid = IN_UNTID;
  SET v_count = 0;
  SET v_count_p = 0;
  SET v_count_c = 0;
  SET OUT_RET = 0;
  /*成功对账--当日记录满足六大条件的被认为是对账成功，置对账状态为1,对账平*/
  UPDATE BALANCE_P A
     SET A.COMPFLAG=1,
         A.RET='对账平',
         A.EXPLAIN='对账平'
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_C B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
                     
  UPDATE BALANCE_C A
     SET A.COMPFLAG=1,
         A.RET='对账平',
         A.EXPLAIN='对账平'
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_P B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
         
  /*差错账--当日记录满足唯一标识条件但是内容不一致的被认为是差错账，置对账状态为2*/
  UPDATE BALANCE_P A
     SET A.COMPFLAG=2,
         A.RET='金额错',
         A.EXPLAIN='前置金额为:'||A.TRANAMT
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_C B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT <> A.TRANAMT
                     AND B.UNTID = v_untid 
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
                     
  UPDATE BALANCE_C A
     SET A.COMPFLAG=2,
         A.RET='金额错',
         A.EXPLAIN='终端金额为:'||A.TRANAMT
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_P B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT <> A.TRANAMT
                     AND B.UNTID = v_untid
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
               
  UPDATE BALANCE_P A
     SET A.COMPFLAG=2,
         A.RET='卡号错',
         A.EXPLAIN='前置卡号为:'||A.CARDNO
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_C B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO <> A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid 
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
                     
  UPDATE BALANCE_C A
     SET A.COMPFLAG=2,
         A.RET='卡号错',
         A.EXPLAIN='终端卡号为:'||A.CARDNO
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_P B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO <> A.CARDNO
                     AND B.TRANCODE = A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;      
         
  UPDATE BALANCE_P A
     SET A.COMPFLAG=2,
         A.RET='交易码错',
         A.EXPLAIN='前置交易码为:'||A.TRANCODE
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_C B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE <> A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid 
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
                     
  UPDATE BALANCE_C A
     SET A.COMPFLAG=2,
         A.RET='交易码错',
         A.EXPLAIN='终端交易码为:'||A.TRANCODE
   WHERE EXISTS ( SELECT 8 
                    FROM BALANCE_P B
                   WHERE B.UNTID = A.UNTID
                     AND B.TSPTRANCNUM = A.TSPTRANCNUM
                     AND B.TRANCDATE = A.TRANCDATE
                     AND B.CARDNO = A.CARDNO
                     AND B.TRANCODE <> A.TRANCODE
                     AND B.TRANAMT = A.TRANAMT
                     AND B.UNTID = v_untid
                     AND B.TRANCDATE = v_date)
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;  
         
  /*P端单边帐--P表中有但C表中没有的数据，置对账状态为3*/
  UPDATE BALANCE_P A
     SET A.COMPFLAG=3,
         A.RET='前置单边帐',
         A.EXPLAIN='前置有该交易而终端没有'
   WHERE NOT EXISTS ( SELECT 8 
                        FROM BALANCE_C B
                       WHERE B.UNTID = A.UNTID
                         AND B.TSPTRANCNUM = A.TSPTRANCNUM
                         AND B.TRANCDATE = A.TRANCDATE
                         AND B.UNTID = v_untid
                         AND B.TRANCDATE = v_date )
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
         
  /*C端单边帐--C表中有但P表中没有的数据，置对账状态为3*/
  UPDATE BALANCE_C A
     SET A.COMPFLAG=3,
         A.RET='终端单边帐',
         A.EXPLAIN='终端有该交易而前置没有'
   WHERE NOT EXISTS ( SELECT 8 
                        FROM BALANCE_P B
                       WHERE B.UNTID = A.UNTID
                         AND B.TSPTRANCNUM = A.TSPTRANCNUM
                         AND B.TRANCDATE = A.TRANCDATE
                         AND B.UNTID = v_untid
                         AND B.TRANCDATE = v_date )
         AND A.UNTID = v_untid
         AND A.TRANCDATE = v_date;
         
  /*检查Ｐ表是否完成对账--即是否还有状态为0的记录*/
  SELECT COUNT(*) INTO v_count_p
    FROM BALANCE_P
   WHERE COMPFLAG = 0
     AND UNTID = v_untid
     AND TRANCDATE = v_date;
  IF v_count_p > 0 THEN
     SET OUT_RET = 1; /*对账失败，还有未对账记录*/
     SET v_status = '未对账';
  ELSE
     SET OUT_RET = 0;
     SET v_status = '已对账';
  END IF;
  
  /*检查Ｃ表是否完成对账--即是否还有状态为0的记录*/
  SELECT COUNT(*) INTO v_count_c
    FROM BALANCE_C
   WHERE COMPFLAG = 0
     AND UNTID = v_untid
     AND TRANCDATE = v_date;
  IF v_count_c > 0 THEN
    SET OUT_RET = 1; /*对账失败，还有未对账记录*/
    SET v_status = '未对账';
  ELSE
    SET OUT_RET = 0;
    SET v_status = '已对账';
  END IF;
  
  /*检查对账结果,是否对账一致*/
  SELECT A.CNT+B.CNT INTO v_count
    FROM (SELECT COUNT(*) AS CNT FROM BALANCE_P WHERE COMPFLAG<>1 AND UNTID = v_untid AND TRANCDATE = v_date) A,
         (SELECT COUNT(*) AS CNT FROM BALANCE_C WHERE COMPFLAG<>1 AND UNTID = v_untid AND TRANCDATE = v_date) B;
         
  IF v_count > 0 THEN
    SET v_ret='对账不一致';
  ELSE
    SET v_ret='对账一致';
  END IF;
  
  /*更新或新增状态表*/
  IF EXISTS (SELECT * FROM BALANCE_DATE WHERE TRANCDATE = v_date ) THEN
    UPDATE BALANCE_DATE
       SET STATUS=v_status,
           RET=v_ret
     WHERE UNTID = v_untid
       AND TRANCDATE = v_date;
  ELSE
    INSERT INTO BALANCE_DATE VALUES ( v_untid,v_date,v_status,v_ret);
  END IF;
END P2;
COMMIT;
END;