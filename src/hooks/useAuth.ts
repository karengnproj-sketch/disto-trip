"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: { id: string; email: string; name?: string } | null;
  isAdmin: boolean;
  loading: boolean;
}

// Admin emails - add your admin email here
const ADMIN_EMAILS = ["admin@distotrip.com", "fadykhaledcons@gmail.com"];

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || "";
        setState({
          user: {
            id: session.user.id,
            email,
            name: session.user.user_metadata?.full_name || email.split("@")[0],
          },
          isAdmin: ADMIN_EMAILS.includes(email),
          loading: false,
        });
      } else {
        setState({ user: null, isAdmin: false, loading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        setState({
          user: {
            id: session.user.id,
            email,
            name: session.user.user_metadata?.full_name || email.split("@")[0],
          },
          isAdmin: ADMIN_EMAILS.includes(email),
          loading: false,
        });
      } else {
        setState({ user: null, isAdmin: false, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
