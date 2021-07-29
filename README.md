# Butler

### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [🔌 Getting Started](#-getting-started)
- [💡 Improvements to Make](#-improvements-to-make)
- [📚 Helpful Resources](#-helpful-resources)

## 👋 Introduction

Butler is a library for actively interfacing with Steam APIs to perform actions on the platform in a simplified fashion.

The large majority of "Steam bots" currently couple together passive interfacing (i.e listening to API events on poll) and active interfacing (i.e actions such as making and sending a Steam trade offer) within a single application. This causes coupling, make testing long and difficult.

By separating the logic into a passive component [`@automatedtf/sentinel`](https://github.com/automatedtf/sentinel) and an active component `@automatedtf/butler`, it allows for cross-applicational systems to exist with newly-found opportunities for scalability, robustness and maintenance.

This library is designed to be stateless, meaning that it is suitable for usage in stateful settings (i.e handler functions for a 24/7 bot instance) and stateless settings (i.e Cloud / Lambda functions).

## 🔌 Getting Started
`🚧 TODO 🚧`

## 💡 Improvements to Make
`🚧 TODO 🚧`

## 📚 Helpful Resources
- [`@automatedtf/sentinel`](https://github.com/automatedtf/sentinel)