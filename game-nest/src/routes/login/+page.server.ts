import { fail, redirect } from "@sveltejs/kit";

type ReturnObject = {
    success: boolean;
    email: string;
    password: string;
    passwordConfirmation?: never;
    name?: never;
    errors: string[];
}

export const actions = {
    default: async ({request, locals: {supabase}}) => {
        const formData = await request.formData();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const returnObject: ReturnObject = {
            success: true,
            email,
            password,
            errors: [],
        };

        
        if (!email.length) {
            returnObject.errors.push("Email is required.");
        }

        if (!password.length) {
            returnObject.errors.push("Password is required.");
        }


        if (returnObject.errors.length) {
            returnObject.success = false;
            return returnObject;
        }


        let {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            console.log("There has been an error logging in!");
            console.log(error);
            returnObject.success = false;
            returnObject.errors.push("Error logging in");
            return fail(400, returnObject);
        }

        redirect(303, "/private/dashboard");

    }
}