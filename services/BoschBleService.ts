import { BleManager, Device } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

export type BoschBleStatus =
  | 'idle'
  | 'permission_denied'
  | 'bluetooth_off'
  | 'scanning'
  | 'found'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type BoschDevice = {
  id: string;
  name: string;
  rssi?: number | null;
  serviceUUIDs?: string[] | null;
};

class BoschBleService {
  private manager = new BleManager();
  private connectedDevice: Device | null = null;
  private devices: BoschDevice[] = [];

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return Object.values(result).every(
      (value) => value === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  async checkBluetoothReady(): Promise<boolean> {
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }

  async startScan(
    onDeviceFound: (device: BoschDevice) => void,
    onStatus?: (status: BoschBleStatus, message?: string) => void
  ) {
    const hasPermission = await this.requestPermissions();

    if (!hasPermission) {
      onStatus?.('permission_denied', 'Bluetooth-Berechtigung wurde abgelehnt.');
      return;
    }

    const ready = await this.checkBluetoothReady();

    if (!ready) {
      onStatus?.('bluetooth_off', 'Bluetooth ist ausgeschaltet.');
      return;
    }

    this.devices = [];
    onStatus?.('scanning', 'Suche Bluetooth-Geräte...');

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        onStatus?.('error', error.message);
        return;
      }

      if (!device) return;

      const name = device.name || device.localName || 'Unbekanntes Gerät';

      const found: BoschDevice = {
        id: device.id,
        name,
        rssi: device.rssi,
        serviceUUIDs: device.serviceUUIDs,
      };

      const exists = this.devices.some((d) => d.id === found.id);

      if (!exists) {
        this.devices.push(found);
        onDeviceFound(found);
      }

      const isProbablyBosch =
        name.toLowerCase().includes('bosch') ||
        name.toLowerCase().includes('glm') ||
        name.toLowerCase().includes('distance') ||
        name.toLowerCase().includes('laser');

      if (isProbablyBosch) {
        onStatus?.('found', `Mögliches Bosch-Gerät gefunden: ${name}`);
      }
    });

    setTimeout(() => {
      this.stopScan();

      if (this.devices.length === 0) {
        onStatus?.('error', 'Kein Bluetooth-Gerät gefunden.');
      } else {
        onStatus?.('found', `${this.devices.length} Geräte gefunden.`);
      }
    }, 12000);
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connect(
    deviceId: string,
    onStatus?: (status: BoschBleStatus, message?: string) => void
  ): Promise<Device | null> {
    try {
      onStatus?.('connecting', 'Verbindung wird aufgebaut...');

      const device = await this.manager.connectToDevice(deviceId, {
        timeout: 15000,
      });

      const readyDevice = await device.discoverAllServicesAndCharacteristics();

      this.connectedDevice = readyDevice;

      onStatus?.('connected', `Verbunden mit ${readyDevice.name || readyDevice.id}`);

      return readyDevice;
    } catch (error: any) {
      onStatus?.('error', error?.message || 'Verbindung fehlgeschlagen.');
      return null;
    }
  }

  async disconnect(onStatus?: (status: BoschBleStatus, message?: string) => void) {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.cancelConnection();
      }

      this.connectedDevice = null;
      onStatus?.('disconnected', 'Verbindung getrennt.');
    } catch (error: any) {
      onStatus?.('error', error?.message || 'Trennen fehlgeschlagen.');
    }
  }

  async getServices() {
    if (!this.connectedDevice) return [];

    const services = await this.connectedDevice.services();

    return services.map((service) => ({
      uuid: service.uuid,
      isPrimary: service.isPrimary,
    }));
  }

  async getCharacteristics(serviceUUID: string) {
    if (!this.connectedDevice) return [];

    const characteristics =
      await this.connectedDevice.characteristicsForService(serviceUUID);

    return characteristics.map((char) => ({
      uuid: char.uuid,
      serviceUUID: char.serviceUUID,
      isReadable: char.isReadable,
      isWritableWithResponse: char.isWritableWithResponse,
      isWritableWithoutResponse: char.isWritableWithoutResponse,
      isNotifiable: char.isNotifiable,
      isIndicatable: char.isIndicatable,
    }));
  }

  getConnectedDevice() {
    return this.connectedDevice;
  }

  destroy() {
    this.stopScan();
    this.manager.destroy();
  }
}

const boschBleService = new BoschBleService();

export default boschBleService;
