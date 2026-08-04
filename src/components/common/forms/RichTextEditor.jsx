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
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import FontFamily from '@tiptap/extension-font-family'; // font family uses TextStyle
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

import {
    FiBold,
    FiItalic,
    FiUnderline,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiAlignJustify,
    FiList,
    FiLink,
    FiImage,
    FiCode,
    FiType,
    FiMinus,
    FiMaximize2,
    FiMinimize2,
    FiX,
    FiCheckSquare,
    FiCornerDownRight,
    FiCornerUpLeft,
    FiMenu,
    FiTable,
    FiDelete,
} from 'react-icons/fi';
import { IoListCircleOutline } from 'react-icons/io5';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '@/styles/common/forms/RichTextEditor.module.css';

// ---------- Small UI helpers ----------

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

const DropdownMenu = ({ trigger, children, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <div onClick={() => !disabled && setIsOpen((open) => !open)}>
                {trigger}
            </div>
            {isOpen && !disabled && (
                <div className={styles.dropdownContent}>
                    {children}
                </div>
            )}
        </div>
    );
};

const ColorPicker = ({ onSelect, currentColor, label, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);

    const colors = [
        '#000000', '#DC2626', '#EF4444', '#F87171', '#FCA5A5',
        '#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
        '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
        '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE',
        '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A',
        '#DB2777', '#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8',
        '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB',
        '#FFFFFF',
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.colorPickerWrapper} ref={pickerRef}>
            <button
                type="button"
                className={`${styles.colorPickerTrigger} ${disabled ? styles.disabled : ''}`}
                onClick={() => !disabled && setIsOpen((open) => !open)}
                disabled={disabled}
                title={label}
            >
                <span
                    className={styles.colorPreview}
                    style={{ backgroundColor: currentColor || '#000000' }}
                />
            </button>
            {isOpen && !disabled && (
                <div className={styles.colorPickerDropdown}>
                    <div className={styles.colorPickerGrid}>
                        {colors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`${styles.colorOption} ${currentColor === color ? styles.colorSelected : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    onSelect(color);
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ---------- Config constants ----------

const LINE_HEIGHT_OPTIONS = [
    { value: '1', label: '1.0' },
    { value: '1.15', label: '1.15' },
    { value: '1.5', label: '1.5' },
    { value: '1.75', label: '1.75' },
    { value: '2', label: '2.0' },
    { value: '2.5', label: '2.5' },
    { value: '3', label: '3.0' },
];

const BULLET_STYLES = [
    { value: 'disc', label: '●', name: 'Normal Bullet' },
    { value: 'circle', label: '○', name: 'Circle Bullet' },
    { value: 'square', label: '■', name: 'Square Bullet' },
];

const NUMBERING_STYLES = [
    { value: 'decimal', label: '1.', name: '1, 2, 3' },
    { value: 'decimal-parenthesis', label: '1)', name: '1), 2), 3)' },
    { value: 'upper-roman', label: 'I.', name: 'I, II, III' },
    { value: 'upper-alpha', label: 'A.', name: 'A, B, C' },
    { value: 'lower-alpha', label: 'a.', name: 'a, b, c' },
    { value: 'lower-roman', label: 'i.', name: 'i, ii, iii' },
];

const FONT_FAMILIES = [
    { label: 'Default', value: '' },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Monospace', value: '"Fira Code", monospace' },
];

// ---------- Main component ----------

export default function RichTextEditor({
    name,
    label,
    placeholder = 'Write something...',
    required = false,
    description,
    disabled = false,
    readOnly = false,
    size = 'md',
    className = '',
    inputClassName = '',
    labelClassName = '',
    toolbarPosition = 'top',
    showToolbar = true,
    minHeight = '150px',
    maxHeight = '400px',
    maxLength,
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    const [isExpanded, setIsExpanded] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');
    const [selectedLineHeight, setSelectedLineHeight] = useState('1.5');

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
                            bulletList: {
                                keepMarks: true,
                                keepAttributes: false,
                            },
                            orderedList: {
                                keepMarks: true,
                                keepAttributes: false,
                            },
                            listItem: {
                                nested: true,
                            },
                        }),
                        TextStyle, // needed for font family, font size, color [web:11]
                        FontFamily.configure({ types: ['textStyle'] }), // [web:1]
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
                        Highlight.configure({ multicolor: true }),
                        Color,
                        Image,
                        TaskList,
                        TaskItem.configure({ nested: true }),
                        Subscript,
                        Superscript,
                        Table.configure({
                            resizable: true,
                        }), // [web:17]
                        TableRow,
                        TableHeader,
                        TableCell,
                    ],
                    content: field.value || '',
                    editable: !disabled && !readOnly,
                    onUpdate: ({ editor }) => {
                        const html = editor.getHTML();
                        field.onChange(html);
                    },
                    editorProps: {
                        attributes: {
                            class: `${styles.editorContent} ${sizeClass} ${error ? styles.error : ''} ${inputClassName}`,
                            'data-placeholder': placeholder,
                            style: {
                                minHeight: isExpanded ? '400px' : minHeight,
                                maxHeight: isExpanded ? 'none' : maxHeight,
                                lineHeight: selectedLineHeight,
                            },
                        },
                    },
                    ...props,
                });

                // sync external value
                useEffect(() => {
                    if (editor && field.value !== undefined && field.value !== editor.getHTML()) {
                        editor.commands.setContent(field.value || '');
                    }
                }, [editor, field.value]);

                // optional autofocus
                useEffect(() => {
                    if (editor && !disabled && !readOnly) {
                        editor.commands.focus();
                    }
                }, [editor, disabled, readOnly]);

                // ensure initial content
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

                const toggleExpanded = () => setIsExpanded((exp) => !exp);

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

                const setTextColorHandler = useCallback((color) => {
                    if (!editor) return;
                    setTextColor(color);
                    editor.chain().focus().setColor(color).run();
                }, [editor]);

                const setHighlightColorHandler = useCallback((color) => {
                    if (!editor) return;
                    setHighlightColor(color);
                    editor.chain().focus().toggleHighlight({ color }).run();
                }, [editor]);

                const setLineHeight = useCallback((value) => {
                    setSelectedLineHeight(value);
                    if (editor) {
                        editor.view.dom.style.lineHeight = value;
                    }
                }, [editor]);

                const toggleBulletList = useCallback((style) => {
                    if (!editor) return;
                    editor.chain().focus().toggleBulletList().run();
                    const listElements = editor.view.dom.querySelectorAll('ul');
                    listElements.forEach((el) => {
                        if (style === 'circle') {
                            el.style.listStyleType = 'circle';
                        } else if (style === 'square') {
                            el.style.listStyleType = 'square';
                        } else {
                            el.style.listStyleType = 'disc';
                        }
                    });
                }, [editor]);

                const toggleOrderedList = useCallback((style) => {
                    if (!editor) return;
                    editor.chain().focus().toggleOrderedList().run();
                    const listElements = editor.view.dom.querySelectorAll('ol');
                    listElements.forEach((el) => {
                        if (style === 'upper-roman') {
                            el.style.listStyleType = 'upper-roman';
                        } else if (style === 'upper-alpha') {
                            el.style.listStyleType = 'upper-alpha';
                        } else if (style === 'lower-alpha') {
                            el.style.listStyleType = 'lower-alpha';
                        } else if (style === 'lower-roman') {
                            el.style.listStyleType = 'lower-roman';
                        } else {
                            el.style.listStyleType = 'decimal';
                        }

                        if (style === 'decimal-parenthesis') {
                            el.style.listStyleType = 'none';
                            el.style.counterReset = 'item';
                            const styleEl = document.createElement('style');
                            styleEl.textContent = `
                .custom-ol-parenthesis li::marker {
                  content: counter(item) ") ";
                }
              `;
                            document.head.appendChild(styleEl);
                            el.classList.add('custom-ol-parenthesis');
                            el.style.counterReset = 'item';
                            el.querySelectorAll('li').forEach((li, index) => {
                                li.style.counterIncrement = `item ${index + 1}`;
                            });
                        }
                    });
                }, [editor]);

                const indent = useCallback(() => {
                    if (!editor) return;
                    editor.chain().focus().sinkListItem('listItem').run();
                }, [editor]);

                const outdent = useCallback(() => {
                    if (!editor) return;
                    editor.chain().focus().liftListItem('listItem').run();
                }, [editor]);

                const setFontFamily = useCallback((family) => {
                    editor?.chain().focus().setFontFamily(family || null).run();
                }, [editor]);

                const insertTable = useCallback(() => {
                    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                }, [editor]);

                const deleteTable = useCallback(() => {
                    editor?.chain().focus().deleteTable().run();
                }, [editor]);

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
                    taskList: () => editor?.chain().focus().toggleTaskList().run(),
                    blockquote: () => editor?.chain().focus().toggleBlockquote().run(),
                    codeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
                    leftAlign: () => editor?.chain().focus().setTextAlign('left').run(),
                    centerAlign: () => editor?.chain().focus().setTextAlign('center').run(),
                    rightAlign: () => editor?.chain().focus().setTextAlign('right').run(),
                    justifyAlign: () => editor?.chain().focus().setTextAlign('justify').run(),
                    clearFormat: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
                    indent,
                    outdent,
                    subscript: () => editor?.chain().focus().toggleSubscript().run(),
                    superscript: () => editor?.chain().focus().toggleSuperscript().run(),
                };

                const isActive = (extension, attributes) => {
                    if (!editor) return false;
                    if (extension === 'heading') {
                        return editor.isActive('heading', attributes);
                    }
                    return editor.isActive(extension, attributes);
                };

                const renderToolbar = showToolbar && !readOnly && !disabled;

                const currentFontFamily = editor?.getAttributes('textStyle').fontFamily || '';

                return (
                    <FormItem className={`${styles.formItem} ${className}`}>
                        {label && (
                            <FormLabel className={`${styles.formLabel} ${labelSizeClass} ${labelClassName}`}>
                                {label}
                                {required && <span className={styles.required}>*</span>}
                            </FormLabel>
                        )}

                        <FormControl>
                            <div
                                className={`${styles.editorWrapper} ${error ? styles.hasError : ''} ${disabled ? styles.disabled : ''
                                    }`}
                            >
                                {renderToolbar && toolbarPosition === 'top' && (
                                    <div className={styles.toolbar}>
                                        {/* Font family */}
                                        <div className={styles.toolbarGroup}>
                                            <select
                                                className={styles.select}
                                                value={currentFontFamily}
                                                onChange={(e) => setFontFamily(e.target.value)}
                                                disabled={disabled}
                                            >
                                                {FONT_FAMILIES.map((f) => (
                                                    <option key={f.value || 'default'} value={f.value}>
                                                        {f.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Text formatting */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('bold')} onClick={actions.bold} icon={FiBold} label="Bold" disabled={disabled} />
                                            <MenuButton isActive={isActive('italic')} onClick={actions.italic} icon={FiItalic} label="Italic" disabled={disabled} />
                                            <MenuButton isActive={isActive('underline')} onClick={actions.underline} icon={FiUnderline} label="Underline" disabled={disabled} />
                                            <MenuButton isActive={isActive('strike')} onClick={actions.strike} icon={FiMinus} label="Strikethrough" disabled={disabled} />
                                            <MenuButton isActive={isActive('subscript')} onClick={actions.subscript} icon={FiCornerDownRight} label="Subscript" disabled={disabled} />
                                            <MenuButton isActive={isActive('superscript')} onClick={actions.superscript} icon={FiCornerUpLeft} label="Superscript" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Text color */}
                                        <div className={styles.toolbarGroup}>
                                            <ColorPicker
                                                onSelect={setTextColorHandler}
                                                currentColor={textColor}
                                                label="Text Color"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Highlight color */}
                                        <div className={styles.toolbarGroup}>
                                            <ColorPicker
                                                onSelect={setHighlightColorHandler}
                                                currentColor={highlightColor}
                                                label="Highlight Color"
                                                disabled={disabled}
                                            />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Headings */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('heading', { level: 1 })} onClick={actions.heading1} icon={FiType} label="Heading 1" disabled={disabled} />
                                            <MenuButton isActive={isActive('heading', { level: 2 })} onClick={actions.heading2} icon={FiType} label="Heading 2" disabled={disabled} />
                                            <MenuButton isActive={isActive('heading', { level: 3 })} onClick={actions.heading3} icon={FiType} label="Heading 3" disabled={disabled} />
                                            <MenuButton isActive={isActive('heading', { level: 4 })} onClick={actions.heading4} icon={FiType} label="Heading 4" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Lists */}
                                        <div className={styles.toolbarGroup}>
                                            <DropdownMenu
                                                trigger={
                                                    <MenuButton isActive={isActive('bulletList')} onClick={() => { }} icon={FiList} label="Bullet List" disabled={disabled} />
                                                }
                                                disabled={disabled}
                                            >
                                                {BULLET_STYLES.map((style) => (
                                                    <div
                                                        key={style.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => toggleBulletList(style.value)}
                                                    >
                                                        <span>{style.label}</span> {style.name}
                                                    </div>
                                                ))}
                                                <div className={styles.dropdownDivider} />
                                                <div className={styles.dropdownItem} onClick={actions.taskList}>
                                                    <FiCheckSquare size={14} /> Task List
                                                </div>
                                            </DropdownMenu>

                                            <DropdownMenu
                                                trigger={
                                                    <MenuButton isActive={isActive('orderedList')} onClick={() => { }} icon={IoListCircleOutline} label="Ordered List" disabled={disabled} />
                                                }
                                                disabled={disabled}
                                            >
                                                {NUMBERING_STYLES.map((style) => (
                                                    <div
                                                        key={style.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => toggleOrderedList(style.value)}
                                                    >
                                                        <span>{style.label}</span> {style.name}
                                                    </div>
                                                ))}
                                            </DropdownMenu>

                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Indent controls */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={false} onClick={actions.outdent} icon={FiCornerUpLeft} label="Decrease Indent" disabled={disabled} />
                                            <MenuButton isActive={false} onClick={actions.indent} icon={FiCornerDownRight} label="Increase Indent" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Alignment */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('textAlign', { textAlign: 'left' })} onClick={actions.leftAlign} icon={FiAlignLeft} label="Align Left" disabled={disabled} />
                                            <MenuButton isActive={isActive('textAlign', { textAlign: 'center' })} onClick={actions.centerAlign} icon={FiAlignCenter} label="Align Center" disabled={disabled} />
                                            <MenuButton isActive={isActive('textAlign', { textAlign: 'right' })} onClick={actions.rightAlign} icon={FiAlignRight} label="Align Right" disabled={disabled} />
                                            <MenuButton isActive={isActive('textAlign', { textAlign: 'justify' })} onClick={actions.justifyAlign} icon={FiAlignJustify} label="Justify" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Line height */}
                                        <div className={styles.toolbarGroup}>
                                            <DropdownMenu
                                                trigger={
                                                    <MenuButton isActive={false} onClick={() => { }} icon={FiMenu} label="Line Height" disabled={disabled} />
                                                }
                                                disabled={disabled}
                                            >
                                                {LINE_HEIGHT_OPTIONS.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className={styles.dropdownItem}
                                                        onClick={() => setLineHeight(option.value)}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </DropdownMenu>
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Tables */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('table')} onClick={insertTable} icon={FiTable} label="Insert Table" disabled={disabled} />
                                            <MenuButton isActive={false} onClick={deleteTable} icon={FiDelete} label="Delete Table" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Advanced */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('link')} onClick={toggleLink} icon={FiLink} label="Add Link" disabled={disabled} />
                                            <MenuButton isActive={isActive('image')} onClick={handleImageUpload} icon={FiImage} label="Insert Image" disabled={disabled} />
                                            <MenuButton isActive={isActive('codeBlock')} onClick={actions.codeBlock} icon={FiCode} label="Code Block" disabled={disabled} />
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Clear formatting & Expand */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={false} onClick={actions.clearFormat} icon={FiX} label="Clear Formatting" disabled={disabled} />
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

                                <div className={`${styles.editorContainer} ${isExpanded ? styles.expanded : ''}`}>
                                    <EditorContent editor={editor} />
                                </div>

                                {maxLength && (
                                    <div className={styles.charCount}>
                                        <span
                                            className={`${styles.charCountText} ${editor?.getText().length > maxLength ? styles.charCountExceed : ''
                                                }`}
                                        >
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