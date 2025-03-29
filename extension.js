const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Filament UI Extension is now active!');
    
    // Register a completion provider for Blade files
    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'blade' },
        {
            provideCompletionItems(document, position) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                
                // Check if we're at the start of what could be a tag
                if (linePrefix.endsWith('<')) {
                    // When user types "<", suggests Filament components
                    // We'll need a specialized completion here that doesn't duplicate the "<"
                    const filamentTags = [
                        'x-filament::input', 'x-filament::button',
                        'x-filament::dropdown', 'x-filament::modal', 'x-filament::avatar', 'x-filament::badge',
                        'x-filament::select', 'x-filament::checkbox',
                        'x-filament::section', 'x-filament::tabs', 'x-filament::link',
                        'x-filament::icon-button', 'x-filament::loading-indicator', 'x-filament::fieldset',
                        'x-filament::breadcrumbs', 'x-filament::pagination'
                    ];
                    
                    return filamentTags.map(tag => {
                        const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Snippet);
                        const componentName = tag.replace('x-filament::', '');
                        
                        // Check if the component is self-closing based on name
                        const isSelfClosing = ['input', 'avatar', 'icon-button', 'loading-indicator', 'checkbox', 'radio', 'toggle'].some(
                            name => tag === `x-filament::${name}` || tag.startsWith(`x-filament::${name}.`)
                        );
                        
                        if (isSelfClosing) {
                            item.insertText = new vscode.SnippetString(`${tag} $0 />`);
                        } else {
                            item.insertText = new vscode.SnippetString(`${tag}>\n    $0\n</${tag}>`);
                        }
                        
                        item.detail = `Filament ${componentName} component`;
                        item.documentation = getComponentDocumentation(componentName);
                        
                        return item;
                    });
                }
                
                // Special handling for when user types <x and hits enter
                if (linePrefix.match(/^[\s\t]*<x$/i)) {
                    const item = new vscode.CompletionItem('x-filament::', vscode.CompletionItemKind.Snippet);
                    item.detail = 'Filament component prefix';
                    item.documentation = 'Prefix for all Filament UI components';
                    item.insertText = new vscode.SnippetString('x-filament::$0');
                    item.sortText = '0000'; // Ensure this appears at the top
                    return [item];
                }
                
                // For when user starts typing an x- directly
                if (linePrefix.match(/^[\s\t]*<*x$/i)) {
                    const item = new vscode.CompletionItem('x-filament::', vscode.CompletionItemKind.Snippet);
                    item.detail = 'Filament component prefix';
                    item.documentation = 'Prefix for all Filament UI components';
                    
                    // We need to check if there's already a "<" at the beginning
                    const hasOpeningBracket = linePrefix.trimStart().startsWith('<');
                    
                    if (hasOpeningBracket) {
                        item.insertText = new vscode.SnippetString('x-filament::$0');
                    } else {
                        item.insertText = new vscode.SnippetString('<x-filament::$0');
                    }
                    
                    return [item];
                }
                
                // Handle the scenario where user types "<x-filament" directly and hits enter
                if (linePrefix.match(/^[\s\t]*<x-filament$/i)) {
                    // Provide x-filament:: prefix without adding another < at the beginning
                    const item = new vscode.CompletionItem('x-filament::', vscode.CompletionItemKind.Snippet);
                    item.detail = 'Filament component prefix';
                    item.documentation = 'Prefix for all Filament UI components';
                    item.insertText = new vscode.SnippetString('x-filament::$0');
                    return [item];
                }
                
                // Check if user is typing a Filament component without the opening bracket
                // This happens when user types "x-filament::" directly
                if (linePrefix.match(/^[\s\t]*x-filament::/i)) {
                    const componentText = linePrefix.trim();
                    const componentNameMatch = componentText.match(/^(x-filament::[a-zA-Z0-9.-]+)/i);
                    
                    if (componentNameMatch && componentNameMatch[1]) {
                        const componentName = componentNameMatch[1];
                        const item = new vscode.CompletionItem(componentName, vscode.CompletionItemKind.Snippet);
                        
                        // Check for opening bracket to avoid duplication
                        const hasOpeningBracket = linePrefix.trimStart().startsWith('<');
                        const tagPrefix = hasOpeningBracket ? '' : '<';
                        
                        // Check if the component is self-closing based on name
                        const isSelfClosing = ['input', 'avatar', 'icon-button', 'loading-indicator', 'checkbox', 'radio', 'toggle'].some(
                            name => componentName === `x-filament::${name}` || componentName.startsWith(`x-filament::${name} `)
                        );
                        
                        if (isSelfClosing) {
                            item.insertText = new vscode.SnippetString(`${tagPrefix}${componentName} $0 />`);
                        } else {
                            item.insertText = new vscode.SnippetString(`${tagPrefix}${componentName}>\n    $0\n</${componentName}>`);
                        }
                        
                        item.detail = `Filament ${componentName.replace('x-filament::', '')} component`;
                        item.documentation = getComponentDocumentation(componentName.replace('x-filament::', ''));
                        
                        return [item];
                    }
                }
                
                // For basic Filament component completion
                if (linePrefix.match(/<x-filament::/i)) {
                    // Check if we're in the middle of typing a component name
                    const isTypingComponentName = linePrefix.match(/<x-filament::([a-zA-Z0-9.-]*)$/i);
                    
                    if (isTypingComponentName) {
                        // Provide dynamic completions for component names
                        const filamentComponents = [
                            // Input components
                            'input', 'input.wrapper', 'input.label', 'input.error',
                            'textarea', 'select', 'checkbox', 'radio', 'toggle',
                            // UI components
                            'button', 'card', 'dropdown', 'dropdown.item', 'dropdown.list',
                            'form', 'alert', 'badge', 'avatar', 'section',
                            'tabs', 'tabs.item', 'modal', 'link', 'icon-button',
                            'loading-indicator', 'fieldset', 'breadcrumbs', 'pagination'
                        ];
                        
                        return filamentComponents.map(component => {
                            const item = new vscode.CompletionItem(component, vscode.CompletionItemKind.Snippet);
                            item.detail = `Filament ${component} component`;
                            
                            // Only insert the component name part, not the full tag
                            item.insertText = component;
                            
                            // Add documentation based on the component
                            const docs = getComponentDocumentation(component);
                            if (docs) {
                                item.documentation = new vscode.MarkdownString(docs);
                            }
                            
                            // Explicitly set a special sort order to ensure these appear at the top
                            item.sortText = '0000' + component;
                            
                            return item;
                        });
                    }
                    
                    // If not typing a component name, continue with original attribute suggestions
                }
                
                // For component recognition when typing a full tag
                if (linePrefix.match(/^[\s\t]*<x-filament::[a-zA-Z0-9.-]+$/i)) {
                    const componentMatch = linePrefix.match(/<(x-filament::[a-zA-Z0-9.-]+)$/i);
                    if (componentMatch && componentMatch[1]) {
                        const componentName = componentMatch[1];
                        const item = new vscode.CompletionItem(componentName, vscode.CompletionItemKind.Snippet);
                        
                        // Check if the component is self-closing based on name
                        const baseName = componentName.replace('x-filament::', '');
                        const isSelfClosing = ['input', 'avatar', 'icon-button', 'loading-indicator', 'checkbox', 'radio', 'toggle'].some(
                            name => baseName === name || baseName.startsWith(`${name}.`)
                        );
                        
                        if (isSelfClosing) {
                            item.insertText = new vscode.SnippetString(`${componentName} $0 />`);
                        } else if (baseName === 'alert') {
                            item.insertText = new vscode.SnippetString(`${componentName} type="\${1|info,success,warning,danger|}">\n    $0\n</${componentName}>`);
                        } else {
                            item.insertText = new vscode.SnippetString(`${componentName}>\n    $0\n</${componentName}>`);
                        }
                        
                        item.detail = `Filament ${baseName} component`;
                        item.documentation = getComponentDocumentation(baseName);
                        
                        return [item];
                    }
                }
                
                // For attributes within Filament components
                if (linePrefix.match(/<x-filament::[^>]*$/i)) {
                    // Make sure we're not just typing a component name
                    if (linePrefix.match(/<x-filament::[a-zA-Z0-9.-]*\s[^>]*$/i)) {
                        // Get the component name to provide specialized attributes
                        const componentNameMatch = linePrefix.match(/<x-filament::([a-zA-Z0-9.-]+)/i);
                        if (componentNameMatch && componentNameMatch[1]) {
                            const componentName = componentNameMatch[1];
                            return getComponentAttributes(componentName);
                        }
                        
                        // Common attributes for all components
                        const commonAttributes = [
                            'wire:model', 'wire:click', 'id', 'class'
                        ];
                        
                        return commonAttributes.map(attr => {
                            const item = new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property);
                            item.insertText = new vscode.SnippetString(`${attr}="\${1:value}"`);
                            return item;
                        });
                    }
                }
                
                return null;
            }
        },
        ':', '>', '.' // Trigger characters for autocompletion
    );
    
    // Register a document formatting provider to ensure proper indentation
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'blade' },
        {
            provideDocumentFormattingEdits(document) {
                // This is a simple formatting example
                // In a real extension, you might want to use a more sophisticated formatter
                const text = document.getText();
                const edits = [];
                
                // For now, we'll just return no edits to avoid interfering with other formatters
                return edits;
            }
        }
    );
    
    context.subscriptions.push(provider, formattingProvider);
}

