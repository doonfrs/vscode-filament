# VSCode Extension Development Guide

## Setup

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Open the project in VSCode

## Running the Extension

1. Press `F5` to launch a new VSCode window with your extension loaded
2. Open a `.blade.php` file in the new window
3. Try the autocompletion by typing `<x-filament::`

## Making Changes

1. Make changes to the files:
   - `extension.js` - The main extension code
   - `snippets/filament.json` - The snippets for autocompletion
   - `syntaxes/blade.tmLanguage.json` - The language syntax definition

2. Reload the extension by:
   - Closing the debug window
   - Pressing `F5` again to relaunch

## Packaging the Extension

To create a `.vsix` package that can be installed in VSCode:

```bash
npm install -g @vscode/vsce
vsce package
```

## Publishing to VSCode Marketplace

1. Create a publisher account on the VSCode Marketplace
2. Update the publisher field in `package.json`
3. Run `vsce publish`

## Resources

- [VSCode Extension Documentation](https://code.visualstudio.com/api)
- [VSCode Extension Samples](https://github.com/microsoft/vscode-extension-samples)
