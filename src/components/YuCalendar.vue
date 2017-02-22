<template>
  <div>
    <div>
      <input type="number" :value="year" @input="year = $event.target.value">年
      <input type="number" :value="month" @input="getMonth($event.target.value)">月
      <br/>
      当前选择了：{{selectedDate}}
      <ol>
        <li v-for="weekdate in weekAry">{{weekdate}}</li>
        <li class="can-act" v-for="day in renderList.prevList">{{day}}</li>
        <li @click="selectDate(day)" class="crt-month" :class="{'selected': index == selectIndex}" v-for="(day, index) in renderList.crtList">{{day}}</li>
        <li class="can-act" v-for="day in renderList.nextList">{{day}}</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { getRenderList, zero } from '../utils.js'
export default {
  data () {
    return {
      weekAry: ['天', '一', '二', '三', '四', '五', '六'],
      year: (new Date).getFullYear(),
      month: (new Date).getMonth() + 1,
      selectedDate: '',
      selectIndex: -1
    }
  },
  computed: {
    renderList () {
      try {
        return getRenderList(this.year, this.month)
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    getMonth (val) {
      let month
      if (val > 12) {
        this.year++
        this.month = val - 12
      } else if (val < 1) {
        this.year--
        this.month = 12 - val
      } else {
        this.month = val
      }
    },
    selectDate (day) {
      this.selectIndex = day - 1
      let year = zero(this.year)
      let month = zero(this.month)
      let date = zero(day)
      let selectedDate = year + '-' + month + '-' + date
      console.log(selectedDate)
      this.selectedDate = selectedDate
    }
  }
}
</script>

<style scoped>
  ol {
    display: block;
    list-style-type: none;
    width: 420px;
  }

  li {
    float: left;
    display: block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .can-act {
    color: rgb(180,180,180);
  }
  .crt-month {
    color: rgb(60,60,60);
    cursor: pointer;
  }
  .crt-month:hover {
    background-color: #f2f2f2;
  }
  li.selected {
    background-color: rgb(120,120,120);
    color: #fff;
  }
  li.selected:hover {
    background-color: rgb(120,120,120);
    color: #fff;
  }
</style>