/**
 * Get documentation for a specific component
 * @param {string} component The component name
 * @returns {string|null} Documentation string or null
 */
function getComponentDocumentation(component) {
    const documentation = {
        'input': 'Standard input field component for collecting text data from users.',
        'input.wrapper': 'Wrapper component for inputs providing consistent styling and border.',
        'input.label': 'Label component for form inputs with proper styling and positioning.',
        'input.error': 'Displays validation error messages below form inputs.',
        'textarea': 'Multi-line text input component for longer text entries.',
        'select': 'Dropdown select component for choosing from predefined options.',
        'checkbox': 'Checkbox input component for boolean selections.',
        'radio': 'Radio button input component for single selections from a group.',
        'toggle': 'Toggle switch component for boolean on/off selections.',
        'button': 'Button component with various styling options like color, size, and icons.',
        'card': 'Container component with consistent styling for grouping related content.',
        'dropdown': 'Interactive dropdown menu component for displaying a list of actions.',
        'dropdown.item': 'Individual selectable item within a dropdown menu.',
        'dropdown.list': 'Container for dropdown items with consistent styling.',
        'form': 'Form container component that handles submission and validation.',
        'alert': 'Alert component for displaying messages with different states (info, success, warning, danger).',
        'badge': 'Small label component often used for status indicators or counters.',
        'avatar': 'Component for displaying user profile images in a circular or square format.',
        'section': 'Content section with optional heading and description.',
        'tabs': 'Tabbed interface component for organizing content into separate views.',
        'tabs.item': 'Individual tab panel within the tabs component.',
        'modal': 'Dialog box component that appears over the page content.',
        'link': 'Styled hyperlink component with various formatting options.',
        'icon-button': 'Button that displays only an icon with optional tooltip.',
        'loading-indicator': 'Animated spinner component for indicating loading states.',
        'fieldset': 'Component for grouping related form elements with an optional label.',
        'breadcrumbs': 'Navigation component showing the hierarchical path to the current page.',
        'pagination': 'Component for navigating through paginated data sets.'
    };
    
    return documentation[component] || null;
}

