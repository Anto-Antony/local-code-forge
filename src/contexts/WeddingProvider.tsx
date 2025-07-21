import type { Session } from "@supabase/supabase-js";
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type {
    User,
    WeddingData,
    WeddingWish,
    WeddingWishType,
    WebEntry,
} from "@/types/wedding";
import uploadImage from "@/utils/UploadImage";
import { WeddingContext } from "./WeddingContext";
import { deepMerge } from "@/lib/utils";

const defaultWeddingData: WeddingData = {
    couple: {
        groomName: "Nithin",
        brideName: "Nithya",
        weddingQuote:
            "Together We Journey – Two souls, one path, endless love.",
        image: "/couple/white.png",
    },
    story: {
        title: "Brewing Love",
        content:
            "We met on a beautiful autumn day in the local coffee shop. What started as a chance encounter over spilled coffee became the beginning of our forever love story. After three wonderful years together, Nithin proposed during a romantic sunset at our favorite beach, and Nithya said yes with tears of joy.",
        image: "/couple/white.png",
    },
    weddingDetails: {
        event1: {
            title: "Ceremony",
            date: "June 15, 2024",
            time: "4:00 PM",
            venue: "St. Mary's Cathedral",
            address: "123 Cathedral Street, City, State 12345",
            addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
        },
        event2: {
            title: "Reception",
            date: "June 15, 2024",
            time: "6:30 PM",
            venue: "Grand Ballroom",
            address: "456 Reception Avenue, City, State 12345",
            addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
        },
        toKnow1: {
            title: "Getting There",
            description:
                "The venue is easily accessible by car or public transport. Free shuttle service will be provided from the ceremony to reception venue.",
        },
        toKnow2: {
            title: "What to wear",
            description:
                "Semi-formal attire requested. Ladies: cocktail dresses or elegant separates. Gentlemen: suit and tie or dress shirt with slacks.",
        },
        toKnow3: {
            title: "Parking",
            description:
                "Complimentary valet parking available at both venues. Street parking is also available on surrounding streets.",
        },
    },
    schedule: [
        {
            id: "1",
            time: "3:30 PM",
            event: "Guest Arrival",
            description: "Welcome drinks and mingling",
        },
        {
            id: "2",
            time: "4:00 PM",
            event: "Ceremony",
            description: "Wedding ceremony begins",
        },
        {
            id: "3",
            time: "5:00 PM",
            event: "Cocktail Hour",
            description: "Photos and cocktails",
        },
        {
            id: "4",
            time: "6:30 PM",
            event: "Reception",
            description: "Dinner and dancing",
        },
    ],
    gallery: [
        {
            id: "0",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
        {
            id: "1",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
        {
            id: "2",
            url: "/couple/white.png",
            caption: null,
            name: null,
        },
    ],
    moreInfo: {
        title: "Additional Information",
        content:
            "For dietary restrictions, please contact us at least one week before the wedding. We will have vegetarian and gluten-free options available. Children are welcome at both the ceremony and reception.",
    },
    contact: {
        phone: "+91 956 5858 855",
        email: "wedding@nithin_nithya.com",
        address: "123 Main Street, City, State 12345",
        addressMapLink: "https://maps.app.goo.gl/JDeNeY5MxbVFCeXK6",
    },
    jeweller: {
        title: "Our Wedding Jeweller",
        description:
            "Discover exquisite wedding rings and jewellery collections from our trusted partner.",
        shopName: "Edimannickal Gold and Diamonds",
        website:
            "https://www.instagram.com/edimannickalgoldanddiamonds?igsh=czd3ZzV3bjNvMQ==",
    },
};

// Define a default wedding wish for fallback values
const defaultWeddingWish: WeddingWish = {
    id: "default-id",
    name: "Anonymous",
    message: "Best wishes!",
};

export { defaultWeddingData, defaultWeddingWish };

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [weddingData, setWeddingData] = useState<WeddingData>(defaultWeddingData);
    const [weddingWishes, setWeddingWishes] = useState<WeddingWishType>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [globalIsLoading, setGloabalIsLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userWebEntry, setUserWebEntry] = useState<WebEntry | null>(null);

    // Restore user and login state from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("wedding_user");
        const storedIsLoggedIn = localStorage.getItem("wedding_isLoggedIn");
        const storedUserId = localStorage.getItem("wedding_userId");
        if (storedUser && storedIsLoggedIn === "true") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
                if (storedUserId) setUserId(storedUserId);
                // Optionally, reload wedding data
                loadWeddingData(parsedUser.id);
                fetchUserWebEntry(parsedUser.id);
            } catch (e) {
                // If parsing fails, clear localStorage
                localStorage.removeItem("wedding_user");
                localStorage.removeItem("wedding_isLoggedIn");
                localStorage.removeItem("wedding_userId");
            }
        }
        setGloabalIsLoading(false);
    }, []);

    // loadWeddingData is now inside the component and can access state setters
    const loadWeddingData = useCallback(async (userId: string) => {
        console.log("Calling loadWeddingData for user:", userId);
        try {
            const { data, error } = await supabase
                .from("web_entries")
                .select("web_data, wishes")
                .eq("user_id", userId)
                .maybeSingle();

            if (error || !data || !data.web_data) {
                // If no data from Supabase, use default
                setWeddingData(defaultWeddingData);
                setWeddingWishes([]);
                setGloabalIsLoading(false);
                return;
            }

            // If data exists, use it
            setWeddingData({ ...defaultWeddingData, ...data.web_data });
            const mergedWishes = (data.wishes || []).map((wish: any) =>
                ({ ...defaultWeddingWish, ...wish })
            );
            setWeddingWishes(mergedWishes);
            setGloabalIsLoading(false);
        } catch (error) {
            // On error, use default data
            setWeddingData(defaultWeddingData);
            setWeddingWishes([]);
            setGloabalIsLoading(false);
        }
    }, [setWeddingData, setWeddingWishes, setGloabalIsLoading]);

    const fetchUserWebEntry = async (userId: string) => {
        const { data, error } = await supabase
            .from("web_entries")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (!error && data) setUserWebEntry(data);
        // Optionally handle error
    };

    // useEffect(() => {
        // Set up auth state listener
        // const {
        //     data: { subscription },
        // } = supabase.auth.onAuthStateChange((_, session) => {
        //     flushSync(() => setSession(session));
        //     if (session?.user) {
        //         const mappedUser: User = {
        //             id: session.user.id,
        //             email: session.user.email || "",
        //             isAuthenticated: true,
        //         };
        //         setUser(mappedUser);
        //         setIsLoggedIn(true);
        //         loadWeddingData(session.user.id);
        //     } else {
        //         setUser(null);
        //         setIsLoggedIn(false);
        //     }
        // });

        // // Check for existing session
        // supabase.auth.getSession().then(({ data: { session } }) => {
        //     setSession(session);
        //     if (session?.user) {
        //         const mappedUser: User = {
        //             id: session.user.id,
        //             email: session.user.email || "",
        //             isAuthenticated: true,
        //         };
        //         setUser(mappedUser);
        //         setIsLoggedIn(true);
        //         loadWeddingData(session.user.id);
        //     }
        // });

    //     return undefined;
    // }, []);

    const loadAllWeddingWishes = async () => {
        if (!user?.id) {
            return;
        }
        try {
            const { data: wishData, error: wishError } = await supabase
                .from("web_entries")
                .select("wishes")
                .eq("user_id", user.id)
                .maybeSingle();

            if (wishError) {
                return;
            }

            if (wishData) {
                // Merge each wish with default values for missing fields
                const mergedWishes = (wishData.wishes || []).map((wish: any) => ({
                    ...defaultWeddingWish,
                    ...wish,
                }));
                setWeddingWishes(mergedWishes);
            }
        } catch (error) {
        }
    };

    const updateWeddingData = async (
        data: Partial<WeddingData>,
    ): Promise<boolean> => {
        const prev = structuredClone(weddingData);
        const updated = { ...weddingData, ...data };

        setWeddingData(updated);

        const success = await saveData(updated);

        if (!success) setWeddingData(prev);

        return success;
    };

    const updateGalleryImage = async (
        file: File | null,
        imageCaption: string | null,
        index: number,
    ) => {
        const image_id = `${Date.now()}-${crypto.randomUUID()}`;
        const image_name = `gallery_image_${image_id}`;
        const updatedGallery = [...weddingData.gallery];

        if (index >= updatedGallery.length) {
            updatedGallery.push({
                id: image_id,
                url: "",
                caption: imageCaption,
                name: image_name,
            });
        }

        if (file) {
            const imageUrl = await uploadImage(file, user, image_name);
            if (!imageUrl) {
                return;
            }
            updatedGallery[index].url = imageUrl;
        }

        updatedGallery[index].caption = imageCaption;
        updateWeddingData({ gallery: updatedGallery });
    };

    const saveData = async (data: WeddingData): Promise<boolean> => {
        if (!user?.id) {
            return false;
        }
        try {
            const { error } = await supabase.from("web_entries").upsert(
                {
                    user_id: user.id,
                    web_data: data,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id" }
            );
            if (error) {
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    };

    const addWish = async (wish: WeddingWish) => {
        if (!user?.id) {
            return;
        }
        try {
            // Fetch current wishes
            const { data, error } = await supabase
                .from("web_entries")
                .select("wishes")
                .eq("user_id", user.id)
                .maybeSingle();

            let wishes: WeddingWishType = [];
            if (data && data.wishes) {
                wishes = data.wishes;
            }
            wishes.push(wish);

            // Update wishes array
            const { error: updateError } = await supabase
                .from("web_entries")
                .update({ wishes, updated_at: new Date().toISOString() })
                .eq("user_id", user.id);

    
        } catch (error) {
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<{ user: User | null; error: string | null }> => {
        setGloabalIsLoading(true);
        // Fetch user profile by email
        const { data, error } = await supabase
            .from("user_profile")
            .select("user_id, bride_name, groom_name, email, phone_number, password")
            .eq("email", email)
            .maybeSingle();
    
        if (error || !data) {
            setGloabalIsLoading(false);
            return { user: null, error: "No user found" };
        }
    
        if (data.password !== password) {
            setGloabalIsLoading(false);
            return { user: null, error: "Incorrect password" };
        }
    
        const customUser: User = {
            id: data.user_id,
            email: data.email,
            isAuthenticated: true,
            bride_name: data.bride_name,
            groom_name: data.groom_name,
            phone_number: data.phone_number,
            // Add other fields as you need them
        };
        setUser(customUser);
        setIsLoggedIn(true);
        // Persist to localStorage
        localStorage.setItem("wedding_user", JSON.stringify(customUser));
        localStorage.setItem("wedding_isLoggedIn", "true");
        localStorage.setItem("wedding_userId", data.user_id);
    
        // Load wedding data (and wishes) after login
        await loadWeddingData(data.user_id);
        setUserId(data.user_id);
        await fetchUserWebEntry(data.user_id);
    
        setGloabalIsLoading(false);
        return { user: customUser, error: null };
    };
    

    const logout = async () => {
        setUser(null);
        setWeddingData(defaultWeddingData);
        setWeddingWishes([]);
        setIsLoggedIn(false);
        setGloabalIsLoading(false);
        // Clear localStorage
        localStorage.removeItem("wedding_user");
        localStorage.removeItem("wedding_isLoggedIn");
        localStorage.removeItem("wedding_userId");
    };

    return (
        <WeddingContext.Provider
            value={{
                weddingData,
                weddingWishes,
                setWeddingWishes,
                loadAllWeddingWishes,
                user,
                session: null,
                isLoggedIn,
                globalIsLoading,
                editable,
                updateWeddingData,
                updateGalleryImage,
                saveData,
                addWish,
                login,
                logout,
                userId,
                setUserId,
                userWebEntry,
                fetchUserWebEntry,
                loadWeddingData,
            }}
        >
            {children}
        </WeddingContext.Provider>
    );
};
