# Boucle Decade (Windows) : un appel Claude Code isolé par élément non coché du backlog.
# Usage : ./scripts/loop.ps1 composants|pages
param([string]$Kind = "composants")
$cfg = Get-Content decade.config.json -Raw -Encoding UTF8 | ConvertFrom-Json
if ($Kind -eq "pages") { $section = "Pages"; $cmd = "/decade-front:page"; $turns = if ($cfg.boucles.maxTurnsPage) { $cfg.boucles.maxTurnsPage } else { 40 } }
else { $section = "Composants"; $cmd = "/decade-front:ds-component"; $turns = if ($cfg.boucles.maxTurnsComposant) { $cfg.boucles.maxTurnsComposant } else { 30 } }
$model = if ($cfg.modeles.boucle) { $cfg.modeles.boucle } else { "haiku" }   # skill decade-modeles
New-Item -ItemType Directory -Force workflow/logs | Out-Null
$stop = "workflow/STOP-BOUCLE.md"
if (Test-Path $stop) { Remove-Item $stop }

# Préalables : sans Storybook, le contrôleur QA ne peut pas jouer les stories et la boucle tournerait pour rien.
if ($cfg.stack -eq "react" -or $cfg.stack -eq "nextjs") {
  $sb = if ($env:STORYBOOK_URL) { $env:STORYBOOK_URL } else { "http://localhost:6006" }
  try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 "$sb/index.json" | Out-Null }
  catch {
    Write-Host "⛔ Storybook ne répond pas sur $sb."
    Write-Host "   Ouvre un autre terminal dans ce dossier, lance « npm run storybook », attends « Storybook started », puis relance ce script."
    exit 1
  }
  if ($cfg.stack -eq "nextjs") {
    try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 "http://localhost:3000" | Out-Null }
    catch { Write-Host "⚠ Le site ne répond pas sur http://localhost:3000 : lance « npm run dev » dans un autre terminal (Next DevTools MCP s’en sert). La boucle continue." }
  }
}

$in = $false; $todo = @()
foreach ($line in Get-Content workflow/backlog.md -Encoding UTF8) {
  if ($line -match '^## ') { $in = ($line -eq "## $section"); continue }
  if ($in -and $line -match '^- \[ \] (\S+)') { $todo += $Matches[1] }
}
Write-Host "$($todo.Count) élément(s) à traiter ($section)"
# Une commande par appel (pas de &&, |, cd) : en boucle, personne ne peut accepter une commande hors de cette liste.
$tools = "Read,Write,Edit,Glob,Grep,Agent,Task,Bash(npm run *),Bash(npx playwright *),Bash(npx lhci *),Bash(npx --no-install *),Bash(npx storybook *),Bash(git status),Bash(git diff *),mcp__figma,mcp__plugin_figma_figma,mcp__storybook,mcp__next-devtools"
foreach ($item in $todo) {
  Write-Host "▶ $item"
  $out = claude -p "$cmd $item" --model $model --permission-mode acceptEdits --allowedTools $tools --max-turns $turns --output-format text
  $out | Set-Content -Path "workflow/logs/$Kind-$item.log" -Encoding UTF8
  $out | Select-Object -Last 3
  if (Test-Path $stop) {
    Write-Host "⛔ Boucle arrêtée : un contrôle n’a pas pu s’exécuter (verdict BLOQUÉ). Rien n’est coché à tort."
    Get-Content $stop -Encoding UTF8 | Write-Host
    break
  }
}
Write-Host "🧭 À toi, pilote : ouvre Claude Code et lance /decade-front:next-step (bilan, blocages, prochaine action)."
