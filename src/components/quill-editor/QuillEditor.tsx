import { defineComponent, onMounted, reactive, ref, watch, PropType } from "vue"
// import './style.less'
import Quill, { QuillOptionsStatic, RangeStatic, Sources } from 'quill'
// import Delta from 'quill-delta'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
/**
 * 只读设置options: { theme: 'bubble', readOnly: true } 
 * 编辑设置options: { theme: 'snow' } 组件默认主题为snow
 * ps官方readOnly为true任可编辑，这里直接使用HTML渲染
 */
// 主题类型
export type QuillThemeType = 'bubble' | 'snow'

const defaultOptions = (imageCallback?: Function) =>{
  const options = {
    theme: 'snow',
    boundary: document.body,
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ],
        handlers: {
          // 'image': (value: any) => imageCallback(value)
        }
      }
    },
    placeholder: 'Insert text here ...',
    readOnly: false
  } as QuillOptionsStatic
  if (imageCallback && options.modules) {
    options.modules.toolbar.handlers.image = imageCallback
  }
  return options
}
const props = {
  content: String,
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object as PropType<QuillOptionsStatic>,
    default: () => {}
  },
  height: String,
  border: {
    type: Boolean,
    default: true
  },
  // toolbar中图片按钮点击回调
  imageCallback: {
    type: Function
  },
  // 图片上传成功后插入图片
  insertImage: {
    type: String,
    default: ''
  }
}
export default defineComponent({
  name: 'quill-editor',
  props,
  emits: ['blur', 'focus', 'update:modelValue', 'change', 'ready'],
  setup(props, { slots, emit, attrs }) {
    const state = reactive({
      options: {},
      content: '',
      readOnly: props.options?.readOnly || false
    })
    const quillEditor = ref(null)
    let quill: Quill
    watch(() => props.content, (val) => {
      if (!quill || !val || state.readOnly) return
      quill.pasteHTML(val)
    })
    watch(() => props.disabled, (val) => {
      if (!quill) return
      quill.enable(!props.disabled)
    })
    watch(() => props.insertImage, (path) => {
      !!path && insertImage(path)
    })

    onMounted(() => {
      initialize()
    })

    const initialize = () => {
      if (!quillEditor.value) return
      
      state.options = Object.assign({}, defaultOptions(props.imageCallback), props.options)
      console.log(state.options)
      if (!state.readOnly) {
        quill = new Quill(quillEditor.value, state.options)
        quill.enable(false)

        // set editor content
        if (props.modelValue) {
          quill.pasteHTML(props.modelValue)
        }

        quill.enable(!props.disabled)

        quill.on('selection-change', (range: RangeStatic) => {
          if (!range) {
            emit('blur', quill)
          } else {
            emit('focus', quill)
          }
        })

        // update model if text changes
        quill.on('text-change', (delta: any, oldContents: any, source: Sources) => {
          if (quillEditor.value) {
            const inputFile = quillEditor.value as HTMLInputElement
            let html = inputFile.children[0].innerHTML || ''
            const text = quill.getText()
            if (html === '<p><br></p>') html = ''
            state.content = html
            emit('update:modelValue', state.content)
            emit('change', { html, text, quill })
          }
        })
        // Emit ready event
        emit('ready', quill)
      } 
    }

    // 插入Image
    const insertImage = (path: string) => {
      // 获取光标位置
      const pos = quill.getSelection()?.index || 0
      // 插入图片到光标位置
      quill.insertEmbed(pos, 'image', path)
    }
    return () => <div class={'quill_editor'} style={{height: props.height || '100%'}}>
      <div class={'ql-toolbar'}>
        {slots.toolbar && slots.toolbar()}
      </div>
      {
        state.readOnly ?
        <div style={{'border': !props.border ? 'none' : ''}} class={['quill_content ql-container ql-snow', 'quill_content_no_padding']}>
          <div {...attrs} class={'ql-editor'} v-html={props.content}></div>
        </div>
        :
        <div ref={quillEditor} style={{'border': !props.border ? 'none' : ''}} class={['quill_content', props.options && props.options.readOnly ? 'quill_content_no_padding' : '']}></div>
      }
      
      <div style="display:none;">
        {
          slots.uploadButton && slots.uploadButton()
        }
      </div>
    </div>
  }
})