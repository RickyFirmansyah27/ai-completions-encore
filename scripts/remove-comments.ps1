# PowerShell script to remove multi-line comments (/* ... */) from TypeScript/JavaScript files
# Usage: .\scripts\remove-comments.ps1 [directory]

param(
    [string]$TargetPath = ".\src"
)

class CommentRemover {
    [int]$ProcessedFiles = 0
    [int]$RemovedComments = 0

    # Remove multi-line comments from content
    [string] RemoveComments([string]$content) {
        $result = ""
        $i = 0
        $inString = $false
        $stringChar = ""
        $inComment = $false
        $removedCount = 0

        while ($i -lt $content.Length) {
            $char = $content[$i]
            $nextChar = if ($i + 1 -lt $content.Length) { $content[$i + 1] } else { "" }

            # Handle string literals
            if (-not $inComment -and ($char -eq '"' -or $char -eq "'" -or $char -eq '`')) {
                if (-not $inString) {
                    $inString = $true
                    $stringChar = $char
                } elseif ($char -eq $stringChar -and ($i -eq 0 -or $content[$i - 1] -ne '\')) {
                    $inString = $false
                    $stringChar = ""
                }
                $result += $char
                $i++
                continue
            }

            # Skip if inside string
            if ($inString) {
                $result += $char
                $i++
                continue
            }

            # Handle comment start
            if (-not $inComment -and $char -eq '/' -and $nextChar -eq '*') {
                $inComment = $true
                $i += 2
                continue
            }

            # Handle comment end
            if ($inComment -and $char -eq '*' -and $nextChar -eq '/') {
                $inComment = $false
                $removedCount++
                $i += 2
                
                # Add space if needed
                if ($i -lt $content.Length -and $content[$i] -ne "`n" -and $content[$i] -ne ' ') {
                    $result += ' '
                }
                continue
            }

            # Skip if in comment
            if ($inComment) {
                $i++
                continue
            }

            # Add regular characters
            $result += $char
            $i++
        }

        $this.RemovedComments += $removedCount
        return $result
    }

    # Process a single file
    [void] ProcessFile([string]$filePath) {
        try {
            $content = Get-Content -Path $filePath -Raw -Encoding UTF8
            $cleanedContent = $this.RemoveComments($content)
            
            if ($content -ne $cleanedContent) {
                Set-Content -Path $filePath -Value $cleanedContent -Encoding UTF8 -NoNewline
                Write-Host "✓ Processed: $filePath" -ForegroundColor Green
            }
            
            $this.ProcessedFiles++
        }
        catch {
            Write-Host "✗ Error processing $filePath : $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Process directory recursively
    [void] ProcessDirectory([string]$dirPath) {
        try {
            $items = Get-ChildItem -Path $dirPath
            
            foreach ($item in $items) {
                if ($item.PSIsContainer) {
                    # Skip common directories
                    if ($item.Name -notin @('node_modules', '.git', 'dist', 'build', '.next')) {
                        $this.ProcessDirectory($item.FullName)
                    }
                }
                elseif ($item.Extension -in @('.ts', '.js', '.tsx', '.jsx')) {
                    $this.ProcessFile($item.FullName)
                }
            }
        }
        catch {
            Write-Host "✗ Error reading directory $dirPath : $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Main execution method
    [void] Run([string]$targetPath) {
        Write-Host "🧹 Starting comment removal...`n" -ForegroundColor Cyan
        
        $fullPath = Resolve-Path -Path $targetPath -ErrorAction SilentlyContinue
        
        if (-not $fullPath -or -not (Test-Path $fullPath)) {
            Write-Host "✗ Path does not exist: $targetPath" -ForegroundColor Red
            exit 1
        }
        
        if (Test-Path $fullPath -PathType Leaf) {
            $this.ProcessFile($fullPath)
        }
        elseif (Test-Path $fullPath -PathType Container) {
            $this.ProcessDirectory($fullPath)
        }
        
        Write-Host "`n📊 Summary:" -ForegroundColor Yellow
        Write-Host "   Files processed: $($this.ProcessedFiles)" -ForegroundColor White
        Write-Host "   Comments removed: $($this.RemovedComments)" -ForegroundColor White
        Write-Host "`n✅ Comment removal completed!" -ForegroundColor Green
    }
}

# Run the script
$remover = [CommentRemover]::new()
$remover.Run($TargetPath)