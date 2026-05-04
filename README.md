# HiveFIAP

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

Adicione aqui:

- Tela de login.
- Tela de cadastro.
- Tela principal.
- Tela de salas por andar.
- Tela do Maker Lab.
- Tela de busca sem resultados.
- Tela de Minhas reservas.

## Gifs
<img width="300" alt="gif 1" src="https://github.com/user-attachments/assets/59806c02-4f95-437d-95c1-1f23d9f779b0" />
<img width="300" alt="gif 2" src="https://github.com/user-attachments/assets/07466ff5-2b4a-4ede-b451-4e0b80593a29" />
<img width="300" alt="gif 3" src="https://github.com/user-attachments/assets/e3347658-28f1-4575-bc5f-5fa1f8d058f3" />
<img width="300" alt="gif 4" src="https://github.com/user-attachments/assets/f06cfeb1-fb73-4c7e-a5e4-a5fa0a614468" />
<img width="300" alt="gif 5" src="https://github.com/user-attachments/assets/5d688a88-00b9-4f94-8207-2e613472ccd0" />











Fluxo esperado:

1. Cadastro de usuario.
2. Login.
3. Reserva de uma sala.
4. Visualizacao da sala na tela Minhas reservas.
5. Reserva de material com quantidade no Maker Lab.
6. Visualizacao do material na tela Minhas reservas.
7. Busca/filtro no Maker Lab.
8. Logout.

Link do video/GIF: preencher antes da entrega.

## Proximos Passos

- Adicionar notificacoes locais para lembrar reservas.
- Permitir foto de perfil com ImagePicker.
- Criar uma tela de historico de reservas concluidas/canceladas.
- Adicionar edicao de dados do usuario.

## Status dos Requisitos do CP2

- React Native + Expo: OK.
- Expo Router com pelo menos 3 telas: OK.
- Auth com AsyncStorage: OK.
- Persistencia funcional com AsyncStorage: OK.
- Context API: OK.
- Formularios com validacao inline: OK.
- UX/UI refinada: OK.
- Diferencial tecnico: OK.
- README documentado: OK, faltando apenas prints, video e dados finais do grupo.
