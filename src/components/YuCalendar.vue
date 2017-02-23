<template>
  <div>
    <div>
      <input type="number" :value="year" @input="year = $event.target.value">年
      <input type="number" :value="month" @input="getMonth($event.target.value)">月
      <br/>
      当前选择了：{{selectedDate}}

      <div class="calendar-container clearfix" :class="{'single-width': doublePanel == false, 'double-width': doublePanel == true}">
        <ol class="clearfix" :class="{'double-mg-right': doublePanel == true}">
          <li class="week" v-for="weekdate in weekList">{{weekdate}}</li>
          <li class="cant-act" v-for="day in renderCrtMonthList.prevList">{{day}}</li>
          <li @click="selectDate(day)" class="crt-month" :class="activeClass(index)" v-for="(day, index) in renderCrtMonthList.crtList">{{day}}</li>
          <li class="cant-act" v-for="day in renderCrtMonthList.nextList">{{day}}</li>
        </ol>
        <ol class="clearfix" v-if="doublePanel">
          <li class="week" v-for="weekdate in weekList">{{weekdate}}</li>
          <li class="cant-act" v-for="day in renderNextMonthList.prevList">{{day}}</li>
          <li @click="selectNextPanelData(day)" class="crt-month" :class="activeNextPanelClass(index)" v-for="(day, index) in renderNextMonthList.crtList">{{day}}</li>
          <li class="cant-act" v-for="day in renderNextMonthList.nextList">{{day}}</li>
        </ol>
      </div>

    </div>
  </div>
</template>

<script>
import { getRenderList, zero } from '../utils.js'
export default {
  props: {
    range: {
      type: Boolean,
      default: false
    },
    doublePanel: {
      type: Boolean,
      default: false
    },
    weekList: {
      type: Array,
      default () {
        return ['天', '一', '二', '三', '四', '五', '六']
      }
    }
  },
  data () {
    return {
      year: (new Date).getFullYear(),
      month: (new Date).getMonth() + 1,
      selectedYear: 0,
      selectedMonth: 0,
      selectedDate: '',
      selectIndex: -1,
      rangeData: {
        clickCount: 0,
        start: {
          index: -1,
          year: 0,
          month: 0,
          day: 0
        },
        end: {
          index: -1,
          year: 0,
          month: 0,
          day: 0
        }
      }
    }
  },
  computed: {
    renderCrtMonthList () {
      return getRenderList(this.year, this.month, this.doublePanel)
    },
    renderNextMonthList () {
      return getRenderList(this.year, this.month + 1, this.doublePanel)
    }
  },
  methods: {
    activeClass (index) {
      if (index === this.selectIndex && this.selectedYear === this.year && this.selectedMonth === this.month) return 'selected'
    },
    activeNextPanelClass (index) {
      let crtDateStr = zero(this.year) + zero(this.month)
      let nextDate = new Date(this.selectedYear, this.selectedMonth - 2)
      let nextDateSrt = zero(nextDate.getFullYear()) + zero(nextDate.getMonth() + 1)
      // console.log(crtDateStr, nextDateSrt)
      if (index === this.selectIndex && crtDateStr === nextDateSrt) {
        return 'selected'
      }
    },
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
      let yearStr = zero(this.year)
      let monthStr = zero(this.month)
      let date = zero(day)
      let selectedDate = yearStr + '-' + monthStr + '-' + date
      if (!this.range) {
        this.selectIndex = day - 1
        this.selectedYear = this.year
        this.selectedMonth = this.month
        this.selectedDate = selectedDate
      } else {
        this.rangeData.clickCount++
        if (this.rangeData.clickCount === 1) {
          this.rangeData.start.index = day - 1
          this.rangeData.start.year = this.year
          this.rangeData.start.month = this.month
          this.rangeData.start.day = day
        } else if (this.rangeData.clickCount === 2) {
          this.rangeData.end.index = day - 1
          this.rangeData.end.year = this.year
          this.rangeData.end.month = this.month
          this.rangeData.end.day = day
          this.rangeData.clickCount = 0
        }
      }
      console.log(this.rangeData)
    },
    selectNextPanelData (day) {
      let tempDate = new Date(this.year, this.month)
      this.selectIndex = day - 1
      this.selectedYear = tempDate.getFullYear()
      this.selectedMonth = tempDate.getMonth() + 1
      let yearStr = zero(this.selectedYear)
      let monthStr = zero(this.selectedMonth)
      let date = zero(day)
      let selectedDate = yearStr + '-' + monthStr + '-' + date
      this.selectedDate = selectedDate
    }
  }
}
</script>

<style scoped>
  .clearfix:before, .clearfix:after {
    content:"";
    display:table;
  }

  .clearfix:after { clear: both;}

  .clearfix { *zoom:1;}

  .calendar-container {
    border: 1px solid #eee;
    box-shadow: 0 0 12px 1px rgba(0,0,0,.1);
    border-radius: 4px;
  }

  .single-width {
    width: 300px;
  }

  .double-width {
    width: 600px;
  }

  ol {
    display: block;
    list-style-type: none;
    width: 280px;
    padding: 0 5px;
    float: left;
  }

  .double-mg-right {
    margin-right: 15px;
  }

  li {
    float: left;
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .week {
    color: rgb(150,150,150);
  }
  .cant-act {
    color: rgb(200,200,200);
  }
  .crt-month {
    color: rgb(60,60,60);
    cursor: pointer;
  }
  .crt-month:hover {
    background-color: #f2f2f2;
  }
  li.selected {
    background-color: #20A0FF;
    color: #fff;
    transition: all .1s ease;
  }

  li[class~=selected] {
    border-radius: 50%;
  }

  li.selected:hover {
    background-color: #20A0FF;
    color: #fff;
  }
</style>
