import { supabase } from "@/integrations/supabase/client";

type TrackEventParams = {
  eventType: string;
  eventData?: Record<string, unknown>;
  pageUrl?: string;
};

export const trackEvent = async ({ eventType, eventData = {}, pageUrl }: TrackEventParams) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("Anonymous event tracked:", eventType);
      return;
    }
    
    // Use any to bypass stale types - will work once types regenerate
    const client = supabase as unknown as { from: (table: string) => { insert: (data: unknown) => Promise<{ error: unknown }> } };
    const { error } = await client.from('user_behavior').insert({
      user_id: session.user.id,
      event_type: eventType,
      event_data: eventData,
      page_url: pageUrl || window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      session_id: session.access_token.slice(-12),
    });

    if (error) {
      console.error("Error tracking event:", error);
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};

export const trackPageView = () => {
  trackEvent({
    eventType: 'page_view',
    pageUrl: window.location.href,
  });
};

export const trackConversion = async (type: string, value?: number, source?: string, metadata: Record<string, unknown> = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("Anonymous conversion tracked:", type);
      return;
    }
    
    // Use any to bypass stale types
    const client = supabase as unknown as { from: (table: string) => { insert: (data: unknown) => Promise<{ error: unknown }> } };
    const { error } = await client.from('conversion_events').insert({
      user_id: session.user.id,
      event_type: type,
      value,
      source,
      metadata,
    });

    if (error) {
      console.error("Error tracking conversion:", error);
    }
  } catch (error) {
    console.error("Failed to track conversion:", error);
  }
};