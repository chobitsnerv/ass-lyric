<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import ASSLyric from './ASSLyric.vue'

export default defineComponent({
  name: 'App',
})
</script>

<script setup lang="ts">
const songList = ref<string[]>([])

const musicSrc = ref('../public/samples/2021.09.09 D 我在人民广场吃炸鸡.m4a')
// 歌词
const lyricFile = ref('')
// 当前播放时间
const currentTime = ref(0)

const audio = ref<HTMLVideoElement | null>(null)

// 是否暂停
const isPaused = ref(false)

// 歌词字体大小
const fontsize = ref(1.8)

// 当前选中的歌曲
const selectedIndex = ref(0)

const fontsizeRem = computed(() => {
  return `${fontsize.value}rem`
})

// 将00:00.00转换为秒数
const timeStrToNum = (str: string) => {
  const minute = Number(str.slice(0, 2))
  const second = Number(str.slice(3, 5))
  const minSec = Number(str.slice(6, 8))
  return minute * 60 + second + minSec / 100
}

// 更新播放时间
const timeupdate = () => {
  changeCurrentTime(audio.value?.currentTime || 0)
}
const changeCurrentTime = (newTime: number) => {
  currentTime.value = newTime
}
const handleChangeCurrentTime = (time: number) => {
  if (audio.value)
    audio.value.currentTime = time
}

const readFile = (filePath: string) => {
  // 创建一个新的xhr对象
  let xhr = null
  const okStatus = document.location.protocol === 'file' ? 0 : 200
  xhr = new XMLHttpRequest()
  xhr.open('GET', filePath, false)
  xhr.overrideMimeType('text/html;charset=utf-8')
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}

const changeAudio = (audioName: string, index: number) => {
  musicSrc.value = `../public/samples/${audioName}.m4a`
  lyricFile.value = readFile(`../public/samples/${audioName}.lrc`) || ''
  selectedIndex.value = index
}

onMounted(() => {
  lyricFile.value
    = readFile('../public/samples/2021.09.09 D 我在人民广场吃炸鸡.lrc') || ''
  const modulesFiles = import.meta.globEager('../public/samples/*.lrc', { as: 'raw' })

  for (const path in modulesFiles)
    songList.value.push(path.slice(path.lastIndexOf('/') + 1, path.length - 4))
  audio.value?.addEventListener('error', () => {
    musicSrc.value = musicSrc.value.replace('m4a', 'mp3')
  })
})
</script>

<template>
  <div id="app">
    <div class="audio-wrapper">
      <audio
        ref="audio"
        controls
        class="music-player"
        :src="musicSrc"
        :loop="true"
        @timeupdate="timeupdate"
        @pause="isPaused=true"
        @play="isPaused=false"
      />
      <div class="slider-title">
        Font Size:<el-slider v-model="fontsize" min="0.5" max="2.5" step="0.1" show-input input-size="small" />
      </div>
      <el-scrollbar height="400px">
        <p
          v-for="(song,idx) in songList" :key="idx" :class="
            [idx !== selectedIndex? 'scrollbar-demo-item':'scrollbar-demo-item-selected']" @click="changeAudio(song,idx)"
        >
          {{ song }}
        </p>
      </el-scrollbar>
    </div>

    <div class="lyric">
      <ASSLyric
        :lyric="lyricFile"
        :is-pasued="isPaused"
        :lyric-active-class="'lyric-active'"
        :lyric-center-class="'lyric-center'"
        triangle-width="14px"
        triangle-color="#fff"
        center-line-color="#fff"
        center-time-color="#fff"
        :current-time="currentTime"
        @change-current-time="handleChangeCurrentTime"
      />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  font-size: 16px;
  display: flex;
  grid-template-rows: 100px calc(100vh - 120px);
  justify-content: center;
  background-color: #64363c;
  margin: 0 auto;
}
.audio-wrapper {
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
}
.lyric {
  width: 100%;
  color: #adaaa8;
  box-sizing: border-box;
  border: 1px dashed #ccc;
  box-sizing: border-box;
  text-align: center;
  font:normal normal bold v-bind(fontsizeRem) 微软雅黑,sans-serif;
}
.lyric-active {
  // 需要最高级，否则可能被内部的.center-lyric覆盖
  color: #fff !important;
}
.lyric-center {
  color: #fff;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 1rem;
  height: 50px;
  margin: 10px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  cursor:pointer
}
.scrollbar-demo-item-selected {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 1rem;
  height: 50px;
  margin: 10px;
  border-radius: 4px;
  background: var(--el-color-primary-light-5);
  color: var(--el-color-primary);
  cursor:pointer
}
.slider-title {
  color: white;
}
</style>
