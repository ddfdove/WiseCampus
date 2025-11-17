import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace YudaoDemo03StudentApi {
  /** 学生信息 */
  export interface Demo03Student {
    id: number; // 编号
    name?: string; // 名字
    sex?: number; // 性别
    birthday?: Dayjs | string; // 出生日期
    description?: string; // 简介
  }
}

/** 查询学生分页 */
export function getDemo03StudentPage(params: PageParam) {
  return requestClient.get<PageResult<YudaoDemo03StudentApi.Demo03Student>>(
    '/test/demo03-student/page',
    { params },
  );
}

/** 查询学生详情 */
export function getDemo03Student(id: number) {
  return requestClient.get<YudaoDemo03StudentApi.Demo03Student>(
    `/test/demo03-student/get?id=${id}`,
  );
}

/** 新增学生 */
export function createDemo03Student(data: YudaoDemo03StudentApi.Demo03Student) {
  return requestClient.post('/test/demo03-student/create', data);
}

/** 修改学生 */
export function updateDemo03Student(data: YudaoDemo03StudentApi.Demo03Student) {
  return requestClient.put('/test/demo03-student/update', data);
}

/** 删除学生 */
export function deleteDemo03Student(id: number) {
  return requestClient.delete(`/test/demo03-student/delete?id=${id}`);
}

/** 批量删除学生 */
export function deleteDemo03StudentList(ids: number[]) {
  return requestClient.delete(
    `/test/demo03-student/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出学生 */
export function exportDemo03Student(params: any) {
  return requestClient.download('/test/demo03-student/export-excel', {
    params,
  });
}
