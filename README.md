# Butler 🤵

### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [🔌 Getting Started](#-getting-started)
    - [Example Usages](#example-usages)
        - [Creating a Trade Offer](#creating-a-trade-offer)
        - [Getting a Trade Offer](#getting-a-trade-offer)
    - [Login Details](#login-details)
        - [Minimal Login Details](#minimal-login-details)
    - [Processing an IncomingTradeOffer](#processing-an-incomingtradeoffer)
        - [Accepting an IncomingTradeOffer](#accepting-an-incomingtradeoffer)
        - [Declining an IncomingTradeOffer](#declining-an-incomingtradeoffer)
        - [Countering an IncomingTradeOffer](#countering-an-incomingtradeoffer)
    - [Getting Trade Exchange Details](#getting-trade-exchange-details)
    - [Accessing other Steam Functionalities](#accessing-other-steam-functionalities)
- [💡 Improvements to Make](#-improvements-to-make)
- [📚 Helpful Resources](#-helpful-resources)

## 👋 Introduction

Butler is a library for actively interfacing with Steam APIs to perform actions on the platform in a simplified fashion.

The large majority of "Steam bots" currently couple together passive interfacing (i.e listening to API events on poll) and active interfacing (i.e actions such as making and sending a Steam trade offer) within a single application. This causes coupling, make testing long and difficult.

By separating the logic into a passive component [`@automatedtf/sentinel`](https://github.com/automatedtf/sentinel) and an active component `@automatedtf/butler`, it allows for cross-applicational systems to exist with newly-found opportunities for scalability, robustness and maintenance.

This library is designed to be stateless, meaning that it is suitable for usage in stateful settings (i.e handler functions for a 24/7 bot instance) and stateless settings (i.e Cloud / Lambda functions).

## 🔌 Getting Started

To use the library, you will need to install it via `npm`:
```typescript
npm install @automatedtf/butler
```
This will add the library to your `package.json` file.

### Example Usages
Below are a few examples of how to use the library. There are more functionalities available, which are listed later on.
##### Creating a Trade Offer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const tradeURL: string = ...;
const draftOffer: OutgoingTradeOffer = await withLoginDetails(loginDetails).createOffer(tradeURL);

// Trade offer construction
const myItemsToAdd: Item[] = [...];
const theirItemsToAdd: Item[] = [...];
const tradeMessage: string = "Please accept!";

await draftOffer
    .addMyItems(myItemsToAdd) // Add my items
    .addTheirItems(theirItemsToAdd) // Add their items
    .setMessage(tradeMessage) // Set trade message
    .send(); // Send the offer!

console.log(draftOffer.offer.id); // The offer is given an ID after it is sent
```

##### Getting a Trade Offer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const offerid: string = ...;
const incomingOffer: IncomingTradeOffer = await withLoginDetails(loginDetails).getOffer(offerid);

console.log(incomingOffer.offer.id); // incomingOffer.offer.id === offerid
```

### Login Details
The interface `SteamLoginDetails` details the various login details that may be needed to login.

```typescript
interface SteamLoginDetails {
    accountName: string;
    password: string;
    steamguard?: string; // Steam Guard code for those logging in on Steam Guard Authorisation email
    authCode?: string; // Steam Guard code on first email authentication
    twoFactorCode?: string;
    captcha?: string;
    disableMobile?: boolean;
    logonID?: number;
}
```
These login details are used for logging into the Steam platform programmatically, being handled by Dr. Mckay's [`steamcommunity`](https://github.com/DoctorMcKay/node-steamcommunity/wiki/SteamCommunity).

[🔗 Read more about logging in with SteamCommunity](https://github.com/DoctorMcKay/node-steamcommunity/wiki/SteamCommunity#logindetails-callback)

##### Minimal Login Details

For the bare minimum to login, you should set the required fields for the `SteamSecrets` interface.

```typescript
const loginDetails: SteamSecrets = {
    accountName: 'username',
    password: 'password',
    identitySecret: 'identitySecret',
    sharedSecret: 'sharedSecret'
};
```

[🔗 Definition of SteamSecrets interface](https://github.com/automatedtf/butler/blob/master/lib/types.ts#L21)

### Processing an IncomingTradeOffer

##### Accepting an IncomingTradeOffer
`🚧 TODO 🚧`
##### Declining an IncomingTradeOffer
`🚧 TODO 🚧`
##### Countering an IncomingTradeOffer
`🚧 TODO 🚧`

### Getting Trade Exchange Details
`🚧 TODO 🚧`
### Accessing other Steam Functionalities
`🚧 TODO 🚧`

## 💡 Improvements to Make
`🚧 TODO 🚧`

## 📚 Helpful Resources
- [@automatedtf/sentinel](https://github.com/automatedtf/sentinel)
- [node-steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity/wiki/SteamCommunity)