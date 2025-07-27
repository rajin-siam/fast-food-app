import {View, Text, Alert} from 'react-native'
import React from 'react'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {signIn} from "@/lib/appwrite";


const SignIn = () => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [form, setForm] = React.useState({email: '', password: ''});

    const submit = async () => {
        const { email, password} = form;
        if (!email || !password) return Alert.alert('Error', "Please enter valid email address & password");

        setIsSubmitting(true);
        try {
            // Call appwrite sign in function
            await signIn({email, password});
            Alert.alert('Success', 'User signed in successfully');
            router.replace("/");
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your Email"
                value={form.email}
                onChangeText={(text) => setForm((prev)=>({...prev, email: text}))}
                label="Email"
                keyboardType="email-address"
            />

            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev)=>({...prev, password: text}))}
                label="Email"
                secureTextEntry={true}
            />

            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />


            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don&#39;t have a account?
                </Text>
                <Link href={"/sign-up"} className="base-bold text-primary">Sign Up</Link>
            </View>
        </View>
    )
}
export default SignIn
