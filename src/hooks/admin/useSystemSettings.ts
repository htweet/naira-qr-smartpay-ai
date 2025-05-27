
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSystemSettings = () => {
  const updateSystemSetting = async (key: string, value: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-system-setting', {
        body: { key, value }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  return {
    updateSystemSetting
  };
};
