export default class TradeOffer {
    offer: any;

    constructor(offer: any) {
        this.offer = offer;
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