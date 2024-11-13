'use client'

import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface EditorProps {
  value: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ value, onChange }: EditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(evt, editor) => {
        editorRef.current = editor
      }}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
          'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media link | help',
        skin: 'oxide-dark',
        content_css: 'dark',
        images_upload_handler: async (blobInfo, progress) => {
          const formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())

          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })

            if (!response.ok) throw new Error('Upload failed')
            const data = await response.json()
            return data.url
          } catch (error) {
            console.error('Upload error:', error)
            throw error
          }
        },
        automatic_uploads: true,
        file_picker_types: 'image',
        image_advtab: true,
        image_uploadtab: true,
      }}
    />
  )
}