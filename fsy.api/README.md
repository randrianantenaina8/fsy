<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<div align="center">

[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![PHP][php-shield]](#)
[![React.js][react-shield]](#)

</div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/">
    <img src="https://gitlab.lexaura.eu/uploads/-/system/project/avatar/54/Capture.JPG" alt="Logo" width="80">
  </a>

<h3 align="center">Simulateur Fransylva - API</h3>

  <p align="center">
    Simulateur d’aides au renouvellement forestier
    <br />
    <a href="https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/-/tree/develop/docs"><strong>Documentation »</strong></a>
    <br />
    <br />
    <a title="Serveur de dev" href="#">Développement</a>
    ·
    <a title="Serveur de recette" href="#">Recette</a>
    ·
    <a title="Serveur de prod" href="#">Production</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<div align="center">

[![Project model][project-screenshot]][project-screenshot]

</div>

Ce simulateur en ligne informe/calcule les propriétaires et gestionnaires sur les aides disponibles et leurs modalités d’accès selon l’éligibilité de leur dossier individuel.

Il s'agit ici du projet "API".



<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [Symfony](https://symfony.com/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Ce projet est basé sur symfony, suivre les instructions ci-dessous pour toute nouvelle installation du projet

### Prerequisites

Installer Composer et npm (node.js) :
* [https://getcomposer.org/download/](https://getcomposer.org/download/)
* [https://nodejs.org/en/](https://nodejs.org/en/)


* Mettre à jour composer
  ```sh
  composer selfupdate
  ```

* Mettre à jour npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Cloner le repo
   ```sh
   git clone https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/
   ```
2. Installer les vendor Symfony
   ```sh
   composer install
   ```
3. créer un .env.local à partir du .env présent à la racine du dossier
   ```sh
   cp .env .env.local
   ```
4. Modifier les lignes suivantes dans le .env.local
   ```
   - DATABASE_URL
   - JWT_PASSPHRASE
   ```
5. Générer les fichiers **config/jwt/private.pem** et **config/jwt/public.pem**
   
   > *Attention à bien noter le mot de passe utilisé pour générer ces fichiers*
   ```sh
   openssl genrsa -out config/jwt/private.pem -aes256 4096
   openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
   ```
6. Initialiser la BDD 
   ```sh
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

#### TODO: Remplir cette section

_Pour plus d'exemples, voir la [Documentation](https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/-/tree/develop/docs)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Fonctions de gestion des utilisateurs
- [ ] Fonctions de gestion des questions
- [ ] Fonctions de gestion des fides d'aides
- [ ] Fonctions de gestion des statistiques

Pour plus de détails, voir [le cahier des charges](#) ou [la maquette](#)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Licence Nextaura, voir le fichier `LICENSE.md` pour plus d'informations.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Développeurs :
- Sébastien RINGOT - [sringot@nextaura.com](mailto:sringot@nextaura.com)
- Angelo ANDRIANANTENAINA - [aandrianantenaina@nextaura.com](mailto:aandrianantenaina@nextaura.com)

Lien du projet: [fsy.api][project-link]

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[issues-shield]: https://img.shields.io/badge/Issues----yellow?style=flat-square
[issues-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/-/issues
[license-shield]: https://img.shields.io/badge/License-Nextaura-00C5E6?style=flat-square
[license-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.api/-/blob/develop/LICENSE.md
[php-shield]: https://img.shields.io/badge/php-%3E%3D8.1.0-blue?style=flat-square
[react-shield]: https://img.shields.io/badge/React.js-%5E18.1.0-61dafb?style=flat-square
[project-link]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.api
[project-screenshot]: https://gitlab.lexaura.eu/uploads/-/system/project/avatar/54/Capture.JPG
