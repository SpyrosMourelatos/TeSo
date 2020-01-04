CREATE DATABASE IF NOT EXISTS `te_so` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `te_so`;
CREATE TABLE IF NOT EXIST `ActualTotalLoad`(
Id;
EntityCreatedAt;
EntityModifiedAt;
ActionTaskID;
Status;
Year;
Month;
Day;
DateTime;
AreaName;
UpdateTime;
TotalLoadValue;
AreaTypeCodeId;
AreaCodeId;
ResolutionCodeId;
MapCodeId;
RowHash;)

BULK INSERT SchoolsTemp
FROM 'C:\CSVData\Schools.csv'
WITH
(
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',  --CSV field delimiter
    ROWTERMINATOR = '\n',   --Use to shift the control to next row
    TABLOCK
)
