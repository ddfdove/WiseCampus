<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// import { ElMessage } from 'element-plus'
import { IconifyIcon } from '@vben/icons';

import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { message, Timeline, TimelineItem } from 'ant-design-vue';
import { LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

const router = useRouter();
const pieEls = ref<HTMLElement[]>([]);
const pieInstances: echarts.ECharts[] = [];
const activeTab = ref('schedule');
const selectedClass = ref<any>('');
const lineChart = ref<HTMLElement | null>(null);
const pieRefs = ref<HTMLElement[]>([]);

// 年级、班级选项数据
const classOptions = ref([
  { label: '全部班级', value: 'all' },
  { label: '高一', value: 'g1' },
  { label: '高二', value: 'g2' },
  { label: '高三', value: 'g3' },
]);
// ----------------- 模拟后端返回（两周课程） -----------------
const mockRes = [
  // 📅 本周（2025-11-03 ~ 2025-11-09）
  {
    id: 1,
    name: '语文',
    startTime: '2025-11-03 08:00:00',
    endTime: '2025-11-03 08:45:00',
    color: '#FF7043',
  },
  {
    id: 2,
    name: '数学',
    startTime: '2025-11-03 09:00:00',
    endTime: '2025-11-03 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 3,
    name: '英语',
    startTime: '2025-11-03 14:00:00',
    endTime: '2025-11-03 14:45:00',
    color: '#2196F3',
  },
  {
    id: 4,
    name: '物理',
    startTime: '2025-11-03 15:00:00',
    endTime: '2025-11-03 15:45:00',
    color: '#FF9800',
  },

  {
    id: 5,
    name: '数学',
    startTime: '2025-11-04 09:00:00',
    endTime: '2025-11-04 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 6,
    name: '英语',
    startTime: '2025-11-04 11:00:00',
    endTime: '2025-11-04 11:45:00',
    color: '#2196F3',
  },
  {
    id: 7,
    name: '化学',
    startTime: '2025-11-04 14:00:00',
    endTime: '2025-11-04 14:45:00',
    color: '#9C27B0',
  },
  {
    id: 8,
    name: '历史',
    startTime: '2025-11-04 16:00:00',
    endTime: '2025-11-04 16:45:00',
    color: '#795548',
  },

  {
    id: 9,
    name: '语文',
    startTime: '2025-11-05 08:00:00',
    endTime: '2025-11-05 08:45:00',
    color: '#FF7043',
  },
  {
    id: 10,
    name: '数学',
    startTime: '2025-11-05 09:00:00',
    endTime: '2025-11-05 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 11,
    name: '英语',
    startTime: '2025-11-05 14:00:00',
    endTime: '2025-11-05 14:45:00',
    color: '#2196F3',
  },
  {
    id: 12,
    name: '体育',
    startTime: '2025-11-05 15:00:00',
    endTime: '2025-11-05 15:45:00',
    color: '#009688',
  },

  {
    id: 13,
    name: '生物',
    startTime: '2025-11-06 08:00:00',
    endTime: '2025-11-06 08:45:00',
    color: '#8BC34A',
  },
  {
    id: 14,
    name: '数学',
    startTime: '2025-11-06 09:00:00',
    endTime: '2025-11-06 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 15,
    name: '信息技术',
    startTime: '2025-11-06 14:00:00',
    endTime: '2025-11-06 14:45:00',
    color: '#607D8B',
  },
  {
    id: 16,
    name: '英语',
    startTime: '2025-11-06 15:00:00',
    endTime: '2025-11-06 15:45:00',
    color: '#2196F3',
  },

  {
    id: 17,
    name: '数学',
    startTime: '2025-11-07 08:00:00',
    endTime: '2025-11-07 08:45:00',
    color: '#4CAF50',
  },
  {
    id: 18,
    name: '语文',
    startTime: '2025-11-07 09:00:00',
    endTime: '2025-11-07 09:45:00',
    color: '#FF7043',
  },
  {
    id: 19,
    name: '美术',
    startTime: '2025-11-07 14:00:00',
    endTime: '2025-11-07 14:45:00',
    color: '#E91E63',
  },
  {
    id: 20,
    name: '音乐',
    startTime: '2025-11-07 15:00:00',
    endTime: '2025-11-07 15:45:00',
    color: '#00BCD4',
  },

  // 🎨 周末课外
  {
    id: 21,
    name: '奥数班',
    startTime: '2025-11-08 09:00:00',
    endTime: '2025-11-08 10:30:00',
    color: '#FF5722',
  },
  {
    id: 22,
    name: '英语口语',
    startTime: '2025-11-08 14:00:00',
    endTime: '2025-11-08 15:30:00',
    color: '#03A9F4',
  },
  {
    id: 23,
    name: '钢琴',
    startTime: '2025-11-09 09:00:00',
    endTime: '2025-11-09 10:30:00',
    color: '#9C27B0',
  },
  {
    id: 24,
    name: '美术兴趣',
    startTime: '2025-11-09 14:00:00',
    endTime: '2025-11-09 15:30:00',
    color: '#E91E63',
  },

  // 📅 下周（2025-11-10 ~ 2025-11-16）
  {
    id: 25,
    name: '语文',
    startTime: '2025-11-10 08:00:00',
    endTime: '2025-11-10 08:45:00',
    color: '#FF7043',
  },
  {
    id: 26,
    name: '数学',
    startTime: '2025-11-10 09:00:00',
    endTime: '2025-11-10 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 27,
    name: '英语',
    startTime: '2025-11-10 14:00:00',
    endTime: '2025-11-10 14:45:00',
    color: '#2196F3',
  },
  {
    id: 28,
    name: '物理',
    startTime: '2025-11-10 15:00:00',
    endTime: '2025-11-10 15:45:00',
    color: '#FF9800',
  },

  {
    id: 29,
    name: '化学',
    startTime: '2025-11-11 08:00:00',
    endTime: '2025-11-11 08:45:00',
    color: '#9C27B0',
  },
  {
    id: 30,
    name: '数学',
    startTime: '2025-11-11 09:00:00',
    endTime: '2025-11-11 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 31,
    name: '英语',
    startTime: '2025-11-11 14:00:00',
    endTime: '2025-11-11 14:45:00',
    color: '#2196F3',
  },
  {
    id: 32,
    name: '历史',
    startTime: '2025-11-11 15:00:00',
    endTime: '2025-11-11 15:45:00',
    color: '#795548',
  },

  {
    id: 33,
    name: '语文',
    startTime: '2025-11-12 08:00:00',
    endTime: '2025-11-12 08:45:00',
    color: '#FF7043',
  },
  {
    id: 34,
    name: '数学',
    startTime: '2025-11-12 09:00:00',
    endTime: '2025-11-12 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 35,
    name: '体育',
    startTime: '2025-11-12 14:00:00',
    endTime: '2025-11-12 14:45:00',
    color: '#009688',
  },
  {
    id: 36,
    name: '信息技术',
    startTime: '2025-11-12 15:00:00',
    endTime: '2025-11-12 15:45:00',
    color: '#607D8B',
  },

  {
    id: 37,
    name: '生物',
    startTime: '2025-11-13 08:00:00',
    endTime: '2025-11-13 08:45:00',
    color: '#8BC34A',
  },
  {
    id: 38,
    name: '数学',
    startTime: '2025-11-13 09:00:00',
    endTime: '2025-11-13 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 39,
    name: '英语',
    startTime: '2025-11-13 14:00:00',
    endTime: '2025-11-13 14:45:00',
    color: '#2196F3',
  },
  {
    id: 40,
    name: '美术',
    startTime: '2025-11-13 15:00:00',
    endTime: '2025-11-13 15:45:00',
    color: '#E91E63',
  },

  {
    id: 41,
    name: '语文',
    startTime: '2025-11-14 08:00:00',
    endTime: '2025-11-14 08:45:00',
    color: '#FF7043',
  },
  {
    id: 42,
    name: '数学',
    startTime: '2025-11-14 09:00:00',
    endTime: '2025-11-14 09:45:00',
    color: '#4CAF50',
  },
  {
    id: 43,
    name: '英语',
    startTime: '2025-11-14 14:00:00',
    endTime: '2025-11-14 14:45:00',
    color: '#2196F3',
  },
  {
    id: 44,
    name: '音乐',
    startTime: '2025-11-14 15:00:00',
    endTime: '2025-11-14 15:45:00',
    color: '#00BCD4',
  },

  // 🎨 下周末兴趣班
  {
    id: 45,
    name: '编程兴趣',
    startTime: '2025-11-15 09:00:00',
    endTime: '2025-11-15 10:30:00',
    color: '#3F51B5',
  },
  {
    id: 46,
    name: '科学探究',
    startTime: '2025-11-15 14:00:00',
    endTime: '2025-11-15 15:30:00',
    color: '#009688',
  },
  {
    id: 47,
    name: '绘画兴趣',
    startTime: '2025-11-16 09:00:00',
    endTime: '2025-11-16 10:30:00',
    color: '#E91E63',
  },
  {
    id: 48,
    name: '足球训练',
    startTime: '2025-11-16 14:00:00',
    endTime: '2025-11-16 15:30:00',
    color: '#4CAF50',
  },
];
// ----------------- FullCalendar 配置 -----------------
const currentTitle = ref('');
// 详情弹窗控制 & 选中事件信息
const detailVisible = ref(false);
const selectedEvent = ref<any>({
  title: '',
  start: '',
  end: '',
  backgroundColor: '',
});
const calendarRef = ref<any>(null);
const calendarOptions = ref<any>({
  locale: zhCnLocale,
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  allDaySlot: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '19:00:00',
  slotDuration: '00:30:00',
  slotMinHeight: '100',
  nowIndicator: true,
  headerToolbar: false, // 我们用自定义 toolbar
  contentHeight: 'auto', // 让 FullCalendar 填满父容器
  expandRows: false, // 避免向下填充空行
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  // 最开始先给空数组，后面通过请求更新
  events: [],
  // 当视图或日期范围改变时更新标题
  datesSet: (arg: any) => {
    // arg.view.title 是 FullCalendar 默认的标题（例如 'Nov 3 – 9, 2025'），但 locale 已是中文
    currentTitle.value = arg.view.title;
  },
  // 事件点击
  eventClick: (info: any) => {
    const ev = info.event;
    selectedEvent.value = {
      title: ev.title,
      start: ev.start ? ev.start.toLocaleString() : ev.start,
      end: ev.end ? ev.end.toLocaleString() : ev.end,
      backgroundColor:
        ev.backgroundColor || ev.extendedProps?.backgroundColor || '#409EFF',
    };
    detailVisible.value = true;
  },
});

// ----------------- 工具：把 "yyyy-MM-dd HH:mm:ss" -> "yyyy-MM-ddTHH:mm:ss"
function convertToISO(dateStr: string) {
  if (!dateStr) return '';
  // 简单替换空格为 T（适合后端统一返回的格式）
  return dateStr.replace(' ', 'T');
}

// 将后端数据转换为 FullCalendar 的 events 格式
function convertBackendToEvents(list: any[]) {
  return list.map((it) => ({
    id: it.id,
    title: it.name,
    start: convertToISO(it.startTime),
    end: convertToISO(it.endTime),
    backgroundColor: it.color,
    borderColor: it.color,
  }));
}
// 模拟“从后端拉数据”的函数（这里用 mockRes）
async function fetchCourseList() {
  // 模拟网络延时
  await new Promise((r) => setTimeout(r, 600));
  const fcEvents = convertBackendToEvents(mockRes);
  // 更新 calendar options 的 events（FullCalendar 会自动响应）
  calendarOptions.value = {
    ...calendarOptions.value,
    events: fcEvents,
  };
  // 小提醒：如果没有显示，尝试调用 render 或者获取 api 滚到当前时间
  // const api = calendarRef.value?.getApi()
  // api?.render()
}
// 顶部控制：上一周/下一周/本周
function getApi() {
  return calendarRef.value?.getApi ? calendarRef.value.getApi() : null;
}
function goPrev() {
  const api = getApi();
  if (!api) return message.warning('日历未就绪');
  api.prev();
}
function goNext() {
  const api = getApi();
  if (!api) return message.warning('日历未就绪');
  api.next();
}
function goToday() {
  const api = getApi();
  if (!api) return message.warning('日历未就绪');
  api.today();
}

// 🧩 校园公告数据提取
const notices = ref([
  {
    date: '2025-11-05',
    title: '期中考试时间安排通知',
    content:
      '各年级期中考试将于11月15日至17日举行，请各班主任提前做好考务准备。',
  },
  {
    date: '2025-11-02',
    title: '校园消防安全演练',
    content:
      '全校将于本周五下午举行消防安全演练，请全体师生积极配合，听从指挥。',
  },
  {
    date: '2025-10-30',
    title: '图书馆开放时间调整',
    content: '自11月起，图书馆周末开放时间调整为8:00—17:30，请师生知悉。',
  },
  {
    date: '2025-10-30',
    title: '图书馆开放时间调整',
    content: '自11月起，图书馆周末开放时间调整为8:00—17:30，请师生知悉。',
  },
  {
    date: '2025-10-26',
    title: '学生健康体检通知',
    content: '本周三起分年级进行学生健康体检，请按班级排班表准时到达体检点。',
  },
]);
// 快捷应用
const items = [
  {
    name: 'AttendanceView',
    path: '/education/attendance/view',
    title: '考勤查看',
    icon: 'ep:clock',
    bg: 'bg-blue-300',
  },
  {
    name: 'LeaveManagement',
    path: '/education/leave/management',
    title: '请假管理',
    icon: 'ep:calendar',
    bg: 'bg-amber-300',
  },
  {
    name: 'MoralRecord',
    path: '/education/moral/record',
    title: '德育记录',
    icon: 'ep:medal',
    bg: 'bg-green-300',
  },
  {
    name: 'ExamManagement',
    path: '/education/exam/management',
    title: '考试管理',
    icon: 'ep:edit-pen',
    bg: 'bg-indigo-300',
  },
  {
    name: 'StudentManagement',
    path: '/education/student/management',
    title: '学生管理',
    icon: 'ep:user',
    bg: 'bg-purple-300',
  },
  {
    name: 'DormitoryManagement',
    path: '/education/dormitory/management',
    title: '宿舍管理',
    icon: 'ep:home-filled',
    bg: 'bg-cyan-300',
  },
  {
    name: 'TeacherManagement',
    path: '/education/teacher/management',
    title: '教师管理',
    icon: 'ep:user-filled',
    bg: 'bg-pink-300',
  },
  {
    name: 'ClassInfo',
    path: '/education/class/info',
    title: '班级信息',
    icon: 'ep:office-building',
    bg: 'bg-teal-300',
  },
  {
    name: 'NoticePublish',
    path: '/education/notice/publish',
    title: '通知发布',
    icon: 'ep:bell',
    bg: 'bg-orange-300',
  },
  {
    name: 'StudentArchive',
    path: '/education/student/archive',
    title: '学生档案',
    icon: 'ep:document',
    bg: 'bg-lime-300',
  },
  {
    name: 'HomeSchool',
    path: '/education/homeschool/index',
    title: '家校共育',
    icon: 'ep:chat-dot-round',
    bg: 'bg-red-300',
  },
  {
    name: 'Survey',
    path: '/education/survey/index',
    title: '调查问卷',
    icon: 'ep:edit',
    bg: 'bg-sky-300',
  },
];

const bg_color = [
  'bg-red-300',
  'bg-yellow-300',
  'bg-orange-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
  'bg-pink-300',
  'bg-teal-300',
  'bg-cyan-300',
  'bg-lime-300',
  'bg-emerald-300',
  'bg-sky-300',
  'bg-violet-300',
  'bg-rose-300',
];

const pieData = ref<any[]>([
  { label: '违纪率', value: 30, color: '#FF5722' },
  { label: '奖励率', value: 78, color: '#2196F3' },
  { label: '处罚率', value: 55, color: '#4CAF50' },
]);

const setPieRef = (index: any) => (el: any) => {
  if (el && !pieRefs.value[index]) {
    pieRefs.value[index] = echarts.init(el);
    pieRefs.value[index].setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
          data: [
            {
              value: pieData.value[index].value,
              name: pieData.value[index].label,
              itemStyle: { color: pieData.value[index].color },
            },
            {
              value: 100 - pieData.value[index].value,
              name: 'remaining',
              itemStyle: { color: '#f3f4f6' },
            },
          ],
        },
      ],
    });
  }
};

