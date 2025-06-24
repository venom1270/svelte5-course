import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
    const {supabase} = await parent();

    const {gameId} = params;

    console.log(gameId);

    const { data } = await supabase.from("games").select("*").eq("id", +gameId).single();

    if (data) {
        return {
            game: data
        };
    }

    error(404, "Not found");
}