Création de la base de données :
- Ouvrir phpmyadmin (gestion de base de données)
- Créer une base en l'appelant "iat"
- Cliquer sur "importer"
- Choisir le fichier iat.sql dans le dossier database

Connecter le site à la base de données :
- Modifier le fichier DBconnect.php dans le dossier database par le login et le mdp (les mêmes que ceux pour ouvrir phpmyadmin)

Mettre tous les fichiers du site dans le serveur :
- les mettre dans le dossier "public_html"

Notes:
Il y a 2 liens pour 2 domaines différents :
- Les sciences dures : l'URL se finit par indexsciences.php (ex : https://iat.univ-amu.fr/iat_comite/indexsciences.php )
- Le reste : l'URL se finit par indexothers.php (ex : https://iat.univ-amu.fr/iat_comite/indexothers.php )
L'intitulé de la phase des questions (après l'IAT) change selon le domaine