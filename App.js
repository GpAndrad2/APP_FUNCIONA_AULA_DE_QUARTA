import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Image } from 'react-native';
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'expo-camera';
import Texto from './src/componentes/texto';
import Produto from './src/telas/Produtos/';
import Sobre from './src/telas/Sobre/';
import Produtos_Lista from './src/telas/Produtos_Lista/';
import VideoScreen from './src/telas/video';
import mockProduto from './src/mocks/produto/';
import mockSobre from './src/mocks/sobre/';
import mockProdutos_Lista from './src/mocks/produtos_lista/';
import { Audio } from 'expo-av';
import ListaDesejos from './src/telas/listadedesejos';

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setPhoto(uri);
    }
  };

  const switchCamera = () => {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        {/* Colocando o TextInput sobre a visualização da câmera */}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Digite algo aqui"
          keyboardType="default"
        />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={switchCamera}>
            <Text style={styles.text}>Virar Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
        {photo && <Image source={{ uri: photo }} style={styles.preview} />}
      </Camera>
    </View>
  );
}

function MenuAudio() {
  const [audioStatus, setAudioStatus] = useState(false);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (audioStatus) {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync(require('./assets/acdc_highway_to_hell.mp3'));
        setSound(sound);
        try {
          await sound.playAsync();
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      } else {
        if (sound) {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (e) {
            console.log(e);
          }
        }
      }
    })();
  }, [audioStatus]);

  return (
    <TouchableOpacity onPress={() => { if (!loading) { setAudioStatus(!audioStatus); } }}>
      <Texto>🎧 Liga/Desliga</Texto>
    </TouchableOpacity>
  );
}

function MenuKit() {
  return (
    <View style={styles.container}>
      <Produto {...mockProduto} />
    </View>
  );
}

function SobreNos() {
  return (
    <View>
      <Sobre {...mockSobre} />
    </View>
  );
}

function ListaProdutos() {
  return (
    <View>
      <Produtos_Lista {...mockProdutos_Lista} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabsMenu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Kit") {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === "Sobre nós") {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === "Produtos") {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === "Lista de Desejos") {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === "Vídeo") {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === "Câmera") {
            iconName = focused ? 'camera' : 'camera-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'pink',
        tabBarHideOnKeyboard: true,
      })}
      

    >
      <Tab.Screen name="Sobre nós" component={SobreNos} />
      <Tab.Screen name="Kit" component={MenuKit} />
      <Tab.Screen name="Produtos" component={ListaProdutos} />
      <Tab.Screen name="Lista de Desejos" component={MenuKit} />
      <Tab.Screen name="Vídeo" component={VideoScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
    </Tab.Navigator>
  );
} 
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject, 
  },
  input: {
    height: 40,
    borderColor: 'white', 
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 8,
    width: '80%',
    color: 'white', 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 5, 
    position: 'absolute',
    top: 50, 
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20, 
    position: 'absolute',
    bottom: 20, 
  button: {
    backgroundColor: '#ff5c5c', 
    padding: 15,
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18, // Tamanho da fonte do texto do botão
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 10, // Bordas arredondadas da visualização da foto
    borderColor: 'white', // Cor da borda da visualização da foto
    borderWidth: 2, // Largura da borda da visualização da foto
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}});

export default function App() {
  const [fonteCarregada] = useFonts({
    "SpaceGRegular": SpaceGrotesk_300Light,
    "SpaceGBold": SpaceGrotesk_700Bold,
  });

  if (!fonteCarregada) {
    return <View />;
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <TabsMenu />
        <MenuAudio />
      </View>
    </NavigationContainer>
  );
}
