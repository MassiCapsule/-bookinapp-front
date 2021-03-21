import React from 'react';
import {connect} from 'react-redux';
import {Image, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function BookCard(props) {
    const navigation = useNavigation();

    function titleCut (desc) {
        if (desc.length > 14){
            return desc.substring(0,14)+"..."
          } else {
              return desc
          };
      };
    
const handleClickBook = (id) => {
    navigation.navigate('BookScreen');
    // navigation.navigate('BookScreen', {itemId: id});
    props.saveGoogleId(id);
  };

if (props.bookCover) {
    return (
        <View style={{marginBottom:10}} id={props.keys}>
            <TouchableOpacity onPress={() => handleClickBook(props.googleId)}>
                {props.bookCover ? 
                <Image
                source={{uri:props.bookCover}} 
                alt={props.bookTitle}
                style={{ width: 107, height: 152, borderRadius:5 }}
                /> :
                <Image
                source={require('../assets/cover_nondispo.jpg')} 
                alt='cover bookin'
                style={{ width: 107, height: 152, borderRadius:5 }}
                />
                }

                <Text style={{color:'#23396c', textAlign:'center'}}>{(props.bookTitle).charAt(0).toUpperCase() + titleCut(props.bookTitle).substr(1).toLowerCase()}</Text>
            </TouchableOpacity>
        </View>
        );
} else {
    return (
        null
        );
}

  } 
  
  function mapDispatchToProps(dispatch) {
    return {
      saveGoogleId: function(id) {
          dispatch( {type: 'saveGoogleId', googleId:id} )
      }
    }
   }

export default connect(null,mapDispatchToProps)(BookCard);
