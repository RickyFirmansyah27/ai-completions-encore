#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script to remove multi-line comments (/* ... */) from TypeScript/JavaScript files
// Usage: node scripts/remove-comments.cjs [directory]

class CommentRemover {
  constructor() {
    this.processedFiles = 0;
    this.removedComments = 0;
  }

  // Removes multi-line comments from code while preserving strings
  removeComments(content) {
    let result = '';
    let i = 0;
    let inString = false;
    let stringChar = '';
    let inComment = false;
    let removedCount = 0;

    while (i < content.length) {
      const char = content[i];
      const nextChar = content[i + 1] || '';

      // Handle string literals
      if (!inComment && (char === '"' || char === "'" || char === '`')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar && (i === 0 || content[i - 1] !== '\\')) {
          inString = false;
          stringChar = '';
        }
        result += char;
        i++;
        continue;
      }

      // Skip if we're inside a string
      if (inString) {
        result += char;
        i++;
        continue;
      }

      // Handle comment start
      if (!inComment && char === '/' && nextChar === '*') {
        inComment = true;
        i += 2;
        continue;
      }

      // Handle comment end
      if (inComment && char === '*' && nextChar === '/') {
        inComment = false;
        removedCount++;
        
        // Skip the closing */
        i += 2;
        
        // Add a space if the comment was in the middle of code
        if (i < content.length && content[i] !== '\n' && content[i] !== ' ') {
          result += ' ';
        }
        continue;
      }

      // If we're in a comment, skip the character
      if (inComment) {
        i++;
        continue;
      }

      // Add regular characters
      result += char;
      i++;
    }

    this.removedComments += removedCount;
    return result;
  }

  // Processes a single file
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const cleanedContent = this.removeComments(content);
      
      // Only write if content changed
      if (content !== cleanedContent) {
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        console.log(`✓ Processed: ${filePath}`);
      }
      
      this.processedFiles++;
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }

  // Recursively processes all TypeScript/JavaScript files in a directory
  processDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other common directories
          const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next'];
          if (!skipDirs.includes(item)) {
            this.processDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          // Process TypeScript and JavaScript files
          const filePattern = /\.(ts|js|tsx|jsx)$/;
          if (filePattern.test(item)) {
            this.processFile(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`✗ Error reading directory ${dirPath}:`, error.message);
    }
  }

  // Main execution method
  run(targetPath) {
    targetPath = targetPath || './src';
    console.log('🧹 Starting comment removal...\n');
    
    const fullPath = path.resolve(targetPath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`✗ Path does not exist: ${fullPath}`);
      process.exit(1);
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile()) {
      this.processFile(fullPath);
    } else if (stat.isDirectory()) {
      this.processDirectory(fullPath);
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Files processed: ${this.processedFiles}`);
    console.log(`   Comments removed: ${this.removedComments}`);
    console.log('\n✅ Comment removal completed!');
  }
}

// Run the script
const targetPath = process.argv[2];
const remover = new CommentRemover();
remover.run(targetPath);