<template>
  <div>
    <div>
      <input type="text" :value="computedDate" @click.stop="calendarShow = true">


      <div v-show="calendarShow" @click.stop="" class="calendar-container clearfix" :class="{'single-width': doublePanel == false, 'double-width': doublePanel == true}">
        <div class="calendar-header clearfix">
          <div class="calendar-contrl">
            <div class="triangle triangle-up" @click="togglePanel(false)"></div>
            <div class="triangle triangle-down" @click="togglePanel(true)"></div>
          </div>
          <div class="calendar-title">{{year}}年 {{month}}月</div>
          <div class="calendar-title" v-if="doublePanel">{{new Date(year, month).getFullYear()}}年 {{new Date(year, month).getMonth() + 1}}月</div>
        </div>

        <ol class="clearfix" :class="{'double-mg-right': doublePanel == true}">
          <li class="week" v-for="weekdate in weekList">{{weekdate}}</li>
          <li class="cant-act" v-for="day in renderCrtMonthList.prevList">{{day}}</li>
          <li @click="selectDate(day)" class="crt-month" :class="activeClass(index)" v-for="(day, index) in renderCrtMonthList.crtList">{{day}}</li>
          <li class="cant-act" v-for="day in renderCrtMonthList.nextList">{{day}}</li>
        </ol>
        <ol class="clearfix" v-if="doublePanel">
          <li class="week" v-for="weekdate in weekList">{{weekdate}}</li>
          <li class="cant-act" v-for="day in renderNextMonthList.prevList">{{day}}</li>
          <li @click="selectDate(day, true)" class="crt-month" :class="activeNextPanelClass(index)" v-for="(day, index) in renderNextMonthList.crtList">{{day}}</li>
          <li class="cant-act" v-for="day in renderNextMonthList.nextList">{{day}}</li>
        </ol>
      </div>

    </div>
  </div>
</template>

