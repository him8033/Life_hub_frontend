// src/constants/richTextEditor.constants.js

export const BULLET_STYLES = [
    { value: 'disc', label: '●', name: 'Normal Bullet' },
    { value: 'circle', label: '○', name: 'Circle Bullet' },
    { value: 'square', label: '■', name: 'Square Bullet' },
];

export const NUMBERING_STYLES = [
    { value: 'decimal', label: '1.', name: '1, 2, 3' },
    { value: 'decimal-parenthesis', label: '1)', name: '1), 2), 3)' },
    { value: 'upper-roman', label: 'I.', name: 'I, II, III' },
    { value: 'upper-alpha', label: 'A.', name: 'A, B, C' },
    { value: 'lower-alpha', label: 'a.', name: 'a, b, c' },
    { value: 'lower-roman', label: 'i.', name: 'i, ii, iii' },
];

export const FONT_FAMILIES = [
    // System Fonts (10)
    { label: 'Default', value: '' },
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Courier New', value: '"Courier New", Courier, monospace' },
    { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { label: 'Impact', value: 'Impact, Charcoal, sans-serif' },

    // Google Fonts - Sans Serif (20)
    { label: 'Inter', value: '"Inter", sans-serif' },
    { label: 'Roboto', value: '"Roboto", sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
    { label: 'Lato', value: '"Lato", sans-serif' },
    { label: 'Montserrat', value: '"Montserrat", sans-serif' },
    { label: 'Poppins', value: '"Poppins", sans-serif' },
    { label: 'Nunito', value: '"Nunito", sans-serif' },
    { label: 'Work Sans', value: '"Work Sans", sans-serif' },
    { label: 'Raleway', value: '"Raleway", sans-serif' },
    { label: 'Quicksand', value: '"Quicksand", sans-serif' },
    { label: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },
    { label: 'Muli', value: '"Muli", sans-serif' },
    { label: 'Cabin', value: '"Cabin", sans-serif' },
    { label: 'Karla', value: '"Karla", sans-serif' },
    { label: 'Hind', value: '"Hind", sans-serif' },
    { label: 'Dosis', value: '"Dosis", sans-serif' },
    { label: 'Exo', value: '"Exo", sans-serif' },
    { label: 'Titillium Web', value: '"Titillium Web", sans-serif' },
    { label: 'Ubuntu', value: '"Ubuntu", sans-serif' },
    { label: 'Asap', value: '"Asap", sans-serif' },

    // Google Fonts - Serif (15)
    { label: 'Merriweather', value: '"Merriweather", serif' },
    { label: 'Playfair Display', value: '"Playfair Display", serif' },
    { label: 'Lora', value: '"Lora", serif' },
    { label: 'Roboto Slab', value: '"Roboto Slab", serif' },
    { label: 'Source Serif Pro', value: '"Source Serif Pro", serif' },
    { label: 'PT Serif', value: '"PT Serif", serif' },
    { label: 'Crimson Text', value: '"Crimson Text", serif' },
    { label: 'Bitter', value: '"Bitter", serif' },
    { label: 'Old Standard TT', value: '"Old Standard TT", serif' },
    { label: 'Taviraj', value: '"Taviraj", serif' },
    { label: 'Alegreya', value: '"Alegreya", serif' },
    { label: 'Arvo', value: '"Arvo", serif' },
    { label: 'EB Garamond', value: '"EB Garamond", serif' },
    { label: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
    { label: 'Zilla Slab', value: '"Zilla Slab", serif' },

    // Google Fonts - Display (15)
    { label: 'Pacifico', value: '"Pacifico", cursive' },
    { label: 'Lobster', value: '"Lobster", cursive' },
    { label: 'Dancing Script', value: '"Dancing Script", cursive' },
    { label: 'Great Vibes', value: '"Great Vibes", cursive' },
    { label: 'Caveat', value: '"Caveat", cursive' },
    { label: 'Amatic SC', value: '"Amatic SC", cursive' },
    { label: 'Satisfy', value: '"Satisfy", cursive' },
    { label: 'Courgette', value: '"Courgette", cursive' },
    { label: 'Kaushan Script', value: '"Kaushan Script", cursive' },
    { label: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
    { label: 'Permanent Marker', value: '"Permanent Marker", cursive' },
    { label: 'Fredoka One', value: '"Fredoka One", cursive' },
    { label: 'Bangers', value: '"Bangers", cursive' },
    { label: 'Righteous', value: '"Righteous", cursive' },
    { label: 'Yanone Kaffeesatz', value: '"Yanone Kaffeesatz", sans-serif' },

    // Google Fonts - Monospace (8)
    { label: 'Fira Code', value: '"Fira Code", monospace' },
    { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
    { label: 'Inconsolata', value: '"Inconsolata", monospace' },
    { label: 'Cascadia Code', value: '"Cascadia Code", monospace' },
    { label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
    { label: 'Space Mono', value: '"Space Mono", monospace' },
    { label: 'Anonymous Pro', value: '"Anonymous Pro", monospace' },

    // Google Fonts - Handwriting (6)
    { label: 'Alex Brush', value: '"Alex Brush", cursive' },
    { label: 'Allura', value: '"Allura", cursive' },
    { label: 'Tangerine', value: '"Tangerine", cursive' },
    { label: 'Parisienne', value: '"Parisienne", cursive' },
    { label: 'Monsieur La Doulaise', value: '"Monsieur La Doulaise", cursive' },
    { label: 'Mr De Haviland', value: '"Mr De Haviland", cursive' },

    // Google Fonts - Modern (10)
    { label: 'Manrope', value: '"Manrope", sans-serif' },
    { label: 'DM Sans', value: '"DM Sans", sans-serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { label: 'Satoshi', value: '"Satoshi", sans-serif' },
    { label: 'Clash Display', value: '"Clash Display", sans-serif' },
    { label: 'Cabinet Grotesk', value: '"Cabinet Grotesk", sans-serif' },
    { label: 'General Sans', value: '"General Sans", sans-serif' },
    { label: 'Zodiak', value: '"Zodiak", serif' },
    { label: 'Stardom', value: '"Stardom", sans-serif' },
    { label: 'Sora', value: '"Sora", sans-serif' },

    // Additional Web Safe Fonts (6)
    { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif' },
    { label: 'Palatino Linotype', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { label: 'Book Antiqua', value: '"Book Antiqua", Palatino, serif' },
    { label: 'Garamond', value: 'Garamond, "Times New Roman", serif' },
    { label: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
    { label: 'Lucida Sans', value: '"Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", sans-serif' },

    // Chinese Fonts (4)
    { label: 'Noto Sans SC', value: '"Noto Sans SC", sans-serif' },
    { label: 'Noto Serif SC', value: '"Noto Serif SC", serif' },
    { label: 'Ma Shan Zheng', value: '"Ma Shan Zheng", cursive' },
    { label: 'ZCOOL KuaiLe', value: '"ZCOOL KuaiLe", cursive' },

    // Japanese Fonts (3)
    { label: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
    { label: 'Noto Serif JP', value: '"Noto Serif JP", serif' },
    { label: 'M PLUS Rounded 1c', value: '"M PLUS Rounded 1c", sans-serif' },

    // Korean Fonts (2)
    { label: 'Noto Sans KR', value: '"Noto Sans KR", sans-serif' },
    { label: 'Noto Serif KR', value: '"Noto Serif KR", serif' },

    // Other (1)
    { label: 'Oxygen', value: '"Oxygen", sans-serif' },
];

export const COLOR_PALETTE = [
    '#000000', '#DC2626', '#EF4444', '#F87171', '#FCA5A5',
    '#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',
    '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
    '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE',
    '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A',
    '#DB2777', '#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8',
    '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB',
    '#FFFFFF',
];

export const TABLE_DEFAULT_CONFIG = {
    rows: 3,
    cols: 3,
    withHeaderRow: true,
};