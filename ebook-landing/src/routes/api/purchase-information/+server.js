import { json } from "@sveltejs/kit";
import { STRIPE_WEBHOOK_SECRET, STRIPE_API_KEY } from "$env/static/private";

import Stripe from "stripe";

const stripe = new Stripe(STRIPE_API_KEY);

const PDF_GUIDE_URL = "https://narrify-public.s3.eu-central-1.amazonaws.com/sample.pdf";

export async function POST({request}) {
    const requestBody = await request.text();
    console.log(requestBody);

    const stripeSignature = request.headers.get("stripe-signature") || "";
    console.log(stripeSignature);
    console.log(STRIPE_WEBHOOK_SECRET);
    
    // This is just for security to check if event is authentic!
    try {
        const stripeEvent = stripe.webhooks.constructEvent(
            requestBody,
            stripeSignature,
            STRIPE_WEBHOOK_SECRET
        );

        const customerMail = stripeEvent.data.object.customer_details.email;
        const customerName = stripeEvent.data.object.customer_details.name;
        console.log("Stripe webhook OK!")

        const response = await fetch(PDF_GUIDE_URL);
        const pdfBuffer = await response.arrayBuffer();
        const base64pdf = Buffer.from(pdfBuffer).toString("base64");
    
        
    
        const message = {
            to: customerMail,
            from: "myemail@email.com",
            subject: "Your purchase confirmation - Complete Spain Relocation Guide",
            html: `Dear ${customerName}, you bought our book! Please do us a favor and Youtube Rick Roll for us. Thank you!`,
            attachments: [
                {
                    content: base64pdf,
                    filename: "Spain Relocation.pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                }
            ]
        };
    
        // send imaginary mail
        console.log(message);
    
        return json({ success: true });


    } catch (err) {
        console.log(err);
        console.log("Stripe webhook FAKE!")
        return json({error: "Webhook signature verification failed!"}, {status: 400});
    }

   
}