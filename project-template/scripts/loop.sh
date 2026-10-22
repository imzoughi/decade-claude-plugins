#!/usr/bin/env bash
# Boucle Decade : un appel Claude Code isolé par élément non coché du backlog.
# Usage : scripts/loop.sh composants|pages     (paramètres lus dans decade.config.json)
set -euo pipefail
KIND="${1:-composants}"
BACKLOG="workflow/backlog.md"
STOP="workflow/STOP-BOUCLE.md"
cfg() { node -e "const c=require('./decade.config.json');const v=$1;console.log(v===undefined?'$2':v)"; }
if [ "$KIND" = "pages" ]; then SECTION="Pages"; CMD="/decade-front:page"; TURNS=$(cfg "c.boucles&&c.boucles.maxTurnsPage" 40)
else SECTION="Composants"; CMD="/decade-front:ds-component"; TURNS=$(cfg "c.boucles&&c.boucles.maxTurnsComposant" 30); fi
MODEL=$(cfg "c.modeles&&c.modeles.boucle" haiku)   # skill decade-modeles : la session de boucle ne fait qu’orchestrer
STACK=$(cfg "c.stack" "")
mkdir -p workflow/logs
[ -f "$STOP" ] && rm "$STOP"

# Préalables : sans Storybook, le contrôleur QA ne peut pas jouer les stories et la boucle tournerait pour rien.
if [ "$STACK" = "react" ] || [ "$STACK" = "nextjs" ]; then
  SB="${STORYBOOK_URL:-http://localhost:6006}"
  if ! node -e "fetch('$SB/index.json').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"; then
    echo "⛔ Storybook ne répond pas sur $SB."
    echo "   Ouvre un autre terminal dans ce dossier, lance « npm run storybook », attends « Storybook started », puis relance ce script."
    exit 1
  fi
  if [ "$STACK" = "nextjs" ] && ! node -e "fetch('http://localhost:3000').then(()=>process.exit(0),()=>process.exit(1))"; then
    echo "⚠ Le site ne répond pas sur http://localhost:3000 : lance « npm run dev » dans un autre terminal (Next DevTools MCP s’en sert). La boucle continue."
  fi
fi

mapfile -t TODO < <(awk -v s="## $SECTION" '$0==s{f=1;next} /^## /{f=0} f && /^- \[ \] /{sub(/^- \[ \] /,""); print $1}' "$BACKLOG")
echo "${#TODO[@]} élément(s) à traiter ($SECTION)"
# Une commande par appel (pas de &&, |, cd) : en boucle, personne ne peut accepter une commande hors de cette liste.
TOOLS="Read,Write,Edit,Glob,Grep,Agent,Task,Bash(npm run *),Bash(npx playwright *),Bash(npx lhci *),Bash(npx --no-install *),Bash(npx storybook *),Bash(git status),Bash(git diff *),mcp__figma,mcp__plugin_figma_figma,mcp__storybook,mcp__next-devtools"
for item in "${TODO[@]}"; do
  echo "▶ $item"
  claude -p "$CMD $item" --model "$MODEL" --permission-mode acceptEdits --allowedTools "$TOOLS" \
    --max-turns "$TURNS" --output-format text | tee "workflow/logs/$KIND-$item.log" | tail -3
  if [ -f "$STOP" ]; then
    echo "⛔ Boucle arrêtée : un contrôle n’a pas pu s’exécuter (verdict BLOQUÉ). Rien n’est coché à tort."
    cat "$STOP"
    break
  fi
done
echo "Terminé. Reste non coché : $(grep -c '^- \[ \]' "$BACKLOG" || true)"
echo "🧭 À toi, pilote : ouvre Claude Code et lance /decade-front:next-step (bilan, blocages, prochaine action)."
