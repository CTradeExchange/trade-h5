<template>
    <div :class="['popover-tips', modelValue ? 'show' : 'hide']">
        <div class='popover-relative'>
            <span class='triangle'></span>
            <div class='text'>
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
import { watch, ref } from 'vue'
export default {
    props: {
        // 是否显示
        modelValue: {
            type: Boolean,
            default: false
        },
        // 提示文案
        text: {
            type: String,
            default: ''
        },
        // 是否自动关闭
        autoClose: {
            type: Boolean,
            default: false
        },
        // 自动关闭的时间
        closeTime: {
            type: Number,
            default: 3000
        }
    },
    setup (props, { emit }) {
        const timer = ref(null)
        watch(() => props.modelValue, () => {
            if (props.modelValue && props.autoClose) {
                timer.value && clearTimeout(timer.value)
                timer.value = setTimeout(() => {
                    emit('update:modelValue', false)
                }, props.closeTime)
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.popover-tips {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: rem(600px);
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  transition: 0.15s ease-in;
  z-index: 100;
  opacity: 1;
  visibility: visible;
  &.hide {
      transform: translateY(-10px);
      visibility: hidden;
      opacity: 0;
  }
}
.popover-relative {
  line-height: 1.4;
  position: relative;
  background: #4C5260;
  color: #FFF;
  padding: rem(12px) rem(24px);
  font-size: rem(27px);
  border-radius: rem(10px);
  .triangle {
      border-width: rem(18px);
      border-style: solid;
      border-color: transparent;
      border-top-color: #4C5260;
      position: absolute;
      left: 50%;
      bottom: rem(-30px);
      transform: translateX(-50%);
  }
}
</style>
