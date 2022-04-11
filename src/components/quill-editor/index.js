import Quill, { QuillOptionsStatic } from 'quill'
import QuillEditor from "./QuillEditor"
QuillEditor.install = function(app) {
  app.component(QuillEditor.name, QuillEditor)
}

// const Vue3QuillEditor = { Quill, QuillEditor, QuillOptionsStatic }
export default QuillEditor
export { Quill, QuillOptionsStatic }
