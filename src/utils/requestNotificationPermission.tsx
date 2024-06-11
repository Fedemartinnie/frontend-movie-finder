import { PermissionsAndroid, Platform } from 'react-native';

async function RequestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Permiso de notificaciones",
          message: "Esta aplicación necesita acceso a las notificaciones.",
          buttonNeutral: "Preguntar más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permiso de notificaciones concedido");
      } else {
        console.log("Permiso de notificaciones denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

// Llama a esta función en un lugar adecuado, como en el arranque de la aplicación
export default  RequestNotificationPermission;