let lineInstance: echarts.ECharts | null = null;

const lineOption = {
  color: ['#f43f5e', '#10b981'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['违规', '奖励'], top: 6 },
  grid: { left: '6%', right: '6%', bottom: '6%', top: 36 },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 10 }).map((_, i) => `D${i + 1}`),
    boundaryGap: false,
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '违规',
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.08 },
      data: [200, 250, 300, 450, 600, 800, 700, 650, 600, 520],
    },
    {
      name: '奖励',
      type: 'line',
      smooth: true,
      data: [220, 300, 360, 520, 900, 1200, 950, 900, 860, 780],
    },
  ],
};

const makePieOption = (value: number) => ({
  series: [
    {
      type: 'pie',
      radius: ['70%', '90%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value, name: 'value' },
        { value: 100 - value, name: 'rest', itemStyle: { color: '#f3f4f6' } },
      ],
    },
  ],
});

onMounted(() => {
  fetchCourseList();
  // 折线图初始化
  if (lineChart.value) {
    lineInstance = echarts.init(lineChart.value);
    lineInstance.setOption(lineOption);
  }

  // 饼图初始化
  pieEls.value.forEach((el, i) => {
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      series: [
        {
          type: 'pie',
          radius: ['65%', '85%'],
          avoidLabelOverlap: false,
          label: { show: false },
          data: [
            {
              value: pieData.value[i].value,
              name: pieData.value[i].label,
              itemStyle: { color: pieData.value[i].color },
            },
            {
              value: 100 - pieData.value[i].value,
              name: 'rest',
              itemStyle: { color: '#f3f4f6' },
            },
          ],
        },
      ],
    });
    pieInstances.push(chart);
  });

  window.addEventListener('resize', resizeAll);
  // ElMessage.success('校园首页加载成功')
});

