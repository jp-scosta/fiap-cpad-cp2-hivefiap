
﻿# HiveFIAP
 
Aplicativo cross-platform desenvolvido com React Native, Expo e Expo Router para gerenciar reservas de espacos academicos da FIAP e materiais do Maker Lab.

## Sobre o Projeto

O HiveFIAP resolve um problema comum da rotina academica: consultar e reservar salas por andar, alem de controlar a reserva de materiais do Maker Lab. A operacao escolhida foi a gestao de espacos e recursos da FIAP porque ela combina navegacao entre telas, persistencia de dados, autenticacao e feedback visual para o usuario.

Em relacao ao CP1, o projeto evoluiu com:

- Autenticacao de usuarios com cadastro, login, logout e sessao persistida.
- Persistencia local de reservas de salas e estoque/reservas do Maker Lab.
- Gerenciamento de estado global com Context API.
- Validacao de formularios com mensagens inline.
- Interface visual inspirada na identidade da FIAP.
- Diferencial tecnico: busca e filtragem em tempo real no Maker Lab.

## Funcionalidades

- Cadastro de usuario com nome completo, usuario/RM, e-mail, senha e confirmacao de senha.
- Login com e-mail e senha persistidos no AsyncStorage.
- Logout com limpeza da sessao.
- Sessao persistida: usuario logado continua autenticado ao reabrir o app.
- Protecao de rotas: telas principais redirecionam para login quando nao ha usuario autenticado.
- Listagem de andares da FIAP.
- Reserva e cancelamento de salas por andar com data, horario de inicio e horario de fim.
- Persistencia das reservas de salas por andar.
- Estoque do Maker Lab com reserva e cancelamento de materiais por quantidade.
- Persistencia do estoque e das reservas do Maker Lab.
- Busca e filtro em tempo real de materiais.
- Tela "Minhas reservas" com resumo de salas e materiais reservados.
- Feedback visual de sucesso e erro.
- Telas de carregamento com `ActivityIndicator`.
- Tela de lista vazia na busca do Maker Lab.

## Integrantes do Grupo

| Nome completo | RM |
| Rodrigo Cordeiro | RM: 566386 |
| João Pedro | RM: 563869 |
| Gabriel de Biasi | RM: 563247 |
| Lucas Moraes | RM: 563667 |

## Como Rodar o Projeto

### Pre-requisitos

- Node.js instalado.
- Expo CLI via `npx`.
- Expo Go no celular ou emulador Android/iOS.
- Projeto usando Expo SDK 55.

### Passo a passo

```bash
git clone https://github.com/jp-scosta/fiap-cpad-cp2-hivefiap
cd fiap-cpad-cp2-hivefiap
npm install
npx expo start
```

Para abrir no navegador:

```bash
npx expo start --web
```

## Estrutura do Projeto

```text
fiap-cpad-cp2-hivefiap/
├── app/
│   ├── (auth)/
│   │   └── cadastro.js
│   ├── _layout.js
│   ├── index.js
│   ├── lab-maker.js
│   ├── login.js
│   └── salas-default.js
├── components/
│   └── FiapBackground.js
├── context/
│   └── AuthContext.js
├── assets/
└── README.md
```

## Decisoes Tecnicas

### Context API

O projeto usa `AuthContext` para centralizar o estado global de autenticacao. Ele disponibiliza:

- `user`: usuario logado.
- `loading`: estado de carregamento da sessao.
- `signed`: booleano indicando se ha usuario autenticado.
- `login(email, senha)`: valida credenciais persistidas.
- `logout()`: limpa a sessao e redireciona para login.

### AsyncStorage

O AsyncStorage foi usado para persistir dados localmente:

- `@HiveFiap:user`: sessao atual do usuario.
- `@HiveFiap:account_<email>`: dados de cadastro usados no login.
- `@HiveFiap:account_<usuario>`: chave auxiliar para manter RM/usuario salvo.
- `@HiveFiap:salas_andar_<andar>`: reservas de salas por andar.
- `@HiveFiap:maker_lab`: estoque e reservas do Maker Lab.

### Navegacao Protegida

As telas `index`, `salas-default` e `lab-maker` consomem `useAuth`. Quando nao existe usuario autenticado, a tela redireciona para `/login` usando `router.replace`.

### Validacao de Formularios

Os formularios validam:

- Campo obrigatorio.
- Formato de e-mail.
- Senha com minimo de 6 caracteres.
- Confirmacao de senha igual a senha.

As mensagens aparecem inline, abaixo dos campos correspondentes, sem uso de `Alert`.

## Diferencial Implementado

### Busca e filtragem em tempo real no Maker Lab

O diferencial escolhido foi a busca em tempo real no estoque do Maker Lab. Ele agrega valor porque o usuario encontra rapidamente materiais em uma lista que pode crescer com o tempo, reduzindo friccao no fluxo de reserva.

Resumo tecnico:

- Campo `TextInput` controla o termo de busca.
- `useMemo` filtra os materiais pelo nome.
- `FlatList` renderiza apenas os materiais encontrados.
- Quando nao ha resultado, o app mostra um componente de lista vazia.

## Demonstracao Visual

Obrigatorio antes da entrega: adicionar prints de todas as telas e link de GIF/video com o fluxo completo.

### Prints

- <img width="390" height="794" alt="tela de login" src="https://github.com/user-attachments/assets/802a4be3-2248-47b4-b306-279dcf580701" />

- <img width="362" height="755" alt="Tela de cadastro" src="https://github.com/user-attachments/assets/6e51fbc0-10e6-4786-8ff5-82fa5204ff52" />

- <img width="357" height="772" alt="Tela principal" src="https://github.com/user-attachments/assets/5cb80631-42c6-456f-b9e7-34a8733c9c37" />

- <img width="347" height="748" alt="Tela principal 2" src="https://github.com/user-attachments/assets/f9341f89-9fd7-436c-ab8c-c12adef6e09a" />

- <img width="366" height="777" alt="Tela reserva de sala" src="https://github.com/user-attachments/assets/193c1642-c50a-412c-86e7-4ffd2d3913f2" />

- <img width="366" height="765" alt="Tela Maker lab" src="https://github.com/user-attachments/assets/760e647b-bd77-44c5-b9a7-e678aed401ed" />

- <img width="350" height="782" alt="Tela minhas reservas" src="https://github.com/user-attachments/assets/8531e3c8-0cde-4c3e-85b6-db06ca944899" />


## Gifs
<img width="300" alt="gif 1" src="https://github.com/user-attachments/assets/ed22c881-24d9-4b1d-8716-68e35d223764" />
<img width="300" alt="gif 2" src="https://github.com/user-attachments/assets/ab685767-bd79-44db-8e02-1e8bb779f254" />
<img width="300" alt="gif 3" src="https://github.com/user-attachments/assets/23c9a66a-bb97-4f38-82ca-c5e044080940" />
<img width="300" alt="gif 4" src="https://github.com/user-attachments/assets/64b7afd2-5b2d-4c52-9b19-95b613233464" />
<img width="300" alt="gif 5" src="https://github.com/user-attachments/assets/63ffc4b6-1f22-4075-9e82-c6d9cf5deb85" />
<img width="300" alt="gif 6" src="https://github.com/user-attachments/assets/1ba4cb04-ce54-4d45-b050-fc129b3db0d7" />







