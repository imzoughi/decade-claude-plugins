# Actions utilisateur

Une section par action. Aujourd’hui ces actions ne font que changer l’affichage (ou rien) : c’est au backend de les rendre réelles.

## {{Nom de l’action}} — ex. Ajouter au panier
- **Où** : page {{page}}, composant {{Composant}} (bouton « … »)
- **Code actuel** : `{{fichier}}` · `{{handler}}` (ce qu’il fait aujourd’hui)
- **Entrée** : `{ "productId": "string", "quantity": 1 }`
- **Appel attendu** : `POST /{{ressource}}`
- **Réponse attendue** : entité `{{Cart}}` du contrat
- **Erreurs à gérer** : stock épuisé, non connecté, réseau
- **Retour visuel prévu** : pendant l’appel {{état chargement du bouton}} · succès {{Toast « Ajouté au panier »}} · erreur {{Toast d’erreur}}
