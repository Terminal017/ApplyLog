// 公司级别
export type CompanyLevel = '大厂' | '中厂' | '小厂' | '国企' | '外企'

// 投递渠道
export type ApplyChannel = '官网' | '内推' | '邮箱' | '其他'

// 岗位类型
export type JobType = '日常实习' | '暑期实习' | '校招'

// 投递结果
export type ApplicationResult =
  | 'offer'
  | '待投递'
  | '流程中'
  | '简历挂'
  | '笔试挂'
  | '面试挂'

// 投递记录
export interface Application {
  id: string
  companyName: string
  jobName: string
  jobType: JobType
  city: string
  companyLevel: CompanyLevel
  applyChannel: ApplyChannel
  applyLink: string
  applyDate: string
  processStatus: string
  record: string
  result: ApplicationResult
  createdAt: string
  updatedAt: string
}

// 新增投递记录时的输入类型
export type ApplicationInput = Omit<
  Application,
  'id' | 'createdAt' | 'updatedAt'
>

// 更新投递记录时的输入类型
export type ApplicationUpdate = Partial<Omit<Application, 'id' | 'createdAt'>>
