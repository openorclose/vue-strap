import {coerce} from './utils.js'
import $ from './NodeList.js'
import md from './markdown.js'

export default {
  props: {
    trigger: {
      type: String
    },
    effect: {
      type: String,
      default: 'fade'
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    header: {
      type: Boolean,
      coerce: coerce.boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'top'
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      position: {
        top: 0,
        left: 0
      },
      show: false
    }
  },
  computed: {
    contentRendered () {
      return md.renderInline(this.content)
    },
    titleRendered () {
      return md.renderInline(this.title)
    }
  },
  methods: {
    /**
     * Reset the trigger element
     * @param el a Vue instance
     */
    setTrigger (el) {
      let events = {contextmenu: 'contextmenu', hover: 'mouseleave mouseenter', focus: 'blur focus'}
      this.trigger = el.trigger
      this._trigger = el.$el
      jQuery(el.$el).on(events[this.trigger] || 'click', this.toggle)
    },
    toggle (e) {
      if (e && this.trigger === 'contextmenu') e.preventDefault()
      if (!(this.show = !this.show)) {
        return
      }
      setTimeout(() => {
        const popover = this.$els.popover
        const trigger = this._trigger.children.length === 0 ? this._trigger : this._trigger.children[0]
        switch (this.placement) {
          case 'top' :
            this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
            this.position.top = trigger.offsetTop - popover.offsetHeight
            break
          case 'left':
            this.position.left = trigger.offsetLeft - popover.offsetWidth
            this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
            break
          case 'right':
            this.position.left = trigger.offsetLeft + trigger.offsetWidth
            this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
            break
          case 'bottom':
            this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
            this.position.top = trigger.offsetTop + trigger.offsetHeight
            break
          default:
            console.warn('Wrong placement prop')
        }
        popover.style.top = this.position.top + 'px'
        popover.style.left = this.position.left + 'px'
      }, 0)
    }
  },
  ready () {
    let trigger = this.$els.trigger
    if (!trigger) return console.error('Could not find trigger v-el in your component that uses popoverMixin.')

    if (this.trigger === 'focus' && !~trigger.tabIndex) {
      trigger = $('a,input,select,textarea,button', trigger)
      if (!trigger.length) {
        trigger = null
      }
    }
    if (trigger) {
      let events = {contextmenu: 'contextmenu', hover: 'mouseleave mouseenter', focus: 'blur focus'}
      $(trigger).on(events[this.trigger] || 'click', this.toggle)
      this._trigger = trigger
    }
  },
  beforeDestroy () {
    if (this._trigger) $(this._trigger).off()
  }
}