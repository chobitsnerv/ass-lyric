<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUpdate, ref, watch } from 'vue'

export default defineComponent({
  name: 'ASSLyric',
})
</script>

<script setup lang="ts">
const props = defineProps({
  currentTime: {
    type: Number,
    required: true,
  },
  // 原词，格式为{开始时间: 歌词, ...}
  lyric: {
    type: String,
    required: true,
  }, // 当前唱到的歌词类名
  lyricActiveClass: {
    type: String,
    default: '',
  },
  // 拖拽时中间歌词类名
  lyricCenterClass: {
    type: String,
    default: '',
  },
  // 滚动到目标歌词时间，单位ms
  lyricScrollTime: {
    type: Number,
    default: 400,
  },
  // 拖拽结束后隔多长后恢复滚动
  dragendWaitTime: {
    type: Number,
    default: 3000,
  },
  // 每句歌词及翻译与下一句歌词及翻译的间隔
  lyricMargin: {
    type: String,
    default: '20px',
  },
  // 每句歌词及翻译行高
  lyricLineheight: {
    type: String,
    default: '1.5em',
  },
  // 拖拽时左边出现的三角形颜色
  triangleColor: {
    type: String,
    default: 'orange',
  },
  // 拖拽时左边出现的等边三角形的高度
  triangleWidth: {
    type: String,
    default: '40px',
  },
  // 拖拽时中间线的颜色
  centerLineColor: {
    type: String,
    default: '#ccc',
  },
  // 拖拽时中间歌词开始时间颜色
  centerTimeColor: {
    type: String,
    default: 'orange',
  },
})

const emit = defineEmits(['change-current-time'])

// 接收到的lyric文件
const lyricObject = ref(props.lyric)
// 开始接触的clientY
const startClientY = ref(0)
// 开始接触的translateY
const startTranslateY = ref(0)
// 是否正在拖拽
const isDragging = ref(false)
// 当前歌词容器滚动的高度
const nowTranslateY = ref(0)
// touchend后设置的定时器
const timer = ref()
// 找出当前视野中最接近中间的歌词，返回下标
const centerLyricIdx = ref(-1)
// 每句歌词的高度
const offsetHeightList = ref<number[]>([])
// 包裹全部歌词的容器
const wrapper = ref(null)
// 容器高度
const wrapperHeight = ref(0)
// 歌词可视区高度
const viewHeight = ref(0)
// 获取歌词view容器div
const lyricView = ref<null | HTMLElement>(null)
// 获取歌词wrapper容器div
const lyricWrapper = ref<null | HTMLElement>(null)
// 获取歌词行容器div
const lyricLine = ref<HTMLElement[]>([])

const firstLyricHeight = ref(0)
const lastLyricHeight = ref(0)

// 包含原词和译词（译词在同一个文件）
/**
 * Parse lrc, suppose multiple time tag
 *
 * @param {String} lyric - Format:
 * [mm:ss]lyric
 * [mm:ss.xx]lyric
 * [mm:ss.xxx]lyric
 * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
 * [mm:ss.xx]<mm:ss.xx>lyric
 *
 * @return {String} [[time, text], [time, text], [time, text], ...]
 */
const parsedLyric = computed(() => {
  if (lyricObject.value) {
    const _lyricObject = lyricObject.value.replace(
      /([^\]^\n])\[/g,
      (p1: string) => `${p1}\n[`,
    )
    const lyric = _lyricObject.split('\n')
    let lrc = []
    const lyricLen = lyric.length
    for (let i = 0; i < lyricLen; i++) {
      // match lrc time
      const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g)
      // match lrc text
      const lrcText = lyric[i]
        .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
        .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
        .replace(/^\s+|\s+$/g, '')

      if (lrcTimes) {
        // handle multiple time tag
        const timeLen = lrcTimes.length
        for (let j = 0; j < timeLen; j++) {
          const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j])
          if (oneTime) {
            const min2sec = parseInt(oneTime[1]) * 60
            const sec2sec = parseInt(oneTime[2])
            const msec2sec = oneTime[4]
              ? parseInt(oneTime[4])
                / (`${oneTime[4]}`.length === 2 ? 100 : 1000)
              : 0
            const lrcTime = min2sec + sec2sec + msec2sec
            lrc.push([lrcTime, lrcText])
          }
        }
      }
    }
    // sort by time
    lrc = lrc.filter(item => item[1])
    lrc.sort((a: any, b: any) => a[0] - b[0])
    const _lrc = []
    for (let i = 0; i < lrc.length - 1; i++) {
      _lrc.push(lrc[i])
      if (lrc[i][0] === lrc[i + 1][0]) {
        _lrc[_lrc.length - 1][2] = lrc[i + 1][1]
        i++
      }
    }
    if (lrc[lrc.length - 1][0] !== _lrc[_lrc.length - 1][0])_lrc.push(lrc[lrc.length - 1])
    return _lrc
  }
  else {
    return []
  }
})

