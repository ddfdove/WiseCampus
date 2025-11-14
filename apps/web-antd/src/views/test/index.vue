<script setup lang="ts">
import { onMounted, ref } from 'vue';

import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import { message } from 'ant-design-vue';
// import { ElMessage } from 'element-plus';

// ref to FullCalendar component
const calendarRef = ref<any>(null);

// 当前标题（例如：2025年11月3日 - 2025年11月9日 / 周一 11/3 - 周日 11/9 / FullCalendar view.title 中文化后会更可读）
const currentTitle = ref('');

// 详情弹窗控制 & 选中事件信息
const detailVisible = ref(false);
const selectedEvent = ref<any>({
  title: '',
  start: '',
  end: '',
  backgroundColor: '',
});

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

// ----------------- 工具：把 "yyyy-MM-dd HH:mm:ss" -> "yyyy-MM-ddTHH:mm:ss" -----------------
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

// ----------------- FullCalendar 配置 -----------------
const calendarOptions = ref<any>({
  locale: zhCnLocale,
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  allDaySlot: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '19:00:00',
  slotDuration: '00:30:00',
  slotMinHeight: 100,
  nowIndicator: true,
  headerToolbar: false, // 我们用自定义 toolbar
  contentHeight: 'auto',
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

//顶部控制：上一周/下一周/本周
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

// 页面加载时拉数据
onMounted(() => {
  fetchCourseList();
});
</script>

<template>
  <div class="calendar-wrapper">
    <div class="toolbar">
      <a-buttongroup>
        <a-button size="small" @click="goPrev">上一周</a-button>
        <a-button size="small" @click="goToday">本周</a-button>
        <a-button size="small" @click="goNext">下一周</a-button>
      </a-buttongroup>

      <div class="title">{{ currentTitle }}</div>
    </div>

    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      style="padding: 8px; border: 1px solid #eee; border-radius: 6px"
    />

    <!-- 课程详情弹窗 -->
    <a-modal
      v-model:visible="detailVisible"
      width="420px"
      :close-on-click-modal="true"
      title="课程详情"
    >
      <div class="detail-row">
        <strong>课程：</strong> {{ selectedEvent.title }}
      </div>
      <div class="detail-row">
        <strong>开始：</strong> {{ selectedEvent.start }}
      </div>
      <div class="detail-row">
        <strong>结束：</strong> {{ selectedEvent.end }}
      </div>
      <div class="detail-row">
        <strong>颜色：</strong>
        <el-tag
          :style="{ background: selectedEvent.backgroundColor, color: '#fff' }"
        >
          {{ selectedEvent.backgroundColor }}
        </el-tag>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title {
  margin-left: 12px;
  font-weight: 700;
}

.detail-row {
  margin: 8px 0;
}

.fc {
  /* 如果你想让日历固定高度可以改这里 */

  /* height: 90vh; */
}

:deep(.fc .fc-event-title) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.fc .fc-timegrid-slot) {
  height: 35px; /* 你想要的高度 */
}

:deep(.fc .fc-event) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* 让事件填满格子 */
  padding: 4px;
  font-size: 14px;
}
</style>

