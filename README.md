# Butler 🤵

### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [🔌 Getting Started](#-getting-started)
    - [Example Usages](#example-usages)
        - [Creating a Trade Offer](#creating-a-trade-offer)
        - [Getting a Trade Offer](#getting-a-trade-offer)
    - [Login Details](#login-details)
        - [Minimal Login Details](#minimal-login-details)
        - [Setting a LogonID](#setting-a-logonid)
        - [BotInstance](#botinstance)
        - [Logging in with Cookies](#logging-in-with-cookies)
    - [Processing an IncomingTradeOffer](#processing-an-incomingtradeoffer)
        - [Accepting an IncomingTradeOffer](#accepting-an-incomingtradeoffer)
        - [Declining an IncomingTradeOffer](#declining-an-incomingtradeoffer)
        - [Countering an IncomingTradeOffer](#countering-an-incomingtradeoffer)
    - [Creating an OutgoingTradeOffer](#creating-an-outgoingtradeoffer)
        - [Adding Items to an OutgoingTradeOffer](#adding-items-to-an-outgoingtradeoffer)
        - [Sending the OutgoingTradeOffer](#sending-the-outgoingtradeoffer)
    - [Getting Trade Exchange Details](#getting-trade-exchange-details)
        - [Exchange Details for an OutgoingTradeOffer](#exchange-details-for-an-outgoingtradeoffer)
        - [Exchange Details for an IncomingTradeOffer](#exchange-details-for-an-incomingtradeoffer)
    - [Changing Profile Details](#changing-profile-details)
        - [Editing Public Profile](#editing-public-profile)
        - [Updating Profile Picture](#updating-profile-picture)
    - [Accessing other Steam Functionalities](#accessing-other-steam-functionalities)
- [💡 Improvements to Make](#-improvements-to-make)
    - [In-Memory Bot Instances](#in-memory-bot-instances)
- [📚 Helpful Resources](#-helpful-resources)

## 👋 Introduction

Butler is a library for actively interfacing with Steam APIs to perform actions on the platform in a simplified fashion.

The large majority of "Steam bots" currently couple together passive interfacing (i.e listening to API events on poll) and active interfacing (i.e actions such as making and sending a Steam trade offer) within a single application. This causes coupling, make testing long and difficult.

By separating the logic into a passive component [`@automatedtf/sentinel`](https://github.com/automatedtf/sentinel) and an active component `@automatedtf/butler`, it allows for cross-applicational systems to exist with newly-found opportunities for scalability, robustness and maintenance.

This library is designed to provide functions built for ephemeral execution, meaning that it is suitable for usage in stateful settings (i.e handler functions for a 24/7 bot instance) and stateless settings (i.e Cloud / Lambda functions).

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

##### Setting a LogonID
The usage of a `logonID` is optional.

When logging into an instance of a bot from `@automatedtf/sentinel`, `@automatedtf/butler` or by any other modules, it will kick all other sessions of the bot with the same `logonID`.

To allow for multiple sessions of the bot to run, a unique `logonID` for that running bot instance. This can be set explicitly or randomly. The module will generate a deterministic `logonID` if not set, using the hash `Date.now() % 2 ** 16`.

##### BotInstance
Logging in with any suitable form of login details will return a `BotInstance`.

```typescript
import { withLoginDetails, BotInstance } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const botInstance: BotInstance = withLoginDetails(loginDetails);
```

This class has its own set of methods that can be interfaced with to perform various additional actions on the Steam platform. Generally, this class will be used for accessing offers via `BotInstance.getOffer` and `BotInstance.createOffer`.

[🔗 Accessing other Steam Functionalities](#accessing-other-steam-functionalities)

##### Logging in with Cookies
Cookies are given when a `steam-user` client joins a `webSession`. These cookies can be used to log back into a previous session without having to login again. This is highly recommended when you are logging into multiple instances of a bot, as you may the receive the `AlreadyLoggedInElsewhere` error at times.

To login with cookies, you can use the `withCookies` function instead of `withLoginDetails`.

```typescript
import { withCookies } from '@automatedtf/butler';
const loginDetails: SteamLoginDetails = { ... };
const cookies: string[] = [...];

const botInstance: BotInstance = withCookies(cookies);
```

[🔗 Read more about logging in with Cookies](https://dev.doctormckay.com/topic/365-cookies/)

### Processing an IncomingTradeOffer
When an incoming trade offer is received from a user (e.g from receiving the event from `@automatedtf/sentinel` or as part of an event handler), you can process it using the following methods attached to the `IncomingTradeOffer` object that is returned when you decide to get the offer from using `BotInstance.getOffer`.

##### Accepting an IncomingTradeOffer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const offerid = '...';
const loginDetails: SteamLoginDetails = { ... };

const incomingOffer: IncomingTradeOffer = await withLoginDetails(loginDetails).getOffer(offerid);

// Accepting an incoming trade offer
await incomingOffer.accept();
```

##### Declining an IncomingTradeOffer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const offerid = '...';
const loginDetails: SteamLoginDetails = { ... };

const incomingOffer: IncomingTradeOffer = await withLoginDetails(loginDetails).getOffer(offerid);

// Decline an incoming trade offer
await incomingOffer.decline();
```

##### Countering an IncomingTradeOffer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const offerid = '...';
const loginDetails: SteamLoginDetails = { ... };

const incomingOffer: IncomingTradeOffer = await withLoginDetails(loginDetails).getOffer(offerid);

// Countering an incoming trade offer
const draftOutgoingOffer = await incomingOffer.counter();

// Next: Add items, set message, etc.
```

### Creating an OutgoingTradeOffer
You can use the `BotInstance.createOffer` method or `IncomingTradeOffer.counter` method (as shown above) to create an outgoing trade offer.

```typescript
import { withLoginDetails } from '@automatedtf/butler';

const tradeURL: string = ...;
const loginDetails: SteamLoginDetails = { ... };

const outgoingOffer: OutgoingTradeOffer = await withLoginDetails(loginDetails).createOffer(tradeURL);
```

##### Adding Items to an OutgoingTradeOffer
```typescript
const outgoingOffer: OutgoingTradeOffer = ...; // get somehow

const myItemsToAdd: Item[] = [...];
const theirItemsToAdd: Item[] = [...];
const message: string = "Please accept!";

outgoingOffer.addMyItems(myItemsToAdd); // Add my items
outgoingOffer.addTheirItems(theirItemsToAdd); // Add their items
```

The `Item` interface is defined as follows:
```typescript
interface Item {
    assetid: string;
    appid: number;
    contextid: string;
    amount: number;
}
```

You can fetch instances of `Item` from a supported API or module, but generally, you can set this for yourself.

```typescript
// Creating an `Item` for Team Fortress 2 items

import { ItemInstance } from '@automatedtf/sherpa';
const item: ItemInstance = ...; // Get somehow  

function toItem(itemInstance: ItemInstance): Item {
    return {
        assetid: itemInstance.assetid,
        appid: itemInstance.appid, // 440 for TF2
        contextid: '2', // ContextID for all TF2 items
        amount: 1
    } as Item;
}
```
##### Sending the OutgoingTradeOffer
When you are ready, you can then send the trade offer.
```typescript
// Set trade message (optional!)
outgoingOffer.setMessage(message); 

// Send the offer!
await outgoingOffer.send();
```
Confirmation for the trade offer object is done automatically for convenience, meaning that you will not need to do anything else to ensure that the trade offer is sent to the other party.



### Getting Trade Exchange Details
You can get the new `assetid`s for the items in the trade offer using the `TradeOffer.getExchangeDetails` method that is provided for any `OutgoingTradeOffer` or `IncomingTradeOffer` instance.

[🔗 Further Details on getExchangeDetails Returned Data](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager/wiki/TradeOffer#getexchangedetailsgetdetailsiffailed-callback)

##### Exchange Details for an OutgoingTradeOffer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const outgoingOffer: OutgoingTradeOffer = ...; // get somehow
...
// ASSERT: outgoingOffer has been sent previously
...
const {
    status,
    tradeInitTime,
    receivedItems,
    sentItems
} = outgoingOffer.getExchangeDetails();
```

##### Exchange Details for an IncomingTradeOffer
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const incomingOffer: IncomingTradeOffer = ...; // get somehow
...
// ASSERT: incomingOffer has been accepted previously
...
const {
    status,
    tradeInitTime,
    receivedItems,
    sentItems
} = incomingOffer.getExchangeDetails();
```

### Changing Profile Details

For ease, several methods are offered under the `BotInstance` class to facilitate changing profile details.

##### Editing Public Profile
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const botInstance: BotInstance = await withLoginDetails(loginDetails);

const profileDetails: Partial<SteamProfileDetails> = {
    name: "New Name",
    realName: "New Real Name",
    summary: "New Summary",
    country: "UK",
    state: "FL",
    city: "Orlando",
    customURL: "myNewCustomURLToMyProfile",
}
await botInstance.editProfile(profileDetails);
```

This can be used to change the public profile details of the account.

##### Updating Profile Picture
```typescript
import { withLoginDetails } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const botInstance: BotInstance = await withLoginDetails(loginDetails);

const photoURL: string = "...";
await botInstance.changeProfilePicture(photoURL);
```

For now, support is only provided for a `https://` or `http://` url to a photo.

### Accessing other Steam Functionalities
You can access other Steam functionalities by using the methods of the `BotInstance` class to access relevant clients. These will have already been instantiated for you, logged in, and ready to use.

`BotInstance.accessTradeManager()` - Access the [trade manager client](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager/wiki/TradeOfferManager).

`BotInstance.accessCommunity()` - Access the [community client](https://github.com/DoctorMcKay/node-steamcommunity/wiki/SteamCommunity).

## 💡 Improvements to Make

As said, the library is designed to be for ephemeral executions, but usage can be tailored for persistent bot instances by holding the running `BotInstance` object in memory.

```typescript
import { withLoginDetails } from '@automatedtf/butler';

const loginDetails: SteamLoginDetails = { ... };
const botInstance = await withLoginDetails(loginDetails);

// Do stuff with botInstance
```

As such, there are potential opportunities of improvement to take advantage of to reduce the cold start time and improve the overall performance for using the library in a stateful setting.

##### In-Memory Bot Instances
Holding a bot instance in memory is a potential improvement when multiple (but centralised) accesses have to be made to the Steam account that is being operated programmatically as a bot.

For example, one may have a dedicated `Express` server for executing actions for the bot to perform using `@automatedtf/butler`. Rather than a new login being performed always every single time when using `withLoginDetails`, `withLoginDetails` can first access a cache of `BotInstance` objects that have been created previously and then return the cached instance if present.

## 📚 Helpful Resources
- [@automatedtf/sentinel](https://github.com/automatedtf/sentinel)
- [node-steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity/wiki/SteamCommunity)