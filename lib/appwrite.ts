import {Account, Avatars, Client, Databases, ID, Query} from "react-native-appwrite";
import {CreateUserParams, SignInParams} from "@/type";

export const appWriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.siam.foodzy",
    databaseId: '6886058200062179497b',
    userCollectionId: '688605b70023fad33e4c',
}

export const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint)
    .setProject(appWriteConfig.projectId)
    .setPlatform(appWriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({email, password, name}: CreateUserParams) => {


    try {
        const newAccount = await account.create(ID.unique(), email, password);
        if (!newAccount) throw Error;


        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            {email, name, accountId: newAccount.$id, avatar: avatarUrl}
        )

    } catch (error) {
        throw new Error(error as string)
    }
}


export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {

    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string)
    }
}