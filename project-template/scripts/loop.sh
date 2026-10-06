#!/usr/bin/env bash
# Boucle Decade : un appel Claude Code isolé par élément non coché du backlog.
# Usage : scripts/loop.sh composants|pages     (paramètres lus dans decade.config.json)
set -euo pipefail
KIND="${1:-composants}"
BACKLOG="workflow/backlog.md"
cfg() { node -e "const c=require('./decade.config.json');const v=$1;console.log(v===undefined?'$2':v)"; }
if [ "$KIND" = "pages" ]; then SECTION="Pages"; CMD="/decade-front:page"; TURNS=$(cfg "c.boucles&&c.boucles.maxTurnsPage" 40)
else SECTION="Composants"; CMD="/decade-front:ds-component"; TURNS=$(cfg "c.boucles&&c.boucles.maxTurnsComposant" 30); fi
MODEL=$(cfg "c.modeles&&c.modeles.boucle" haiku)   # skill decade-modeles : la session de boucle ne fait qu’orchestrer
mkdir -p workflow/logs
mapfile -t TODO < <(awk -v s="## $SECTION" '$0==s{f=1;next} /^## /{f=0} f && /^- \[ \] /{sub(/^- \[ \] /,""); print $1}' "$BACKLOG")
echo "${#TODO[@]} élément(s) à traiter ($SECTION)"
for item in "${TODO[@]}"; do
  echo "▶ $item"
  claude -p "$CMD $item" --model "$MODEL" --permission-mode acceptEdits \
    --allowedTools "Read,Write,Edit,Glob,Grep,Agent,Task,Bash(npm run *),Bash(npx playwright *),Bash(npx lhci *),mcp__figma,mcp__storybook,mcp__next-devtools" \
    --max-turns "$TURNS" --output-format text | tee "workflow/logs/$KIND-$item.log" | tail -3
done
echo "Terminé. Reste non coché : $(grep -c '^- \[ \]' "$BACKLOG" || true)"
echo "🧭 À toi, pilote : ouvre Claude Code et lance /decade-front:next-step (bilan, blocages, prochaine action)."
