// Import sendgrid API key...

import { json } from "@sveltejs/kit";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST({request}) {
    const { contactMail, contactName, informationAboutProject } = await request.json();

    if (!contactMail || !contactName || !informationAboutProject || true) {
        return json({ message: "Could not send email. Missing data." }, {status: 400} );
    }

    await delay(2000);

    return json({emailSentSuccessfuly: true});
}