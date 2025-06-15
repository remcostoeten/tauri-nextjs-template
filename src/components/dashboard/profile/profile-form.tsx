'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { useUser } from '@/hooks/use-user';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Skeleton } from '@/shared/ui/skeleton';

const profileFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    avatar: z.string().url('Invalid URL.').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
    const { user, loading } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            email: '',
            avatar: '',
        },
    });

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Update form values when user data is loaded
    if (
        form.getValues('name') !== user.name ||
        form.getValues('email') !== user.email ||
        form.getValues('avatar') !== user.avatar
    ) {
        form.reset({
            name: user.name || '',
            email: user.email,
            avatar: user.avatar || '',
        });
    }

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast({
                title: 'Profile updated',
                description: 'Your profile has been updated successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update profile. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const initials = user.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : user.email[0].toUpperCase();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-x-4">
                    <Avatar className="h-14 w-14">
                        {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name || 'User'} />
                        ) : null}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="text-sm font-medium">Profile Picture</h4>
                        <p className="text-sm text-muted-foreground">
                            Your profile picture will be shown across the app.
                        </p>
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com/avatar.jpg"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Enter a URL for your profile picture.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the email address you use to sign in.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update profile'}
                </Button>
            </form>
        </Form>
    );
} 