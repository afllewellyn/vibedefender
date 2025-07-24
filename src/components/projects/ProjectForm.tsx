import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  url: z.string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'URL must start with http:// or https://'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    url: string;
    description?: string;
  };
  onSuccess: () => void;
}

export const ProjectForm = ({ initialData, onSuccess }: ProjectFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      url: initialData?.url || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            name: data.name,
            url: data.url,
            description: data.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            name: data.name,
            url: data.url,
            description: data.description || null,
            user_id: user.id,
          });

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      
      let errorMessage = 'Failed to save project. Please try again.';
      
      if (error.code === '23505') {
        errorMessage = 'A project with this name already exists. Please choose a different name.';
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Company Website"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The URL of the website or application to scan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about this project..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description to help you identify this project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
            )}
            {initialData ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};