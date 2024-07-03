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
<h3 align="center">Simulateur Fransylva - Common-library</h3>

  <p align="center">
    Une librairie pour regroupant les fonctions utilisées par le simulateur d'aides forestières Fransylva 
    <br />
    <a href="https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library/-/tree/develop/docs"><strong>Documentation »</strong></a>
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
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">

[![Project model][project-screenshot]][project-screenshot]

</div>

Ce simulateur en ligne informe/calcule les propriétaires et gestionnaires sur les aides disponibles et leurs modalités
d’accès selon l’éligibilité de leur dossier individuel.

Il s'agit ici du projet "common-library". Ce projet a pour but de centraliser les fonctions communes aux projets front
et back sous forme d'une librairie installable via npm

Il expose notamment des fonctions permettant de faire les requêtes à l'Api ou encore de récupérer les constantes
communes

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Node.js](https://nodejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

Suivre les instructions ci-dessous pour toute nouvelle installation du projet

### Prerequisites

Installer npm (node.js) :

* [https://nodejs.org/](https://nodejs.org/)

* Mettre à jour npm

```sh
npm install npm@latest -g
```

### Installation

1. Installer le packet sur le projet voulu

```sh
npm install https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library
```

2. Importer les fonctions et constantes voulues

```javascript
// Import library objects
import {Api, Constants} from 'common-library';
// Call an api function
const users = await Api.getUsers();
// Get a constant value
console.log(Constants.HTTP_USER_NOT_FOUND);
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Usage -->

## Usage

La librairie exporte les 4 objets suivants

| Nom       | Description                                                                                                                                                                                                  |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Api       | Contient toutes les fonctions API disponibles. Les fonctions sont regroupées par type d'entité. Par exemple pour récupérer la liste des utilisateurs il faut utiliser la fonction : `Api.User.getUsers(jwt)` |
| Session   | Contient toutes les fonctions permettant de gérer une session avec React : gestion du localStorage, gestion des cookies, connexion / déconnexion, ...                                                        |
| Roles     | Contient 2 fonctions : `isGranted` et `getRoleString` permettant de vérifier le niveau de droit d'un utilisateur et de récupérer le nom d'un rôle sous forme de texte lisible par une personne lambda        |
| Constants | Regroupe toutes les constantes nécessaires au projet : Codes http, nom du projet, rôles, etc ...                                                                                                             |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Licence Nextaura, voir le fichier `LICENSE.md` pour plus d'informations.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

Développeurs :

- Sébastien RINGOT - [sringot@nextaura.com](mailto:sringot@nextaura.com)

Lien du projet: [scg.common-library][project-link]

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[issues-shield]: https://img.shields.io/badge/Issues----yellow?style=flat-square

[issues-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library/-/issues

[license-shield]: https://img.shields.io/badge/License-Nextaura-00C5E6?style=flat-square

[license-url]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library/-/blob/develop/LICENSE.md

[react-shield]: https://img.shields.io/badge/Node.js-%5E18.12.1-026E00?style=flat-square

[project-link]: https://gitlab.lexaura.eu/nextaura/fsy/fsy.common-library

[project-cdc]: https://workdrive.zohopublic.eu/external/e5d84cdce34750206794b162417b3a8470d03f87c6aaf3ef78841ea02a60bf63

[project-maquette]: https://workdrive.zohopublic.eu/external/b1b77b36e8d1ae1e0b46aad72125fe42804c375d4b6a906385e26c065b3a7901
