import { goto } from "$app/navigation";
import type { Database } from "$lib/types/database.types";
import { type SupabaseClient, type Session, type User } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import { getContext, setContext } from "svelte";

interface Game {
    category: string | null
    cover_image: string | null
    created_at: string
    description: string | null
    developer: string | null
    finished_playing: string | null
    id: number
    rating: number | null
    started_playing: string | null
    title: string
    user_id: string
}

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
}

export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient<Database> | null>(null);
    user = $state<User | null>(null);
    allGames = $state<Game[]>([]);
    userName = $state<string | null>(null);


    constructor(data: UserStateProps) {
        this.updateState(data);
    }

    updateState(data: UserStateProps) {
        this.session = data.session;
        this.supabase = data.supabase;
        this.user = data.user;
        this.fetchUserData();
    }

    async fetchUserData() {
        if (!this.user || !this.supabase) return;

        const userId = this.user.id;
        
        const [gamesResponse, userNameResponse] = await Promise.all([
            this.supabase.from("games").select("*").eq("user_id", userId),
            this.supabase.from("user_names").select("name").eq("user_id", userId).single()
        ]);

        if (gamesResponse.error || !gamesResponse.data || userNameResponse.error || !userNameResponse.data) {
            console.log("Error fetching user data!");
            console.log({gamesError: gamesResponse.error, userNamesError: userNameResponse.error});
            return;
        }

        this.allGames = gamesResponse.data;
        this.userName = userNameResponse.data.name;
    }

    async logout() {
        console.log("LOGGIGN OUT!!!");
        await this.supabase?.auth.signOut();
    }
}

// Nekaj kar vedno vrne unique???
const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
    return setContext(USER_STATE_KEY, new UserState(data))
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}