import { Item } from '../types';
import TradeOffer from './TradeOffer';
import { OfferSentStatus } from '../enums/Offer';

export default class OutgoingTradeOffer extends TradeOffer {

    constructor({ offer, community, identitySecret }) {
        super(offer, community, identitySecret);
    }

    addMyItems(items: Item[]) {
        this.offer.addMyItems(items);
        return this;
    }

    addTheirItems(items: Item[]) {
        this.offer.addTheirItems(items);
        return this;
    }

    setMessage(message: string) {
        this.offer.setMessage(message);
        return this;
    }

    send(): Promise<OfferSentStatus> {
        return new Promise((resolve, reject) => {
            this.offer.send((err, status) => {
                if (err) return reject(err);
                
                if (this.offer.itemsToGive.length == 0) return resolve(status);

                this.community.acceptConfirmationForObject(this.identitySecret, this.offer.id, (err, status) => {
                    if (err) return reject(err);
                    return resolve(status);
                });
            });
        });
    }
}