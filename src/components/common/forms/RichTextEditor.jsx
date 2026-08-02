// src/components/common/forms/RichTextEditor.jsx

'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import {
    FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
    FiAlignRight, FiAlignJustify, FiList,
    FiLink, FiImage, FiCode, FiCornerDownLeft, FiType,
    FiMinus, FiMaximize2, FiMinimize2,
    FiX
} from 'react-icons/fi';
import { IoListCircleOutline } from 'react-icons/io5';
import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/common/forms/RichTextEditor.module.css';

// Menu bar button component
const MenuButton = ({ isActive, onClick, icon: Icon, label, disabled = false }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${styles.menuButton} ${isActive ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
        title={label}
        aria-label={label}
    >
        <Icon size={16} />
    </button>
);

export default function RichTextEditor({
    name,
    label,
    placeholder = "Write something...",
    required = false,
    description,
    disabled = false,
    readOnly = false,
    size = 'md', // sm, md, lg
    className = '',
    inputClassName = '',
    labelClassName = '',
    toolbarPosition = 'top', // top, bottom
    showToolbar = true,
    minHeight = '150px',
    maxHeight = '400px',
    maxLength, // ADD THIS - maxLength prop
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];
    const [isExpanded, setIsExpanded] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    // Size classes
    const sizeClass = styles[`editor${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const editor = useEditor({
                    extensions: [
                        StarterKit.configure({
                            heading: {
                                levels: [1, 2, 3, 4],
                            },
                        }),
                        Link.configure({
                            openOnClick: false,
                            HTMLAttributes: {
                                class: styles.link,
                                target: '_blank',
                                rel: 'noopener noreferrer',
                            },
                        }),
                        TextAlign.configure({
                            types: ['heading', 'paragraph'],
                            alignments: ['left', 'center', 'right', 'justify'],
                        }),
                        Underline,
                        Highlight,
                        Image,
                    ],
                    content: field.value || '',
                    editable: !disabled && !readOnly,
                    onUpdate: ({ editor }) => {
                        const html = editor.getHTML();
                        field.onChange(html);
                        setEditorContent(html);
                    },
                    editorProps: {
                        attributes: {
                            class: `${styles.editorContent} ${sizeClass} ${error ? styles.error : ''} ${inputClassName}`,
                            'data-placeholder': placeholder,
                            style: {
                                minHeight: isExpanded ? '400px' : minHeight,
                                maxHeight: isExpanded ? 'none' : maxHeight,
                            },
                        },
                    },
                });

                // Update editor content when field value changes externally
                useEffect(() => {
                    if (editor && field.value !== undefined && field.value !== editor.getHTML()) {
                        editor.commands.setContent(field.value || '');
                    }
                }, [editor, field.value]);

                // Focus management
                useEffect(() => {
                    if (editor && !disabled && !readOnly) {
                        editor.commands.focus();
                    }
                }, [editor, disabled, readOnly]);

                // Set initial content
                useEffect(() => {
                    if (editor && field.value) {
                        editor.commands.setContent(field.value);
                    }
                }, [editor]);

                const toggleLink = useCallback(() => {
                    if (!editor) return;

                    const previousUrl = editor.getAttributes('link').href;
                    const url = window.prompt('Enter URL:', previousUrl);

                    if (url === null) return;

                    if (url === '') {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }

                    editor.chain().focus().setLink({ href: url }).run();
                }, [editor]);

                const toggleExpanded = () => {
                    setIsExpanded(!isExpanded);
                };

                const handleImageUpload = useCallback(() => {
                    if (!editor) return;

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';

                    input.onchange = () => {
                        const file = input.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const src = e.target?.result;
                            if (typeof src === 'string') {
                                editor.chain().focus().setImage({ src }).run();
                            }
                        };
                        reader.readAsDataURL(file);
                    };

                    input.click();
                }, [editor]);

                // Toolbar actions
                const actions = {
                    bold: () => editor?.chain().focus().toggleBold().run(),
                    italic: () => editor?.chain().focus().toggleItalic().run(),
                    underline: () => editor?.chain().focus().toggleUnderline().run(),
                    strike: () => editor?.chain().focus().toggleStrike().run(),
                    heading1: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                    heading2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                    heading3: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                    heading4: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
                    bulletList: () => editor?.chain().focus().toggleBulletList().run(),
                    orderedList: () => editor?.chain().focus().toggleOrderedList().run(),
                    blockquote: () => editor?.chain().focus().toggleBlockquote().run(),
                    codeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
                    leftAlign: () => editor?.chain().focus().setTextAlign('left').run(),
                    centerAlign: () => editor?.chain().focus().setTextAlign('center').run(),
                    rightAlign: () => editor?.chain().focus().setTextAlign('right').run(),
                    justifyAlign: () => editor?.chain().focus().setTextAlign('justify').run(),
                    highlight: () => editor?.chain().focus().toggleHighlight().run(),
                    clearFormat: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
                };

                // Check if editor is active
                const isActive = (extension, attributes) => {
                    if (!editor) return false;

                    if (extension === 'heading') {
                        return editor.isActive('heading', attributes);
                    }

                    return editor.isActive(extension);
                };

                const renderToolbar = showToolbar && !readOnly && !disabled;

                return (
                    <FormItem className={`${styles.formItem} ${className}`}>
                        {label && (
                            <FormLabel className={`${styles.formLabel} ${labelSizeClass} ${labelClassName}`}>
                                {label}
                                {required && <span className={styles.required}>*</span>}
                            </FormLabel>
                        )}

                        <FormControl>
                            <div className={`${styles.editorWrapper} ${error ? styles.hasError : ''} ${disabled ? styles.disabled : ''}`}>
                                {/* Toolbar - Top */}
                                {renderToolbar && toolbarPosition === 'top' && (
                                    <div className={styles.toolbar}>
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={isActive('bold')}
                                                onClick={actions.bold}
                                                icon={FiBold}
                                                label="Bold"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('italic')}
                                                onClick={actions.italic}
                                                icon={FiItalic}
                                                label="Italic"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('underline')}
                                                onClick={actions.underline}
                                                icon={FiUnderline}
                                                label="Underline"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('strike')}
                                                onClick={actions.strike}
                                                icon={FiMinus}
                                                label="Strikethrough"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={isActive('heading', { level: 1 })}
                                                onClick={actions.heading1}
                                                icon={FiType}
                                                label="Heading 1"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('heading', { level: 2 })}
                                                onClick={actions.heading2}
                                                icon={FiType}
                                                label="Heading 2"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('heading', { level: 3 })}
                                                onClick={actions.heading3}
                                                icon={FiType}
                                                label="Heading 3"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('heading', { level: 4 })}
                                                onClick={actions.heading4}
                                                icon={FiType}
                                                label="Heading 4"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={isActive('bulletList')}
                                                onClick={actions.bulletList}
                                                icon={FiList}
                                                label="Bullet List"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('orderedList')}
                                                onClick={actions.orderedList}
                                                icon={IoListCircleOutline}
                                                label="Ordered List"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={isActive('textAlign', { textAlign: 'left' })}
                                                onClick={actions.leftAlign}
                                                icon={FiAlignLeft}
                                                label="Align Left"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('textAlign', { textAlign: 'center' })}
                                                onClick={actions.centerAlign}
                                                icon={FiAlignCenter}
                                                label="Align Center"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('textAlign', { textAlign: 'right' })}
                                                onClick={actions.rightAlign}
                                                icon={FiAlignRight}
                                                label="Align Right"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('textAlign', { textAlign: 'justify' })}
                                                onClick={actions.justifyAlign}
                                                icon={FiAlignJustify}
                                                label="Justify"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={isActive('link')}
                                                onClick={toggleLink}
                                                icon={FiLink}
                                                label="Add Link"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('highlight')}
                                                onClick={actions.highlight}
                                                icon={FiCornerDownLeft}
                                                label="Highlight"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('image')}
                                                onClick={handleImageUpload}
                                                icon={FiImage}
                                                label="Insert Image"
                                                disabled={disabled}
                                            />
                                            <MenuButton
                                                isActive={isActive('codeBlock')}
                                                onClick={actions.codeBlock}
                                                icon={FiCode}
                                                label="Code Block"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <MenuButton
                                                isActive={false}
                                                onClick={actions.clearFormat}
                                                icon={FiX}
                                                label="Clear Formatting"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        <div className={styles.toolbarGroup}>
                                            <button
                                                type="button"
                                                onClick={toggleExpanded}
                                                className={`${styles.menuButton} ${isExpanded ? styles.active : ''}`}
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Editor Content */}
                                <div className={`${styles.editorContainer} ${isExpanded ? styles.expanded : ''}`}>
                                    <EditorContent editor={editor} />
                                </div>

                                {/* Character Count */}
                                {maxLength && (
                                    <div className={styles.charCount}>
                                        <span className={`${styles.charCountText} ${editor?.getText().length > maxLength ? styles.charCountExceed : ''}`}>
                                            {editor?.getText().length || 0} / {maxLength}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </FormControl>

                        {description && (
                            <FormDescription className={`${styles.description} ${descriptionSizeClass}`}>
                                {description}
                            </FormDescription>
                        )}

                        <FormMessage className={`${styles.errorMessage} ${errorSizeClass}`} />
                    </FormItem>
                );
            }}
        />
    );
}