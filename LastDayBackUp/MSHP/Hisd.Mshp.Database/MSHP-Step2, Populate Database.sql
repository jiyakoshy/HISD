/* Step #2 Populate Database */
USE MSHP
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Calendar](
	[CalendarID] [int] IDENTITY(1,1) NOT NULL,
	[SchoolYear] [varchar](10) NOT NULL,
	[CompareDaySeq] [int] NOT NULL,
	[InstructionDay] [int] NULL,
	[ReportDate] [datetime] NULL,
	[PlanNotes] [varchar](2000) NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [varchar](50) NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
    CONSTRAINT [PK_Calendar] PRIMARY KEY CLUSTERED([CalendarID] ASC)
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[CampusEnrollment](
	[CampusEnrollmentID] [int] IDENTITY(1,1) NOT NULL,
	[CampusProfileID] [int] NOT NULL,
	[CalendarID] [int] NOT NULL,
	[CompareDaySeq] [int] NOT NULL,
	[IEE] [int] NULL,[IPK] [int] NULL,[IKG] [int] NULL,[I01] [int] NULL,[I02] [int] NULL,[I03] [int] NULL,[I04] [int] NULL,[I05] [int] NULL,
	[I06] [int] NULL,[I07] [int] NULL,[I08] [int] NULL,[I09] [int] NULL,[I10] [int] NULL,[I11] [int] NULL,[I12] [int] NULL,
	[Total] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [varchar](50) NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	CONSTRAINT [PK_CampusEnrollment] PRIMARY KEY CLUSTERED([CampusEnrollmentID] ASC)
	WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[CampusProfile](
	[CampusProfileID] [int] IDENTITY(1,1) NOT NULL,
	[CalendarID] [int] NOT NULL,
	[OrganizationGroupID] [int] NULL,
	[SchoolYear] [varchar](10) NULL,
	[CampusNumber] [varchar](10) NULL,
	[Capacity] [int] NULL,
	[Projection] [int] NULL,
	[Snapshot] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CreatedBy] [varchar](50) NULL,
	[UpdatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](50) NULL,
	CONSTRAINT [PK_CampusProfile] PRIMARY KEY CLUSTERED([CampusProfileID] ASC)
	WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[OrganizationGroup](
	[OrganizationGroupID] [int] IDENTITY(101,1) NOT NULL,
	[CalendarID] [int] NOT NULL,
	[SchoolYear] [varchar](10) NULL,
	[ShortDescription] [varchar](10) NULL,
	[Description] [varchar](50) NULL,
	[IsOrganizationGroup] [bit] NULL,
	[DisplayOrder] [int] NULL,
	CONSTRAINT [PK_OrganizationGroups] PRIMARY KEY CLUSTERED([OrganizationGroupID] ASC)
	WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


SET ANSI_PADDING OFF
GO
ALTER TABLE [dbo].[Calendar] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Calendar] ADD  DEFAULT (getdate()) FOR [UpdatedDate]
GO
ALTER TABLE [dbo].[CampusEnrollment] ADD  CONSTRAINT [DF_CampusEnrollment_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[CampusEnrollment] ADD  CONSTRAINT [DF_CampusEnrollment_UpdatedDate]  DEFAULT (getdate()) FOR [UpdatedDate]
GO
ALTER TABLE [dbo].[CampusProfile] ADD  CONSTRAINT [DF__CampusProfile__CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[CampusProfile] ADD  CONSTRAINT [DF__CampusProfile__UpdatedDate]  DEFAULT (getdate()) FOR [UpdatedDate]
GO
ALTER TABLE [dbo].[CampusEnrollment]  WITH CHECK ADD  CONSTRAINT [FK_CampusEnrollment_Calendar] FOREIGN KEY([CalendarID])
REFERENCES [dbo].[Calendar] ([CalendarID])
GO
ALTER TABLE [dbo].[CampusEnrollment] CHECK CONSTRAINT [FK_CampusEnrollment_Calendar]
GO
ALTER TABLE [dbo].[CampusEnrollment]  WITH CHECK ADD  CONSTRAINT [FK_CampusEnrollment_CampusProfile] FOREIGN KEY([CampusProfileID])
REFERENCES [dbo].[CampusProfile] ([CampusProfileID])
GO
ALTER TABLE [dbo].[CampusEnrollment] CHECK CONSTRAINT [FK_CampusEnrollment_CampusProfile]
GO
ALTER TABLE [dbo].[CampusProfile]  WITH CHECK ADD  CONSTRAINT [FK_CampusProfile_Calendar] FOREIGN KEY([CalendarID])
REFERENCES [dbo].[Calendar] ([CalendarID])
GO
ALTER TABLE [dbo].[CampusProfile] CHECK CONSTRAINT [FK_CampusProfile_Calendar]
GO
ALTER TABLE [dbo].[CampusProfile]  WITH CHECK ADD  CONSTRAINT [FK_CampusProfile_OrganizationGroup] FOREIGN KEY([OrganizationGroupID])
REFERENCES [dbo].[OrganizationGroup] ([OrganizationGroupID])
GO
ALTER TABLE [dbo].[CampusProfile] CHECK CONSTRAINT [FK_CampusProfile_OrganizationGroup]
GO
ALTER TABLE [dbo].[OrganizationGroup]  WITH CHECK ADD  CONSTRAINT [FK_OrganizationGroup_Calendar] FOREIGN KEY([CalendarID])
REFERENCES [dbo].[Calendar] ([CalendarID])
GO
ALTER TABLE [dbo].[OrganizationGroup] CHECK CONSTRAINT [FK_OrganizationGroup_Calendar]
GO




INSERT INTO dbo.Calendar
(
	 SchoolYear
	,CompareDaySeq
	,InstructionDay
	,ReportDate
	,PlanNotes
	,CreatedDate
	,CreatedBy
	,UpdatedDate
	,UpdatedBy
)
(
SELECT 
	RTRIM([SchoolYear])
	,[CompareDaySeq]
	,[InstructionDay]
	,[ReportDate]
	,[PlanNotes]
	,[CreatedDate]
	,[CreatedBy]
	,[ModifiedDate]
	,[ModifiedBy]
  FROM [MSHP_Prod].[dbo].[MSHPtbRptCalendar]
)
GO  --(495 row(s) affected)




INSERT INTO [dbo].[OrganizationGroup]
(   
	 CalendarID
    ,SchoolYear
    ,ShortDescription
    ,[Description]
    ,IsOrganizationGroup
    ,DisplayOrder
)
(
SELECT 
	(
		SELECT top 1 CalendarID
		FROM dbo.Calendar 
		WHERE RTRIM(SchoolYear)=RTRIM(mcg.SchoolYear)
	)AS CalendarID	 
    ,RTRIM([SchoolYear])
    ,[ShortDescription]
    ,[Description]
    ,[ActiveGroup]
    ,[DisplayOrder]
FROM [MSHP_Prod].[dbo].[MSHPtbCampusGrouping] mcg
)
GO --(75 row(s) affected)


INSERT INTO dbo.CampusProfile
(	 CalendarID
	,OrganizationGroupID
	,CampusNumber
	,SchoolYear
	,Capacity
	,Projection
	,[Snapshot]
	,CreatedDate,CreatedBy,UpdatedDate,UpdatedBy
)
(
SELECT 
	(
		SELECT top 1 CalendarID
		FROM dbo.Calendar 
		WHERE RTRIM(mcp.[SchoolYear])=RTRIM(SchoolYear)
	)AS CalendarID
	,(
		SELECT top 1 OrganizationGroupID
		FROM dbo.OrganizationGroup 
		WHERE mcp.[GroupingID]=OrganizationGroupID
	)AS OrganizationGroupID
    ,RTRIM(mcp.[CampusID])
	,RTRIM(mcp.[SchoolYear])
	,mcp.[Capacity]
	,mcp.[Projection]
	,[LastSchoolYearSnapShot]
	,[CreatedDate],[CreatedBy],[LastModifiedDate],[LastModifiedBy]
  FROM [MSHP_Prod].[dbo].[MSHPtbCampusProfile] mcp
)
GO --(4769 row(s) affected)




INSERT INTO dbo.CampusEnrollment
(	 CampusProfileID
    ,CalendarID
	,CompareDaySeq
	,IEE,IPK,IKG,I01,I02,I03,I04,I05,I06,I07,I08,I09,I10,I11,I12
	,Total,CreatedDate,CreatedBy,UpdatedDate,UpdatedBy
)
(
SELECT 
	(
		SELECT [CampusProfileID]
		FROM [dbo].[CampusProfile]
		WHERE RTRIM(SchoolYear)=RTRIM(mcp.SchoolYear)AND RTRIM(CampusNumber)=RTRIM(mcp.CampusID)
	)AS CampusProfileID
	,(
		SELECT [CalendarID]
		FROM [dbo].[Calendar] 
		WHERE  RTRIM(SchoolYear)=RTRIM(mei.SchoolYear)AND CompareDaySeq=mei.CompareDaySeq
	)AS CalendarID
    ,[CompareDaySeq]
	,mei.[EE],mei.[PK],mei.[KG],mei.[01],mei.[02],mei.[03],mei.[04],mei.[05],mei.[06],mei.[07],mei.[08],mei.[09],mei.[10],mei.[11],mei.[12]
	,[Total],[DateCreated],mei.[CreatedBy],[LastModified],mei.[LastModifiedBy]
	FROM [MSHP_Prod].[dbo].[MSHPtbEnrollmentInput] mei 
	INNER JOIN [MSHP_Prod].[dbo].[MSHPtbCampusProfile] mcp ON RTRIM(mcp.CampusID)=RTRIM(mei.CampusID)AND mcp.SchoolYear=mei.SchoolYear
)
GO  --(121928 row(s) affected)



ALTER TABLE [dbo].[CampusProfile]
DROP COLUMN [SchoolYear];
GO


ALTER TABLE [dbo].[CampusEnrollment]
DROP COLUMN [CompareDaySeq];
GO





SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetDetailReport]
@SchoolYear Varchar(10),
@CompareDaySeq Int,
@OrganizationGroupID Int,
@CampusNumber Varchar(10) 
AS
BEGIN
	Set Nocount on
	If object_id('#t1') is not null Drop Table #t1	
	If object_id('#t2') is not null Drop Table #t2	
	If object_id('#t3') is not null Drop Table #t3	
	If object_id('#t4') is not null Drop Table #t4

	Declare @rd Datetime
 	Set @rd=(Select ReportDate From dbo.Calendar Where dbo.Calendar.CompareDaySeq=@CompareDaySeq and SchoolYear=@SchoolYear)
	Declare @LastSchoolYear varchar(10)
	Set @LastSchoolYear=(Select Top 1 SchoolYear
						 From dbo.Calendar
						 Where SchoolYear IN(Select Distinct Top 2 SchoolYear From dbo.Calendar Order By SchoolYear Desc)
						 Order By SchoolYear ASC)
	Select
		cp.CampusNumber, c.SchoolYear, c.CompareDaySeq, c.ReportDate, c.InstructionDay,
		ce.IEE, ce.IPK, ce.IKG, ce.I01, ce.I02, ce.I03, ce.I04, ce.I05, ce.I06, ce.I07, ce.I08, ce.I09, ce.I10, ce.I11, ce.I12, ce.Total, 
		cp.OrganizationGroupID as LevelGroupID,
		LevelGroup=(Select [Description] From OrganizationGroup g Where cp.OrganizationGroupID=g.OrganizationGroupID), --this is the label to be displayed in the report
		cp.Capacity, cp.Projection, cp.[SnapShot] as PrevSnapshot, 		  		  
		@LastSchoolYear as LastYear, 0 as LastYearCapacity, 0 as LastYearEnrollment, 
		ce.CreatedDate, ce.UpdatedDate, og.DisplayOrder
	Into #t1
	From
		Calendar c 
		Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID
		Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID 
		Inner join OrganizationGroup og	on og.OrganizationGroupID = cp.OrganizationGroupID
	Where     
		(c.SchoolYear = @SchoolYear) AND (c.CompareDaySeq = @CompareDaySeq)
	--select * from #t1


	Select
		cp.CampusNumber, c.SchoolYear, CompareDaySeq=@CompareDaySeq, ReportDate=@rd, InstructionDay=(Select InstructionDay From Calendar c Where c.CompareDaySeq = @CompareDaySeq and SchoolYear=@SchoolYear),		  
		0 as IEE, 0 as IPK, 0 as IKG, 0 as I01, 0 as I02, 0 as I03, 0 as I04, 0 as I05, 0 as I06, 0 as I07, 0 as I08, 0 as I09, 0 as I10, 0 as I11, 0 as I12,0 as Total, 
		cp.OrganizationGroupID as LevelGroupID, 
		LevelGroup=(Select [Description] from OrganizationGroup g Where cp.OrganizationGroupID=g.OrganizationGroupID), --this is the label to be displayed in the report
		cp.Capacity, cp.Projection, cp.[SnapShot] as PrevSnapshot, 
		@LastSchoolYear as LastYear, 0 as LastYearCapacity, 0 as LastYearEnrollment,
		GetDate() as CreatedDate, GetDate() as UpdatedDate, DisplayOrder=(Select DisplayOrder from OrganizationGroup g Where cp.OrganizationGroupID=g.OrganizationGroupID)
	Into #t3
	From         
		Calendar c 
		Inner join CampusProfile cp on c.CalendarID = cp.CalendarID
	Where 
		(c.SchoolYear = @SchoolYear) and(cp.CampusNumber Not in(Select CampusNumber From #t1))
	--select * from #t3

	Select * 
	Into #t4 From #t1
	Union 
	Select * From #t3 Select cp.CampusNumber, cp.Capacity, cp.OrganizationGroupId as LevelGroupId
	Into #t2 	
	From Calendar c Inner join CampusProfile cp on c.calendarid = cp.CalendarID where c.SchoolYear=@LastSchoolYear
	--Select * From #t2

	Update #t4 
	Set LastYearCapacity=(select isnull(#t2.Capacity,0) from #t2 where #t2.CampusNumber=#t4.CampusNumber)
	Where Exists(Select #t2.CampusNumber
				 From #t2
				 Where #t2.CampusNumber = #t4.CampusNumber);	 


	If (@SchoolYear='2014-2015' and @CompareDaySeq=26)---Get the LastYearEnrollmentInput for this schoolyear 2014-2015, on snapshot day 10-31-2014. This particular data is same as the 10-24-2014(Comparedayseq = 25).
	Begin
		Update #t4
		Set LastYearEnrollment=(Select IsNull(Total,0) 
								From Calendar c 
									 Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
									 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID 
								Where cp.CampusNumber=#t4.CampusNumber and c.SchoolYear = @LastSchoolYear and c.CompareDaySeq=@CompareDaySeq - 1)
		Where Exists(Select cp.CampusNumber
					 From CampusEnrollment ce 
						  Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
					 Where cp.CampusNumber=#t4.CampusNumber and SchoolYear=@LastSchoolYear And CompareDaySeq=@CompareDaySeq - 1)
	End
	Else
		If (@SchoolYear='2015-2016' and @CompareDaySeq=6)   --CALENDAR ISSUE: August 31,2015 has no data for 2014-15 membership (Detail Report). Use data for Day 7 of previous year (9-02-2014) for this day. The labels should remain "Day #6".
		Begin
			Update #t4
			Set LastYearEnrollment=(Select IsNull(Total,0) 
									From Calendar c 
										 Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
										 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
									Where cp.CampusNumber=#t4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq + 1)
			Where Exists(Select cp.CampusNumber
						 From Calendar c 
							  Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
							  Inner join CampusProfile cp ON ce.CampusProfileID = cp.CampusProfileID
						 Where cp.CampusNumber=#t4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq + 1)
		End	
	Else
	Begin
		Update #t4
		Set LastYearEnrollment=(Select IsNull(Total,0) 
								From Calendar c inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
									 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
								Where cp.CampusNumber=#t4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq)
		Where Exists(Select cp.CampusNumber
					 From Calendar c inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
						  Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
					 Where cp.CampusNumber=#t4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq)
	End
    --select * from #t4

--------------------------------		

	If @SchoolYear IN('2003-2004','2004-2005','2005-2006','2006-2007','2007-2008','2008-2009','2009-2010','2010-2011')
	Begin    --2011/08/29: Logic used to group schools before 2011-2012 can be deprecated since this hard-coded rule has been ported to table organizationGroup and CampusProfile 'OrganizationGroupgID' column.
		Update #t4 Set LevelGroup='ES'
		Where (CampusNumber >= '100')or CampusNumber in('039','058','071','074','080')

		Update #t4 Set LevelGroup='MS'
		Where (CampusNumber > '040' and CampusNumber <='099')or CampusNumber in('163','300','334','337','340','456')

		Update #t4 Set LevelGroup='HS'
		Where (CampusNumber <= '040' 
			   or CampusNumber in('301','303','308','309','310','316','322','323','345','348','349','451','452','454')) 
			   and CampusNumber not in('039') 

		Update #t4 Set LevelGroup='AT'
		Where (CampusNumber in('013','029','038','069','093','094','097','100','200','300','303',
							   '311','312','316','320','321','324','326','327','328','329','332','339','342','343',
							   '350','364','366','371','376','378','387','390','392','453','455','607'))

		If (@OrganizationGroupID = 0 and @CampusNumber is null) --GetDetailLevelAll()
		Begin
			Select 
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Order By DisplayOrder, LevelGroupID, CampusNumber
		End
		Else If (@OrganizationGroupID <> 0) --GetDetailLevelOrganizationGroup()
		Begin
			Select 
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Order By CampusNumber
		End
		Else If (@CampusNumber is not null)  --GetDetailLevelCampus()
		Begin
			Select 
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Where CampusNumber =@CampusNumber
		End
	End
	Else 
	Begin  --New logic used to group schools starting SY 2011-2012
		If (@OrganizationGroupID = 0 and @CampusNumber is null) --GetDetailLevelAll()
		Begin
			Select 
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,	  
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Where 
			LevelGroupID Not in(Select OrganizationGroupID From OrganizationGroup Where SchoolYear=@SchoolYear and IsOrganizationGroup=0)
			and LevelGroupID>0
			Order By DisplayOrder, LevelGroupID, CampusNumber
		End
		Else If (@OrganizationGroupID <> 0) --GetDetailLevelOrganizationGroup()
		Begin
			Select
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Where LevelGroupID in(Select OrganizationGroupID from OrganizationGroup Where SchoolYear=@SchoolYear and OrganizationGroupID=@OrganizationGroupID and IsOrganizationGroup=1)
			Order By CampusNumber
		End
		Else If (@CampusNumber is not null)  --GetDetailLevelCampus()
		Begin
			Select 
			  CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			  LevelGroupID, LevelGroup,
			  IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			  Capacity, Projection, PrevSnapshot,
			  LastYear, LastYearCapacity, LastYearEnrollment,CreatedDate, UpdatedDate
			From #t4
			Where CampusNumber =@CampusNumber
		End
	End
	--select * from #t4
	If object_id('#t1') is not null Drop Table #t1
	If object_id('#t2') is not null Drop Table #t2
	If object_id('#t3') is not null Drop Table #t3
	If object_id('#t4') is not null Drop Table #t4
END
/*
[GetDetailReport] '2007-2008',2,0,null
[GetDetailReport] '2010-2011',3,0,null
[GetDetailReport] '2010-2011',11,0,null
[GetDetailReport] '2010-2011',12,0,null 
[GetDetailReport] '2011-2012',4,0,null
[GetDetailReport] '2011-2012',11,0,null --Report date is null
[GetDetailReport] '2011-2012',12,0,null
[GetDetailReport] '2012-2013',1,0,null
[GetDetailReport] '2014-2015',1,0,null
[GetDetailReport] '2014-2015',26,0,null  --RE @SchoolYear='2014-2015' and @CompareDaySeq=26
[GetDetailReport] '2015-2016',1,0,null
[GetDetailReport] '2015-2016',6,0,null
[GetDetailReport] '2016-2017',1,0,null
[GetDetailReport] '2017-2018',22,0,null
[GetDetailReport] '2017-2018',30,0,null

[GetDetailReport] '2015-2016', 6,161, null
[GetDetailReport] '2015-2016', 6,0, 102
*/







GO
CREATE PROCEDURE [dbo].[GetSummaryAndDetailReport]
@SchoolYear Varchar(10),
@CompareDaySeq Int 
AS
BEGIN
	Set Nocount on
	If object_id('#tt1') is not null Drop Table #tt1	
	If object_id('#tt2') is not null Drop Table #tt2	
	If object_id('#tt3') is not null Drop Table #tt3	
	If object_id('#tt4') is not null Drop Table #tt4	
	
	Declare @rd Datetime
 	Set @rd=(Select ReportDate From dbo.Calendar Where dbo.Calendar.CompareDaySeq=@CompareDaySeq and SchoolYear=@SchoolYear) 
	Declare @LastSchoolYear Varchar(10)
	Set @LastSchoolYear=(Select Top 1 SchoolYear 
						 From dbo.Calendar 
						 Where SchoolYear in(Select Distinct Top 2 SchoolYear From dbo.Calendar Order By SchoolYear Desc)
						 Order By SchoolYear Asc)
	Select
		  cp.CampusNumber, c.SchoolYear, c.CompareDaySeq, c.ReportDate, c.InstructionDay,
		  cp.OrganizationGroupID as LevelGroupID, Space(20) as LevelGroup,				--this is the label to be displayed in the report
		  ce.IEE, ce.IPK, ce.IKG, ce.I01, ce.I02, ce.I03, ce.I04, ce.I05, ce.I06, ce.I07, ce.I08, ce.I09, ce.I10, ce.I11, ce.I12, ce.Total, 		  
		  cp.Capacity, cp.Projection, cp.[SnapShot] as PrevSnapshot, 		  		  
		  @LastSchoolYear as LastYear, 0 as LastYearCapacity, 0 as LastYearEnrollment, ce.CreatedDate, ce.UpdatedDate
	Into #tt1
	From    
		Calendar c 
		Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID
		Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID 
		Inner join OrganizationGroup og	on og.OrganizationGroupID = cp.OrganizationGroupID
	Where     
		(c.SchoolYear = @SchoolYear) and(c.CompareDaySeq = @CompareDaySeq)
	--select * from #tt1

	Select
		  cp.CampusNumber, c.SchoolYear, CompareDaySeq=@CompareDaySeq, ReportDate=@rd, InstructionDay=(Select InstructionDay From Calendar c where c.CompareDaySeq = @CompareDaySeq and SchoolYear=@SchoolYear),
		  cp.OrganizationGroupID as LevelGroupID, Space(20) as LevelGroup,
		  0 as IEE, 0 as IPK, 0 as IKG, 0 as I01, 0 as I02, 0 as I03, 0 as I04, 0 as I05, 0 as I06, 0 as I07, 0 as I08, 0 as I09, 0 as I10, 0 as I11, 0 as I12,0 as Total, 		  
		  cp.Capacity, cp.Projection, cp.[SnapShot] as PrevSnapshot, 
		  @LastSchoolYear as LastYear, 0 as LastYearCapacity, 0 as LastYearEnrollment, GetDate() as CreatedDate, GetDate() as UpdatedDate
	Into #tt3
	From         
		Calendar c 
		Inner join CampusProfile cp on c.CalendarID = cp.CalendarID
	Where     
		(c.SchoolYear = @SchoolYear) and(cp.CampusNumber Not in(Select CampusNumber From #tt1))
	--select * from #tt3

	Select * Into #tt4 From #tt1
	Union
	Select * From #tt3 Select cp.CampusNumber, cp.Capacity, cp.OrganizationGroupID as LevelGroupID
	Into #tt2 
	From Calendar c Inner join CampusProfile cp on c.CalendarID = cp.CalendarID Where c.SchoolYear=@LastSchoolYear 
	--select * from #tt2

	Update #tt4 
	Set LastYearCapacity=(Select IsNull(#tt2.Capacity,0) From #tt2 Where #tt2.CampusNumber=#tt4.CampusNumber)
	Where EXISTS(Select #tt2.CampusNumber 
				 From #tt2 
				 Where #tt2.CampusNumber = #tt4.CampusNumber)	 

	If (@SchoolYear = '2014-2015' and @CompareDaySeq = 26)---Get the LastYearEnrollmentInput for this schoolyear 2014-2015, on snapshot day 10-31-2014. This particular data is same as the 10-24-2014(Comparedayseq = 25).
	Begin
		Update #tt4
		Set LastYearEnrollment=(Select IsNull(Total,0) 
								From Calendar c 
									 Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
									 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID  
								Where cp.CampusNumber=#tt4.CampusNumber and SchoolYear=@LastSchoolYear and CompareDaySeq=@CompareDaySeq - 1)
		Where EXISTS(Select cp.CampusNumber
					 From CampusEnrollment ce 
						  Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
					 Where cp.CampusNumber=#tt4.CampusNumber and SchoolYear=@LastSchoolYear and CompareDaySeq=@CompareDaySeq - 1);
	End	
	Else
		If (@SchoolYear = '2015-2016' and @CompareDaySeq = 6) --CALENDAR ISSUE: August 31,2015 has no data for 2014-15 membership (Detail Report). Use data for Day 7 of previous year (9-02-2014) for this day. The labels should remain “Day #6”.	
		Begin
			Update #tt4
			Set LastYearEnrollment=(Select IsNull(Total,0) 
									From Calendar c 
										 Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
										 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
									Where cp.CampusNumber=#tt4.CampusNumber and SchoolYear=@LastSchoolYear and CompareDaySeq=@CompareDaySeq + 1)
			Where Exists(Select cp.CampusNumber
						 From Calendar c Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
							  Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
						 Where cp.CampusNumber=#tt4.CampusNumber and SchoolYear=@LastSchoolYear and CompareDaySeq=@CompareDaySeq + 1);
		End
	Else
	Begin
		Update #tt4
		Set LastYearEnrollment=(Select IsNull(Total,0) 
								From Calendar c Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
									 Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
								Where cp.CampusNumber=#tt4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq)
		Where Exists(Select cp.CampusNumber
					 From Calendar c Inner join CampusEnrollment ce on c.CalendarID = ce.CalendarID 
						  Inner join CampusProfile cp on ce.CampusProfileID = cp.CampusProfileID
					 Where cp.CampusNumber=#tt4.CampusNumber and c.SchoolYear=@LastSchoolYear and c.CompareDaySeq=@CompareDaySeq);
	End
	--select * from #tt4

--------------------------------		

	If @SchoolYear in('2003-2004','2004-2005','2005-2006','2006-2007','2007-2008','2008-2009','2009-2010','2010-2011')
	Begin 
		Update #tt4 Set LevelGroup='ES'
		Where (CampusNumber >= '100')or CampusNumber in('039','058','071','074','080')

		Update #tt4 Set LevelGroup='MS'
		Where (CampusNumber > '040' and CampusNumber <='099')or CampusNumber in('163', '300', '334','337','340','456')

		Update #tt4 Set LevelGroup='HS'
		Where (CampusNumber <= '040' or CampusNumber in('301','303','308','309','310','316','322','323','345','348','349','451','452','454'))and CampusNumber not in ('039')

		Update #tt4 Set LevelGroup='AT'
		Where (CampusNumber in('013','029','038','069','093','094','097','100','200','300','303',
							   '311','312','316','320','321','324','326','327','328','329','332','339','342','343',
							   '350','364','366','371','376','378','387','390','392','453','455','607'))
		Select * From #tt4
		Order by SchoolYear, CampusNumber
	End
	Else If @SchoolYear IN('2011-2012','2012-2013','2013-2014','2014-2015')--logic used to group schools starting SY 2011-2012
		 Begin 
			Update #tt4 
			Set LevelGroup= CASE 
			When(Select og.OrganizationGroupID as LevelGroupID
				 From OrganizationGroup og 
					  Inner join CampusProfile cp on og.OrganizationGroupID = cp.OrganizationGroupID 
					  Inner join Calendar c on c.CalendarID = cp.CalendarID
				 Where c.SchoolYear=@SchoolYear and cp.CampusNumber=#tt4.CampusNumber)
			In(135,140,143,144,147,150,151,152) 
			Then 'ELEMENTARY SCHOOL'

			When(Select og.OrganizationGroupID as LevelGroupID 
				 From OrganizationGroup og 
					  Inner join CampusProfile cp on og.OrganizationGroupID = cp.OrganizationGroupID 
					  Inner join Calendar c on c.CalendarID = cp.CalendarID
				 Where c.SchoolYear=@SchoolYear and cp.CampusNumber=#tt4.CampusNumber)
			In(134,139,146,153) 
			Then 'MIDDLE SCHOOL'

			When(Select og.OrganizationGroupID as LevelGroupID
				 From OrganizationGroup og 
					  Inner join CampusProfile cp on og.OrganizationGroupID = cp.OrganizationGroupID 
					  Inner join Calendar c on c.CalendarID = cp.CalendarID
				 Where c.SchoolYear=@SchoolYear and cp.CampusNumber=#tt4.CampusNumber)
			In(133,138,145,154)
			Then 'HIGH SCHOOL'
			Else 'N/A'
		  End

			Update #tt4 
			Set LevelGroupID = Case 
				When LevelGroup Like '%ELEMENTARY%' Then 1
				When LevelGroup Like '%MIDDLE%' Then 2
				When LevelGroup Like '%HIGH%' Then 3
			End
		  
			Select
				CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
				LevelGroupID, LevelGroup,
				IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
				Capacity, Projection, PrevSnapshot,
				LastYear, LastYearCapacity, LastYearEnrollment, CreatedDate, UpdatedDate
			From #tt4
			Where LevelGroupID NOT in(Select OrganizationGroupID From OrganizationGroup Where SchoolYear=@SchoolYear and IsOrganizationGroup=0)
			Order By LevelGroupID, CampusNumber
		 End
	Else 
	Begin --For S+D Report SY 2015-2016 and up
		Update #tt4 
		Set LevelGroup='ELEMENTARY SCHOOL'
		Where CampusNumber IN('039','058','080','102','104','105','106','107','108','109','110','111','112','113','114','115','116','117','119','120','121','122','123','124','125','127','128','130','131','132','133','135','136','137','138','140','144','147','148','149','151','152','153','154','155','156','157','158','159','162','166','167','168','169','170','171','172','173','174','175','178','179','180','181','182','185','186','187','188','189','192','194','195','196','197','198','199','201','203','204','207','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223','224','225','227','228','229','231','232','233','234','237','239','240','241','242','243','244','245','247','248','249','251','252','253','254','255','256','257','258','259','260','262','263','264','265','267','268','269','271','273','274','275','276','279','281','283','285','286','287','289','290','291','292','295','297','298','299','328','344','350','352','353','354','355','357','358','359','360','364','369','371','372','373','374','378','380','382','383','389','392','394','395','396','460','466','470','473','475','478','479','480','483','489')
		
		Update #tt4 
		Set LevelGroup='MIDDLE SCHOOL'
		Where CampusNumber IN('041','042','043','044','045','046','047','048','049','050','051','052','053','054','055','056','057','060','061','062','064','068','071','072','075','077','078','079','082','098','099','163','300','337','338','340','342','390','456','459','467','476')
				
		Update #tt4 
		Set LevelGroup='HIGH SCHOOL'
		Where CampusNumber IN('001','002','003','004','006','007','008','009','010','011','012','013','014','015','016','017','018','019','020','023','024','025','026','027','033','034','036','059','069','081','094','097','100','301','303','308','310','311','320','321','322','323','324','329','345','348','349','455','458','462','463','468','477','484','485','486','487','488')

		Update #tt4 
		Set LevelGroupID = Case 
			When LevelGroup Like '%ELEMENTARY%' Then 1
			When LevelGroup Like '%MIDDLE%' Then 2
			When LevelGroup Like '%HIGH%' Then 3
		End

		Select 
			CampusNumber, SchoolYear, CompareDaySeq, Convert(Date,ReportDate,101)as ReportDate, InstructionDay,
			LevelGroupID, LevelGroup,
			IEE, IPK, IKG, I01, I02, I03, I04, I05, I06, I07, I08, I09, I10, I11, I12, Total,
			Capacity, Projection, PrevSnapshot,
			LastYear, LastYearCapacity, LastYearEnrollment, CreatedDate, UpdatedDate
		From #tt4
		Where 
		LevelGroupID Not in(Select OrganizationGroupID From OrganizationGroup Where SchoolYear=@SchoolYear and IsOrganizationGroup=0)
		and LevelGroupID > 0
		Order By LevelGroupID, CampusNumber
	End

	If object_id('#tt1') is not null Drop Table #tt1	
	If object_id('#tt2') is not null Drop Table #tt2	
	If object_id('#tt3') is not null Drop Table #tt3	
	If object_id('#tt4') is not null Drop Table #tt4	
END
/*
[GetSummaryAndDetailReport] '2007-2008', 2
[GetSummaryAndDetailReport] '2010-2011', 3
[GetSummaryAndDetailReport] '2011-2012', 4
[GetSummaryAndDetailReport] '2011-2012', 11 --Report date is null
[GetSummaryAndDetailReport] '2011-2012', 12
[GetSummaryAndDetailReport] '2010-2011', 11 --Report date is null
[GetSummaryAndDetailReport] '2010-2011', 12
[GetSummaryAndDetailReport] '2012-2013', 1

[GetSummaryAndDetailReport] '2014-2015', 26  --RE @SchoolYear='2014-2015' and @CompareDaySeq=26
[GetSummaryAndDetailReport] '2015-2016', 1
[GetSummaryAndDetailReport] '2015-2016', 6
[GetSummaryAndDetailReport] '2016-2017', 1
[GetSummaryAndDetailReport] '2017-2018', 22
*/



GO