// 每句歌词及其翻译对应的div的offsetTop
const offsetTopList = computed(() => {
  const resultArr: any[] = []
  let totalHeight = 0
  if (lyricLine.value) {
    lyricLine.value.forEach((line: { offsetHeight: any }) => {
      const height = line.offsetHeight
      offsetHeightList.value.push(height)
      resultArr.push(totalHeight)
      totalHeight += height
    })
  }
  return resultArr
})

// 当前高亮的歌词下标（也就是第几句，从0开始）
const activeLyricIdx = computed(() => {
  const allLyric = parsedLyric.value
  const currentTime = props.currentTime
  for (let i = 0, len = allLyric.length; i < len; i++) {
    if (
      allLyric[i][0] <= currentTime
      && ((allLyric[i + 1] && allLyric[i + 1][0] > currentTime)
        || !allLyric[i + 1])
    )
      return i
  }
  return 0
})

// 第一句歌词距容器顶部的最大距离
const lyricTopPadding = computed(() => {
  return viewHeight.value / 2 - firstLyricHeight.value / 2
})

// 最后一句歌词距容器底部的最大距离
const lyricBottomPadding = computed(() => {
  return viewHeight.value / 2 - lastLyricHeight.value / 2
})

// nowTranslateY的最小值，也就是歌词向上滚动的最大值
const minTranslateY = computed(() => {
  return -(wrapperHeight.value - viewHeight.value + lyricBottomPadding.value)
})

watch(
  () => props.lyric,
  (newValue: string) => {
    lyricObject.value = newValue
  },
)

watch(
  () => props.currentTime,
  () => {
    updateLyricPos()
  },
)

watch(
  parsedLyric,
  () => {
    nextTick(() => {
      // 获取第1句 和最后 1句歌词高度
      setFirstLastLyricHeight()
      // 获取可视区高度
      viewHeight.value = lyricView.value?.offsetHeight || 0
      // 获取容器高度
      wrapperHeight.value = lyricWrapper.value?.offsetHeight || 0
      // 设置初始滚动
      nowTranslateY.value = lyricTopPadding.value
    })
  },
)

// 带单位的字符串除以数字，如60px/2=15px
const unitDivide = (unitNum: string, num: number) => {
  const num1 = parseFloat(unitNum)
  const unit = unitNum.replace(num1.toString(), '')
  return `${num1 / num}${unit}`
}

// 把秒数转换为xx:xx的形式
const timeToStr = (num: number) => {
  num = Math.round(num)
  let second: any = num % 60
  let minute: any = Math.floor(num / 60)
  if (second < 10) second = `0${second}`

  if (minute < 10) minute = `0${minute}`

  return `${minute}:${second}`
}

// 设置第1句和最后1句歌词高度
const setFirstLastLyricHeight = () => {
  const lyricLines = lyricLine.value
  if (lyricLines) {
    firstLyricHeight.value = lyricLines[0].offsetHeight
    lastLyricHeight.value = lyricLines[lyricLines.length - 1].offsetHeight
  }
}

// 拖拽后点击视野中间左侧三角形更改进度
const changeCurrentTime = () => {
  emit('change-current-time', parsedLyric.value[centerLyricIdx.value][0])
  nextTick(() => {
    isDragging.value = false
  })
}

// 实时获取当前元素的translateY
const getTranslateY = (el: null | Element) => {
  if (el) {
    const curStyle = window.getComputedStyle(el)
    const curTransform = curStyle.transform || curStyle.webkitTransform
    return curTransform.split(',')[5].replace(')', '')
  }
  return null
}

