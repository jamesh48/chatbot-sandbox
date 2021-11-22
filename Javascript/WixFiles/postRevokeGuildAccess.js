import wixData from 'wix-data';
import Promise from 'bluebird';
import { suppressOptions } from './constants.js';

export const revokeGuildAccess = async (req) => {
    if (!req.query.email) {
        throw new Error('No Email Provided');
    }

    const { items: purchasedProductArr } = await wixData.query('purchased_candidates')
        .eq('email', req.query.email)
        // Todo- Validate that the existing discord id is the same as what is passed in, but what about temp tokens?
        // Temp tokens would mean that they never gained access to the channels and could just be removed the same as if they had gained access with a discordId.
        // This would be an issue perhaps if another user used a different email for a user that hadn't yet clicked the button, in which case they would just have to run register again.
        .find(suppressOptions);

    if (!purchasedProductArr.length) {
        throw new Error('Email not found');
    }

    //----------------->UPDATE DB<----------------------------------
    await Promise.each(purchasedProductArr, (item) => {
        const toUpdate = { ...item, discordId: null };
        return wixData.update('purchased_candidates', toUpdate, suppressOptions);
    });
    return 'ok';
}