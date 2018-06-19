//import liraries
import React, { Component } from 'react';
import { View,FlatList,TouchableOpacity,Button,ActivityIndicator,Text,Image } from 'react-native';
import firebase from 'react-native-firebase';
import {  TabNavigator} from 'react-navigation';
import Profile from './Profile';
var SIT = {last:'loading'}
// create a component
class Users extends Component {
   
    static navigationOptions={
        header:null,
    }

  constructor(props){
    super(props)
    this.state={
      store:[],
      visible:false,
      lastT:'',
      returnArr:[],erp:''
    }
  }

   componentDidMount(){
this.setState({visible:true})
var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
});
    var user = firebase.auth().currentUser;
    var database = firebase.database();

        firebase.auth().onAuthStateChanged(user => {
          if (user){
            var database = firebase.database();

           


            console.log(user)
        this.getUsers();

      }})

  }

  getUsers(){
    //made ref to current user and database folder
    var userR = firebase.database().ref('Friends/');
     var user = firebase.auth().currentUser;

// here i stored all the users data inside an array for later users

     userR.on('value', (snap) =>{

       var mid =[];

       snap.forEach((child)=>{
           if(child.val().uid != user.uid) //here i checked that list contains all users but not current user

           {
          // console.log(child)
         //var childData = childSnapshot.val();
         mid.push({
           name: child.val().name,
           email: child.val().email,
           id: child.val().uid,
           image: child.val().image,
           unread : child.val().unreadCount
         })
}
else {
   console.log('not one of us')
}
         //console.log(mid)
         //console.log(this.state.store)
       });
       this.setState({store:mid}) //here i finnaly stored that array to state for use



   });
  }


   change(props){
    var user = firebase.auth().currentUser;

    var res = user.uid +'-'+ props
    console.log(res)
      var last = firebase.database().ref('chat/').child(res);
// Attach an asynchronous callback to read the data at our posts reference
last.once("value",  (data)=> {
  // do some stuff once
  console.log(data)
  var itemlast = data._value
  console.log(itemlast)
   
   var returnArr = Object.keys(itemlast).map(key => itemlast[key])
   var result = returnArr[0]
   console.log(result.text)

   if (this.state.erp != result.text){
   this.setState({erp:result.text})
   }
});



  }



     
  
  showUnread(props){
    if(props>0){
      console.log(props)
      return (<View style={{width:40,height:40,borderRadius:20,backgroundColor:'#2ecc71',alignItems:'center',justifyContent:'center',right:0,position:'absolute',marginHorizontal:4}}><Text style={{color:'white',fontWeight:'500',fontSize:16}}>{props}</Text></View>)

    }
  }

/*/  <Button title="Logout" onPress={()=>this.logout()} />
  <Button title="My Profile" onPress={()=>this.props.navigation.navigate('profile')} />*/
    render() {
        return (
        <View>

                <FlatList
                style={{marginTop:0}}
              keyExtractor={(item, index) => index.toString()} //javascript helper function..
              data={this.state.store}
              renderItem={({ item }) =>
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('chat',{uname:item.name,uid:item.id,email:item.email,image:item.image})}

              style={{padding:4,flexDirection:'row',marginVertical:3,marginHorizontal:5,backgroundColor:'white',height:90,shadowOffset: { width: 10, height: 10 }, shadowColor: 'black',alignItems:'center'}}>
                        <View style={{left:0}}>
                        <Image source={{uri : item.image}} style={{width:60,height:60,borderRadius:30,}}    />
                        </View>
                        <View style={{left:6}}>
                        {this.change(item.id)}
                        <Text style={{fontWeight:'500',fontSize:19,color:'#1abc9c'}}>{item.name}</Text>
                        { this.state.erp ? (<Text style={{color:'#7f8c8d',fontWeight:'200'}}>{this.state.erp}</Text>) : null}

                        
                        </View>



              {this.showUnread(item.unread)}
                

              </TouchableOpacity>
            }
              />
            </View>
        );
    }

}
// define your styles
class Logout extends Component{
  logout(){
    const {navigate} = this.props.navigation
    firebase.auth().signOut().then(function() {
    alert('you are Signed Out')
    navigate('login')
  }, function(error) {
    console.error('Sign Out Error', error);
  });
  }
  render(){
    return(
      <View style={{backgroundColor:'white',width:'100%',height:'100%'}}>
       <TouchableOpacity  onPress={()=>this.logout()} style={{borderWidth:3,marginTop:250,width:'50%',marginLeft:100,height:70,backgroundColor:'white',borderColor:'green',borderRadius:15}} >
       <Text style={{color:'black',alignSelf:'center',alignItems:'center',fontSize:30}}>Log out</Text>
       </TouchableOpacity>
       </View>
    );
  }
}

//make this component available to the app
//export default Users;
export default TabNavigator ({
users:{screen:Users},
  profile:{screen:Profile},
  logout:{screen:Logout},
},{
  tabBarOptions : {
    style: {
      backgroundColor: 'green',
    }
  }
});
