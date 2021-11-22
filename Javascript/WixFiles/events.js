import { ok } from 'wix-http-functions';
import wixData from 'wix-data';


const resObj = {
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
    "body": {
        "message": "ok"
    }
}

export async function wixStores_onOrderPaid(event) {
    // Collect User Information
    const userEmail = event.buyerInfo.email || 'Not Provided';
    const firstName = event.buyerInfo.firstName;
    const lastName = event.buyerInfo.lastName;

    const city = event.billingInfo.address?.city || 'Not Provided';
    const country = event.billingInfo.address?.country || 'Not Provided';

    // Build Promise Array of Each Product Bought
    const promiseArr = event.lineItems.map(({ name }) => {
        const dataToInsert = {
            "email": userEmail,
            "purchasedProductName": name,
            "firstName": firstName,
            "lastName": lastName,
            "city": city,
            "country": country,
            "discordId": null
        }
        // Return unresolved promise
        return wixData.insert('purchased_candidates', dataToInsert, suppressOptions);
    });

    try {
        // wait for all data to be inserted
        await Promise.all(promiseArr);
        // confirmation log
        return ok(resObj)
    } catch (err) {
        console.log(err.message);
    }
}