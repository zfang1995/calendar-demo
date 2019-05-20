<script>
import { default as generateDays, getToday } from "./generateDays.js";
let moment = require("moment");

export default {
  name: "calendar",
  data() {
    let today = getToday();
    let startMonth = today.moment
      .clone()
      .startOf("month")
      .subtract(2, "M");
    let endMonth = today.moment
      .clone()
      .add(2, "M")
      .endOf("month");
    return {
      today,
      startMonth,
      endMonth,
      selectedDay: undefined,
      days: generateDays(startMonth, endMonth),
      cbe: true,
      sliderOptions: { slidesPerColumn: 1, initialSlide: 2, autoHeight: true },
      currentSlideIndex: 2,
      calendarTitle: ""
    };
  },
  methods: {
    selectDay(day) {
      this.selectedDay = day;
      this.calendarTitle = this.selectedDay.moment.format("YYYY-M-D");
    },
    footerClickHandler() {
      this.calendarBeenExpanded = !this.calendarBeenExpanded;
    },
    translateDaysModelToTableRows(days) {
      let tableRows = [];
      for (let index = 0; index < days.length; index++) {
        const day = days[index];
        let tableCell = (
          <div
            class={[
              "table-cell",
              this.selectedDay &&
              this.selectedDay.moment.isSame(day.moment, "day")
                ? "selected"
                : "",
              this.today.moment.isSame(day.moment, "day") ? "today" : "",
              day.events.length !== 0 ? "eventNotice" : ""
            ]}
            key={index}
            onClick={this.selectDay.bind(this, day)} // 此处可用事件代理技术进行重构以减少性能开销。
          >
            {day.dayOfMonth}
          </div>
        );
        if (day.dayOfWeek === 0 || day.dayOfMonth === 1) {
          // 新建表行
          let tableRow = (
            <div
              class="table-row"
              days={{ [day.moment.format("YYYY-M-D")]: day }}
            >
              {tableCell}
            </div>
          );
          tableRows.push(tableRow);
          if (day.dayOfMonth === 1) {
            // 为每月的第一行注入空白单元格作为占位符
            for (let index = 0; index < day.dayOfWeek; index++) {
              tableRow.children.unshift(<div class="table-cell" />);
            }
          }
        } else {
          // 把单元格添加进表行内
          let row = tableRows[tableRows.length - 1];
          row.children.push(tableCell);
          row.data.attrs.days[day.moment.format("YYYY-M-D")] = day;
        }
        if (
          day.moment
            .clone()
            .endOf("month")
            .date() === day.dayOfMonth
        ) {
          let row = tableRows[tableRows.length - 1];
          // 为每月的最后一行设置标识
          row.data.isLastRowAtMonthView = true;
          // 为每月的最后一行添加空白单元格作为占位符
          for (let dayOfWeek = day.dayOfWeek + 1; dayOfWeek < 7; dayOfWeek++) {
            row.children.push(<div class="table-cell" />);
          }
        }
      }
      return tableRows;
    },
    gotoToday() {
      let targetIndex;
      let slides = this.calendarBeenExpanded
        ? this.slidesOfMonthView
        : this.slidesOfWeekView;

      for (let index = 0; index < slides.length; index++) {
        const slide = slides[index];
        if (
          slide.data.attrs.days.hasOwnProperty(
            this.today.moment.format("YYYY-M-D")
          )
        ) {
          targetIndex = index;
          break;
        }
      }
      this.calendarSlider.slideTo(targetIndex, 0, false);
      this.selectDay(this.today);
      this.currentSlideIndex = targetIndex;
    },
    extendDurationRange(direction = "toBoth") {
      if (direction === "toLeft") {
        this.startMonth = this.startMonth.clone().subtract(2, "M");
      } else if (direction === "toRight") {
        this.endMonth = this.endMonth.clone().add(2, "M");
      } else if (direction === "toBoth") {
        this.startMonth = this.startMonth.clone().subtract(1, "M");
        this.endMonth = this.endMonth.clone().add(1, "M");
      } else {
        console.warn("unexpected argument：'" + direction + "'");
      }
    },
    slideNextHandler() {
      this.currentSlideIndex++;
      let currentSlideIndex = this.currentSlideIndex;
      this.calendarTitle = this._calendarTitle;
      if (
        currentSlideIndex >= this.calendarSlider.slides.length - 2 &&
        currentSlideIndex <= this.calendarSlider.slides.length - 1
      ) {
        this.extendDurationRange("toRight");
      }
    },
    slidePrevHandler() {
      this.currentSlideIndex--;
      let currentSlideIndex = this.currentSlideIndex;
      this.calendarTitle = this._calendarTitle;
      if (currentSlideIndex >= 0 && currentSlideIndex <= 1) {
        this.extendDurationRange("toLeft");
      }
    }
  },
  computed: {
    calendarSlider() {
      return this.$refs.calendarSlider.swiper;
    },
    calendarBeenExpanded: {
      get() {
        return this.cbe;
      },
      set(val) {
        let calendarSlider = this.calendarSlider;
        if (val && val !== this.cbe) {
          // 从收缩到展开
          let targetIndex = this.slidesOfWeekView[this.currentSlideIndex].data
            .attrs.expandTo;
          this.currentSlideIndex = targetIndex;
          window.console.log(targetIndex);
          this.$nextTick(function() {
            setTimeout(() => {
              calendarSlider.slideTo(targetIndex, 0, false);
            }, 0);
          });
        } else if (!val && val !== this.cbe) {
          // 从展开到收缩
          let targetIndex = this.slidesOfMonthView[this.currentSlideIndex].data
            .attrs.shrinkTo;
          this.currentSlideIndex = targetIndex;
          this.$nextTick(function() {
            setTimeout(() => {
              calendarSlider.slideTo(targetIndex, 0, false);
            }, 0);
          });
        }
        this.cbe = val;
        return true;
      }
    },
    calendarTableRows() {
      return this.translateDaysModelToTableRows(this.days);
    },
    slidesOfWeekView() {
      let monthCounter = 0;
      return this.calendarTableRows.map((e, i) => {
        let days = e.data.attrs.days;
        let slide = (
          <swiper-slide
            class="slide"
            key={i}
            expandTo={monthCounter}
            days={days}
            title={Object.values(days)[0].moment.format("YYYY-M")}
          >
            {e}
          </swiper-slide>
        );
        if (e.data.isLastRowAtMonthView) monthCounter++;
        return slide;
      });
    },
    slidesOfMonthView() {
      let rowsOfSlide = [];
      let counter = 0;
      let days = {};
      return this.calendarTableRows.reduce(
        (slides, tableRow, tableRowIndex) => {
          Object.assign(days, tableRow.data.attrs.days);
          rowsOfSlide.push(tableRow);
          if (tableRow.data.isLastRowAtMonthView) {
            let amountOfWeeks = rowsOfSlide.length;
            let slide = (
              <swiper-slide
                class="slide"
                key={counter}
                shrinkTo={tableRowIndex - amountOfWeeks + 1}
                amountOfWeeks={amountOfWeeks}
                days={days}
                title={Object.values(days)[0].moment.format("YYYY-M")}
              >
                {rowsOfSlide}
              </swiper-slide>
            );
            slides.push(slide);
            rowsOfSlide = [];
            days = {};
            counter++;
          }
          return slides;
        },
        []
      );
    },
    _calendarTitle() {
      if (this.calendarBeenExpanded) {
        return this.slidesOfMonthView[this.currentSlideIndex].data.attrs.title;
      } else {
        return this.slidesOfWeekView[this.currentSlideIndex].data.attrs.title;
      }
    }
  },
  created() {
    this.calendarTitle = this._calendarTitle;
  },
  watch: {
    startMonth(newVal, oldVal) {
      window.console.log("start month changed");
      if (moment.isMoment(newVal) && newVal.isBefore(oldVal)) {
        let original_index = this.currentSlideIndex;
        let original_slidesOfMonthViewLength = this.slidesOfMonthView.length;
        let original_slidesOfWeekViewLength = this.slidesOfWeekView.length;
        this.days.unshift(
          ...generateDays(
            newVal,
            oldVal
              .clone()
              .subtract(1, "M")
              .endOf("month")
          )
        );

        this.$nextTick(() => {
          let offset = this.calendarBeenExpanded
            ? this.slidesOfMonthView.length - original_slidesOfMonthViewLength
            : this.slidesOfWeekView.length - original_slidesOfWeekViewLength;
          this.calendarSlider.slideTo(original_index + offset, 0, false);
          this.currentSlideIndex = original_index + offset;
        });
      } else {
        window.console.error("unexpected argument: ", newVal);
      }
    },
    endMonth(newVal, oldVal) {
      window.console.log("end month changed");
      if (moment.isMoment(newVal) && newVal.isAfter(oldVal)) {
        this.days.push(
          ...generateDays(
            oldVal
              .clone()
              .add(1, "M")
              .startOf("month"),
            newVal
          )
        );
      } else {
        window.console.error("unexpected argument: ", newVal);
      }
    }
  },
  render(createElement) {
    createElement;
    let slides = this.calendarBeenExpanded
      ? this.slidesOfMonthView
      : this.slidesOfWeekView;
    let eventsList = this.selectedDay
      ? this.selectedDay.events.map(e => (
          <div class="item">
            <div class="at-left">
              <div class="title">{e.title}</div>
              <div class="content">{e.content}</div>
              <div class={["role", e.role]}>我的角色 {e.role}</div>
            </div>
            <div class="at-right">
              <div>{e.time}</div>
              <div class="dots">···</div>
            </div>
          </div>
        ))
      : null;
    let placeholder = <div class="placeholder">您尚未选择日期</div>;
    return (
      <div class="page">
        <div
          class={[
            this.calendarBeenExpanded ? "calendarBeenExpanded" : "",
            "calendar"
          ]}
        >
          <div class="header">
            <div class="title">{this.calendarTitle}</div>
            <div class="button today" onClick={this.gotoToday}>
              今天
            </div>
          </div>
          <div class="body table">
            <div class="table-head">
              <div class="table-cell">日</div>
              <div class="table-cell">一</div>
              <div class="table-cell">二</div>
              <div class="table-cell">三</div>
              <div class="table-cell">四</div>
              <div class="table-cell">五</div>
              <div class="table-cell">六</div>
            </div>
            <swiper
              class="table-body slider"
              ref="calendarSlider"
              options={this.sliderOptions}
              vOn:slideNextTransitionEnd={this.slideNextHandler}
              vOn:slidePrevTransitionEnd={this.slidePrevHandler}
            >
              {slides}
            </swiper>
          </div>
          <div
            class={[
              "footer button toggle",
              this.calendarBeenExpanded ? "button-up-ward" : ""
            ]}
            onClick={this.footerClickHandler}
          />
        </div>
        <div class="events">
          <div class="header">
            <div class="nav-bar">
              <div class="selected nav-bar-item">已设置提醒</div>
              <div class="nav-bar-item">创建时间</div>
              <div class="nav-bar-item">最后发言时间</div>
            </div>
          </div>
          <div class="body list">{eventsList || placeholder}</div>
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@light-gray: rgb(204, 204, 204);
@blue: rgb(42, 87, 154);
@orange: rgb(255, 155, 0);
@light-blue: rgb(135, 214, 243);

@table-row-height: 11vw;

.page {
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.calendar > .header {
  color: white;
  background-color: rgb(51, 51, 51);
  height: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.today.button {
  position: absolute;
  right: 0;
  padding: 1em;
}

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 9.3vw;
  color: @light-gray;
  font-weight: bold;
}

// .calendarBeenExpanded .table-body {
//   height: fit-content;
// }

.slide {
  height: fit-content;
}

.table-row {
  display: flex;
  height: @table-row-height;
  font-weight: 525;
}

.table-cell {
  flex-grow: 1;
  flex-basis: 14.28%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
}

.today {
  position: relative;
}
.today::before {
  content: "";
  height: inherit;
  width: @table-row-height;
  margin: auto;
  position: absolute;
  z-index: -2;
  border: 1px solid @blue;
  box-sizing: border-box;
  border-radius: 50%;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.table-cell.selected {
  position: relative;
}
.table-cell.selected::before {
  content: "";
  height: inherit;
  width: @table-row-height;
  position: absolute;
  z-index: -2;
  border: 1px solid @blue;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: @blue;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.table-cell.eventNotice {
  position: relative;
}
.table-cell.eventNotice::after {
  content: "\2022";
  font-size: 5vw;
  font-weight: bolder;
  height: inherit;
  width: @table-row-height;
  position: absolute;
  vertical-align: bottom;
  z-index: -1;
  top: 1vw;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: @orange;
}

.footer {
  height: 8.5vw;
  &.button {
    mask-image: url("./arrow-of-double-angle-pointing-down.svg");
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 4vw;
    background-image: linear-gradient(to bottom, @blue, @light-blue);
  }
  &.button-up-ward {
    transform: rotate(180deg);
  }
}

.events {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
}

.events .nav-bar {
  display: flex;
  justify-content: space-around;
  height: 12vw;
  align-items: center;
  box-shadow: 0px 4px 6px 0px rgba(196, 196, 196, 1);
  & > .nav-bar-item.selected {
    color: @blue;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    &::after {
      content: "";
      position: absolute;
      display: block;
      height: 2px;
      width: 80%;
      bottom: 0;
      left: 10%;
      background-color: @blue;
    }
  }
}
.events > .header::before {
  content: "";
  height: 2px;
  width: 100%;
  display: block;
  background-color: rgb(242, 242, 242);
}
.events > .header::after {
  content: "";
  height: 1.5vw;
  width: 100%;
  display: block;
  background-color: rgb(242, 242, 242);
}
.events > .body {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.events .item {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  height: 21vw;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 1.9vw 0;
  padding-left: 5vw;
  padding-right: 1vw;
  border-bottom: 1px solid rgba(240, 240, 240, 0.9);
  & .title {
    font-size: 4.5vw;
    font-weight: bold;
    color: black;
  }
  & .content {
    font-size: 4.5vw;
    color: @light-gray;
  }
  & .role.交办人 {
    color: @blue;
    font-size: 4.5vw;
  }
  & .role.经办人 {
    color: @orange;
    font-size: 4.5vw;
  }
  & > .at-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 3vw;
    color: @light-gray;
    & > .dots {
      font-size: 8vw;
      font-family: "Times New Roman", Times, serif;
      font-weight: bold;
    }
  }
}
.placeholder {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: @light-gray;
}
</style>
