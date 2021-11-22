import wixData from 'wix-data';
import Promise from 'bluebird';
import { suppressOptions } from './constants.js';

export const usersRegisteredProducts = async (req) => {
    // Find items where the email matches and the discordId matches the random token
    const { items: purchasedProductArr } = await wixData.query('purchased_candidates')
        .eq('email', req.query.email)
        .eq('discordId', req.query.tempRandToken)
        .find(suppressOptions);

    // From that array filter out entries that aren't temporary tokens.
    const newlyPurchasedProducts = purchasedProductArr.filter((x) => {
        const xidTest = x.discordId?.split('_');
        if (xidTest && xidTest[0] === 'xid') {
            return x;
        }
    });

    if (!newlyPurchasedProducts.length) {
        throw new Error('No New Products To Register');
    }

    //----------------->UPDATE DB<----------------------------------
    let finalPurchasedProductArr = [];
    await Promise.each(newlyPurchasedProducts, async (item) => {
        const toUpdate = { ...item, discordId: req.query.discordId };
        finalPurchasedProductArr.push(item.purchasedProductName);
        await wixData.update('purchased_candidates', toUpdate, suppressOptions);
    });

    return finalPurchasedProductArr;
}