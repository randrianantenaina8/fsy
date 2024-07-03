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
[![React.js][react-shield]](#)

</div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/">
    <img src="https://gitlab.lexaura.eu/uploads/-/system/project/avatar/64/FSY-back.jpg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Simulateur Fransylva - BackOffice</h3>

  <p align="center">
    Simulateur d’aides au renouvellement forestier
    <br />
    <a href="https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/-/tree/develop/docs"><strong>Documentation »</strong></a>
    <br />
    <br />
    <a title="Serveur de dev" href="https://fsy-dev49.nextaura.eu/">Développement</a>
    ·
    <a title="Serveur de recette" href="https://fsy-stag41.nextaura.eu/">Recette</a>
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

Il s'agit ici de l'interface d'administration permettant de gérer le simulateur et consulter les statistiques associées


<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [React.js](https://reactjs.org/)
* using [fsy.common-library](https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

Ce projet est basé sur React.js, suivre les instructions ci-dessous pour toute nouvelle installation du
projet

### Prerequisites

Installer npm (node.js) :

* [https://nodejs.org/en/](https://nodejs.org/en/)

* Mettre à jour npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Cloner le repo
   ```sh
   git clone https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/
   ```
2. créer un .env.local à partir du .env présent à la racine du dossier
   ```sh
   cp .env .env.local
   ```
3. Installer les packages npm
   ```sh
   npm install
   ```
4. Démarrer le projet localement
   ```sh
   npm start
   ```
3. Lancer un build de production
   ```sh
   npm run build
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->

## Usage

#### TODO: Remplir cette section

_Pour plus d'exemples, voir la [Documentation](https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/-/tree/develop/docs)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->

## Roadmap

- [x] Interface générale
- [ ] Gestion des utilisateurs
- [ ] Gestion des Aides
- [ ] Gestion du simulateur
- [ ] Gestion des demandes d'aides
- [ ] Dashboard statistiques

Pour plus de détails, voir [le cahier des charges][project-cdc] ou [la maquette][project-maquette]

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->

## License

Licence Nextaura, voir le fichier `LICENSE.md` pour plus d'informations.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

Développeurs :

- Sébastien RINGOT - [sringot@nextaura.com](mailto:sringot@nextaura.com)

Lien du projet: [fsy.back-office][project-link]

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[issues-shield]: https://img.shields.io/badge/Issues----yellow?style=flat-square
[issues-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/-/issues
[license-shield]: https://img.shields.io/badge/License-Nextaura-00C5E6?style=flat-square
[license-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/-/blob/develop/LICENSE.md
[react-shield]: https://img.shields.io/badge/React.js-%5E18.2.0-61dafb?style=flat-square
[project-link]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.back
[project-screenshot]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.back/-/wikis/uploads/0c5bc9f5daccf4e58024fada4cc81d46/image.png
[project-cdc]: https://workdrive.zohopublic.eu/external/e5d84cdce34750206794b162417b3a8470d03f87c6aaf3ef78841ea02a60bf63
[project-maquette]: https://workdrive.zohopublic.eu/external/b1b77b36e8d1ae1e0b46aad72125fe42804c375d4b6a906385e26c065b3a7901
