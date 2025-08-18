# Comment Removal Scripts

This directory contains scripts to remove multi-line comments (`/* ... */`) from TypeScript and JavaScript files.

## 🚀 Usage

### Option 1: NPM Scripts (Recommended)
```bash
# Remove comments from entire project
npm run clean:comments

# Remove comments from src directory only
npm run clean:comments:src
```

### Option 2: Direct Script Execution

#### Node.js Version
```bash
# Remove comments from src directory (default)
node scripts/remove-comments.cjs

# Remove comments from specific directory
node scripts/remove-comments.cjs ./path/to/directory

# Remove comments from single file
node scripts/remove-comments.cjs ./path/to/file.ts
```

#### PowerShell Version (Windows)
```powershell
# Remove comments from src directory (default)
.\scripts\remove-comments.ps1

# Remove comments from specific directory
.\scripts\remove-comments.ps1 -TargetPath ".\path\to\directory"
```

#### Batch File (Windows)
```cmd
# Remove comments from src directory (default)
scripts\remove-comments.bat

# Remove comments from specific directory
scripts\remove-comments.bat ".\path\to\directory"
```

## 🔧 Features

- **Smart Comment Detection**: Preserves comments inside strings and template literals
- **Recursive Processing**: Processes all `.ts`, `.js`, `.tsx`, `.jsx` files in directories
- **Safe Operation**: Only modifies files that actually contain comments
- **Progress Reporting**: Shows which files are being processed
- **Summary Statistics**: Reports total files processed and comments removed
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 📁 File Types Supported

- TypeScript (`.ts`, `.tsx`)
- JavaScript (`.js`, `.jsx`)

## 🚫 Directories Skipped

The scripts automatically skip these common directories:
- `node_modules`
- `.git`
- `dist`
- `build`
- `.next`

## ⚠️ Important Notes

1. **Backup Your Code**: Always commit your changes to version control before running these scripts
2. **Review Changes**: The scripts will modify your files in place
3. **String Preservation**: Comments inside string literals are preserved
4. **JSDoc Comments**: All multi-line comments are removed, including JSDoc comments

## 🔍 Example

**Before:**
```typescript
/* This is a comment */
const value = "/* this is not a comment */";
/* Another comment
   spanning multiple lines */
function test() {
  return value;
}
```

**After:**
```typescript
const value = "/* this is not a comment */";
function test() {
  return value;
}
```

## 🛠️ Customization

To modify the behavior, edit the respective script files:
- `remove-comments.js` - Node.js version
- `remove-comments.ps1` - PowerShell version
- `remove-comments.bat` - Batch file wrapper

You can customize:
- File extensions to process
- Directories to skip
- Comment removal logic
- Output formatting