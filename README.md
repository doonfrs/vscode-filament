# Filament UI for VSCode

A Visual Studio Code extension that provides syntax highlighting and autocompletion for Laravel Filament UI components in Blade files.

![Filament UI for VSCode Demo](images/vscode-filament-demo.gif)

## Features

- **Syntax Highlighting**: Properly highlights Filament UI components in Blade files without showing them as errors
- **Smart Autocompletion**: Provides context-aware suggestions for components and attributes
- **Component Snippets**: Ready-to-use snippets for all Filament UI components with proper attribute placeholders
- **Intelligent Attributes**: Suggests component-specific attributes with appropriate value options
- **Documentation Tooltips**: Displays helpful documentation for components and attributes as you type
- **Quick Start Typing**: Begin typing `<x-filament::` to see all available components
- **Icon System Support**: Complete autocompletion for Filament's comprehensive icon system
- **Blade Integration**: Seamlessly works with other Blade features and extensions

## Autocompletion Features

This extension provides several types of autocompletion to improve your workflow:

### Component Autocompletion

- Type `<x` or `<x-filament::` to see all available Filament components
- Automatically provides appropriate self-closing tags for components like `<x-filament::icon />`
- Shows component documentation in tooltips when selecting components

### Attribute Autocompletion

- Component-specific attributes appear automatically when typing inside a component tag
- Common attributes like `class`, `id`, and Livewire directives are always available
- Boolean attributes (like `disabled`) are inserted without value placeholders

### Value Autocompletion

- Intelligent dropdown suggestions for attribute values where appropriate
- Predefined options for attributes like `color`, `size`, and `placement`
- Smart handling of boolean values for attributes with `:` prefix

### Icon System Autocompletion

- Complete support for Filament's icon system with the following snippets:
  - `x-filament::icon` - Base icon component
  - `icon-panel` - Panel Builder icons
  - `icon-form` - Form Builder icons
  - `icon-table` - Table Builder icons
  - `icon-notification` - Notification icons
  - `icon-action` - Action icons
  - `icon-infolist` - Infolist Builder icons
  - `icon-ui` - UI Component icons
  - `filament-svg-icon` - Template for custom SVG icons

## Supported Components

This extension supports all Filament UI components from the [official documentation](https://filamentphp.com/docs/3.x/support/blade-components/overview):

### UI Components

`x-filament::avatar` `x-filament::badge` `x-filament::breadcrumbs` `x-filament::icon` `x-filament::loading-indicator` `x-filament::section` `x-filament::tabs`

### Action Components

`x-filament::button` `x-filament::dropdown` `x-filament::icon-button` `x-filament::link` `x-filament::modal`

### Form Components

`x-filament::checkbox` `x-filament::fieldset` `x-filament::input` `x-filament::input.wrapper` `x-filament::select`

### Table Components

`x-filament::pagination`

## Usage Examples

### Basic Component Usage

```blade
<x-filament::button>
    Submit Form
</x-filament::button>
```

### Component with Attributes

```blade
<x-filament::button color="primary" size="lg" icon="heroicon-o-check">
    Save Changes
</x-filament::button>
```

### Using Icons

```blade
<!-- Basic icon usage -->
<x-filament::icon name="heroicon-o-home" />

<!-- Icon with size -->
<x-filament::icon name="heroicon-o-user" size="lg" />

<!-- Using icon aliases -->
<x-filament::icon name="actions::edit-action" />
```

## Requirements

- Visual Studio Code 1.75.0 or higher

## Support This Project

If you find Filament UI for VSCode useful, please consider supporting its development:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/doonfrs)

You can also become a GitHub sponsor: [Sponsor @doonfrs](https://github.com/sponsors/doonfrs)

Your support will encourage me to dedicate more time to keeping this useful package updated and well-documented.

## Icon System Support

This extension provides comprehensive support for Filament's icon system:

- **Icon Component**: Use `x-filament::icon` with name and size attributes
- **Icon Aliases**: Autocomplete for all icon aliases from the Filament documentation
- **Icon Categories**: Organized snippets for different icon categories:
  - Panel Builder icons (`icon-panel`)
  - Form Builder icons (`icon-form`)
  - Table Builder icons (`icon-table`)
  - Notifications icons (`icon-notification`)
  - Actions icons (`icon-action`)
  - Infolist Builder icons (`icon-infolist`)
  - UI Component icons (`icon-ui`)
- **Custom SVG Icons**: Template for creating custom SVG icons (`filament-svg-icon`)

For the complete list of available icons, see the [Filament Icons Documentation](https://filamentphp.com/docs/3.x/support/icons).

## Usage

1. Install the extension from the VSCode marketplace
2. Open a `.blade.php` file
3. Start typing `<x-filament::` and the autocompletion will show the available components
4. Select a component to insert it with proper attributes and formatting
5. Tab through the placeholders to fill in the values

## Intelligent Autocompletion

This extension provides context-aware suggestions:

- Component-specific attributes are suggested when typing within a component tag
- Attribute values have intelligent dropdown options where appropriate (colors, sizes, etc.)
- Documentation is displayed in tooltips as you type

## Extension Settings

This extension doesn't add any VSCode settings.

## Known Issues

If you find any issues, please report them on the [GitHub repository](https://github.com/doonfrs/vscode-filament/issues).
