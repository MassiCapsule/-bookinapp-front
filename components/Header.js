import React from 'react';
import {Image, View, ActivityIndicator,} from 'react-native';

function Header (props) {
    return (
        <View style={{marginTop:25, padding:20, alignItems:'center'}}>
            <Image
            source={{ uri: "https://res.cloudinary.com/dxdwluskm/image/upload/v1615896636/LogoApp_wgglkf.png"}}
            style={{ width: 100, height: 21}}
            PlaceholderContent={<ActivityIndicator />}
            />
        </View>
        );
} 
  
export default Header;
