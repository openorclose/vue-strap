<template>
    <span ref="trigger" :class="[addClass || (this.trigger === 'click' ? 'click-trigger' : 'other-trigger')]"><slot></slot></span>
</template>

<script>
  import {globalEventBus} from './GlobalEventBus.js'

  export default {
    props: {
      trigger: {
        type: String,
        default: 'hover'
      },
      for: {
        type: String
      },
      _triggerBy: {
        type: Object
      },
      addClass: {
        type: String,
        default: ''
      }
    },
    mounted () {
      let events = {contextmenu: 'contextmenu', hover: 'mouseleave mouseenter', focus: 'blur focus'}
      jQuery(this.$el).on(events[this.trigger] || 'click', (e) => {
        if (e && this.trigger === 'contextmenu') e.preventDefault()
        if (!this._triggerBy) {
          globalEventBus.$emit('trigger:bind', this, this.for)
        }
        this._triggerBy && this._triggerBy.toggle(e)
      })
    },
    methods: {
      setTriggerBy (vm) {
        this._triggerBy = vm
      }
    }
  }
</script>

<style>
    .click-trigger {
        cursor: pointer;
        text-decoration: underline dashed;
    }
    .other-trigger {
        text-decoration: underline dotted;
    }
</style>
