<template>
  <div class="clock">
    <div class="clock__time">{{time}}</div>
    <div class="clock__date">
      <span>{{day}}</span>
      <span>{{month}}</span>
      <span>{{year}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Clock',
    data: function () {
      return {
        year: 0,
        month: 0,
        day: 0,
        time: 0,
      }
    },
    created() {
      const instance = this

      function setTime() {
        let date = new Date()
        this.year = date.getFullYear()
        this.month = date.toLocaleString('ru', {month: 'long',})
        this.day = date.getDate()
        this.time = date.toLocaleString('ru', {hour: 'numeric', minute: 'numeric'})
      }

      setTime.call(instance)

      setInterval(function () {
        setTime.call(instance)
      }, 1000)
    },
  }
</script>

<style lang="scss" scoped>
  .clock {
    text-align: center;
  }

  .clock__time {
    font-size: 48px;
    line-height: 1;
    color: #db342a;
    margin-bottom: -1px;
  }

  .clock__date {
    font-size: 20px;
    line-height: 1;
    color: #565656;
    display: flex;
    span {
      padding: 0 4px;
    }
  }
</style>