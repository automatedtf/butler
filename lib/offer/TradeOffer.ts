export default class TradeOffer {
    offer: any;
    community: any;
    identitySecret: string;

    constructor(offer: any, community: any, identitySecret: string) {
        this.offer = offer;
        this.community = community;
        this.identitySecret = identitySecret;
    }

    getID() {
        return this.offer.id;
    }

    isOurOffer(): boolean {
        return this.offer.isOurOffer;
    }

    getExchangeDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.offer.getExchangeDetails(false, (err, status, tradeInitTime, receivedItems, sentItems) => {
                if (err) return reject(err);
                resolve({ status, tradeInitTime, receivedItems, sentItems });
            });
        });
        
    }
}