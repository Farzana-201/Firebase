import { View, Text, StatusBar, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Image } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import Feather from '@expo/vector-icons/Feather';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import * as ImagePicker from 'expo-image-picker';

export default function SignUp() {
  const router= useRouter();
  const [loading , setLoading] = useState(false);
  const {register} = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileRef = useRef("");
  
  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required to access photos!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: true,
  });

  if (!result.canceled && result.assets?.[0]?.uri) {
    const selectedImage = result.assets[0].uri;
    profileRef.current = selectedImage;
  }
};
 const handleRegister = async () => {
  if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
    Alert.alert('Sign Up', "Please fill all the fields");
    return;
  }

  setLoading(true);

  const response = await register(
    emailRef.current,
    passwordRef.current,
    usernameRef.current,
    profileRef.current
  );

  setLoading(false);
  console.log('got result: ', response);

  if (!response.success) {
    Alert.alert('Sign Up', response.msg);
    return;
  }

  
  try {
    await setDoc(doc(firestore, "users", response.user.uid), {
      email: emailRef.current,
      username: usernameRef.current,
      profileUrl: response.profileUrl || "", // or however you're handling image upload
    });

    // Navigate to home or show success
    router.push("Home"); // or whatever your next screen is
  } catch (error) {
    console.log("Firestore error:", error.message);
    Alert.alert("Sign Up", "Failed to save user data.");
  }
};

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className="flex-1 gap-12">
        {/*SignIn image*/}
        <View className="items-center">
          <Image style={{height: hp(20)}} resizeMode='contain' source={require('../assets/images/sign-up.png')} />
        </View>



        <View className="gap-10">
          <Text style={{fontSize:hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
          {/* inputs */}
          <View className="gap-4">
            <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <Octicons name="mail" size={hp(2.7)} color="gray" />
          <TextInput
              onChangeText={value=> emailRef.current=value}
              style={{fontSize: hp(2)}} 
                className="flex-1 font-semibold text-neutral-700"  
                placeholder='Email Address'
                placeholderTextColor={'gray'}
                />
          </View>
             
                <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                  <Octicons name="lock" size={hp(2.7)} color="gray" />
                  <TextInput
                  onChangeText={value=> passwordRef.current=value}
                style={{fontSize: hp(2)}} 
                  className="flex-1 font-semibold text-neutral-700"  
                  placeholder='Password'
                  secureTextEntry
                  placeholderTextColor={'gray'}
                  />
                    </View>

                    <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                  <Feather name="user" size={24} color="gray" />
                  <TextInput
                  onChangeText={value=> usernameRef.current=value}
                  style={{fontSize: hp(2)}} 
                  className="flex-1 font-semibold text-neutral-700"  
                  placeholder='Username'
                  placeholderTextColor={'gray'}
                  />
                    </View>
                    <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                 <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                <Feather name="image" size={24} color="gray" />
                <TouchableOpacity onPress={pickImage}>
                  <Text style={{ fontSize: hp(2), color: 'gray' }} className="font-semibold text-neutral-700">Profile Photo</Text>
                </TouchableOpacity>
              </View>
                    </View>
            
            {profileRef.current ? (
              <Image
                source={{ uri: profileRef.current }}
                style={{ height: hp(10), aspectRatio: 1, borderRadius: 100 }}
              />
            ) : null}
          {/* submit button */}

          <View>
            {
              loading? (
                <View className="flex-row justify-center">
                  <Loading size={hp(11)} />
                  </View>

              ):( 
              <TouchableOpacity onPress={handleRegister} style={{height: hp(6.5)}} className="bg-blue-500 rounded-xl justify-center items-center">
            <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wider">
              Sign up
            </Text>
          </TouchableOpacity>

              )

            }
          </View>

          

          {/*Sign up text*/}

          <View className="flex-row justify-center">
            <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-500">Already have an account? </Text>
            <Pressable onPress={()=> router.push('SignIn')}>
              <Text style={{fontSize: hp(1.8)}} className="font-bold text-blue-500">Sign In</Text>
            </Pressable>
          </View>
           </View> 

        </View>
      </View>
    </CustomKeyboardView>
  )
}