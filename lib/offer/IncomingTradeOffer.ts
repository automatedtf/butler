import TradeOffer from './TradeOffer';
import OutgoingTradeOffer from './OutgoingTradeOffer';

export default class IncomingTradeOffer extends TradeOffer {
    
    constructor({ offer, community, identitySecret }) {
        super(offer, community, identitySecret);
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
        return Promise.resolve(new OutgoingTradeOffer({
            offer: this.offer.counter(),
            community: this.community,
            identitySecret: this.identitySecret
        }));
    }
}