<script>
import { getRenderList, zero } from '../utils.js'
let rangeStartEndKey = [null, 'start', 'end']
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
      calendarShow: false,
      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth() + 1,
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
  mounted () {
    document.addEventListener('click', (event) => {
      this.calendarShow = false
    })
  },
  computed: {
    renderCrtMonthList () {
      return getRenderList(this.year, this.month, this.doublePanel)
    },
    renderNextMonthList () {
      return getRenderList(this.year, this.month + 1, this.doublePanel)
    },
    computedDate () {
      if (typeof this.selectedDate === 'object') {
        let reverse = (new Date(this.rangeData.start.year, this.rangeData.start.month, this.rangeData.start.day) - new Date(this.rangeData.end.year, this.rangeData.end.month, this.rangeData.end.day)) > 0 ? [2, 1] : [1, 2]
        let start = zero(this.rangeData[rangeStartEndKey[reverse[0]]].year) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[0]]].month) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[0]]].day)
        let end = zero(this.rangeData[rangeStartEndKey[reverse[1]]].year) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[1]]].month) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[1]]].day)
        if (start === end) return start
        return start + '——' + end
      } else {
        return this.selectedDate
      }
    }
  },
  methods: {
    activeClass (index) {
      if (this.rangeClass(index) === 'selected') return 'selected'
      if (!this.range) {
        if (index === this.selectIndex && this.selectedYear === this.year && this.selectedMonth === this.month) return 'selected'
      } else {
        if (this.selectedDate === '') {
          if (index === this.rangeData.start.index && this.rangeData.start.year === this.year && this.rangeData.start.month === this.month) return 'selected'
        } else {
          if (index === this.rangeData.start.index && this.rangeData.start.year === this.year && this.rangeData.start.month === this.month) return 'selected'
          if (index === this.rangeData.end.index && this.rangeData.end.year === this.year && this.rangeData.end.month === this.month) return 'selected'
        }
      }
    },
    activeNextPanelClass (index) {
      if (this.rangeClass(index, true) === 'selected') return 'selected'
      let crtDateStr = zero(this.year) + zero(this.month)
      let nextDate
      let nextDateSrt
      if (!this.range) {
        nextDate = new Date(this.selectedYear, this.selectedMonth - 2)
        nextDateSrt = zero(nextDate.getFullYear()) + zero(nextDate.getMonth() + 1)
        if (index === this.selectIndex && crtDateStr === nextDateSrt) return 'selected'
      } else {
        nextDate = new Date(this.rangeData.start.year, this.rangeData.start.month - 2)
        nextDateSrt = zero(nextDate.getFullYear()) + zero(nextDate.getMonth() + 1)
        if (this.selectedDate === '') {
          if (index === this.rangeData.start.index && crtDateStr === nextDateSrt) return 'selected'
        } else {
          let endNextDate = new Date(this.rangeData.end.year, this.rangeData.end.month - 2)
          let endNextDateSrt = zero(endNextDate.getFullYear()) + zero(endNextDate.getMonth() + 1)
          if (index === this.rangeData.start.index && crtDateStr === nextDateSrt) return 'selected'
          if (index === this.rangeData.end.index && crtDateStr === endNextDateSrt) return 'selected'
        }
      }
    },
    rangeClass (index, isNextPanel) {
      if (!this.range || this.selectedDate === '') return ''
      let monthNum = isNextPanel ? 0 : 1
      let crt = new Date(this.year, this.month - monthNum, index + 1)
      // console.log(this.rangeData.start.year, this.rangeData.start.month, this.rangeData.start.day)
      // console.log(this.rangeData.end.year, this.rangeData.end.month, this.rangeData.end.day)
      let start = new Date(this.rangeData.start.year, this.rangeData.start.month - 1, this.rangeData.start.day)
      let end = new Date(this.rangeData.end.year, this.rangeData.end.month - 1, this.rangeData.end.day)
      let isPositive = !!(end - start >=0)
      let rangeFlag = isPositive ? Number(crt) >= Number(start) && Number(crt) <= Number(end) : Number(crt) >= Number(end) && Number(crt) <= Number(start)
      if (rangeFlag) return 'selected'
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
    togglePanel (isNext) {
      let count = this.doublePanel ? 2 : 1
      if (isNext) this.getMonth(this.month + count)
      else this.getMonth(this.month - count)
    },
    selectDate (day, isNextPanel) {
      let reverse
      let year
      let month
      let date = day
      if (!isNextPanel) {
        year = this.year
        month = this.month
      } else {
        let tempDate = new Date(this.year, this.month)
        year = tempDate.getFullYear()
        month = tempDate.getMonth() + 1
      }
      let selectedDate = zero(year) + '-' + zero(month) + '-' + zero(date)
      if (!this.range) {
        this.selectIndex = day - 1
        this.selectedYear = year
        this.selectedMonth = month
        this.selectedDate = selectedDate
      } else {
        this.selectedDate = ''
        this.rangeData.clickCount++
        this.rangeData[rangeStartEndKey[this.rangeData.clickCount]].index = day - 1
        this.rangeData[rangeStartEndKey[this.rangeData.clickCount]].year = year
        this.rangeData[rangeStartEndKey[this.rangeData.clickCount]].month = month
        this.rangeData[rangeStartEndKey[this.rangeData.clickCount]].day = day
        if (this.rangeData.clickCount === 2) {
          this.rangeData.clickCount = 0
          reverse = (new Date(this.rangeData.start.year, this.rangeData.start.month, this.rangeData.start.day) - new Date(this.rangeData.end.year, this.rangeData.end.month, this.rangeData.end.day)) > 0 ? [2, 1] : [1, 2]
          this.selectedDate = {
            start: zero(this.rangeData[rangeStartEndKey[reverse[0]]].year) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[0]]].month) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[0]]].day),
            end: zero(this.rangeData[rangeStartEndKey[reverse[1]]].year) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[1]]].month) + '-' + zero(this.rangeData[rangeStartEndKey[reverse[1]]].day)
          }
        }
      }
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

  .calendar-header {
    text-align: center;
    margin: 12px 22px 0 0;
    position: relative;
    height: 30px;
  }

  .calendar-title {
    float: left;
    width: 50%;
    font-size: 20px;
    color: rgb(46, 46, 46);
  }

  .calendar-contrl {
    position: absolute;
    right: 0;
  }

  .calendar-container {
    border: 1px solid #eee;
    box-shadow: 0 0 12px 1px rgba(0,0,0,.1);
    border-radius: 4px;
    position: absolute;
    background-color: #fff;
  }

  .single-width {
    width: 306px;
  }

  .double-width {
    width: 612px;
  }

  ol {
    display: block;
    list-style-type: none;
    width: 280px;
    padding: 0 8px 10px 8px;
    margin: 0;
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

  .triangle {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    cursor: pointer;
  }

  .triangle:hover {
    opacity: 0.6;
  }

  .triangle-up {
    border-bottom: 10px solid #20A0FF;
    margin-bottom: 3px;
  }
  .triangle-down {
    border-top: 10px solid #20A0FF;
  }
</style>
