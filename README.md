# vue3-quill
Quill editor for vue3  

<p lign="left">
  <a href="https://www.npmjs.com/package/vue3-quill-editor-vite"><img src="https://img.shields.io/npm/v/vue3-quill-editor-vite?style=flat-square" alt="Version"></a>
  <a href="https://npmcharts.com/compare/vue3-quill-editor-vite?minimal=true"><img src="https://img.shields.io/npm/dm/vue3-quill-editor-vite.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue3-quill-editor-vite"><img src="https://img.shields.io/npm/l/vue3-quill-editor-vite.svg?sanitize=true" alt="License"></a>
</p>

## Homepage
[vue3-quill-editor-vite github-page](https://github.com/uniquker/vue3-quill-editor-vite.git)

## Usage

```javascript
npm i vue3-quill-editor-vite
yarn add vue3-quill-editor-vite
```
Global Registration:
```javascript
// global
import { QuillEditor, Quill } from 'vue3-quill-editor-vite'
import 'vue3-quill-editor-vite/dist/style.css'
app.use(QuillEditor)

```
or Local Registration:
```javascript
//single file
import { QuillEditor, Quill } from 'vue3-quill-editor-vite'
import 'vue3-quill-editor-vite/dist/style.css'

export default {
  components: {
    [QuillEditor.name]: QuillEditor
  }
}

```
In .vue
```vue
<template>
  <quill-editor
    v-model:value="state.content"
    :options="state.editorOption"
    :disabled="state.disabled"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  />
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'App',
  setup() {
    const state = reactive({
      content: '<p>2333</p>',
      _content: '',
      editorOption: {
        placeholder: 'core',
        modules: {
          // toolbars: [
            // custom toolbars options
            // will override the default configuration
          // ],
          // other moudle options here
          // otherMoudle: {}
        },
        // more options
      },
      disabled: false
    })

    const onEditorBlur = (quill) => {
      console.log('editor blur!', quill)
    }
    const onEditorFocus = (quill) => {
      console.log('editor focus!', quill)
    }
    const onEditorReady = (quill) => {
      console.log('editor ready!', quill)
    }
    const onEditorChange = ({ quill, html, text }) => {
      console.log('editor change!', quill, html, text)
      state._content = html
    }

    setTimeout(() => {
      state.disabled = true
    }, 2000)

    return { state, onEditorBlur, onEditorFocus, onEditorReady, onEditorChange }
  }
}
</script>
```

# Options  
## Form Input Bindings: v-model
The v-model directive can be used to create a two-way data binding. For example:  
```vue3
<quill-editor v-model:value="state.content"></quill-editor>

// tsx
<QuillEditor v-model:value={state.content} />
```
## Event binding
```vue3
<quill-editor
    v-model:value="state.content"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
    @change="onEditorChange($event)"
  />

// tsx
<QuillEditor
    v-model:value={state.content}
    @blur={onEditorBlur}
    @focus={onEditorFocus}
    @ready={onEditorReady}
    @change={onEditorChange}
  />
```
## readOnly
```vue3
const options = {readOnly: true}

<quill-editor
    v-model:value="state.content"
    :options="options"
  />

// tsx
<QuillEditor
    v-model:value={state.content}
    options={options}
  />
```
## image upload
```vue3
const state = reactive({
	value: '',
	content: '',
	insertImage: ''
})
const quillImage = ref(null)
const options = {readOnly: true}

// Select file event
const selectFile = () => {
	if (quillImage.value) {
		const inputFile = quillImage.value as HTMLInputElement
		inputFile.click()
	}
}

const uploadImage = function (res: Event) {
	const inputFile = res.target as HTMLInputElement
	if (inputFile.files && inputFile.files.length) {
		// Picture upload logic
		doUpload(inputFile.files[0]).then((value: string) => {
			console.log(value)
			state.insertImage = value
		})
	}
}

<quill-editor
	height={'100%'}
	v-model={state.value}
	content={state.content}
	imageCallback={selectFile}
	insertImage={state.insertImage}
>
	<template #uploadButton>
		<input ref="quillImage" type="file" onChange="uploadImage" accept="image/*" />
	</template>
</quill-editor>

// tsx
<QuillEditor
		height={'100%'}
		v-model={state.value}
		content={state.content}
		imageCallback={selectImage}
		insertImage={state.insertImage}
		v-slots={{
			'uploadButton': () => <input ref={quillImage} type="file" onChange={uploadImage} accept="image/*" />
		}}
	/>
```
The following events and arguments are available:
- **blur**  argu: quill
- **focus**   argu: quill
- **ready**   argu: quill
- **change**  argu: html, text, quill

## Options prop
- **options**  
  Apply the default options by not passing this prop.  
  The options passed in will override the default preset options.  
  For example:  
  ```js
  modules: {
    toolbar: []
  }
  ```
  this option will generate an empty toolbar.  
  Check the offical doc [Quill Documentation](https://quilljs.com/docs/configuration/) for all options.
- **disabled**  
  **Default:** `false`  
  Set `true` to disabled the editor.
  As the value of `readOnly` when initialized.
  Value changing will call API [Quill Documentation](https://quilljs.com/docs/api/#enable) of quill after initialization.
  

# Default Quill options
```javascript
modules: {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
    ['link', 'image', 'video']
  ]
}
```

# Packages
Borrowing from: [vue-quill-editor](https://github.com/surmon-china/vue-quill-editor)  Inspired by this one  


# Development
```shell
# root dir
yarn serve
```

# Welcome PR  
Thanks to the open source. :heart:  
