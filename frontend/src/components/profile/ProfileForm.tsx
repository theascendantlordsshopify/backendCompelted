'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, getFieldErrors, getInitials } from '@/lib/utils';
import { TIME_CONFIG } from '@/lib/constants';
import { Profile } from '@/types';

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
  bio: z.string().max(500, 'Bio is too long').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number format').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  company: z.string().max(100, 'Company name is too long').optional(),
  job_title: z.string().max(100, 'Job title is too long').optional(),
  timezone_name: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  date_format: z.string().min(1, 'Date format is required'),
  time_format: z.string().min(1, 'Time format is required'),
  brand_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  public_profile: z.boolean(),
  show_phone: z.boolean(),
  show_email: z.boolean(),
  reasonable_hours_start: z.number().min(0).max(23),
  reasonable_hours_end: z.number().min(1).max(24),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
  onUpdate?: (profile: Profile) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profile_picture);
  
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name || '',
      bio: profile.bio || '',
      phone: profile.phone || '',
      website: profile.website || '',
      company: profile.company || '',
      job_title: profile.job_title || '',
      timezone_name: profile.timezone_name || 'UTC',
      language: profile.language || 'en',
      date_format: profile.date_format || 'MM/DD/YYYY',
      time_format: profile.time_format || '12h',
      brand_color: profile.brand_color || '#6366f1',
      public_profile: profile.public_profile ?? true,
      show_phone: profile.show_phone ?? false,
      show_email: profile.show_email ?? true,
      reasonable_hours_start: profile.reasonable_hours_start ?? 7,
      reasonable_hours_end: profile.reasonable_hours_end ?? 22,
    },
  });

  const brandColor = watch('brand_color');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Profile picture must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (profileImage) {
        formData.append('profile_picture', profileImage);
      }

      // Call API to update profile
      // const response = await ApiClient.users.updateProfile(formData);
      
      // For now, simulate success
      const updatedProfile = { ...profile, ...data };
      onUpdate?.(updatedProfile);
      updateUser({ profile: updatedProfile });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success',
      });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      const fieldErrs = getFieldErrors(err);
      
      setError(errorMessage);
      setFieldErrors(fieldErrs);
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="enterprise-shadow">
        <CardHeader>
          <CardTitle className="text-enterprise-900">Profile Information</CardTitle>
          <CardDescription className="text-enterprise-600">
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <div className="space-y-4">
              <Label className="text-enterprise-700">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {user ? getInitials(user.first_name, user.last_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="enterprise-outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-picture')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeImage}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-enterprise-500">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-enterprise-700">
                  Display Name *
                </Label>
                <Input
                  id="display_name"
                  placeholder="How you'd like to be displayed"
                  className="enterprise-focus"
                  {...register('display_name')}
                  disabled={isLoading}
                />
                {(errors.display_name || fieldErrors.display_name) && (
                  <p className="text-sm text-red-600">
                    {errors.display_name?.message || fieldErrors.display_name?.[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone_name" className="text-enterprise-700">
                  Timezone *
                </Label>
                <Select
                  value={watch('timezone_name')}
                  onValueChange={(value) => setValue('timezone_name', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="enterprise-focus">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_CONFIG.TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(errors.timezone_name || fieldErrors.timezone_name) && (
                  <p className="text-sm text-red-600">
                    {errors.timezone_name?.message || fieldErrors.timezone_name?.[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-enterprise-700">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell people a bit about yourself"
                className="enterprise-focus resize-none"
                rows={3}
                {...register('bio')}
                disabled={isLoading}
              />
              {(errors.bio || fieldErrors.bio) && (
                <p className="text-sm text-red-600">
                  {errors.bio?.message || fieldErrors.bio?.[0]}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-enterprise-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="enterprise-focus"
                  {...register('phone')}
                  disabled={isLoading}
                />
                {(errors.phone || fieldErrors.phone) && (
                  <p className="text-sm text-red-600">
                    {errors.phone?.message || fieldErrors.phone?.[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-enterprise-700">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="enterprise-focus"
                  {...register('website')}
                  disabled={isLoading}
                />
                {(errors.website || fieldErrors.website) && (
                  <p className="text-sm text-red-600">
                    {errors.website?.message || fieldErrors.website?.[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-enterprise-700">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  className="enterprise-focus"
                  {...register('company')}
                  disabled={isLoading}
                />
                {(errors.company || fieldErrors.company) && (
                  <p className="text-sm text-red-600">
                    {errors.company?.message || fieldErrors.company?.[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title" className="text-enterprise-700">
                  Job Title
                </Label>
                <Input
                  id="job_title"
                  placeholder="Your job title"
                  className="enterprise-focus"
                  {...register('job_title')}
                  disabled={isLoading}
                />
                {(errors.job_title || fieldErrors.job_title) && (
                  <p className="text-sm text-red-600">
                    {errors.job_title?.message || fieldErrors.job_title?.[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Localization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-enterprise-700">
                  Language
                </Label>
                <Select
                  value={watch('language')}
                  onValueChange={(value) => setValue('language', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="enterprise-focus">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_format" className="text-enterprise-700">
                  Date Format
                </Label>
                <Select
                  value={watch('date_format')}
                  onValueChange={(value) => setValue('date_format', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="enterprise-focus">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_format" className="text-enterprise-700">
                  Time Format
                </Label>
                <Select
                  value={watch('time_format')}
                  onValueChange={(value) => setValue('time_format', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="enterprise-focus">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <Label className="text-enterprise-700">Brand Color</Label>
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-enterprise-200"
                  style={{ backgroundColor: brandColor }}
                />
                <Input
                  type="color"
                  className="w-20 h-12 p-1 border-enterprise-200"
                  {...register('brand_color')}
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <Input
                    placeholder="#6366f1"
                    className="enterprise-focus"
                    {...register('brand_color')}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {(errors.brand_color || fieldErrors.brand_color) && (
                <p className="text-sm text-red-600">
                  {errors.brand_color?.message || fieldErrors.brand_color?.[0]}
                </p>
              )}
            </div>

            {/* Reasonable Hours for Multi-invitee Scheduling */}
            <div className="space-y-4">
              <Label className="text-enterprise-700">Reasonable Hours (Multi-invitee Scheduling)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reasonable_hours_start" className="text-sm text-enterprise-600">
                    Start Hour (24h format)
                  </Label>
                  <Input
                    id="reasonable_hours_start"
                    type="number"
                    min="0"
                    max="23"
                    className="enterprise-focus"
                    {...register('reasonable_hours_start', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reasonable_hours_end" className="text-sm text-enterprise-600">
                    End Hour (24h format)
                  </Label>
                  <Input
                    id="reasonable_hours_end"
                    type="number"
                    min="1"
                    max="24"
                    className="enterprise-focus"
                    {...register('reasonable_hours_end', { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-enterprise-500">
                These hours are used when scheduling meetings with multiple invitees across different timezones
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <Label className="text-enterprise-700">Privacy Settings</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-enterprise-700">
                      Public Profile
                    </Label>
                    <p className="text-xs text-enterprise-500">
                      Allow others to view your profile information
                    </p>
                  </div>
                  <Switch
                    checked={watch('public_profile')}
                    onCheckedChange={(checked) => setValue('public_profile', checked)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-enterprise-700">
                      Show Phone Number
                    </Label>
                    <p className="text-xs text-enterprise-500">
                      Display your phone number on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={watch('show_phone')}
                    onCheckedChange={(checked) => setValue('show_phone', checked)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-enterprise-700">
                      Show Email Address
                    </Label>
                    <p className="text-xs text-enterprise-500">
                      Display your email address on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={watch('show_email')}
                    onCheckedChange={(checked) => setValue('show_email', checked)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isLoading}
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="enterprise"
                disabled={isLoading || !isDirty}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}