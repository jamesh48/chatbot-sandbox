import { resObj } from './constants.js';
import { ok, badRequest } from 'wix-http-functions';
import { validateCredentials } from './validateCredentials.js';
import { usersRegisteredProducts } from './getUsersRegisteredProducts.js'
import { revokeGuildAccess } from './postRevokeGuildAccess.js';
import { randomToken } from './postRandomToken.js';

export async function get_usersRegisteredProducts(req) {
    try {
        await validateCredentials(req);
        const finalProductArr = await usersRegisteredProducts(req);
        resObj.body.message = finalProductArr;
        return ok(resObj);
    } catch (err) {
        resObj.body.error = err.message;
        return badRequest(resObj);
    }
}

export async function post_revokeGuildAccess(req) {
    try {
        await validateCredentials(req);
        await revokeGuildAccess(req);
        resObj.body.message = 'ok';
        return ok(resObj);
    } catch (err) {
        resObj.body.error = err.message;
        return badRequest(resObj);
    }
}

export async function post_randomToken(req) {
    try {
        await validateCredentials(req);
        const [tempRandToken, channelsToJoin] = await randomToken(req);
        resObj.body.tempRandToken = tempRandToken;
        resObj.body.channelsToJoin = channelsToJoin;
        return ok(resObj);
    } catch (err) {
        resObj.body.error = err.message;
        return badRequest(resObj);
    }
}