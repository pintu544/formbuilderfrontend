/* eslint-disable react/prop-types */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

const RichText = ({ content, setEditorContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Underline words here to convert them into blanks.",
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <div className="relative group">
      <button
        className="hidden group-focus-within:block w-7 h-7 font-medium underline rounded bg-neutral-400 text-white absolute -top-7 left-0 cursor-pointer"
        onClick={() =>
          editor?.isActive("underline")
            ? editor?.chain().focus().unsetUnderline().run()
            : editor?.chain().focus().setUnderline().run()
        }
      >
        U
      </button>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichText;