onBeforeUnmount(() => {
  lineInstance?.dispose();
  pieInstances.forEach((i) => i.dispose());
  window.removeEventListener('resize', resizeAll);
});

function resizeAll() {
  lineInstance?.resize();
  pieInstances.forEach((i) => i.resize());
}
</script>

<template>
  <a-row gutter="20" class="p-4">
    <!-- 待办事项 + 课程表 -->
    <a-col :span="8">
      <a-card
        class="h-[35vh] rounded-2xl shadow-sm"
        :body-style="{ padding: '8px', height: 'calc(35vh - 56px)' }"
      >
        <!-- 卡片标题：放置 Tab 切换 -->
        <template #title>
          <a-tabs v-model:active-key="activeTab" size="small" style="flex: 1">
            <a-tab-pane key="todo" tab="待办事项" />
            <a-tab-pane key="schedule" tab="课程表" />
          </a-tabs>
        </template>

        <!-- 卡片内容，根据 activeTab 切换显示 -->
        <div style="height: 100%; overflow: auto" class="w-full">
          <div v-if="activeTab === 'todo'" class="w-full">
            <a-space direction="vertical" class="w-full">
              <a-alert message="待处理事项：5条" type="info" show-icon />
              <a-alert message="今日考勤异常：3人" type="warning" show-icon />
              <a-alert message="新提交奖励申请：2条" type="success" show-icon />
              <a-alert message="待处理违规记录：4条" type="error" show-icon />
            </a-space>
          </div>

          <div v-else-if="activeTab === 'schedule'" class="w-full">
            <div class="my-2 flex items-center gap-[12px]">
              <a-buttongroup>
                <a-button size="small" @click="goPrev">上一周</a-button>
                <a-button size="small" @click="goToday">本周</a-button>
                <a-button size="small" @click="goNext">下一周</a-button>
              </a-buttongroup>

              <div class="mx-auto text-center">{{ currentTitle }}</div>
            </div>
            <FullCalendar
              ref="calendarRef"
              :options="calendarOptions"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
      </a-card>
    </a-col>

    <!-- 校园公告 -->
    <a-col :span="8">
      <a-card class="h-[35vh] overflow-hidden rounded-2xl shadow-sm">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-base font-semibold">校园公告</span>
            <a @click="router.push('/education/notice/list')">更多</a>
          </div>
        </template>

        <Timeline>
          <TimelineItem
            v-for="(item, index) in notices"
            :key="index"
            :color="index === 0 ? 'blue' : 'gray'"
          >
            <h4 class="text-[14px] font-semibold text-gray-800">
              {{ item.title }}
            </h4>
            <p class="mt-1 text-[13px] text-gray-500">{{ item.content }}</p>
          </TimelineItem>
        </Timeline>
      </a-card>
    </a-col>

    <!-- 我的应用 -->
    <a-col :span="8">
      <a-card class="h-[35vh] overflow-hidden rounded-2xl shadow-sm">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-base font-semibold">我的应用</span>
            <span class="text-xs text-gray-400">最多可选择16个应用</span>
          </div>
        </template>

        <a-row gutter="10" class="flex w-full flex-wrap justify-start">
          <a-col
            v-for="(item, index) in items"
            :key="index"
            :span="6"
            class="mb-5 flex cursor-pointer flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1"
            @click="router.push(item.path)"
          >
            <div
              class="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-md"
              :class="item.bg"
            >
              <IconifyIcon
                :icon="item.icon"
                width="30"
                height="30"
                color="#fff"
              />
            </div>
            <span class="my-2 text-[18px] text-gray-700">{{ item.title }}</span>
          </a-col>
        </a-row>
      </a-card>
    </a-col>

    <!-- 折线统计图 -->
    <a-col :span="16" class="mt-4">
      <a-card class="h-[35vh] overflow-hidden rounded-2xl shadow-sm">
        <template #title>
          <span class="text-base font-semibold">30日学生行为统计</span>
        </template>
        <div ref="lineChart" style="width: 100%; height: 300px"></div>
      </a-card>
    </a-col>

    <!-- 饼图统计 -->
    <a-col :span="8" class="mt-4">
      <a-card class="h-[35vh] overflow-visible rounded-2xl shadow-sm">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-base font-semibold">30日学生行为统计</span>
            <a-select
              v-model:value="selectedClass"
              placeholder="按年级，班级筛选"
              size="small"
              style="width: 240px"
            >
              <a-select-option
                v-for="option in classOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>
        </template>

        <div class="mt-16 flex h-full items-center justify-around">
          <div
            v-for="(item, index) in pieData"
            :key="index"
            class="flex flex-col items-center justify-center"
          >
            <div
              :ref="(el) => (pieEls[index] = el)"
              style="width: 200px; height: 200px"
            ></div>
            <div class="mt-2 text-center">
              <div class="text-sm font-medium">{{ item.label }}</div>
              <div class="text-xs text-gray-500">{{ item.value }}%</div>
            </div>
          </div>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<style scoped>
.el-card {
  background: rgb(255 255 255 / 90%);
  backdrop-filter: blur(8px);
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}

:deep(.fc .fc-timegrid-slot) {
  height: 25px; /* 你想要的高度 */
}

:deep(.fc .fc-event) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* 让事件填满格子 */
  padding: 0;
  font-size: 12px;
}
</style>
