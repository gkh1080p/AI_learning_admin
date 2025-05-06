<template>
  <el-row style="position: relative" class="course">
    <el-col :span="17" style="position: relative">
      <div style="padding-top: 70%" />
      <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;">
        <div id="J_prismPlayer" />
      </div>
    </el-col>
    <el-col :key="refreshKey" :span="7" class="selection">
      <div v-for="chapter of chapterData" :key="chapter.id" class="chapter">

        <div class="title ellipsis" :title="chapter.title">{{ chapter.title }}</div>
        <h3>课程列表</h3>
        <div v-for="(value) of videoData[chapter.id]" :key="`${chapter.id}:${value.id}`"
          :class="{ 'video': true, 'active': activeItem === `${chapter.id}:${value.id}` }"
          @click="play(value.videoId); activeItem = `${chapter.id}:${value.id}`;">
          <div class="title ellipsis" :title="value.title">
            <i class="el-icon-video-play" />
            {{ value.title }}
          </div>
          <div class="info">
            <span class="duration">时长: {{ value.duration }}</span>
          </div>

        </div>
        <!-- 讲义列表 -->
        <h3>讲义列表</h3>
        <div class="materials" v-if="materialData[chapter.id] && materialData[chapter.id].length">
          <div v-for="item in materialData[chapter.id]" :key="item.id" class="material-item">
            <a :href="item.eduMaterialId" target="_blank" rel="noopener noreferrer" class="material-link"
              :title="item.title">
              <i class="el-icon-document material-icon" />
              <span class="material-title ellipsis">{{ item.title }}</span>
              <span class="material-title ellipsis">{{ item.createTime.split(' ')[0] }}</span>
            </a>
          </div>
        </div>

      </div>
    </el-col>
  </el-row>
</template>

<script>
import { listChapters } from '@/api/chapter'
import { listVideos, getPlayAuth } from '@/api/video'
import { listMeterial } from '@/api/material'
export default {
  name: 'EducourseWatch',
  data() {
    return {
      courseId: null,
      player: null,
      chapterData: [],
      // <chapterId, videoList>
      videoData: {},
      materialData: {},
      refreshKey: false,
      activeItem: ''
    }
  },
  methods: {
    setData(courseId) {
      this.courseId = courseId
      this.listChaptersAndVideos(courseId)
    },
    listChaptersAndVideos(courseId) {
      listChapters(courseId).then(resp => {
        this.chapterData = resp.data
        let len = resp.data.length
        for (const c of resp.data) {
          listVideos(c.id).then(resp => {
            console.log('视频列表', resp.data)
            this.$set(this.videoData, c.id, resp.data)
            // 获取完视频列表
            if (!this.player && this.videoData[this.chapterData[0].id]?.[0]) {
              const firstVideo = this.videoData[this.chapterData[0].id][0]
              this.play(firstVideo.videoId)
              this.activeItem = `${this.chapterData[0].id}:${firstVideo.id}`
            }
          })
          listMeterial(c.id).then(resp => {
            console.log('资料列表', resp.data)
            this.$set(this.materialData, c.id, resp.data)
          })
        }
      })
    },
    play(videoSourceId) {
      if (this.player) {
        // const autoPlay = this.player.getStatus() === 'playing'
        // 销毁播放器
        this.player.dispose()
        this.player = null
        document.getElementById('J_prismPlayer').innerHTML = ''
        getPlayAuth(videoSourceId).then(resp => {
          // eslint-disable-next-line no-undef
          this.player = new Aliplayer({
            id: 'J_prismPlayer',
            autoplay: false,
            width: '100%',
            height: '100%',
            vid: videoSourceId,
            playauth: resp.data
          })
        })
      } else {
        getPlayAuth(videoSourceId).then(resp => {
          // eslint-disable-next-line no-undef
          this.player = new Aliplayer({
            id: 'J_prismPlayer',
            autoplay: false,
            width: '100%',
            height: '100%',
            vid: videoSourceId,
            playauth: resp.data
          })
        })
      }
    },

    dispose() {
      if (this.player) {
        this.player.dispose()
        document.getElementById('J_prismPlayer').innerHTML = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.course {
  .selection {
    position: absolute;
    right: 0;
    height: 100%;
    padding: 20px 16px;
    overflow: auto;
    background-color: #232323;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #64a5ff;
    }

    &::-webkit-scrollbar-track {
      background: #232323;
    }
  }
}

.chapter {
  color: #c7c7c7;
  margin-top: 16px;

  >.title {
    font-size: 16px;
  }

  .video {
    font-size: 14px;
    margin-top: 16px;
    cursor: pointer;

    i {
      margin-right: 6px;
    }

    &:hover,
    &.active {
      color: #20a0ff;

      .duration {
        color: #20a0ff;
      }
    }

    .info {
      font-size: 12px;
      margin: 5px 0 0 20px;
      color: #777777;

      span {
        margin-right: 12px;

        &:last-child {
          margin-right: 0;
        }
      }

      .free {
        color: #ff4f23;
      }
    }
  }
}

.materials {
  margin-top: 12px;
  padding-left: 4px;
  border-left: 3px solid #409EFF;
  color: #fff;
}

.material-item {
  margin: 6px 0;
  background: #1f1b1b;
  border-radius: 6px;
  transition: background 0.2s;
  padding: 8px 12px;
  color: #fff;
}

.material-item:hover {
  background-color: #159843;
}

.material-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.material-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #409EFF;
}

.material-title {
  font-size: 14px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