// 更新歌词位置
const updateLyricPos = () => {
  // 没有拖拽歌词
  if (!isDragging.value) {
    const scrollTarget
      = offsetTopList.value[activeLyricIdx.value]
      + offsetHeightList.value[activeLyricIdx.value] / 2
      - viewHeight.value / 2
    nowTranslateY.value = -scrollTarget
  }
}

// 触屏事件
const onTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  clearTimeout(timer.value)
  startClientY.value = e.touches[0].clientY
  startTranslateY.value = Number(getTranslateY(wrapper.value))
  nowTranslateY.value = startTranslateY.value
}

const onTouchMove = (e: TouchEvent) => {
  e.preventDefault() // 防止屏幕跟着滚动
  const clientY = e.touches[0].clientY
  const targetTranslateY = startTranslateY.value + clientY - startClientY.value
  if (targetTranslateY > lyricTopPadding.value) {
    // 抵达上边界
    nowTranslateY.value = lyricTopPadding.value
  }
  else if (targetTranslateY < minTranslateY.value) {
    // 移出下边界
    nowTranslateY.value = minTranslateY.value
  }
  else {
    nowTranslateY.value = targetTranslateY
    centerLyricIdx.value = findCenterLyricIdx()
  }
}

const onTouchEnd = () => {
  timer.value = setTimeout(() => {
    isDragging.value = false
    centerLyricIdx.value = -1
  }, props.dragendWaitTime)
}

// 找出当前视野中最接近中间的歌词，返回下标
const findCenterLyricIdx = () => {
  const halfViewHeight = viewHeight.value / 2
  for (let i = 0, len = offsetTopList.value.length; i < len; i++) {
    const v = offsetTopList.value[i]
    if (
      (nowTranslateY.value + v < halfViewHeight
        && offsetTopList.value[i + 1]
        && nowTranslateY.value + offsetTopList.value[i + 1] > halfViewHeight)
      || !offsetTopList.value[i + 1]
    )
      return i
  }
  return -1
}

onBeforeUpdate(() => {
  lyricLine.value = []
})
</script>

// 歌词滚动组件
<template>
  <div
    ref="lyricView"
    class="lyric-view"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      v-if="lyric"
      ref="lyricWrapper"
      class="lyric-wrapper"
      :style="{
        transform: `translate3d(0, ${nowTranslateY}px, 0)`,
        transition: `${isDragging ? 'none' : `all ease ${lyricScrollTime}ms`}`,
      }"
    >
      <div
        v-for="(item, index) in parsedLyric"
        :ref="el=>{lyricLine[index]=el}"
        :key="index"
        :style="{ padding: `${unitDivide(lyricMargin, 2)} 0` }"
        :class="{
          [lyricCenterClass]: index === centerLyricIdx,
          [lyricActiveClass]: index === activeLyricIdx,
        }"
      >
        <p :style="{lineHeight: lyricLineheight}">
          {{ item[1] }}
        </p>
        <p v-if="item[2]" :style="{lineHeight: lyricLineheight}">
          {{ item[2] }}
        </p>
      </div>
    </div>

    <!-- 拖拽时中间标记 -->
    <div v-if="isDragging" class="center-mark">
      <div
        class="triangle"
        :style="{
          borderColor: `transparent transparent transparent ${triangleColor}`,
          borderWidth: `${unitDivide(triangleWidth, 1.732)} 0 ${unitDivide(
            triangleWidth,
            1.732
          )} ${triangleWidth}`,
        }"
        @click="changeCurrentTime"
      />
      <div class="line" :style="{ background: centerLineColor }" />
      <div class="target-time" :style="{ color: centerTimeColor }">
        {{
          parsedLyric[centerLyricIdx] &&
            timeToStr(parsedLyric[centerLyricIdx][0])
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyric-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .center-mark {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    align-items: center;
    // 拖拽三角形
    .triangle {
      border-style: solid;
    }

    // 中间指示线
    .line {
      flex: 1;
      height: 1px;
      margin: 0 20px;
    }
  }
}
.lyric-wrapper {
  transition: ease 0.3s;
  // 每一句歌词及其翻译
  & > div p {
    padding: 0;
    margin: 0;
  }
}
</style>
