# Butler

Butler is a library for actively interfacing with Steam APIs to perform actions on the platform in a simplified fashion.

"Steam bots" have always relied on interfacing with Steam APIs to work. A bot will have to listen to the respective APIs and effectively "subscribe" for updates through polling. When a user sends a chat message to a bot that has subscribed to listening to new chat messsages, the bot will take that in as an event. The bot can then react to that event and perform active actions upon the details of the event.

The large majority of "Steam bots" currently couple together passive interfacing (i.e listening to events) and active interfacing (i.e actions such as making and sending a Steam trade offer) within a single application. This can make testing long and tedious, often having to be done manually.

By separating the logic into a passive component `@automatedtf/sentinel` and an active component `@automatedtf/butler`, it allows for cross-applicational systems to exist with newly-found opportunities for scalability, robustness and maintenance.

This library is suitable for usage in both stateful settings (i.e handler functions for a 24/7 bot instance) and stateless settings (i.e Cloud / Lambda functions).