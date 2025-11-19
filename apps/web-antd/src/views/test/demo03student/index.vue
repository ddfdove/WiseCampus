<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { YudaoDemo03StudentApi } from '#/api/test/demo03student';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDemo03Student,
  deleteDemo03StudentList,
  exportDemo03Student,
  getDemo03StudentPage,
} from '#/api/test/demo03student';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建学生 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑学生 */
function handleEdit(row: YudaoDemo03StudentApi.Demo03Student) {
  formModalApi.setData(row).open();
}

/** 删除学生 */
async function handleDelete(row: YudaoDemo03StudentApi.Demo03Student) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteDemo03Student(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除学生 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    await deleteDemo03StudentList(checkedIds.value);
    checkedIds.value = [];
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: YudaoDemo03StudentApi.Demo03Student[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportDemo03Student(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '学生.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDemo03StudentPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    keyboardConfig: {
      arrowCursorLock: true, // 方向键光标锁，开启后处于非聚焦式编辑状态，将支持在编辑状态中通过方向键切换单元格。（切换为聚焦编辑状态，可以按 F2 键或者鼠标左键点击输入框，就可以用方向键左右移动输入框的光标）
      isClip: true, // 是否开启复制粘贴
      isArrow: true, // 是否开启方向键功能
      isShift: true, // 是否开启同时按住方向键以活动区域为起始，向指定方向扩展单元格区域
      isTab: true, // 是否开启 Tab 键功能
      isEnter: true, // 是否开启回车键功能
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
      isFNR: true, // 是否开启查找与替换
      isMerge: true // 是否启用合并
    },
    menuConfig: {

      body: {
        options: [
          [
            { code: 'myExportMenu', name: '导出数据', prefixIcon: 'vxe-icon-download' },
            { code: 'myPrintMenu', name: '打印',prefixIcon: 'vxe-icon-print' },
            { code: 'myCustomMenu', name: '自定义配置列',prefixIcon: 'vxe-icon-sort-alpha-asc' },
            { code: 'COMMIT_PROXY_RELOAD', name: '刷新',prefixIcon: 'vxe-icon-repeat roll' },
            { code: 'COMMIT_PROXY_QUERY', name: '返回第一页',prefixIcon: 'vxe-icon-swap'  },
            { code: 'SORT_ASC', name: '升序',prefixIcon: 'vxe-icon-caret-up' },
            { code: 'SORT_DESC', name: '降序', prefixIcon: 'vxe-icon-caret-down' },
          ],

        ],
      },

    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    printConfig: {
      sheetName: '学生列表',
      isHeader: true,
      // 直接提供列和数据
    },
    exportConfig: {
      filename: '学生列表',
      sheetName: '学生列表',
      // remote: true, // 开启后端导出
      // exportMethod: async ({ options }) => {
      //   // 这里可以调用你的后端接口，返回整个列表数据
      //   const res = await getDemo03StudentList();
      //   console.log('exportMethod', res);

      //   return res; // 返回数组数据
      // },
    },
    toolbarConfig: {
      refresh: true,
      // search: true,
      print: true,
      export: true,
    },
  } as VxeTableGridOptions<YudaoDemo03StudentApi.Demo03Student>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="学生列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['学生']),
              type: 'primary',
              icon: ACTION_ICON.ADD,

              onClick: handleCreate,
            },

            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,

              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'primary',
              danger: true,
              icon: ACTION_ICON.DELETE,

              disabled: isEmpty(checkedIds),
              onClick: handleDeleteBatch,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,

              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,

              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
