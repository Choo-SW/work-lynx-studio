"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import '../styles/editor.css';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content = '', 
  onChange,
  placeholder = '내용을 입력하세요...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    immediatelyRender: false, // SSR hydration mismatch 방지
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
      {/* 툴바 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '8px 12px',
        borderBottom: '1px solid #d9d9d9',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <Space.Compact>
          <Button
            size="small"
            type={editor.isActive('bold') ? 'primary' : 'default'}
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="굵게 (Ctrl+B)"
          />
          <Button
            size="small"
            type={editor.isActive('italic') ? 'primary' : 'default'}
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="기울임 (Ctrl+I)"
          />
          <Button
            size="small"
            type={editor.isActive('strike') ? 'primary' : 'default'}
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="취소선"
          />
        </Space.Compact>

        <Space.Compact>
          <Button
            size="small"
            type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
          <Button
            size="small"
            type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
          <Button
            size="small"
            type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button
            size="small"
            type={editor.isActive('bulletList') ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="글머리 기호"
          />
          <Button
            size="small"
            type={editor.isActive('orderedList') ? 'primary' : 'default'}
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="번호 매기기"
          />
        </Space.Compact>

        <Space.Compact>
          <Button
            size="small"
            type={editor.isActive('blockquote') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="인용"
          >
            "
          </Button>
          <Button
            size="small"
            type={editor.isActive('code') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="코드"
          >
            {'<>'}
          </Button>
          <Button
            size="small"
            type={editor.isActive('codeBlock') ? 'primary' : 'default'}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="코드 블록"
          >
            {'{ }'}
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="실행 취소 (Ctrl+Z)"
          />
          <Button
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="다시 실행 (Ctrl+Y)"
          />
        </Space.Compact>
      </div>

      {/* 에디터 영역 */}
      <EditorContent 
        editor={editor} 
        style={{ 
          minHeight: 300,
          background: '#fff',
        }} 
      />
    </div>
  );
};

export default RichTextEditor;
