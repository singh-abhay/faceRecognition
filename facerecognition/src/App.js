import React,{Component} from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
  apiKey: '002b91dc6a5245d6b28ca35e656228b7'
 });

const particlesoptions = {
  "particles": {
    "number": {
        "value": 50
    },
    "size": {
        "value": 3
    } 
},
"interactivity": {
    "events": {
        "onhover": {
            "enable": true,
            "mode": "repulse"
        }
    }
}
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
        email:'',
        id:'',
        name:'',
        entries: 0,
        joined:''
      }
    }
  }

  loadUser=(data)=>{
      this.setState({user:{
        email:data.email,
        id:data.id,
        name:data.name,
        entries:data.entries,
        joined:data.joined
      }})

  }
  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox=(box)=>{
    this.setState({box:box})
  }

  onInputChange=(event)=>{
   this.setState({input:event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models
      .predict('a403429f2ddf4b49b307e318f00e528b',this.state.input)
      .then(response=> {
        if(response){
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
            })
          })
          .then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries: count}))

          })

  
        }
        this.displayFaceBox(this.calculateFaceLocation(response))})
      .catch(err=>console.log(err));
  }  
  onRouteChange=(route)=>{
    if (route==='home'){
      this.setState({isSignedIn:true})
    }
    else if(route==='signout'){
      this.setState({isSignedIn:false})
    }
      this.setState({route:route})
  }

  render() {
    const {isSignedIn,route,imageUrl,box}=this.state
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesoptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route==='home'
          ?<div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box ={box} imageUrl={imageUrl}/>
           </div> 
          :(route==='signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );

  }
  
}

export default App;
