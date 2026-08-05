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
import FontFamily from '@tiptap/extension-font-family';
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
    FiTable,
    FiDelete,
    FiEdit,
} from 'react-icons/fi';
import { IoListCircleOutline } from 'react-icons/io5';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '@/styles/common/forms/RichTextEditor.module.css';

// Import constants
import {
    BULLET_STYLES,
    NUMBERING_STYLES,
    FONT_FAMILIES,
    COLOR_PALETTE,
    TABLE_DEFAULT_CONFIG,
} from '@/constants/richTextEditor.constants';

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
    const [customColor, setCustomColor] = useState('');
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        onSelect(color);
    };

    const handleCustomColorInput = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        // Only apply if it's a valid hex color
        if (/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)) {
            onSelect(color);
        }
    };

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
                        {COLOR_PALETTE.map((color) => (
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

                    {/* Custom color picker section */}
                    <div className={styles.colorPickerCustom}>
                        <div className={styles.colorPickerCustomLabel}>
                            <FiEdit size={12} />
                            <span>Custom Color</span>
                        </div>
                        <div className={styles.colorPickerCustomInput}>
                            <input
                                type="color"
                                value={customColor || currentColor || '#000000'}
                                onChange={handleCustomColorChange}
                                className={styles.colorPickerNativeInput}
                                title="Pick a custom color"
                            />
                            <input
                                type="text"
                                value={customColor || currentColor || ''}
                                onChange={handleCustomColorInput}
                                placeholder="#000000"
                                className={styles.colorPickerHexInput}
                                maxLength={7}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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
    // Feature flags
    enableHeadings = false,
    enableTables = false,
    enableFontFamily = true,
    enableTextColor = true,
    enableHighlightColor = true,
    enableTaskList = true,
    enableSubSuperscript = true,
    enableBlockquote = true,
    enableCodeBlock = true,
    enableImage = true,
    enableLink = true,
    enableTextAlign = true,
    enableUnderline = true,
    enableStrike = true,
    enableClearFormat = true,
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    const [isExpanded, setIsExpanded] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');

    const sizeClass = styles[`editor${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    // Build extensions based on enabled features
    const getExtensions = () => {
        const extensions = [];

        // StarterKit with configurable options
        const starterKitConfig = {
            heading: enableHeadings ? { levels: [1, 2, 3, 4] } : false,
            bulletList: { keepMarks: true, keepAttributes: false },
            orderedList: { keepMarks: true, keepAttributes: false },
            listItem: { nested: true },
            blockquote: enableBlockquote ? {} : false,
            codeBlock: enableCodeBlock ? {} : false,
            bold: {},
            italic: {},
            strike: enableStrike ? {} : false,
        };

        extensions.push(StarterKit.configure(starterKitConfig));

        // TextStyle - required for font family and color
        extensions.push(TextStyle);

        // Font Family
        if (enableFontFamily) {
            extensions.push(FontFamily.configure({ types: ['textStyle'] }));
        }

        // Link
        if (enableLink) {
            extensions.push(
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        class: styles.link,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                    },
                })
            );
        }

        // Text Align
        if (enableTextAlign) {
            extensions.push(
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                    alignments: ['left', 'center', 'right', 'justify'],
                })
            );
        }

        // Underline
        if (enableUnderline) {
            extensions.push(Underline);
        }

        // Highlight
        if (enableHighlightColor) {
            extensions.push(Highlight.configure({ multicolor: true }));
        }

        // Color
        if (enableTextColor) {
            extensions.push(Color);
        }

        // Image
        if (enableImage) {
            extensions.push(Image);
        }

        // Task List
        if (enableTaskList) {
            extensions.push(TaskList);
            extensions.push(TaskItem.configure({ nested: true }));
        }

        // Subscript & Superscript
        if (enableSubSuperscript) {
            extensions.push(Subscript);
            extensions.push(Superscript);
        }

        // Tables
        if (enableTables) {
            extensions.push(
                Table.configure({
                    resizable: true,
                })
            );
            extensions.push(TableRow);
            extensions.push(TableHeader);
            extensions.push(TableCell);
        }

        return extensions;
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const editor = useEditor({
                    extensions: getExtensions(),
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
                    if (!editor || !enableLink) return;
                    const previousUrl = editor.getAttributes('link').href;
                    const url = window.prompt('Enter URL:', previousUrl);
                    if (url === null) return;
                    if (url === '') {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }
                    editor.chain().focus().setLink({ href: url }).run();
                }, [editor, enableLink]);

                const toggleExpanded = () => setIsExpanded((exp) => !exp);

                const handleImageUpload = useCallback(() => {
                    if (!editor || !enableImage) return;
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
                }, [editor, enableImage]);

                const setTextColorHandler = useCallback((color) => {
                    if (!editor || !enableTextColor) return;
                    setTextColor(color);
                    editor.chain().focus().setColor(color).run();
                }, [editor, enableTextColor]);

                const setHighlightColorHandler = useCallback((color) => {
                    if (!editor || !enableHighlightColor) return;
                    setHighlightColor(color);
                    editor.chain().focus().toggleHighlight({ color }).run();
                }, [editor, enableHighlightColor]);

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

                const setFontFamily = useCallback((family) => {
                    if (!editor || !enableFontFamily) return;
                    editor?.chain().focus().setFontFamily(family || null).run();
                }, [editor, enableFontFamily]);

                const insertTable = useCallback(() => {
                    if (!editor || !enableTables) return;
                    editor?.chain().focus()
                        .insertTable({
                            rows: TABLE_DEFAULT_CONFIG.rows,
                            cols: TABLE_DEFAULT_CONFIG.cols,
                            withHeaderRow: TABLE_DEFAULT_CONFIG.withHeaderRow
                        })
                        .run();
                }, [editor, enableTables]);

                const deleteTable = useCallback(() => {
                    if (!editor || !enableTables) return;
                    editor?.chain().focus().deleteTable().run();
                }, [editor, enableTables]);

                const actions = {
                    bold: () => editor?.chain().focus().toggleBold().run(),
                    italic: () => editor?.chain().focus().toggleItalic().run(),
                    underline: () => editor?.chain().focus().toggleUnderline().run(),
                    strike: () => editor?.chain().focus().toggleStrike().run(),
                    heading1: () => enableHeadings && editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                    heading2: () => enableHeadings && editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                    heading3: () => enableHeadings && editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                    heading4: () => enableHeadings && editor?.chain().focus().toggleHeading({ level: 4 }).run(),
                    bulletList: () => editor?.chain().focus().toggleBulletList().run(),
                    orderedList: () => editor?.chain().focus().toggleOrderedList().run(),
                    taskList: () => enableTaskList && editor?.chain().focus().toggleTaskList().run(),
                    blockquote: () => enableBlockquote && editor?.chain().focus().toggleBlockquote().run(),
                    codeBlock: () => enableCodeBlock && editor?.chain().focus().toggleCodeBlock().run(),
                    leftAlign: () => enableTextAlign && editor?.chain().focus().setTextAlign('left').run(),
                    centerAlign: () => enableTextAlign && editor?.chain().focus().setTextAlign('center').run(),
                    rightAlign: () => enableTextAlign && editor?.chain().focus().setTextAlign('right').run(),
                    justifyAlign: () => enableTextAlign && editor?.chain().focus().setTextAlign('justify').run(),
                    clearFormat: () => enableClearFormat && editor?.chain().focus().clearNodes().unsetAllMarks().run(),
                    subscript: () => enableSubSuperscript && editor?.chain().focus().toggleSubscript().run(),
                    superscript: () => enableSubSuperscript && editor?.chain().focus().toggleSuperscript().run(),
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
                                {renderToolbar && (
                                    <div className={styles.toolbar}>
                                        {/* Font family - only if enabled */}
                                        {enableFontFamily && (
                                            <>
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
                                            </>
                                        )}

                                        {/* Text formatting - always available */}
                                        <div className={styles.toolbarGroup}>
                                            <MenuButton isActive={isActive('bold')} onClick={actions.bold} icon={FiBold} label="Bold" disabled={disabled} />
                                            <MenuButton isActive={isActive('italic')} onClick={actions.italic} icon={FiItalic} label="Italic" disabled={disabled} />
                                            {enableUnderline && (
                                                <MenuButton isActive={isActive('underline')} onClick={actions.underline} icon={FiUnderline} label="Underline" disabled={disabled} />
                                            )}
                                            {enableStrike && (
                                                <MenuButton isActive={isActive('strike')} onClick={actions.strike} icon={FiMinus} label="Strikethrough" disabled={disabled} />
                                            )}
                                            {enableSubSuperscript && (
                                                <>
                                                    <MenuButton isActive={isActive('subscript')} onClick={actions.subscript} icon={FiCornerDownRight} label="Subscript" disabled={disabled} />
                                                    <MenuButton isActive={isActive('superscript')} onClick={actions.superscript} icon={FiCornerUpLeft} label="Superscript" disabled={disabled} />
                                                </>
                                            )}
                                            <span className={styles.toolbarDivider} />
                                        </div>

                                        {/* Text color - only if enabled */}
                                        {enableTextColor && (
                                            <>
                                                <div className={styles.toolbarGroup}>
                                                    <ColorPicker
                                                        onSelect={setTextColorHandler}
                                                        currentColor={textColor}
                                                        label="Text Color"
                                                        disabled={disabled}
                                                    />
                                                    <span className={styles.toolbarDivider} />
                                                </div>
                                            </>
                                        )}

                                        {/* Highlight color - only if enabled */}
                                        {enableHighlightColor && (
                                            <>
                                                <div className={styles.toolbarGroup}>
                                                    <ColorPicker
                                                        onSelect={setHighlightColorHandler}
                                                        currentColor={highlightColor}
                                                        label="Highlight Color"
                                                        disabled={disabled}
                                                    />
                                                    <span className={styles.toolbarDivider} />
                                                </div>
                                            </>
                                        )}

                                        {/* Headings - only if enabled */}
                                        {enableHeadings && (
                                            <>
                                                <div className={styles.toolbarGroup}>
                                                    <MenuButton isActive={isActive('heading', { level: 1 })} onClick={actions.heading1} icon={FiType} label="Heading 1" disabled={disabled} />
                                                    <MenuButton isActive={isActive('heading', { level: 2 })} onClick={actions.heading2} icon={FiType} label="Heading 2" disabled={disabled} />
                                                    <MenuButton isActive={isActive('heading', { level: 3 })} onClick={actions.heading3} icon={FiType} label="Heading 3" disabled={disabled} />
                                                    <MenuButton isActive={isActive('heading', { level: 4 })} onClick={actions.heading4} icon={FiType} label="Heading 4" disabled={disabled} />
                                                    <span className={styles.toolbarDivider} />
                                                </div>
                                            </>
                                        )}

                                        {/* Lists - always available */}
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
                                                {enableTaskList && (
                                                    <>
                                                        <div className={styles.dropdownDivider} />
                                                        <div className={styles.dropdownItem} onClick={actions.taskList}>
                                                            <FiCheckSquare size={14} /> Task List
                                                        </div>
                                                    </>
                                                )}
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

                                        {/* Blockquote & Code Block - only if enabled */}
                                        {(enableBlockquote || enableCodeBlock) && (
                                            <div className={styles.toolbarGroup}>
                                                {enableBlockquote && (
                                                    <MenuButton isActive={isActive('blockquote')} onClick={actions.blockquote} icon={FiType} label="Blockquote" disabled={disabled} />
                                                )}
                                                {enableCodeBlock && (
                                                    <MenuButton isActive={isActive('codeBlock')} onClick={actions.codeBlock} icon={FiCode} label="Code Block" disabled={disabled} />
                                                )}
                                                <span className={styles.toolbarDivider} />
                                            </div>
                                        )}

                                        {/* Text Align - only if enabled */}
                                        {enableTextAlign && (
                                            <div className={styles.toolbarGroup}>
                                                <MenuButton isActive={isActive('textAlign', { textAlign: 'left' })} onClick={actions.leftAlign} icon={FiAlignLeft} label="Align Left" disabled={disabled} />
                                                <MenuButton isActive={isActive('textAlign', { textAlign: 'center' })} onClick={actions.centerAlign} icon={FiAlignCenter} label="Align Center" disabled={disabled} />
                                                <MenuButton isActive={isActive('textAlign', { textAlign: 'right' })} onClick={actions.rightAlign} icon={FiAlignRight} label="Align Right" disabled={disabled} />
                                                <MenuButton isActive={isActive('textAlign', { textAlign: 'justify' })} onClick={actions.justifyAlign} icon={FiAlignJustify} label="Justify" disabled={disabled} />
                                                <span className={styles.toolbarDivider} />
                                            </div>
                                        )}

                                        {/* Tables - only if enabled */}
                                        {enableTables && (
                                            <div className={styles.toolbarGroup}>
                                                <MenuButton isActive={isActive('table')} onClick={insertTable} icon={FiTable} label="Insert Table" disabled={disabled} />
                                                <MenuButton isActive={false} onClick={deleteTable} icon={FiDelete} label="Delete Table" disabled={disabled} />
                                                <span className={styles.toolbarDivider} />
                                            </div>
                                        )}

                                        {/* Advanced - Link & Image */}
                                        {(enableLink || enableImage) && (
                                            <div className={styles.toolbarGroup}>
                                                {enableLink && (
                                                    <MenuButton isActive={isActive('link')} onClick={toggleLink} icon={FiLink} label="Add Link" disabled={disabled} />
                                                )}
                                                {enableImage && (
                                                    <MenuButton isActive={isActive('image')} onClick={handleImageUpload} icon={FiImage} label="Insert Image" disabled={disabled} />
                                                )}
                                                <span className={styles.toolbarDivider} />
                                            </div>
                                        )}

                                        {/* Clear formatting - only if enabled */}
                                        {enableClearFormat && (
                                            <div className={styles.toolbarGroup}>
                                                <MenuButton isActive={false} onClick={actions.clearFormat} icon={FiX} label="Clear Formatting" disabled={disabled} />
                                                <span className={styles.toolbarDivider} />
                                            </div>
                                        )}

                                        {/* Expand/Collapse - always available */}
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