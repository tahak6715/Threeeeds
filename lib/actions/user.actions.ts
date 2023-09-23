"use server"

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { connToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string;
}

export async function userUpdate({
    userId,
    username,
    name,
    bio,
    image,
    path,
} : Params
) :Promise <void> {
    try{
        connToDB();
        await User.findOneAndUpdate(
            { id: userId },
            {
              username: username.toLowerCase(),
              name,
              bio,
              image,
              onboarded: true,
            },
            { upsert: true }
          );
      
          if (path === "/profile/edit") {
            revalidatePath(path);
          }
    }
    catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
      }
    
    
}