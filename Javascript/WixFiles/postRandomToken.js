import wixData from 'wix-data';
import Promise from 'bluebird';
import { suppressOptions } from './constants.js';

export const randomToken = async (req) => {
    const genRandToken = () => {
        const rand = () => Math.random().toString(36).substr(2);

        const token = 'xid_' + rand() + rand();
        return token;
    }

    const tempRandToken = genRandToken();

    const { items: purchasedProductArr } = await wixData.query('purchased_candidates')
        .eq('email', req.query.email)
        .find(suppressOptions);

    // Update old refresh tokens and newly purchased Products
    const newlyPurchasedProducts = purchasedProductArr.filter((x) => {

        if (!x.discordId) {
            return x;
        }

        const xidSplit = x.discordId.split('_');
        if (xidSplit[0] === 'xid') {
            return x;
        }
    });

    if (!newlyPurchasedProducts.length) {
        throw new Error('No New Products need Registration')
    }

    let channelsToJoin = [];
    //----------------->UPDATE DB<--------------------------
    await Promise.each(newlyPurchasedProducts, (item) => {
        const toUpdate = { ...item, discordId: tempRandToken };
        channelsToJoin.push(item.purchasedProductName);
        return wixData.update('purchased_candidates', toUpdate, suppressOptions);
    });

    return [tempRandToken, channelsToJoin.join(', ')]
}