/**
 * Get specific attributes for a component
 * @param {string} componentName The component name
 * @returns {vscode.CompletionItem[]} Array of completion items
 */
function getComponentAttributes(componentName) {
    const attributes = [];
    
    // Common attributes for most components
    attributes.push(createAttribute('id', 'Unique identifier'));
    attributes.push(createAttribute('class', 'CSS classes'));
    
    // Component-specific attributes
    switch (componentName) {
        case 'input':
            attributes.push(createAttribute('type', 'Input type (text, email, password, etc.)', 'type="\${1|text,email,password,number,tel,url|}"'));
            attributes.push(createAttribute('wire:model', 'Livewire data binding'));
            attributes.push(createAttribute('disabled', 'Disabled state', 'disabled'));
            attributes.push(createAttribute('placeholder', 'Placeholder text'));
            break;
            
        case 'input.wrapper':
            attributes.push(createAttribute('valid', 'Validation state', ':valid="\${1:condition}"'));
            attributes.push(createAttribute('disabled', 'Disabled state', 'disabled'));
            attributes.push(createAttribute('prefix-icon', 'Icon displayed before the input'));
            attributes.push(createAttribute('suffix-icon', 'Icon displayed after the input'));
            attributes.push(createAttribute('prefix-icon-color', 'Color of the prefix icon', 'prefix-icon-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('suffix-icon-color', 'Color of the suffix icon', 'suffix-icon-color="\${1|primary,danger,gray,info,success,warning|}"'));
            break;
            
        case 'button':
            attributes.push(createAttribute('type', 'Button type', 'type="\${1|button,submit,reset|}"'));
            attributes.push(createAttribute('color', 'Button color', 'color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('size', 'Button size', 'size="\${1|xs,sm,md,lg,xl|}"'));
            attributes.push(createAttribute('icon', 'Button icon'));
            attributes.push(createAttribute('icon-position', 'Position of the icon', 'icon-position="\${1|before,after|}"'));
            attributes.push(createAttribute('outlined', 'Outlined style', 'outlined'));
            attributes.push(createAttribute('tooltip', 'Button tooltip'));
            attributes.push(createAttribute('badge-color', 'Color of the badge', 'badge-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('wire:click', 'Livewire click handler'));
            attributes.push(createAttribute('tag', 'HTML tag to use', 'tag="\${1|button,a|}"'));
            attributes.push(createAttribute('href', 'URL for link buttons (when tag is "a")'));
            attributes.push(createAttribute('disabled', 'Disabled state', 'disabled'));
            break;
            
        case 'alert':
            attributes.push(createAttribute('type', 'Alert type', 'type="\${1|info,success,warning,danger|}"'));
            attributes.push(createAttribute('icon', 'Alert icon'));
            attributes.push(createAttribute('dismissible', 'Can be dismissed', 'dismissible'));
            break;
            
        case 'avatar':
            attributes.push(createAttribute('src', 'Image source URL'));
            attributes.push(createAttribute('alt', 'Alternative text'));
            attributes.push(createAttribute('size', 'Avatar size', 'size="\${1|sm,md,lg|}"'));
            attributes.push(createAttribute('circular', 'Circular shape', ':circular="\${1|true,false|}"'));
            break;
            
        case 'dropdown':
            attributes.push(createAttribute('placement', 'Dropdown placement', 'placement="\${1|bottom-start,bottom,bottom-end,top-start,top,top-end,right-start,right,right-end,left-start,left,left-end|}"'));
            attributes.push(createAttribute('width', 'Dropdown width', 'width="\${1|xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl,screen-sm,screen-md,screen-lg,screen-xl,screen-2xl|}"'));
            attributes.push(createAttribute('close-on-click', 'Close when item is clicked', ':close-on-click="\${1|true,false|}"'));
            break;
            
        case 'dropdown.item':
            attributes.push(createAttribute('icon', 'Icon for the dropdown item'));
            attributes.push(createAttribute('icon-color', 'Color of the icon', 'icon-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('color', 'Item color', 'color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('tag', 'HTML tag to use', 'tag="\${1|button,a|}"'));
            attributes.push(createAttribute('href', 'URL for link items (when tag is "a")'));
            attributes.push(createAttribute('image', 'URL to an image to display'));
            attributes.push(createAttribute('badge-color', 'Color of the badge', 'badge-color="\${1|primary,danger,gray,info,success,warning|}"'));
            break;
            
        case 'link':
            attributes.push(createAttribute('href', 'URL to link to'));
            attributes.push(createAttribute('tag', 'HTML tag to use', 'tag="\${1|a,button|}"'));
            attributes.push(createAttribute('size', 'Link size', 'size="\${1|sm,md,lg,xl,2xl|}"'));
            attributes.push(createAttribute('color', 'Link color', 'color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('icon', 'Icon to display'));
            attributes.push(createAttribute('icon-position', 'Position of the icon', 'icon-position="\${1|before,after|}"'));
            attributes.push(createAttribute('tooltip', 'Link tooltip'));
            attributes.push(createAttribute('badge-color', 'Color of the badge', 'badge-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('weight', 'Font weight', 'weight="\${1|thin,extralight,light,normal,medium,semibold,bold,extrabold,black|}"'));
            break;
            
        case 'icon-button':
            attributes.push(createAttribute('icon', 'Button icon'));
            attributes.push(createAttribute('color', 'Button color', 'color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('size', 'Button size', 'size="\${1|sm,md,lg|}"'));
            attributes.push(createAttribute('tooltip', 'Button tooltip'));
            attributes.push(createAttribute('label', 'Button label (for accessibility)'));
            attributes.push(createAttribute('wire:click', 'Livewire click handler'));
            attributes.push(createAttribute('disabled', 'Disabled state', 'disabled'));
            break;
            
        case 'modal':
            attributes.push(createAttribute('width', 'Modal width', 'width="\${1|xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl|}"'));
            attributes.push(createAttribute('slide-over', 'Side panel style', 'slide-over'));
            attributes.push(createAttribute('close-by-clicking-away', 'Close when clicking outside', ':close-by-clicking-away="\${1|true,false|}"'));
            attributes.push(createAttribute('close-by-escaping', 'Close when escape key is pressed', ':close-by-escaping="\${1|true,false|}"'));
            attributes.push(createAttribute('close-button', 'Show close button', ':close-button="\${1|true,false|}"'));
            attributes.push(createAttribute('display-close-button', 'Show close button (alias)', ':display-close-button="\${1|true,false|}"'));
            attributes.push(createAttribute('icon', 'Icon to display'));
            attributes.push(createAttribute('icon-color', 'Color of the icon', 'icon-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('alignment', 'Content alignment', 'alignment="\${1|start,center|}"'));
            attributes.push(createAttribute('sticky-header', 'Make header sticky', 'sticky-header'));
            attributes.push(createAttribute('sticky-footer', 'Make footer sticky', 'sticky-footer'));
            attributes.push(createAttribute('autofocus', 'Auto-focus the first element', ':autofocus="\${1|true,false|}"'));
            attributes.push(createAttribute('id', 'Unique identifier for opening/closing'));
            break;
            
        case 'section':
            attributes.push(createAttribute('collapsible', 'Can be collapsed', 'collapsible'));
            attributes.push(createAttribute('collapsed', 'Initially collapsed', ':collapsed="\${1|true,false|}"'));
            attributes.push(createAttribute('persist-collapsed', 'Remember collapsed state', 'persist-collapsed'));
            attributes.push(createAttribute('aside', 'Content displayed in sidebar', 'aside'));
            attributes.push(createAttribute('content-before', 'Position content before header', 'content-before'));
            attributes.push(createAttribute('icon', 'Icon to display'));
            attributes.push(createAttribute('icon-color', 'Color of the icon', 'icon-color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('icon-size', 'Size of the icon', 'icon-size="\${1|sm,md,lg|}"'));
            break;
            
        case 'select':
            attributes.push(createAttribute('wire:model', 'Livewire data binding'));
            attributes.push(createAttribute('disabled', 'Disabled state', 'disabled'));
            attributes.push(createAttribute('placeholder', 'Placeholder text'));
            break;
            
        case 'tabs':
            attributes.push(createAttribute('contained', 'Contained style', 'contained'));
            break;
            
        case 'tabs.item':
            attributes.push(createAttribute('active', 'Active state', ':active="\${1:condition}"'));
            attributes.push(createAttribute('alpine-active', 'Alpine.js active expression', 'alpine-active="\${1:expression}"'));
            attributes.push(createAttribute('icon', 'Icon to display'));
            attributes.push(createAttribute('icon-position', 'Position of the icon', 'icon-position="\${1|before,after|}"'));
            attributes.push(createAttribute('tag', 'HTML tag to use', 'tag="\${1|button,a|}"'));
            attributes.push(createAttribute('href', 'URL for link tabs (when tag is "a")'));
            break;
            
        case 'badge':
            attributes.push(createAttribute('color', 'Badge color', 'color="\${1|primary,danger,gray,info,success,warning|}"'));
            attributes.push(createAttribute('size', 'Badge size', 'size="\${1|xs,sm,md,lg|}"'));
            attributes.push(createAttribute('icon', 'Icon to display'));
            attributes.push(createAttribute('icon-position', 'Position of the icon', 'icon-position="\${1|before,after|}"'));
            break;
            
        case 'pagination':
            attributes.push(createAttribute('paginator', 'The paginator instance', ':paginator="\${1:variable}"'));
            attributes.push(createAttribute('page-options', 'Items per page options', ':page-options="\${1:[5, 10, 25, 50, 100]}"'));
            attributes.push(createAttribute('current-page-option-property', 'Property for current page option', 'current-page-option-property="\${1:property}"'));
            attributes.push(createAttribute('extreme-links', 'Show first and last page links', 'extreme-links'));
            break;
            
        // Add more component-specific attributes as needed
        default:
            // For other components, just add common wire: attributes
            attributes.push(createAttribute('wire:model', 'Livewire data binding'));
            attributes.push(createAttribute('wire:click', 'Livewire click handler'));
            break;
    }
    
    return attributes;
}

/**
 * Create a completion item for an attribute
 * @param {string} name Attribute name
 * @param {string} documentation Documentation for the attribute
 * @param {string} snippetText Optional custom snippet text
 * @returns {vscode.CompletionItem} Completion item
 */
function createAttribute(name, documentation, snippetText = null) {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
    item.documentation = new vscode.MarkdownString(documentation);
    
    if (snippetText) {
        item.insertText = new vscode.SnippetString(snippetText);
    } else if (name.includes(':')) {
        // For boolean attributes with a colon prefix (like :disabled="true")
        item.insertText = new vscode.SnippetString(`${name}="\${1:true}"`);
    } else if (name === 'disabled' || name === 'readonly' || name === 'required' || name === 'outlined' || 
               name === 'contained' || name === 'collapsible' || name === 'dismissible' || name === 'aside') {
        // For boolean attributes
        item.insertText = new vscode.SnippetString(name);
    } else {
        // For regular attributes
        item.insertText = new vscode.SnippetString(`${name}="\${1:value}"`);
    }
    
    return item;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 