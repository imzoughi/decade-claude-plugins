# Boucle Decade (Windows) : un appel Claude Code isolé par élément non coché du backlog.
# Usage : ./scripts/loop.ps1 composants|pages
param([string]$Kind = "composants")
$cfg = Get-Content decade.config.json -Raw -Encoding UTF8 | ConvertFrom-Json
if ($Kind -eq "pages") { $section = "Pages"; $cmd = "/decade-front:page"; $turns = if ($cfg.boucles.maxTurnsPage) { $cfg.boucles.maxTurnsPage } else { 40 } }
else { $section = "Composants"; $cmd = "/decade-front:ds-component"; $turns = if ($cfg.boucles.maxTurnsComposant) { $cfg.boucles.maxTurnsComposant } else { 30 } }
$model = if ($cfg.modeles.boucle) { $cfg.modeles.boucle } else { "haiku" }   # skill decade-modeles
New-Item -ItemType Directory -Force workflow/logs | Out-Null
$in = $false; $todo = @()
foreach ($line in Get-Content workflow/backlog.md -Encoding UTF8) {
  if ($line -match '^## ') { $in = ($line -eq "## $section"); continue }
  if ($in -and $line -match '^- \[ \] (\S+)') { $todo += $Matches[1] }
}
Write-Host "$($todo.Count) élément(s) à traiter ($section)"
foreach ($item in $todo) {
  Write-Host "▶ $item"
  claude -p "$cmd $item" --model $model --permission-mode acceptEdits `
    --allowedTools "Read,Write,Edit,Glob,Grep,Agent,Task,Bash(npm run *),Bash(npx playwright *),Bash(npx lhci *),mcp__figma,mcp__storybook,mcp__next-devtools" `
    --max-turns $turns --output-format text | Tee-Object -FilePath "workflow/logs/$Kind-$item.log" | Select-Object -Last 3
}
Write-Host "🧭 À toi, pilote : ouvre Claude Code et lance /decade-front:next-step (bilan, blocages, prochaine action)."
