import { fail, redirect } from "@sveltejs/kit";

type ReturnObject = {
    success: boolean;
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    errors: string[];
}

export const actions = {
    default: async ({request, locals: {supabase}}) => {
        const formData = await request.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const passwordConfirmation = formData.get("passwordConfirmation") as string;

        const returnObject: ReturnObject = {
            success: true,
            email,
            name,
            password,
            passwordConfirmation,
            errors: [],
        };

        if (name.length < 2) {
            console.log("Name is too short!");
            returnObject.errors.push("Name must be at least 3 characters.");
        }

        if (!email.length) {
            returnObject.errors.push("Email is required.");
        }

        if (!password.length) {
            returnObject.errors.push("Password is required.");
        }

        if (password !== passwordConfirmation) {
            returnObject.errors.push("Passwords do not match.");
        }

        if (returnObject.errors.length) {
            returnObject.success = false;
            return returnObject;
        }

        // Actual registration flow
        // WSIuGElthYiYreIp

        let {data, error} = await supabase.auth.signUp({
            email,
            password,

        });

        if (error || !data.user) {
            console.log("There has been an error");
            console.log(error);
            returnObject.success = false;
            returnObject.errors.push(error ? error.message : "There has been an error. Maybe the password is too weak.");
            return fail(400, returnObject);
        }

        const userId = data.user.id;

        await supabase.from("user_names").insert([
            {
                user_id: userId,
                name,
            }
        ]);

        redirect(303, "/private/dashboard");

    }
}