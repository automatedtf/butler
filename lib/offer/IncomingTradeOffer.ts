import TradeOffer from './TradeOffer';
import OutgoingTradeOffer from './OutgoingTradeOffer';

export default class IncomingTradeOffer extends TradeOffer {
    
    constructor(offer: any) {
        super(offer);
    }

    accept(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.offer.accept(false, (err, status) => {
                if (err) return reject(err);
                resolve(status);
            });
        });
    }

    decline(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.offer.decline((err) => {
                if (err) return reject(err);
                resolve(null);
            });
        });
    }

    counter(): Promise<OutgoingTradeOffer> {
        return Promise.resolve(new OutgoingTradeOffer(this.offer.counter()));
    }
}