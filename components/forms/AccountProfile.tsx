"use client";

import * as z from 'zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidations } from "@/lib/validations/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from 'next/image';
import { ChangeEvent, useReducer, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { usePathname,useRouter } from 'next/navigation';
import { userUpdate } from '@/lib/actions/user.actions';


interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio:string;
        image: string;
    };
    btnTitle:string;
}



export const AccountProfile = ({ user, btnTitle } : Props) => {

    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(UserValidations),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user.name || '',
            username: user.username || '',
            bio: ''
        }
    })

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
      ) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
    
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];

          setFiles(Array.from(e.target.files))
    
          if (!file.type.includes("image")) return;
    
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            fieldChange(imageDataUrl);
          };
    
          fileReader.readAsDataURL(file);
        }
      };

    const onSubmit = async (values: z.infer<typeof UserValidations>) => {
       const blob = values.profile_photo;

       const hasImageChanged = isBase64Image(blob);

       if(hasImageChanged) {
        const imgRes = await startUpload(files)

        if(imgRes && imgRes[0].fileUrl) {
            values.profile_photo = imgRes[0].fileUrl;
        }
       }

       await userUpdate({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname
      }
       );

       if(pathname === '/profile/edit') {
        router.back();
       }
       else{
        router.push('/')
       }
    
    
    
    

      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>{ field.value ? (
                <Image
                src={field.value}
                alt="ptofile_photo"
                width={96}
                height={96}
                priority
                className='="rounded-full object-contain'
                />
              ) : (
                <Image
                src={"/assets/profile.svg"}
                alt="ptofile_photo"
                width={50}
                height={50}
                priority
                className='="rounded-full object-contain'
                />

              )
              }</FormLabel>
              <FormControl className='flex- text-base-semibold text-gray-200 '>
                <Input type='file' accept='image/*' placeholder='Upload a photo'
                className='account-form_image-input'
                onChange={(e) => handleImage(e, field
                    .onChange)}
                />
                
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex flex-col  w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
              <FormControl className='flex- text-base-semibold text-gray-200 '>
                <Input type='text'
                className='account-form_input no-focus' 
                {...field}
                />
                
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex flex-col  w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>userName</FormLabel>
              <FormControl className='flex- text-base-semibold text-gray-200 '>
                <Input type='text'
                className='account-form_input no-focus' 
                {...field}
                />
                
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='flex flex-col  w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>bio</FormLabel>
              <FormControl className='flex- text-base-semibold text-gray-200 '>
                <Textarea
                rows={10}
                className='account-form_input no-focus' 
                {...field}
                />
                
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <Button type="submit" className='bg-primary-500'>Submit</Button>
      </form>
    </Form>
  )
}
 