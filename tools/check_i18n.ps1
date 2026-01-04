# Check i18n usage vs translations (PowerShell)
# Usage: run from repo root: powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\check_i18n.ps1

$ErrorActionPreference = 'Stop'
$root = Get-Location
Write-Output "Scanning files under: $root"

$files = Get-ChildItem -Path $root -Recurse -File -Include *.html,*.js,*.css -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\tools\\' }

$usedKeys = [System.Collections.Generic.HashSet[string]]::new()

$patterns = @(
    'data-i18n\s*=\s*"([^"]+)"',
    "data-i18n-aria\s*=\s*'([^']+)'",
    'data-i18n-aria\s*=\s*"([^"]+)"',
    "i18n\.t\(\s*'([^']+)'\s*\)",
    'i18n\.t\(\s*"([^"]+)"\s*\)'
)

foreach ($f in $files) {
    try {
        $text = Get-Content -Raw -LiteralPath $f.FullName -ErrorAction Stop
    } catch {
        continue
    }
    if ([string]::IsNullOrEmpty($text)) { continue }
    foreach ($pat in $patterns) {
        $matches = [regex]::Matches($text, $pat)
        foreach ($m in $matches) {
            $key = $m.Groups[1].Value
            if ([string]::IsNullOrEmpty($key)) { continue }
            # ignore obvious regex fragments or short garbage
            if ($key -match '[\(\[\]\\]') { continue }
            $usedKeys.Add($key) | Out-Null
        }
    }
}

# Load translations.js and extract keys from the first language block (prefer 'sv')
$translationsPath = Join-Path $root 'translations.js'
if (-not (Test-Path $translationsPath)) {
    $translationsPath = Get-ChildItem -Path $root -Recurse -File -Filter translations.js -ErrorAction SilentlyContinue | Select-Object -First 1 | ForEach-Object FullName
}
if (-not $translationsPath) {
    Write-Error "translations.js not found in repo."
    exit 2
}

$transText = Get-Content -Raw -LiteralPath $translationsPath

# Try to find 'sv' block first, otherwise take the first language object
$svMatch = [regex]::Match($transText, "\bsv\s*:\s*\{(.*?)\}\s*(,|$)", [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($svMatch.Success) { $block = $svMatch.Groups[1].Value }
else {
    # find first top-level language: something like <lang> : { ... }
    $m = [regex]::Match($transText, "[a-zA-Z0-9_\-]+\s*:\s*\{(.*?)\}\s*(,|\})", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($m.Success) { $block = $m.Groups[1].Value } else { $block = $transText }
}

$translationKeys = [System.Collections.Generic.HashSet[string]]::new()

# Match keys like 'key': or "key": or key:
# Match only top-level object keys at the start of a line (avoid words inside string values)
$pattern = @'
^\s*["']?([A-Za-z0-9_.-]+)["']?\s*:
'@
$keyMatches = [regex]::Matches($block, $pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
foreach ($km in $keyMatches) { $translationKeys.Add($km.Groups[1].Value) | Out-Null }

# Compute differences
$usedList = $usedKeys | Sort-Object
$transList = $translationKeys | Sort-Object

$missing = $usedList | Where-Object { -not ($translationKeys.Contains($_)) }
$unused = $transList | Where-Object { -not ($usedKeys.Contains($_)) }

Write-Output "\nResults:"
Write-Output "Total files scanned: $($files.Count)"
Write-Output "Used i18n keys found: $($usedList.Count)"
Write-Output "Translation keys found: $($transList.Count)\n"

Write-Output "Missing keys (used in code but not present in translations): $($missing.Count)"
if ($missing.Count -gt 0) { $missing | ForEach-Object { Write-Output " - $_" } }

Write-Output "\nUnused translation keys (present in translations but not found in code): $($unused.Count)"
if ($unused.Count -gt 0) { $unused | ForEach-Object { Write-Output " - $_" } }

# Exit code: 0 success
exit 0
